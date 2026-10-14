import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavCtx, type Nav, type Page, type Session } from './lib/nav';
import { useStore } from './lib/store';
import type { Section } from './types';
import Dashboard from './pages/Dashboard';
import PlanPage from './pages/Plan';
import Bank from './pages/Bank';
import Practice from './pages/Practice';
import Tests from './pages/Tests';
import Errors from './pages/Errors';
import Trends from './pages/Trends';
import Priorities from './pages/Priorities';
import Formulas from './pages/Formulas';
import Mocks from './pages/Mocks';
import Strategy from './pages/Strategy';
import SourcesPage from './pages/Sources';
import DataPage from './pages/Data';

const NAV: { page: Page; label: string; group: string }[] = [
  { page: 'dashboard', label: 'Dashboard', group: 'Prepare' },
  { page: 'plan', label: '30-day plan', group: 'Prepare' },
  { page: 'bank', label: 'Question bank', group: 'Prepare' },
  { page: 'tests', label: 'Sectional tests', group: 'Prepare' },
  { page: 'errors', label: 'Error log', group: 'Prepare' },
  { page: 'mocks', label: 'Mock analysis', group: 'Prepare' },
  { page: 'trends', label: 'Paper trends', group: 'Understand' },
  { page: 'priorities', label: 'Topic priorities', group: 'Understand' },
  { page: 'formulas', label: 'Formula sheets', group: 'Understand' },
  { page: 'strategy', label: 'Exam strategy', group: 'Understand' },
  { page: 'sources', label: 'Sources', group: 'Understand' },
  { page: 'data', label: 'Your data', group: 'Understand' },
];
const PAGES = new Set<string>([...NAV.map((n) => n.page), 'practice']);

function initialPage(): Page {
  try {
    const h = window.location.hash.replace('#', '');
    if (PAGES.has(h)) return h as Page;
  } catch { /* ignore */ }
  return 'dashboard';
}

/** At this width the sidebar sits beside the page; below it, it slides over the page as a drawer. */
const WIDE = '(min-width: 1024px)';
const NAV_KEY = 'cat30-sprint:nav-open';

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

export default function App() {
  const { persistent } = useStore();
  const [page, setPage] = useState<Page>(initialPage);
  const [bankSection, setBankSection] = useState<Section>('QA');
  const [bankQuery, setBankQuery] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [pendingTest, setPendingTest] = useState<Section | 'FULL' | null>(null);
  const wide = useWide();
  // Sidebar on wide screens: open by default, remembered. Drawer on narrow screens: closed by default.
  const [sideOpen, setSideOpen] = useState(() => { try { return localStorage.getItem(NAV_KEY) !== '0'; } catch { return true; } });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const navOpen = wide ? sideOpen : drawerOpen;
  const toggleNav = () => (wide ? setSideOpen : setDrawerOpen)((o) => !o);

  useEffect(() => { try { localStorage.setItem(NAV_KEY, sideOpen ? '1' : '0'); } catch { /* ignore */ } }, [sideOpen]);

  // While the drawer covers the page: Escape closes it, and the page behind it doesn't scroll.
  useEffect(() => {
    if (wide || !drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDrawerOpen(false); menuBtn.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [wide, drawerOpen]);

  const go = useCallback<Nav['go']>((p, opts) => {
    if (opts?.bankSection) setBankSection(opts.bankSection);
    if (opts?.bankQuery !== undefined) setBankQuery(opts.bankQuery);
    if (opts?.testSection) setPendingTest(opts.testSection);
    setPage(p);
    try { history.replaceState(null, '', `#${p}`); } catch { /* sandboxed frames may refuse */ }
    window.scrollTo({ top: 0 });
  }, []);

  const startSession = useCallback((ids: string[], title: string, timed = false) => {
    if (!ids.length) return;
    setSession({ ids, title, timed, index: 0 });
    go('practice');
  }, [go]);

  useEffect(() => {
    const onHash = () => { const h = window.location.hash.replace('#', ''); if (PAGES.has(h)) setPage(h as Page); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const nav = useMemo<Nav>(() => ({ page, go, startSession, bankSection, bankQuery, pendingTest, clearPendingTest: () => setPendingTest(null) }),
    [page, go, startSession, bankSection, bankQuery, pendingTest]);

  const groups = ['Prepare', 'Understand'];
  const active = page === 'practice' ? 'bank' : page;

  return (
    <NavCtx.Provider value={nav}>
      <div className="min-h-full">
        <header className="app-head sticky z-40 flex items-center gap-3 border-b px-3 sm:px-4" style={{ top: 'env(safe-area-inset-top, 0px)', height: 'var(--head-h)', background: 'var(--surface)', borderColor: 'var(--line)' }}>
          <button ref={menuBtn} className="btn btn-ghost" style={{ padding: '.4rem' }} onClick={toggleNav} aria-label="Menu" aria-expanded={navOpen} aria-controls="main-nav">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
          <span className="display text-lg font-bold">CAT Sprint</span>
          <span className="ml-auto text-xs text-muted">30 days · 300 questions</span>
        </header>

        {/* Narrow screens: dim the page behind the open drawer; tapping it closes the drawer */}
        {!wide && drawerOpen && (
          <div className="no-print fixed inset-x-0 bottom-0 z-20 bg-black/40" style={{ top: 'var(--head-bottom)' }} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
        )}

        <div className="flex">
          <nav id="main-nav" aria-label="Main"
            className={wide
              ? `sticky shrink-0 overflow-hidden transition-[width,visibility] duration-200 ${navOpen ? 'w-[232px]' : 'invisible w-0'}`
              : `fixed bottom-0 left-0 z-30 w-[264px] max-w-[85vw] transition-[transform,visibility] duration-200 ${navOpen ? '' : 'invisible -translate-x-full'}`}
            style={wide ? { top: 'var(--head-bottom)', height: 'calc(100vh - var(--head-bottom))' } : { top: 'var(--head-bottom)' }}>
            {/* Fixed width inside, so the links don't reflow while the sidebar collapses */}
            <div className={`h-full overflow-y-auto border-r px-4 py-6 ${wide ? 'w-[232px]' : 'w-full'}`} style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
              {groups.map((g) => (
                <div key={g} className="mb-5">
                  <div className="label mb-1 px-2">{g}</div>
                  {NAV.filter((n) => n.group === g).map((n) => (
                    <button key={n.page} onClick={() => { go(n.page); setDrawerOpen(false); }} aria-current={active === n.page ? 'page' : undefined}
                      className="block w-full rounded-md px-2 py-1.5 text-left text-[0.95rem]"
                      style={active === n.page ? { background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 700 } : { color: 'var(--ink)' }}>
                      {n.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </nav>
          <div className="min-w-0 flex-1">
            <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
              {!persistent && (
                <div className="no-print mb-4 rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>
                  This browser is blocking local storage, so progress will be lost when you close the page. Use “Your data → Export” to keep a copy.
                </div>
              )}
              {page === 'dashboard' && <Dashboard />}
              {page === 'plan' && <PlanPage />}
              {page === 'bank' && <Bank />}
              {page === 'practice' && <Practice session={session} setSession={setSession} />}
              {page === 'tests' && <Tests />}
              {page === 'errors' && <Errors />}
              {page === 'trends' && <Trends />}
              {page === 'priorities' && <Priorities />}
              {page === 'formulas' && <Formulas />}
              {page === 'mocks' && <Mocks />}
              {page === 'strategy' && <Strategy />}
              {page === 'sources' && <SourcesPage />}
              {page === 'data' && <DataPage />}
            </main>
          </div>
        </div>
      </div>
    </NavCtx.Provider>
  );
}
