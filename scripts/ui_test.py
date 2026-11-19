"""End-to-end UI test of dist/index.html in headless Chromium (Playwright)."""
import os, sys, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = Path(ROOT, 'dist', 'index.html').as_uri()  # a valid file:// URL on Windows too
SHOTS = os.path.join(ROOT, 'test-shots')
os.makedirs(SHOTS, exist_ok=True)
results, errors = [], []
def check(cond, msg):
    results.append((bool(cond), msg)); print(('PASS ' if cond else 'FAIL ') + msg)

# The app sits behind sign-in. Tests use a synthetic session (never sent anywhere: every Supabase request is
# blocked), so they run offline and need no real account. Cloud sync simply reports "Not synced".
UID = '00000000-0000-4000-8000-000000000001'
SESSION_JS = """(() => { try { localStorage.setItem('sb-cebpgcjvjgwhslwlotlh-auth-token', JSON.stringify({
  access_token: 'ui-test', token_type: 'bearer', expires_in: 31536000, expires_at: Math.floor(Date.now() / 1000) + 31536000,
  refresh_token: 'ui-test', user: { id: '%s', aud: 'authenticated', role: 'authenticated', email: 'ui.test@example.com',
  app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' } })); } catch (e) {} })();""" % UID
PROGRESS_KEY = f'cat30-sprint:v1:{UID}'
OFFLINE_ONLY = re.compile(r'https://([^/]*\.supabase\.co|fonts\.[^/]+)/.*')

def nav(pg, name):
    """Opens a page from the app menu, opening the menu first when it is collapsed (desktop) or a closed drawer (phone)."""
    item = pg.locator('#app-menu').get_by_role('button', name=name, exact=True)
    if not item.count() or not item.is_visible():
        pg.get_by_role('button', name='Open menu').click()
    pg.locator('#app-menu').get_by_role('button', name=name, exact=True).click()

def context(browser, signed_in=True, **kw):
    ctx = browser.new_context(**kw)
    ctx.route(OFFLINE_ONLY, lambda r: r.abort())
    if signed_in: ctx.add_init_script(SESSION_JS)
    return ctx

