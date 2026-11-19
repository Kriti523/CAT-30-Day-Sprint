import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavCtx, type Nav, type Page, type Session } from './lib/nav';
import { useStore } from './lib/store';
import { useAuth } from './lib/auth';
import type { SyncStatus } from './lib/sync';
import type { Section } from './types';
import { ThemeToggle } from './components/ThemeToggle';

// Each page is its own chunk, fetched the first time it is opened.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PlanPage = lazy(() => import('./pages/Plan'));
const Bank = lazy(() => import('./pages/Bank'));
const Practice = lazy(() => import('./pages/Practice'));
const Tests = lazy(() => import('./pages/Tests'));
const Errors = lazy(() => import('./pages/Errors'));
const Trends = lazy(() => import('./pages/Trends'));
const Priorities = lazy(() => import('./pages/Priorities'));
const Formulas = lazy(() => import('./pages/Formulas'));
const Mocks = lazy(() => import('./pages/Mocks'));
const Strategy = lazy(() => import('./pages/Strategy'));
const SourcesPage = lazy(() => import('./pages/Sources'));
const DataPage = lazy(() => import('./pages/Data'));

const SYNC_LABEL: Record<SyncStatus, { text: string; color: string; title: string }> = {
  syncing: { text: 'Saving…', color: 'var(--muted)', title: 'Saving your progress to your account' },
  synced: { text: 'Synced', color: 'var(--good)', title: 'Your progress is saved to your account and matches your other devices' },
  offline: { text: 'Offline', color: 'var(--warn)', title: 'Saved on this device; it will sync when you are back online' },
  error: { text: 'Not synced', color: 'var(--bad)', title: 'Saved on this device; syncing to your account failed and will retry' },
};

function SyncBadge({ status }: { status: SyncStatus }) {
  const l = SYNC_LABEL[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: l.color }} title={l.title} role="status">
      <span className="dot" style={{ background: l.color, width: '.45rem', height: '.45rem' }} aria-hidden />{l.text}
    </span>
  );
}

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

