"""End-to-end test of accounts and sync, against a stand-in for Supabase (no real project needed).

Builds a copy of the app pointed at a fake Supabase URL into dist/auth-test/, then answers every request to
that URL from an in-memory fake that mimics the auth API and the `progress` table (including its row-level
security and version checks). Two browser contexts play two devices signed in to the same account.
Run: python3 scripts/auth_test.py
"""
import base64, json, os, re, subprocess, sys, time, uuid
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dist', 'auth-test')
SB = 'https://cat-test.supabase.co'
subprocess.run(['node', 'scripts/build-offline.mjs'], cwd=ROOT, check=True, stdout=subprocess.DEVNULL,
               env={**os.environ, 'VITE_SUPABASE_URL': SB, 'VITE_SUPABASE_ANON_KEY': 'test-anon-key', 'OUT_DIR': OUT})
URL = 'file://' + os.path.join(OUT, 'index.html')
# A second build with paid access switched on.
OUT_PAID = os.path.join(ROOT, 'dist', 'auth-test-paid')
BUY = 'https://example.gumroad.com/l/cat-sprint'
subprocess.run(['node', 'scripts/build-offline.mjs'], cwd=ROOT, check=True, stdout=subprocess.DEVNULL,
               env={**os.environ, 'VITE_SUPABASE_URL': SB, 'VITE_SUPABASE_ANON_KEY': 'test-anon-key', 'OUT_DIR': OUT_PAID,
                    'VITE_REQUIRE_PURCHASE': 'true', 'VITE_BUY_URL': BUY})
PAID_URL = 'file://' + os.path.join(OUT_PAID, 'index.html')
SAMPLE = {'Q001', 'Q012', 'Q021', 'Q027', 'Q039', 'Q050', 'Q072', 'Q082', 'V001', 'V002', 'V003', 'V004', 'V065', 'V075', 'V084',
          'D061', 'D062', 'D063', 'D064', 'D065'}

results, errors = [], []
def check(cond, msg):
    results.append((bool(cond), msg)); print(('PASS ' if cond else 'FAIL ') + msg)

CORS = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*',
        'Access-Control-Expose-Headers': '*'}