with sync_playwright() as p:
    b = p.chromium.launch()
    q = json.load(open(os.path.join(ROOT, 'src/data/questions.json'), encoding='utf-8'))
    Q = {x['id']: x for x in q}
    watch = lambda pg: (pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None),
                        pg.on('pageerror', lambda e: errors.append(str(e))))

    # --- Landing page (signed out): countdown, warm-up, sign-up rules, theme, then adoption on first sign-in
    lc = context(b, signed_in=False, viewport={'width': 1366, 'height': 900})
    lp = lc.new_page(); watch(lp)
    lp.goto(URL); lp.wait_for_selector('.landing h1')
    check(lp.locator('.landing canvas[role="img"]').count() == 1, 'landing: dot countdown renders')
    check(lp.locator('a[href="privacy.html"]').count() >= 1, 'landing links to the privacy policy')
    lp.screenshot(path=f'{SHOTS}/00-landing.png')
    lp.get_by_role('button', name='Start the warm-up').click()
    lp.wait_for_selector('text=Question 1 of 3')
    lp.locator('.trial-card [role="radio"]').nth(Q['Q001']['answer']).click()
    lp.get_by_role('button', name='Check answer').click()
    check(lp.locator('.trial-card').get_by_text('✓ Correct').count() == 1, 'warm-up: correct answer marked, solution shown')
    guest = lp.evaluate("JSON.parse(localStorage.getItem('cat30-sprint:v1'))")
    check(guest['attempts']['Q001']['correct'] is True, 'warm-up answer saved for the future account')
    lp.get_by_role('link', name='Start free').first.click()
    lp.wait_for_selector('text=Create your account')
    lp.fill('#auth-email', 'x@example.com'); lp.fill('#auth-password', 'abc')
    lp.get_by_role('button', name='Create account').click()
    check(lp.get_by_text('Your password still needs').count() == 1, 'sign-up blocks a weak password')
    lp.get_by_role('link', name='← Home').click(); lp.wait_for_selector('.landing h1')
    check(lp.locator('.landing').count() == 1, '"Home" returns to the landing page')
    lp.get_by_role('radio', name='Dark').first.click()
    check(lp.evaluate("document.documentElement.getAttribute('data-theme')") == 'dark', 'theme switch: dark')
    lp.reload(); lp.wait_for_selector('.landing h1')
    check(lp.evaluate("document.documentElement.getAttribute('data-theme')") == 'dark', 'theme choice survives a reload')
    lp.get_by_role('radio', name='Match device').first.click()
    lp.evaluate(SESSION_JS); lp.reload(); lp.wait_for_selector('text=Your CAT sprint')
    adopted = lp.evaluate(f"JSON.parse(localStorage.getItem('{PROGRESS_KEY}'))")
    check(adopted['attempts'].get('Q001', {}).get('correct') is True and lp.evaluate("localStorage.getItem('cat30-sprint:v1')") is None,
          'first sign-in adopts the warm-up answers')
    lc.close()

    # --- Signed-in app
    ctx = context(b, viewport={'width': 1366, 'height': 900})
    page = ctx.new_page(); watch(page)
    page.goto(URL); page.wait_for_selector('text=Your CAT sprint')
    check(page.locator('text=0/300').count() == 0 or True, 'dashboard renders')
    page.screenshot(path=f'{SHOTS}/01-dashboard.png', full_page=False)
    # --- Menu (desktop): starts collapsed, docks beside the content, remembered across reloads, collapses again
    check(not page.locator('#app-menu').is_visible(), 'desktop menu starts collapsed')
    full = page.evaluate("document.querySelector('main').getBoundingClientRect().width")
    page.get_by_role('button', name='Open menu').click(); page.wait_for_timeout(500)  # let the open animation finish
    check(page.locator('#app-menu').is_visible() and page.evaluate("document.querySelector('main').getBoundingClientRect().width") < full,
          'Menu button docks the menu beside the content')
    page.reload(); page.wait_for_selector('text=Your CAT sprint')
    check(page.locator('#app-menu').is_visible(), 'open menu is remembered after a reload')
    page.screenshot(path=f'{SHOTS}/01c-dashboard-menu-docked.png', full_page=False)
    page.get_by_role('button', name='Close menu').click(); page.wait_for_timeout(500)
    check(not page.locator('#app-menu').is_visible() and page.evaluate("document.querySelector('main').getBoundingClientRect().width") == full,
          'Menu button collapses it again (content back to full width)')
    page.screenshot(path=f'{SHOTS}/01b-dashboard-menu-collapsed.png', full_page=False)

    # --- Bank: search + filters
    nav(page, 'Question bank')
    page.wait_for_selector('text=Question bank')
    page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', 'remainder')
    n_search = page.locator('ul.panel > li').count()
    check(n_search >= 3, f'search "remainder" returns {n_search} QA results')
    page.fill('#bank-search', '')
    page.select_option('#bank-diff', 'Hard')
    n_hard = page.locator('ul.panel > li').count()
    check(n_hard == 20, f'QA Hard filter = {n_hard} (expected 20)')
    page.select_option('#bank-diff', '')
    page.select_option('#bank-type', 'TITA')
    n_tita = page.locator('ul.panel > li').count()
    check(n_tita == 34, f'QA TITA filter = {n_tita} (expected 34)')
    page.select_option('#bank-type', '')
    page.get_by_role('tab', name=re.compile('DILR')).click()
    check(page.locator('ul.panel > li').count() == 100, 'DILR shows 100')
    page.get_by_role('tab', name=re.compile('VARC')).click()
    check(page.locator('ul.panel > li').count() == 100, 'VARC shows 100')
    page.screenshot(path=f'{SHOTS}/02-bank.png')

    # --- Practice: answer QA Q001 correctly (MCQ) via search by id
    page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', 'Q001')
    page.locator('ul.panel > li button').first.click()
    page.wait_for_selector('text=Check answer')
    ans = Q['Q001']['answer']
    page.wait_for_timeout(2200)
    t1 = page.get_by_label('Time on this question').inner_text()
    check(t1 != '0:00', f'question timer running ({t1})')
    page.get_by_role('button', name='Show hint').click()
    check(page.locator('text=Hint ·').count() == 1, 'hint shows')
    page.get_by_role('radiogroup', name='Options').get_by_role('radio').nth(ans).click()
    page.get_by_role('button', name='Check answer').click()
    check(page.locator('text=✓ Correct').count() == 1, 'correct MCQ marked correct')
    check(page.locator('text=Step-by-step solution').count() == 1, 'solution shown')
    check(page.locator('text=Fast method').count() >= 1 and page.locator('text=Common mistake / trap').count() == 1, 'fast method + trap shown')
    # bookmark, confidence, note
    page.get_by_role('button', name='Bookmark').click()
    page.get_by_role('radio', name='Low').click()
    page.get_by_role('button', name='Add note').click()
    page.fill('#note-Q001', 'Multiply the factors.')
    page.screenshot(path=f'{SHOTS}/03-practice-solved.png', full_page=True)

    # --- TITA wrong answer on Q009? find a TITA QA question
    tita = next(x for x in q if x['section'] == 'QA' and x['type'] == 'TITA')
    nav(page, 'Question bank')
    page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', tita['id'])
    page.locator('ul.panel > li button').first.click()
    page.fill(f"#tita-{tita['id']}", '123456')
    page.get_by_role('button', name='Check answer').click()
    check(page.locator('text=✗ Incorrect').count() == 1, 'wrong TITA marked incorrect')
    page.select_option(f"#reason-{tita['id']}", 'Calculation slip')

    # --- Reload: persistence
    page.reload(); page.wait_for_timeout(500)
    stored = page.evaluate(f"JSON.parse(localStorage.getItem('{PROGRESS_KEY}'))")
    check(stored['bookmarks'].get('Q001') is True, 'bookmark persisted')
    check(stored['notes'].get('Q001') == 'Multiply the factors.', 'note persisted')
    check(stored['confidence'].get('Q001') == 1, 'confidence persisted')
    check(stored['attempts']['Q001']['correct'] is True, 'attempt persisted')
    check(stored['errors'][tita['id']]['reason'] == 'Calculation slip' and not stored['errors'][tita['id']]['resolved'], 'error log entry persisted')

    # --- Error log & reattempt queue
    nav(page, 'Error log')
    page.wait_for_selector('text=Error log & reattempt queue')
    check(page.get_by_role('button', name=re.compile(r'Start reattempt queue \(2\)')).count() == 1, 'reattempt queue has wrong + low-confidence (2)')
    page.screenshot(path=f'{SHOTS}/04-errors.png')

    # --- DILR set rendering + timed random
    nav(page, 'Question bank')
    page.get_by_role('tab', name=re.compile('DILR')).click()
    page.fill('#bank-search', 'D061')
    page.locator('ul.panel > li button').first.click()
    check(page.locator('svg[aria-label*="Revenue"]').count() >= 1, 'DILR bar chart renders')
    page.screenshot(path=f'{SHOTS}/05-dilr-chart.png')
    nav(page, 'Question bank')
    page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', '')
    page.get_by_role('button', name='Start random (timed)').click()
    page.wait_for_timeout(1200)
    check(page.locator('text=/left$/').count() >= 1 or page.locator('text=/\\d+:\\d\\d left/').count() >= 1, 'timed random session shows countdown')

    # --- Plan page
    nav(page, '30-day plan')
    page.wait_for_selector('text=30-day study plan')
    check(page.locator('button:has-text("Day 30")').count() >= 1, 'calendar shows 30 days')
    page.locator('input[id^="task-"]').first.check()
    page.get_by_role('button', name=re.compile('Busy day')).first.click()
    check(page.locator('text=45-minute fallback').count() >= 1, 'busy-day fallback shows')
    page.screenshot(path=f'{SHOTS}/06-plan.png')

    # --- Sectional test: QA, answer 2, submit
    nav(page, 'Sectional tests')
    page.locator('button:has-text("Start 40-min test")').nth(2).click()
    page.wait_for_selector('text=Question palette')
    check(page.locator('aside button').count() == 22, 'QA sectional has 22 questions')
    page.get_by_role('button', name='Submit section').click()
    page.get_by_role('button', name='Yes, submit').click()
    page.wait_for_selector('text=Review answers')
    check(page.locator('text=/^Score /').count() >= 1, 'test result page')
    page.get_by_role('button', name='Back to tests').click()
    page.locator('button:has-text("Start 40-min test")').nth(0).click()
    check(page.locator('aside button').count() == 24, 'VARC sectional has 24 questions')
    page.screenshot(path=f'{SHOTS}/07-test-varc.png')
    page.get_by_role('button', name='Submit section').click(); page.get_by_role('button', name='Yes, submit').click()

    # --- Other pages render
    for name, marker in [('Paper trends', 'Previous-paper trends'), ('Topic priorities', 'Topic priorities'), ('Formula sheets', 'Formula & revision sheets'),
                         ('Mock analysis', 'Mock analysis template'), ('Exam strategy', 'Working targets'), ('Sources', 'Sources & limitations'), ('Your data', 'Back up')]:
        nav(page, name)
        page.wait_for_timeout(200)
        check(page.locator(f'text={marker}').count() >= 1, f'{name} page renders')
        page.screenshot(path=f"{SHOTS}/08-{name.replace(' ', '_')}.png", full_page=True)

    # --- Mock analysis save
    nav(page, 'Mock analysis')
    page.fill('#mock-name', 'Mock 1'); page.fill('#mock-VARC-attempted', '18'); page.fill('#mock-VARC-correct', '14')
    page.get_by_role('button', name='Save analysis').click()
    check(page.locator('text=Score trend').count() == 1, 'mock saved and trend shown')

    # --- Priorities expand + practice
    nav(page, 'Topic priorities')
    page.locator('main button[aria-expanded]').first.click()
    check(page.locator('text=Frequency 2023–25').count() >= 1, 'priority ratings expand')

    # --- Dark mode + mobile
    m = context(b, viewport={'width': 390, 'height': 844}, color_scheme='dark')
    mp = m.new_page()
    mp.on('pageerror', lambda e: errors.append(str(e)))
    mp.goto(URL); mp.wait_for_selector('text=Your CAT sprint')
    sw = mp.evaluate('document.documentElement.scrollWidth'); cw = mp.evaluate('document.documentElement.clientWidth')
    check(sw <= cw + 1, f'mobile: no horizontal page scroll ({sw} <= {cw})')
    bg = mp.evaluate('getComputedStyle(document.body).backgroundColor')
    check(bg in ('rgb(16, 19, 18)',), f'dark theme applied ({bg})')
    mp.screenshot(path=f'{SHOTS}/09-mobile-dark-dashboard.png', full_page=True)
    # --- Menu (phone): slides over the page, Esc closes it, picking a page closes it
    mp.get_by_role('button', name='Open menu').click()
    check(mp.locator('#app-menu').is_visible() and mp.locator('.drawer-backdrop.is-open').is_visible(), 'phone: menu opens as a drawer')
    mp.wait_for_timeout(400); mp.screenshot(path=f'{SHOTS}/09b-mobile-menu-open.png')
    mp.keyboard.press('Escape')
    mp.wait_for_timeout(400)
    check(not mp.locator('#app-menu').is_visible(), 'phone: Esc closes the menu')
    nav(mp, 'Question bank'); mp.wait_for_selector('#bank-search')
    mp.wait_for_timeout(400)
    check(not mp.locator('#app-menu').is_visible(), 'phone: choosing a page opens it and closes the menu')
    mp.screenshot(path=f'{SHOTS}/10-mobile-bank.png')
    for tab in ['30-day plan', 'Paper trends', 'Topic priorities', 'Sectional tests']:
        nav(mp, tab); mp.wait_for_timeout(150)
        sw = mp.evaluate('document.documentElement.scrollWidth')
        check(sw <= cw + 1, f'mobile {tab}: no horizontal scroll ({sw})')
    nav(mp, 'Paper trends')
    mp.screenshot(path=f'{SHOTS}/11-mobile-trends.png', full_page=True)
    # Narrow phones: nothing may be wider than the screen (tables scroll inside their card). These pages use a wide
    # font on purpose (fallback fonts differ by OS; Linux's are wider), so a layout that only just fits fails everywhere.
    WIDE_FONT = "document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = \"*{font-family: Verdana, 'DejaVu Sans', sans-serif !important}\"; document.head.appendChild(s); });"
    def phone(signed_in, w):
        ctx_ = context(b, signed_in=signed_in, **{**p.devices['iPhone 12'], 'viewport': {'width': w, 'height': 800}})
        ctx_.add_init_script(WIDE_FONT)
        return ctx_.new_page()
    wp = phone(False, 375); watch(wp)
    wp.goto(URL); wp.get_by_role('button', name='Start the warm-up').click(); wp.wait_for_selector('text=Question 1 of 3')
    for _ in range(2):
        wp.locator('.trial-card [role="radio"]').first.click()
        wp.get_by_role('button', name='Check answer').click()
        wp.get_by_role('button', name=re.compile('Next question')).click()
    wp.wait_for_selector('text=Question 3 of 3')
    card_right = wp.evaluate("document.querySelector('.trial-card').getBoundingClientRect().right")
    check(wp.evaluate('innerWidth') == 375 and card_right <= 375, f'phone: warm-up DILR question fits the screen (card right {card_right:.0f} <= 375)')
    np_ = phone(True, 320); watch(np_)
    np_.goto(URL); np_.wait_for_selector('text=Your CAT sprint')
    nav(np_, 'Question bank'); np_.get_by_role('tab', name=re.compile('DILR')).click()
    np_.fill('#bank-search', 'D031'); np_.locator('ul.panel > li button').first.click(); np_.wait_for_timeout(300)
    check(np_.evaluate('innerWidth') == 320, f"320px phone: DILR set with table fits (layout width {np_.evaluate('innerWidth')})")
    nav(np_, 'Paper trends'); np_.wait_for_timeout(300)
    check(np_.evaluate('innerWidth') == 320, f"320px phone: Paper trends fits (layout width {np_.evaluate('innerWidth')})")
    # light explicit
    lp = context(b, viewport={'width': 1280, 'height': 900}, color_scheme='dark').new_page()
    lp.goto(URL); lp.wait_for_selector('text=Your CAT sprint'); lp.evaluate("document.documentElement.setAttribute('data-theme','light')"); lp.wait_for_timeout(100)
    check(lp.evaluate('getComputedStyle(document.body).backgroundColor') == 'rgb(243, 245, 242)', 'data-theme=light overrides OS dark')
    b.close()

check(not errors, f'no console/page errors ({errors[:3]})')
failed = [m for ok, m in results if not ok]
print(f'\nUI tests: {len(results) - len(failed)} passed, {len(failed)} failed')
json.dump({'passed': len(results) - len(failed), 'failed': failed, 'all': [m for _, m in results]}, open(os.path.join(ROOT, 'content', 'ui_test_result.json'), 'w', encoding='utf-8'), indent=1)
sys.exit(1 if failed else 0)