/** Desktop: whether the docked menu is open (remembered). Phones always start with the menu closed. */
const MENU_KEY = 'cat30-sprint:menu';
const WIDE = '(min-width: 1024px)';

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia?.(WIDE).matches ?? true);
  useEffect(() => {
    const m = window.matchMedia?.(WIDE);
    if (!m) return;
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

/** Three lines that fold into an ✕ when open (animated in index.css). */
function Burger({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
      className={`burger${open ? ' is-open' : ''}`} aria-hidden>
      <line className="l1" x1="4" y1="7" x2="20" y2="7" />
      <line className="l2" x1="4" y1="12" x2="20" y2="12" />
      <line className="l3" x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function initialPage(): Page {
  try {
    const h = window.location.hash.replace('#', '');
    if (PAGES.has(h)) return h as Page;
  } catch { /* ignore */ }
  return 'dashboard';
}

export default function App() {
  const { persistent, sync } = useStore();
  const { user, signOut } = useAuth();
  const [page, setPage] = useState<Page>(initialPage);
  const [bankSection, setBankSection] = useState<Section>('QA');
  const [bankQuery, setBankQuery] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [pendingTest, setPendingTest] = useState<Section | 'FULL' | null>(null);

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
  const activeLabel = page === 'practice' ? 'Practice' : NAV.find((n) => n.page === active)?.label ?? '';

  // Menu: docked beside the content on wide screens (open/closed remembered), a slide-over drawer on phones.
  const wide = useWide();
  const [docked, setDocked] = useState(() => { try { return localStorage.getItem(MENU_KEY) === 'open'; } catch { return false; } });
  const [drawer, setDrawer] = useState(false);
  const open = wide ? docked : drawer;
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    if (!wide) { setDrawer((d) => !d); return; }
    const next = !docked;
    setDocked(next);
    try { localStorage.setItem(MENU_KEY, next ? 'open' : 'closed'); } catch { /* remembered for this visit only */ }
  };
  const navTo = (p: Page) => { go(p); if (!wide) setDrawer(false); };

  useEffect(() => { if (wide) setDrawer(false); }, [wide]);
  // Open drawer: Esc closes it, the page behind doesn't scroll, focus moves in and returns to the button after.
  useEffect(() => {
    if (wide || !drawer) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false); };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const menuEl = menuRef.current;
    (menuEl?.querySelector<HTMLElement>('[aria-current="page"]') ?? menuEl?.querySelector<HTMLElement>('button'))?.focus({ preventScroll: true });
    const btn = menuBtn.current;
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; btn?.focus(); };
  }, [wide, drawer]);

  const menu = (
    <>
      {groups.map((g) => (
        <div key={g} className="mb-5">
          <div className="label mb-1 px-2">{g}</div>
          {NAV.filter((n) => n.group === g).map((n) => (
            <button key={n.page} onClick={() => navTo(n.page)} aria-current={active === n.page ? 'page' : undefined}
              className="block w-full rounded-md px-2 py-1.5 text-left text-[0.95rem]"
              style={active === n.page ? { background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 700 } : { color: 'var(--ink)' }}>
              {n.label}
            </button>
          ))}
        </div>
      ))}
      <div className="mt-2 border-t px-2 pt-4" style={{ borderColor: 'var(--line)' }}>
        <div className="label mb-1">Signed in</div>
        <div className="truncate text-sm" title={user.email}>{user.email}</div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={signOut} className="btn btn-sm">Log out</button>
          <ThemeToggle className="sm:hidden" />
        </div>
      </div>
    </>
  );

  return (
    <NavCtx.Provider value={nav}>
      <div className="min-h-full">
        <header className="app-head sticky z-30 border-b" style={{ top: 'env(safe-area-inset-top, 0px)', background: 'var(--surface)', borderColor: 'var(--line)' }}>
          <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4">
            <button ref={menuBtn} type="button" onClick={toggleMenu} className="btn btn-ghost btn-sm"
              aria-expanded={open} aria-controls="app-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
              <Burger open={open} /><span className="hidden sm:inline">Menu</span>
            </button>
            <button type="button" onClick={() => navTo('dashboard')} className="flex min-w-0 items-center gap-2" aria-label="CAT Sprint dashboard">
              <span className="flex gap-[3px]" aria-hidden>
                <span className="dot" style={{ background: 'var(--varc)', width: 8, height: 8 }} />
                <span className="dot" style={{ background: 'var(--dilr)', width: 8, height: 8 }} />
                <span className="dot" style={{ background: 'var(--qa)', width: 8, height: 8 }} />
              </span>
              <span className="display whitespace-nowrap text-lg font-bold leading-none">CAT Sprint</span>
            </button>
            {activeLabel && <span className="hidden min-w-0 truncate text-sm text-muted md:inline">/ {activeLabel}</span>}
            <div className="ml-auto flex items-center gap-2">
              <SyncBadge status={sync} />
              <ThemeToggle className="hidden sm:inline-flex" />
            </div>
          </div>
        </header>

        {/* The menu stays mounted and is shown/hidden with CSS (index.css "App menu"), so it animates both ways. */}
        <div className={wide ? `shell${docked ? ' menu-open' : ''}` : ''}>
          {wide && (
            <div className="dock" aria-hidden={!docked}>
              <nav id="app-menu" ref={menuRef} aria-label="Main" className="dock-panel h-full overflow-y-auto border-r px-4 py-6"
                style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
                {menu}
              </nav>
            </div>
          )}
          {!wide && (
            <>
              <div className={`drawer-backdrop fixed inset-0 z-40${drawer ? ' is-open' : ''}`} onClick={() => setDrawer(false)} aria-hidden />
              <nav id="app-menu" ref={menuRef} aria-label="Main" aria-hidden={!drawer}
                className={`drawer fixed inset-y-0 left-0 z-50 w-[min(86vw,300px)] overflow-y-auto px-4 pb-6${drawer ? ' is-open' : ''}`}
                style={{ background: 'var(--surface)', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}>
                <div className="mb-4 flex items-center justify-between px-2">
                  <span className="display text-lg font-bold">Menu</span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDrawer(false)} aria-label="Close menu"><Burger open /></button>
                </div>
                {menu}
              </nav>
            </>
          )}

          <div className="min-w-0">
            <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
              {!persistent && (
                <div className="no-print mb-4 rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>
                  This browser is blocking local storage. Your progress is still saved to your account, but only while you're online.
                </div>
              )}
              <Suspense fallback={<div className="py-10 text-sm text-muted" role="status">Loading…</div>}>
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
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </NavCtx.Provider>
  );
}