class FakeSupabase:
    def __init__(self):
        self.users = {}       # email -> {'id', 'password'}
        self.rows = {}        # user_id -> {'state', 'version', 'edited_at'}
        self.rest_down = False
        self.confirm = False  # sign-ups must confirm their email first
        self.entitlements = {}  # user_id -> license key
        self.licenses = {'GOOD-KEY': {}, 'REFUNDED-KEY': {'refunded': True}}  # what Gumroad knows
        self.reports = []

    @staticmethod
    def jwt(uid, email):
        enc = lambda d: base64.urlsafe_b64encode(json.dumps(d).encode()).decode().rstrip('=')
        now = int(time.time())
        return f"{enc({'alg': 'HS256', 'typ': 'JWT'})}.{enc({'sub': uid, 'email': email, 'role': 'authenticated', 'aud': 'authenticated', 'iat': now, 'exp': now + 3600})}.sig"

    def user(self, email):
        uid = self.users[email]['id']
        return {'id': uid, 'aud': 'authenticated', 'role': 'authenticated', 'email': email, 'app_metadata': {'provider': 'email'},
                'user_metadata': {}, 'identities': [{'id': uid, 'user_id': uid, 'provider': 'email'}], 'created_at': '2026-10-01T00:00:00Z'}

    def session(self, email):
        uid = self.users[email]['id']
        return {'access_token': self.jwt(uid, email), 'token_type': 'bearer', 'expires_in': 3600, 'expires_at': int(time.time()) + 3600,
                'refresh_token': 'refresh-' + uid, 'user': self.user(email)}

    def caller(self, req):
        tok = (req.headers.get('authorization') or '').removeprefix('Bearer ')
        try:
            sub = json.loads(base64.urlsafe_b64decode(tok.split('.')[1] + '==')).get('sub')
        except Exception:
            return None
        return next((e for e, u in self.users.items() if u['id'] == sub), None)

    def handle(self, route):
        req = route.request
        u = urlparse(req.url); q = parse_qs(u.query); path = u.path
        reply = lambda status, body=None: route.fulfill(status=status, headers={**CORS, 'Content-Type': 'application/json'},
                                                        body='' if body is None else json.dumps(body))
        if req.method == 'OPTIONS':
            return reply(204)
        body = json.loads(req.post_data) if req.post_data else {}
        me = self.caller(req)
        if path == '/auth/v1/signup':
            if body['email'] in self.users:
                if self.confirm:  # real Supabase hides that the address exists
                    return reply(200, {**self.user(body['email']), 'identities': []})
                return reply(422, {'code': 422, 'error_code': 'user_already_exists', 'msg': 'User already registered'})
            self.users[body['email']] = {'id': str(uuid.uuid4()), 'password': body['password']}
            return reply(200, self.user(body['email']) if self.confirm else self.session(body['email']))
        if path == '/auth/v1/token':
            if q['grant_type'][0] == 'password':
                u_ = self.users.get(body.get('email'))
                if not u_ or u_['password'] != body.get('password'):
                    return reply(400, {'code': 400, 'error_code': 'invalid_credentials', 'msg': 'Invalid login credentials'})
                return reply(200, self.session(body['email']))
            email = next(e for e, u_ in self.users.items() if 'refresh-' + u_['id'] == body.get('refresh_token'))
            return reply(200, self.session(email))
        if path == '/auth/v1/user':
            if not me:
                return reply(401, {'code': 401, 'msg': 'invalid JWT'})
            if req.method == 'PUT' and 'password' in body:
                self.users[me]['password'] = body['password']
            return reply(200, self.user(me))
        if path in ('/auth/v1/logout', '/auth/v1/recover'):
            return reply(204 if path.endswith('logout') else 200, None if path.endswith('logout') else {})
        if path == '/rest/v1/reports' and req.method == 'POST':
            self.reports.append({**body, 'user_id': self.users[me]['id'] if me else None})
            return reply(201)
        if path == '/rest/v1/entitlements' and req.method == 'GET':
            uid = self.users[me]['id'] if me else None
            want = (q.get('user_id', ['eq.'])[0])[3:]
            return reply(200, [{'user_id': uid}] if uid and want == uid and uid in self.entitlements else [])
        if path == '/functions/v1/claim-license':
            if not me:
                return reply(401, {'ok': False, 'error': 'Sign in first, then enter your license key.'})
            uid, key = self.users[me]['id'], str(body.get('licenseKey', '')).strip()
            owner = next((u for u, k in self.entitlements.items() if k == key), None)
            if owner and owner != uid:
                return reply(400, {'ok': False, 'error': 'This license key is already linked to another account.'})
            lic = self.licenses.get(key)
            if lic is None:
                return reply(400, {'ok': False, 'error': 'That license key wasn’t recognised.'})
            if lic.get('refunded'):
                return reply(400, {'ok': False, 'error': 'This purchase was refunded or disputed, so it no longer unlocks the app.'})
            self.entitlements[uid] = key
            return reply(200, {'ok': True})
        if path == '/rest/v1/progress':
            if self.rest_down:
                return reply(500, {'code': 'XX000', 'message': 'server error'})
            uid = self.users[me]['id'] if me else None
            want = (q.get('user_id', ['eq.'])[0])[3:]
            if req.method == 'GET':
                row = self.rows.get(want) if want == uid else None
                return reply(200, [row] if row else [])
            if req.method == 'POST':
                if body['user_id'] != uid:
                    return reply(403, {'code': '42501', 'message': 'new row violates row-level security policy'})
                if uid in self.rows:
                    return reply(409, {'code': '23505', 'message': 'duplicate key value violates unique constraint "progress_pkey"'})
                self.rows[uid] = {'state': body['state'], 'version': body['version'], 'edited_at': body['edited_at']}
                return reply(201)
            if req.method == 'PATCH':
                row = self.rows.get(want) if want == uid else None
                if not row or str(row['version']) != q['version'][0][3:]:
                    return reply(200, [])
                row.update(state=body['state'], version=body['version'], edited_at=body['edited_at'])
                return reply(200, [{'version': row['version']}])
        return reply(404, {'message': f'not faked: {req.method} {path}'})

sb = FakeSupabase()
EMAIL, PW = 'student@example.com', 'secret123'
offline = set()  # devices whose requests fail (routed requests ignore set_offline, so the fake enforces it)

def go_offline(ctx, on):
    ctx.set_offline(on)
    (offline.add if on else offline.discard)(ctx)

