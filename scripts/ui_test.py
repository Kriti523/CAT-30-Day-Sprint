"""End-to-end UI test of dist/index.html in headless Chromium (Playwright)."""
import os, sys, json, re
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'file://' + os.path.join(ROOT, 'dist', 'index.html')
SHOTS = os.path.join(ROOT, 'test-shots')
QS = json.load(open(os.path.join(ROOT, 'src', 'data', 'questions.json')))
count = lambda **kw: sum(1 for q in QS if all(q.get(k) == v for k, v in kw.items()))
results, errors = [], []
def check(cond, msg):
    results.append((bool(cond), msg)); print(('PASS ' if cond else 'FAIL ') + msg)
def setup(pg, start=None):
    """First run asks for a start date and target; build the plan and land on the dashboard."""
    pg.wait_for_selector('text=Let’s build your plan')
    if start: pg.fill('#setup-start', start)
    pg.get_by_role('button', name='Build my plan').click()
    pg.wait_for_selector('text=Your CAT sprint')

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 1366, 'height': 900})
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.route(re.compile(r'https://fonts\..*'), lambda r: r.abort())
    page.goto(URL)
    page.wait_for_selector('text=Let’s build your plan'); check(True, 'first run opens the plan setup')
    page.fill('#setup-start', '2026-11-09')
    check(page.locator('text=/keeps the 20 that matter most/').count() == 1, 'setup previews a shortened plan for 20 days')
    page.fill('#setup-start', '2026-10-14')
    check(page.locator('text=/plus 16 consolidation days/').count() == 1, 'setup previews a 46-day plan with consolidation days')
    page.locator('#target-99').check()
    setup(page, '2026-10-14')
    check(page.locator('text=/target: 99th percentile/i').count() == 1, 'dashboard shows the target')
    page.screenshot(path=f'{SHOTS}/01-dashboard.png', full_page=False)

    # --- Bank: search + filters
    page.get_by_role('button', name='Question bank').first.click()
    page.wait_for_selector('text=Question bank')
    page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', 'remainder')
    n_search = page.locator('[data-qid]').count()
    check(n_search >= 3, f'search "remainder" returns {n_search} QA results')
    page.fill('#bank-search', '')
    page.select_option('#bank-diff', 'Hard')
    n_hard = page.locator('[data-qid]').count()
    check(n_hard == count(section='QA', difficulty='Hard'), f'QA Hard filter = {n_hard} (expected {count(section="QA", difficulty="Hard")})')
    page.select_option('#bank-diff', '')
    page.select_option('#bank-type', 'TITA')
    n_tita = page.locator('[data-qid]').count()
    check(n_tita == count(section='QA', type='TITA'), f'QA TITA filter = {n_tita} (expected {count(section="QA", type="TITA")})')
    page.select_option('#bank-type', '')
    page.get_by_role('tab', name=re.compile('DILR')).click()
    check(page.locator('[data-qid]').count() == 100, 'DILR shows 100')
    page.get_by_role('tab', name=re.compile('VARC')).click()
    check(page.locator('[data-qid]').count() == 100, 'VARC shows 100')
    page.screenshot(path=f'{SHOTS}/02-bank.png')

    # --- Practice: answer QA Q001 correctly (MCQ) via search by id
    page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', 'Q001')
    page.locator('[data-qid] button').first.click()
    page.wait_for_selector('text=Check answer')
    q = json.load(open(os.path.join(ROOT, 'src/data/questions.json')))
    Q = {x['id']: x for x in q}
    ans = Q['Q001']['answer']
    page.wait_for_timeout(2200)
    t1 = page.get_by_label('Time on this question').inner_text()
    check(t1 != '0:00', f'question timer running ({t1})')
    page.get_by_role('button', name='Show hint').click()
    check(page.locator('text=Hint ·').count() == 1, 'hint shows')
    page.locator('.opt').nth(ans).click()
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
    page.get_by_role('button', name='Question bank').first.click()
    page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', tita['id'])
    page.locator('[data-qid] button').first.click()
    page.fill(f"#tita-{tita['id']}", '123456')
    page.get_by_role('button', name='Check answer').click()
    check(page.locator('text=✗ Incorrect').count() == 1, 'wrong TITA marked incorrect')
    page.select_option(f"#reason-{tita['id']}", 'Calculation slip')

    # --- Reload: persistence
    page.reload(); page.wait_for_timeout(500)
    stored = page.evaluate("JSON.parse(localStorage.getItem('cat30-sprint:v1'))")
    check(stored['bookmarks'].get('Q001') is True, 'bookmark persisted')
    check(stored['notes'].get('Q001') == 'Multiply the factors.', 'note persisted')
    check(stored['confidence'].get('Q001') == 1, 'confidence persisted')
    check(stored['attempts']['Q001']['correct'] is True, 'attempt persisted')
    check(stored['errors'][tita['id']]['reason'] == 'Calculation slip' and not stored['errors'][tita['id']]['resolved'], 'error log entry persisted')

    # --- Error log & reattempt queue
    page.get_by_role('button', name='Error log').first.click()
    page.wait_for_selector('text=Error log & reattempt queue')
    check(page.get_by_role('button', name=re.compile(r'Start reattempt queue \(1\)')).count() == 1 and page.locator('text=/1 coming back later, next on/').count() == 1,
          'a miss comes back tomorrow; the low-confidence question is due now')
    page.screenshot(path=f'{SHOTS}/04-errors.png')

    # --- DILR set rendering + timed random
    page.get_by_role('button', name='Question bank').first.click()
    page.get_by_role('tab', name=re.compile('DILR')).click()
    page.fill('#bank-search', 'D061')
    page.locator('[data-qid] button').first.click()
    check(page.locator('svg[aria-label*="Revenue"]').count() >= 1, 'DILR bar chart renders')
    page.screenshot(path=f'{SHOTS}/05-dilr-chart.png')
    page.get_by_role('button', name='Question bank').first.click()
    page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', '')
    page.get_by_role('button', name='Start random (timed)').click()
    page.wait_for_timeout(1200)
    check(page.locator('text=/left$/').count() >= 1 or page.locator('text=/\\d+:\\d\\d left/').count() >= 1, 'timed random session shows countdown')

    # --- Plan page
    page.get_by_role('button', name='Study plan').first.click()
    page.wait_for_selector('text=Your 46-day plan')
    check(page.locator('button:has-text("Day 46")').count() == 1 and page.locator('main >> text=CAT').count() >= 1, 'calendar runs from the start date to the exam')
    page.locator('input[id^="task-"]').first.check()
    page.get_by_role('button', name=re.compile('Busy day')).first.click()
    check(page.locator('text=45-minute fallback').count() >= 1, 'busy-day fallback shows')
    page.screenshot(path=f'{SHOTS}/06-plan.png')

    # --- Sectional test: QA, answer 2, submit
    page.get_by_role('button', name='Sectional tests').first.click()
    page.locator('button:has-text("Start 40-min test")').nth(2).click()
    page.wait_for_selector('text=Question palette')
    check(page.locator('aside button.pal').count() == 22, 'QA sectional has 22 questions')
    page.get_by_role('button', name='Submit section').click()
    page.get_by_role('button', name='Yes, submit').click()
    page.wait_for_selector('text=Review answers')
    check(page.locator('text=/^Score /').count() >= 1, 'test result page')
    page.get_by_role('button', name='Back to tests').click()
    page.locator('button:has-text("Start 40-min test")').nth(0).click()
    check(page.locator('aside button.pal').count() == 24, 'VARC sectional has 24 questions')
    page.screenshot(path=f'{SHOTS}/07-test-varc.png')
    page.get_by_role('button', name='Submit section').click(); page.get_by_role('button', name='Yes, submit').click()

    # --- A running test survives leaving the page and reloading; DILR follows the 68-question pattern
    page.get_by_role('button', name='Back to tests').click()
    page.locator('button:has-text("Start 40-min test")').nth(1).click()
    page.wait_for_selector('text=Question palette')
    check(page.locator('aside button.pal').count() == 22, 'DILR sectional has 22 questions')
    tita_seen = False
    for i in range(22):
        if page.locator('input[id^="tita-"]').count():
            tita_seen = True
            check(page.locator('input[id^="tita-"]').get_attribute('readonly') is not None, 'test answers are typed on the on-screen keypad')
            for k in ['Minus sign', '4', '2']: page.get_by_role('button', name=k, exact=True).click()
            check(page.locator('input[id^="tita-"]').input_value() == '-42', 'keypad enters a negative answer')
            break
        page.locator('.opt').first.click(); page.get_by_role('button', name='Save & next →').click()
    check(tita_seen, 'DILR test includes a typed-answer question')
    answered_before = page.locator('text=/\\d+\\/22 answered/').inner_text()
    page.get_by_role('button', name='Calculator').click()
    for k in ['1', '2', 'Multiply', '3', 'Equals']: page.locator('.calc').get_by_role('button', name=k, exact=True).click()
    check(page.locator('.calc-screen').inner_text().strip().endswith('36'), 'calculator works (12 × 3 = 36)')
    page.get_by_role('button', name='Close calculator').click()
    page.get_by_role('button', name='Dashboard').first.click()
    check(page.get_by_role('button', name='Resume test').count() == 1, 'leaving a test shows a Resume banner')
    page.get_by_role('button', name='Resume test').click(); page.wait_for_selector('text=Question palette')
    check(page.locator('text=/\\d+\\/22 answered/').inner_text() == answered_before, f'test resumes with answers kept ({answered_before})')
    page.reload(); page.wait_for_selector('text=Question palette')
    check(page.locator('text=/\\d+\\/22 answered/').inner_text() == answered_before, 'test survives a reload')
    check(page.locator('aside .pal.answered').count() >= 1 and page.locator('aside .pal.not-visited').count() >= 1, 'palette shows CAT states')
    n_tests = page.evaluate("JSON.parse(localStorage.getItem('cat30-sprint:v1')).tests.length")
    page.get_by_role('button', name='Discard test').click(); page.get_by_role('button', name='Discard', exact=True).click()
    check(page.locator('text=Question palette').count() == 0 and page.evaluate("JSON.parse(localStorage.getItem('cat30-sprint:v1')).tests.length") == n_tests, 'discarding ends the test without saving it')

    # --- Back moves between pages; practice and the exam-day checklist survive
    page.get_by_role('button', name='Question bank').first.click(); page.get_by_role('button', name='Error log').first.click()
    page.go_back(); page.wait_for_timeout(300)
    check(page.evaluate('location.hash') == '#bank' and page.locator('text=Question bank').count() >= 1, 'Back returns to the previous page')
    page.get_by_role('button', name=re.compile(r'^Practise these')).click(); page.wait_for_timeout(200)
    page.reload(); page.wait_for_timeout(600)
    check(page.locator('text=Untimed practice').count() == 1, 'practice session survives a reload')
    page.get_by_role('button', name='Exam strategy').first.click()
    page.locator('#exam-0').check(); page.get_by_role('button', name='Dashboard').first.click(); page.get_by_role('button', name='Exam strategy').first.click()
    check(page.locator('#exam-0').is_checked(), 'exam-day checklist ticks are kept')

    # --- Reattempts reshuffle options; the dashboard counts the streak
    page.get_by_role('button', name='Question bank').first.click(); page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', 'Q001'); page.locator('[data-qid] button').first.click(); page.wait_for_timeout(200)
    check(page.locator('text=Options shuffled').count() == 1 and page.locator('text=Previous try: right').count() == 1, 'a reattempt shows shuffled options and the previous result')
    page.get_by_role('button', name='Dashboard').first.click()
    check(page.locator('text=/1-day streak/').count() == 1, 'dashboard shows the practice streak')

    # --- Keyboard practice, problem reports (no accounts here, so the report is shown to copy), theme switch
    page.get_by_role('button', name='Question bank').first.click(); page.get_by_role('tab', name=re.compile('QA')).click()
    page.fill('#bank-search', 'Q012'); page.locator('[data-qid] button').first.click(); page.wait_for_timeout(200)
    page.keyboard.press('b'); page.keyboard.press('Enter'); page.wait_for_timeout(200)
    check(page.locator('text=Step-by-step solution').count() == 1, 'keyboard: B then Enter answers a question')
    page.get_by_role('button', name='Report a problem').click()
    page.fill('#report-msg-Q012', 'Option text has a typo')
    check(page.locator('text=/Question Q012: Wrong answer key\\. Option text has a typo/').count() == 1, 'without accounts, a report is shown ready to copy')
    page.get_by_role('radio', name='Dark').click()
    check(page.evaluate('getComputedStyle(document.body).backgroundColor') == 'rgb(16, 19, 18)', 'theme switch: Dark applies the dark theme')
    page.reload(); page.wait_for_timeout(400)
    check(page.evaluate("document.documentElement.dataset.theme") == 'dark', 'theme choice survives a reload')
    page.get_by_role('radio', name='System').click()

    # --- A full mock: results with benchmarks and set review, logged on Mock analysis
    page.get_by_role('button', name='Sectional tests').first.click()
    page.get_by_role('button', name='Start 120-min mock').click(); page.wait_for_selector('text=Question palette')
    page.locator('.opt').first.click() if page.locator('.opt').count() else None
    for _ in range(3):
        page.get_by_role('button', name='Submit section').click(); page.get_by_role('button', name='Yes, submit').click(); page.wait_for_timeout(200)
    page.wait_for_selector('text=Review answers')
    check(page.locator('text=vs 99th-percentile level').count() == 1 and page.locator('text=Sets and passages').count() == 1, 'mock results show benchmarks and set review')
    check(page.locator('text=/percentile in CAT 2025|95th percentile needed in CAT 2025/').count() == 1, 'mock results give an indicative percentile band')
    page.get_by_role('button', name='Add your reflections').click()
    check(page.locator('text=/In-app mock \\d/').count() >= 1, 'a full mock is logged on Mock analysis automatically')

    # --- Topic primers: a lesson per Must-Master topic, linked from Topic priorities
    page.get_by_role('button', name='Topic priorities').first.click()
    page.get_by_role('button', name='Primer for Ratio, proportion, averages & mixtures').click(); page.wait_for_timeout(300)
    check(page.locator('text=Tea at ₹40/kg is mixed with tea at ₹70/kg').count() == 1 and page.locator('text=Topic primers').count() >= 1, 'a priority opens its topic primer')
    check(page.get_by_role('button', name=re.compile(r'^Practise \d+ Qs$')).count() == 10, 'every primer except set selection (a skill, not a question type) has a Practise button')

    # --- Other pages render
    for name, marker in [('Paper trends', 'Previous-paper trends'), ('Topic priorities', 'Topic priorities'), ('Formula sheets', 'Formula & revision sheets'),
                         ('Mock analysis', 'Mock analysis template'), ('Exam strategy', 'Working targets'), ('Sources', 'Sources & limitations'), ('Your data', 'Back up')]:
        page.get_by_role('button', name=name).first.click()
        page.wait_for_timeout(200)
        check(page.locator(f'text={marker}').count() >= 1, f'{name} page renders')
        page.screenshot(path=f"{SHOTS}/08-{name.replace(' ', '_')}.png", full_page=True)

    # --- Mock analysis save
    page.get_by_role('button', name='Mock analysis').first.click()
    page.fill('#mock-name', 'Mock 1'); page.fill('#mock-VARC-attempted', '18'); page.fill('#mock-VARC-correct', '14')
    page.get_by_role('button', name='Save analysis').click()
    check(page.locator('text=Score trend').count() == 1, 'mock saved and trend shown')

    # --- Priorities expand + practice
    page.get_by_role('button', name='Topic priorities').first.click()
    page.locator('main button[aria-expanded]').first.click()
    check(page.locator('text=Frequency 2023–25').count() >= 1, 'priority ratings expand')

    # --- Desktop sidebar toggles from the hamburger and remembers the choice
    main_w = lambda: page.evaluate("document.querySelector('main').parentElement.getBoundingClientRect().width")
    w_open = main_w()
    page.get_by_role('button', name='Menu').click(); page.wait_for_timeout(350)
    check(not page.locator('#main-nav').is_visible() and main_w() > w_open + 200, f'desktop: hamburger hides sidebar, page widens ({w_open} -> {main_w()})')
    page.reload(); page.wait_for_selector('#main-nav', state='attached'); page.wait_for_timeout(100)
    check(not page.locator('#main-nav').is_visible(), 'desktop: closed sidebar stays closed after reload')
    page.get_by_role('button', name='Menu').click(); page.wait_for_timeout(350)
    check(page.locator('#main-nav').is_visible() and abs(main_w() - w_open) < 2, 'desktop: hamburger brings sidebar back')

    # --- Dark mode + mobile
    m = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme='dark')
    mp = m.new_page(); mp.route(re.compile(r'https://fonts\..*'), lambda r: r.abort())
    mp.on('pageerror', lambda e: errors.append(str(e)))
    mp.goto(URL); setup(mp)
    sw = mp.evaluate('document.documentElement.scrollWidth'); cw = mp.evaluate('document.documentElement.clientWidth')
    check(sw <= cw + 1, f'mobile: no horizontal page scroll ({sw} <= {cw})')
    bg = mp.evaluate('getComputedStyle(document.body).backgroundColor')
    check(bg in ('rgb(16, 19, 18)',), f'dark theme applied ({bg})')
    mp.screenshot(path=f'{SHOTS}/09-mobile-dark-dashboard.png', full_page=True)
    check(not mp.locator('#main-nav').is_visible(), 'mobile: menu drawer starts closed')
    def mgo(name):
        mp.get_by_role('button', name='Menu').click()
        mp.locator('#main-nav').get_by_role('button', name=name).click(); mp.wait_for_timeout(250)
    mgo('Question bank')
    check(not mp.locator('#main-nav').is_visible(), 'mobile: drawer closes after picking a page')
    mp.screenshot(path=f'{SHOTS}/10-mobile-bank.png')
    for tab in ['Study plan', 'Paper trends', 'Topic priorities', 'Sectional tests']:
        mgo(tab)
        sw = mp.evaluate('document.documentElement.scrollWidth')
        check(sw <= cw + 1, f'mobile {tab}: no horizontal scroll ({sw})')
    mp.get_by_role('button', name='Menu').click(); mp.wait_for_timeout(250)
    check(mp.locator('#main-nav').is_visible(), 'mobile: hamburger opens the drawer')
    mp.keyboard.press('Escape'); mp.wait_for_timeout(250)
    check(not mp.locator('#main-nav').is_visible(), 'mobile: Escape closes the drawer')
    mgo('Paper trends')
    mp.screenshot(path=f'{SHOTS}/11-mobile-trends.png', full_page=True)
    mgo('Question bank'); mp.get_by_role('tab', name=re.compile('VARC')).click(); mp.fill('#bank-search', 'V001'); mp.locator('[data-qid] button').first.click(); mp.wait_for_timeout(200)
    check(mp.get_by_role('tab', name='Passage').get_attribute('aria-selected') == 'true' and not mp.locator('.opt').first.is_visible(), 'mobile: a passage opens on the Passage tab')
    mp.get_by_role('tab', name='Question').click()
    check(mp.locator('.opt').first.is_visible(), 'mobile: the Question tab shows the options')
    # light explicit
    lp = b.new_context(viewport={'width': 1280, 'height': 900}, color_scheme='dark').new_page()
    lp.route(re.compile(r'https://fonts\..*'), lambda r: r.abort())
    lp.goto(URL); lp.evaluate("document.documentElement.setAttribute('data-theme','light')"); lp.wait_for_timeout(100)
    check(lp.evaluate('getComputedStyle(document.body).backgroundColor') == 'rgb(243, 245, 242)', 'data-theme=light overrides OS dark')
    b.close()

check(not errors, f'no console/page errors ({errors[:3]})')
failed = [m for ok, m in results if not ok]
print(f'\nUI tests: {len(results) - len(failed)} passed, {len(failed)} failed')
json.dump({'passed': len(results) - len(failed), 'failed': failed, 'all': [m for _, m in results]}, open(os.path.join(ROOT, 'content', 'ui_test_result.json'), 'w'), indent=1)
sys.exit(1 if failed else 0)
