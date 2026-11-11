import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
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

  return (
    <NavCtx.Provider value={nav}>
      <div className="min-h-full lg:grid lg:grid-cols-[272px_1fr]">
        {/* Desktop sidebar */}
        <nav className="hidden lg:block sticky top-0 h-screen overflow-y-auto border-r px-5 py-7" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }} aria-label="Main">
          <div className="mb-6 px-2">
            <div className="display text-xl font-bold leading-none">CAT Sprint</div>
            <div className="mt-1 text-xs text-muted">30 days · 300 questions</div>
          </div>
          {groups.map((g) => (
            <div key={g} className="mb-5">
              <div className="label mb-1 px-2">{g}</div>
              {NAV.filter((n) => n.group === g).map((n) => (
                <button key={n.page} onClick={() => go(n.page)} aria-current={active === n.page ? 'page' : undefined}
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
            <div className="mt-1"><SyncBadge status={sync} /></div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button onClick={signOut} className="btn btn-sm">Log out</button>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <div className="min-w-0">
          {/* Mobile header + scrollable tabs */}
          <header className="app-head lg:hidden sticky z-20 border-b" style={{ top: 'env(safe-area-inset-top, 0px)', background: 'var(--surface)', borderColor: 'var(--line)' }}>
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="display text-lg font-bold">CAT Sprint</span>
              <div className="flex items-center gap-2">
                <SyncBadge status={sync} />
                <ThemeToggle />
                <button onClick={signOut} className="btn btn-ghost btn-sm" title={`Signed in as ${user.email}`}>Log out</button>
              </div>
            </div>
            <div className="scroll-x flex gap-1 px-3 py-2" role="tablist" aria-label="Pages">
              {NAV.map((n) => (
                <button key={n.page} role="tab" aria-selected={active === n.page} onClick={() => go(n.page)}
                  className="shrink-0 rounded-full px-3 py-1 text-sm"
                  style={active === n.page ? { background: 'var(--accent)', color: 'var(--accent-ink)', fontWeight: 700 } : { background: 'var(--sunk)', color: 'var(--ink)' }}>
                  {n.label}
                </button>
              ))}
            </div>
          </header>

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
    </NavCtx.Provider>
  );
}