def device(browser):
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    ctx.route(re.compile(r'https://fonts\..*'), lambda r: r.abort())
    ctx.route(SB + '/**', lambda r: r.abort('internetdisconnected') if ctx in offline else sb.handle(r))
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errors.append(str(e)))
    return ctx, pg

def done_count(pg):
    pg.wait_for_selector('text=/\\d+\\/4 done/')
    return pg.locator('text=/\\d+\\/4 done/').first.inner_text()

def tick(pg, i):
    pg.locator(f'[id="task-1:{i}"]').click()

def wait_saved(pg):
    pg.get_by_role('button', name=re.compile(r'^Account: .*, saved$')).wait_for(timeout=10000)

def sign_in(pg, email=EMAIL, pw=PW):
    pg.get_by_role('button', name='Sign in').first.click()
    pg.fill('#auth-email', email); pg.fill('#auth-password', pw)
    pg.locator('form').get_by_role('button', name='Sign in').click()

with sync_playwright() as p:
    b = p.chromium.launch()

    # --- Device A: progress made before having an account
    ctxA, A = device(b)
    A.goto(URL); A.get_by_role('button', name='Build my plan').click(); A.wait_for_selector('text=Your CAT sprint')
    check(A.get_by_role('button', name='Sign in').count() == 1, 'guest sees a Sign in button')
    tick(A, 0)
    check(done_count(A) == '1/4 done', 'guest ticks a plan task')

    # --- Wrong password, then create an account: the device's progress goes into it
    A.get_by_role('button', name='Sign in').first.click()
    check(A.locator('text=1 question').count() == 0 and A.locator('text=A new account starts with').count() == 0,
          'no carry-over note when nothing was attempted')
    A.fill('#auth-email', EMAIL); A.fill('#auth-password', 'nope')
    A.locator('form').get_by_role('button', name='Sign in').click()
    A.wait_for_selector('text=Wrong email or password.')
    check(True, 'wrong password shows an error')
    A.get_by_role('button', name='Create an account').click()
    A.fill('#auth-email', EMAIL); A.fill('#auth-password', PW)
    A.get_by_role('button', name='Create account').click()
    wait_saved(A)
    check(done_count(A) == '1/4 done', 'after sign-up the dashboard keeps the device progress')
    uid = sb.users[EMAIL]['id']
    check(sb.rows.get(uid, {}).get('state', {}).get('planTasks', {}).get('1:0') is True, 'device progress uploaded to the new account')
    check(A.evaluate("localStorage.getItem('cat30-sprint:v1')") is None, 'device-only copy removed once it is in the account')

    # --- Edits upload on their own
    tick(A, 1)
    A.wait_for_timeout(1600); wait_saved(A)
    check(sb.rows[uid]['version'] == 2 and sb.rows[uid]['state']['planTasks'].get('1:1') is True, 'an edit uploads (version 2)')

    # --- Device B signs in and sees the same progress
    ctxB, B = device(b)
    B.goto(URL); B.wait_for_selector('text=Let’s build your plan')
    sign_in(B); wait_saved(B)
    check(done_count(B) == '2/4 done', 'second device shows the account progress (2/4)')

    # --- B edits; A picks it up when it comes back to the tab
    tick(B, 2); B.wait_for_timeout(1600); wait_saved(B)
    A.evaluate("document.dispatchEvent(new Event('visibilitychange'))")
    A.wait_for_timeout(800)
    check(done_count(A) == '3/4 done', 'first device pulls the other device’s edit on returning to the tab')

    # --- A goes offline and edits; B edits meanwhile; A's later edit wins when it reconnects
    go_offline(ctxA, True)
    B.locator('[id="task-1:0"]').click(); B.wait_for_timeout(1600); wait_saved(B)   # B un-ticks task 0
    tick(A, 3); A.wait_for_timeout(1600)
    A.get_by_role('button', name=re.compile(r'^Account: .*, offline$')).wait_for(timeout=10000)
    check(True, 'offline edit shows Offline status')
    A.reload(); A.wait_for_selector('text=/\\d+\\/4 done/', timeout=15000)
    check(done_count(A) == '4/4 done', 'offline reload still opens the cached progress')
    go_offline(ctxA, False)
    A.evaluate("window.dispatchEvent(new Event('online'))")
    wait_saved(A)
    st = sb.rows[uid]['state']['planTasks']
    check(st.get('1:3') is True and st.get('1:0') is True, 'newer offline edit replaces the account copy after reconnecting')

    # --- The other way round: the other device edited more recently, so this device takes the account copy
    go_offline(ctxA, True)
    A.locator('[id="task-1:3"]').click()   # older edit, made offline
    A.get_by_role('button', name=re.compile(r'^Account: .*, offline$')).wait_for(timeout=10000)
    B.evaluate("document.dispatchEvent(new Event('visibilitychange'))"); B.wait_for_timeout(800)
    B.locator('[id="task-1:1"]').click(); B.wait_for_timeout(1600); wait_saved(B)   # newer edit
    go_offline(ctxA, False)
    A.evaluate("window.dispatchEvent(new Event('online'))")
    wait_saved(A); A.wait_for_timeout(300)
    st = sb.rows[uid]['state']['planTasks']
    check(st.get('1:1') is False and st.get('1:3') is True and done_count(A) == '3/4 done',
          'older offline edit gives way to the newer edit from the other device')

    # --- Reporting a problem with a question
    A.get_by_role('button', name='Question bank').first.click(); A.get_by_role('tab', name=re.compile('QA')).click()
    A.fill('#bank-search', 'Q021'); A.locator('[data-qid] button').first.click(); A.wait_for_timeout(200)
    A.get_by_role('button', name='Report a problem').click()
    A.select_option('#report-reason-Q021', 'Typo or unclear question'); A.fill('#report-msg-Q021', 'Step 2 is unclear')
    A.get_by_role('button', name='Send report').click(); A.wait_for_selector('text=/We’ll check Q021/')
    rep = sb.reports[-1] if sb.reports else {}
    check(rep.get('question_id') == 'Q021' and rep.get('reason') == 'Typo or unclear question' and rep.get('message') == 'Step 2 is unclear' and rep.get('user_id') == uid,
          'a problem report is saved with the question, reason, details and sender')
    A.get_by_role('button', name='Dashboard').first.click()

    # --- Sign out: back to this device's own (now empty) progress, account copy removed from the browser
    A.get_by_role('button', name=re.compile('^Account:')).click()
    A.get_by_role('button', name='Sign out').click()
    A.get_by_role('button', name='Sign in').first.wait_for()
    A.get_by_role('button', name='Dashboard').first.click()
    check(A.locator('text=Let’s build your plan').count() == 1, 'after sign-out the device starts fresh with plan setup')
    A.get_by_role('button', name='Build my plan').click()
    check(done_count(A) == '0/4 done', 'after sign-out the device shows no account progress')
    check(A.evaluate(f"localStorage.getItem('cat30-sprint:v1:user:{uid}')") is None, 'account copy cleared from the browser on sign-out')

    # --- A brand-new device whose first load fails gets a retry screen, not empty progress
    sb.rest_down = True
    ctxC, C = device(b)
    C.goto(URL); C.wait_for_selector('text=Let’s build your plan')
    sign_in(C)
    C.wait_for_selector('text=Couldn’t load your progress', timeout=20000)
    check(True, 'failed first load shows a retry screen')
    sb.rest_down = False
    C.get_by_role('button', name='Try again').click(); wait_saved(C)
    check(done_count(C) == '3/4 done', 'retry loads the account progress')

    # --- Password reset: request, then open the emailed link (implicit flow tokens in the URL hash)
    ctxD, D = device(b)
    D.goto(URL + '#account'); D.get_by_role('button', name='Forgot password?').click()
    D.fill('#auth-email', EMAIL); D.get_by_role('button', name='Send reset link').click()
    D.wait_for_selector('text=a link to reset the password is on its way')
    check(True, 'reset email requested')
    s = sb.session(EMAIL)
    D.goto(URL + f"#access_token={s['access_token']}&expires_at={s['expires_at']}&expires_in=3600&refresh_token={s['refresh_token']}&token_type=bearer&type=recovery")
    D.reload()
    D.wait_for_selector('text=Choose a new password', timeout=15000)
    check(True, 'reset link opens “Choose a new password”')
    D.fill('#auth-new-password', 'newsecret456'); D.get_by_role('button', name='Save password').click()
    D.wait_for_selector('text=Password updated.')
    check(sb.users[EMAIL]['password'] == 'newsecret456', 'new password saved')

    # --- Email confirmation on: sign-up asks to confirm instead of signing in
    sb.confirm = True
    ctxE, E = device(b)
    E.goto(URL + '#account'); E.get_by_role('button', name='Create an account').click()
    E.fill('#auth-email', 'new@example.com'); E.fill('#auth-password', 'secret123'); E.get_by_role('button', name='Create account').click()
    E.wait_for_selector('text=We’ve sent a confirmation link to new@example.com')
    check(True, 'sign-up with email confirmation asks to check email')
    E.fill('#auth-email', EMAIL); E.fill('#auth-password', 'whatever1'); E.get_by_role('button', name='Create account').click()
    E.wait_for_selector('text=An account with this email already exists')
    check(True, 'sign-up with an existing email says to sign in instead')

    # --- Paid access: the app is a free sample until a license key is verified
    sb.confirm = False
    ctxP, P = device(b)
    P.goto(PAID_URL); P.get_by_role('button', name='Build my plan').click(); P.wait_for_selector('text=Your CAT sprint')
    check(P.get_by_role('button', name='Free sample').count() == 1 and P.locator('text=/Your \\d+-day plan is ready/').count() == 1,
          'unpaid: dashboard offers full access instead of the plan')
    P.get_by_role('button', name='Question bank').first.click(); P.get_by_role('tab', name=re.compile('QA')).click()
    check(P.locator('[data-qid]').count() == 8, 'unpaid: the bank shows the 8 sample QA questions')
    P.get_by_role('button', name='Random across all sections').click(); P.wait_for_timeout(300)
    ids = P.locator('[aria-label="Questions in this session"] button').all_inner_texts()
    check(len(ids) == 10 and all(i in SAMPLE for i in ids), f'unpaid: random practice draws 10 sample questions ({len(ids)})')
    P.get_by_role('button', name='Sectional tests').first.click()
    check(P.locator('text=Sectional tests and mocks are part of full access').count() == 1 and P.locator('text=Start 40-min test').count() == 0,
          'unpaid: tests are locked')
    check(P.get_by_role('link', name='Buy full access').get_attribute('href') == BUY, 'unlock panel links to the Gumroad page')
    P.get_by_role('button', name='Already bought? Sign in').click()
    P.get_by_role('button', name='Create an account').click()
    P.fill('#auth-email', 'buyer@example.com'); P.fill('#auth-password', 'secret123'); P.get_by_role('button', name='Create account').click()
    wait_saved(P)
    P.get_by_role('button', name='Sectional tests').first.click()
    for key, msg in [('WRONG', 'recognised'), ('REFUNDED-KEY', 'refunded or disputed')]:
        P.fill('#license-key', key); P.get_by_role('button', name='Unlock', exact=True).click()
        P.wait_for_selector(f'text=/{msg}/'); check(True, f'license key {key} is refused')
    P.fill('#license-key', 'GOOD-KEY'); P.get_by_role('button', name='Unlock', exact=True).click()
    P.wait_for_selector('text=Start 120-min mock')
    check(P.get_by_role('button', name='Free sample').count() == 0, 'a valid key unlocks the tests and removes the sample badge')
    P.get_by_role('button', name='Question bank').first.click(); P.get_by_role('tab', name=re.compile('QA')).click()
    n_qa = sum(1 for q in json.load(open(os.path.join(ROOT, 'src', 'data', 'questions.json'))) if q['section'] == 'QA')
    check(P.locator('[data-qid]').count() == n_qa, f'unlocked: the bank shows all {n_qa} QA questions')
    P.reload(); P.wait_for_selector('text=Question bank'); P.wait_for_timeout(800)
    check(P.get_by_role('button', name='Free sample').count() == 0, 'access is kept after a reload')
    ctxQ, Q = device(b)
    Q.goto(PAID_URL + '#account'); Q.get_by_role('button', name='Create an account').click()
    Q.fill('#auth-email', 'friend@example.com'); Q.fill('#auth-password', 'secret123'); Q.get_by_role('button', name='Create account').click()
    wait_saved(Q)
    Q.get_by_role('button', name=re.compile('^Account:')).click()
    Q.fill('#license-key', 'GOOD-KEY'); Q.get_by_role('button', name='Unlock', exact=True).click()
    Q.wait_for_selector('text=/already linked to another account/'); check(True, 'one key unlocks only one account')
    b.close()

check(not errors, f'no page errors ({errors[:3]})')
failed = [m for ok, m in results if not ok]
print(f'\nAuth tests: {len(results) - len(failed)} passed, {len(failed)} failed')
sys.exit(1 if failed else 0)
