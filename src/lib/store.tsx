import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppState, Confidence, ErrorReason, MockLog, PracticeSession, RunningTest, TestResult } from '../types';
import { QMAP, isCorrect } from './data';
import { useAuth } from './auth';
import { CloudSync, type SyncStatus } from './sync';
import { toISODate } from './dates';

export { toISODate as toISO } from './dates';

const KEY = 'cat30-sprint:v1';

export function emptyState(): AppState {
  return {
    v: 1, attempts: {}, bookmarks: {}, notes: {}, confidence: {}, errors: {},
    planTasks: {}, busyDays: {}, startDate: toISODate(new Date()), examDate: '2026-11-29', tests: [], mocks: [],
    activeTest: null, practice: null, checklist: {}, setupDone: false, target: '',
  };
}

/** Fills in fields missing from progress saved by an older version of the app, and drops a test or practice
 *  session that refers to questions this version no longer has. */
const normalize = (s?: Partial<AppState>): AppState => {
  const n: AppState = { ...emptyState(), ...s, v: 1 };
  if (n.activeTest && !n.activeTest.sections.every((x) => x.ids.every((id) => QMAP[id]))) n.activeTest = null;
  if (n.practice) {
    const ids = n.practice.ids.filter((id) => QMAP[id]);
    n.practice = ids.length ? { ...n.practice, ids, index: Math.min(n.practice.index, ids.length - 1) } : null;
  }
  return n;
};

/** localStorage can be missing or throw (private mode, blocked storage); the app works without it. */
function load(): { state: AppState; persistent: boolean } {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { state: emptyState(), persistent: true };
    return { state: normalize(JSON.parse(raw)), persistent: true };
  } catch {
    return { state: emptyState(), persistent: false };
  }
}
function save(s: AppState): boolean {
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; }
}

interface Store {
  state: AppState;
  persistent: boolean;
  /** Where progress is being saved: this browser only, or the signed-in account (and how that is going). */
  sync: SyncStatus;
  retrySync: () => void;
  /** Uploads anything pending, then signs out; this device then shows its own progress without an account. */
  signOut: () => Promise<void>;
  record: (qid: string, given: string, seconds: number) => boolean;
  toggleBookmark: (qid: string) => void;
  setNote: (qid: string, text: string) => void;
  setConfidence: (qid: string, c: Confidence) => void;
  setErrorReason: (qid: string, reason: ErrorReason) => void;
  setErrorNote: (qid: string, note: string) => void;
  resolveError: (qid: string, resolved: boolean) => void;
  addToQueue: (qid: string) => void;
  togglePlanTask: (key: string) => void;
  toggleBusy: (day: number) => void;
  setStartDate: (d: string) => void;
  completeSetup: (startDate: string, target: string) => void;
  setTarget: (target: string) => void;
  saveTest: (t: TestResult) => void;
  saveMock: (m: MockLog) => void;
  setActiveTest: (t: RunningTest | null) => void;
  setPractice: (p: PracticeSession | null) => void;
  toggleChecklist: (key: string) => void;
  deleteMock: (id: string) => void;
  replaceAll: (s: AppState) => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

/** Progress belongs to the signed-in account, or to this browser when nobody is signed in. Switching starts a fresh store. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <AccountStore key={user?.id ?? ''} uid={user?.id ?? null}>{children}</AccountStore>;
}

function AccountStore({ uid, children }: { uid: string | null; children: ReactNode }) {
  const auth = useAuth();
  const initial = useRef<{ state: AppState; persistent: boolean; cloud: CloudSync | null }>();
  if (!initial.current) {
    const cloud = uid ? new CloudSync(uid, normalize, { read: () => load().state, clear: () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } } }) : null;
    initial.current = cloud ? { state: cloud.state0, persistent: true, cloud } : { ...load(), cloud: null };
  }
  const { cloud } = initial.current;
  const [state, setState] = useState<AppState>(initial.current.state);
  const [persistent, setPersistent] = useState(initial.current.persistent);
  const [sync, setSync] = useState<SyncStatus>(cloud ? 'loading' : 'local');

  useEffect(() => {
    if (!cloud) return;
    cloud.start(setState, setSync);
    return () => cloud.stop();
  }, [cloud]);

  useEffect(() => { if (cloud) cloud.changed(state); else setPersistent(save(state)); }, [state, cloud]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);

  const record = useCallback((qid: string, given: string, seconds: number) => {
    const q = QMAP[qid];
    const ok = isCorrect(q, given);
    update((s) => {
      const prev = s.attempts[qid];
      const rec = {
        n: (prev?.n ?? 0) + 1, correct: ok, everCorrect: ok || !!prev?.everCorrect, last: given,
        t: Math.round(seconds), at: Date.now(),
        history: [...(prev?.history ?? []), { c: ok, t: Math.round(seconds), at: Date.now() }].slice(-10),
      };
      const errors = { ...s.errors };
      if (!ok) errors[qid] = { ...(errors[qid] ?? { addedAt: Date.now() }), resolved: false };
      else if (errors[qid]) errors[qid] = { ...errors[qid], resolved: true };
      return { ...s, attempts: { ...s.attempts, [qid]: rec }, errors };
    });
    return ok;
  }, [update]);

  const store = useMemo<Store>(() => ({
    state, persistent, record, sync,
    retrySync: () => cloud?.retry(),
    signOut: async () => {
      if (cloud && await cloud.flush()) cloud.forget();
      await auth.signOut();
    },
    toggleBookmark: (qid) => update((s) => {
      const b = { ...s.bookmarks };
      if (b[qid]) delete b[qid]; else b[qid] = true;
      return { ...s, bookmarks: b };
    }),
    setNote: (qid, text) => update((s) => ({ ...s, notes: { ...s.notes, [qid]: text } })),
    setConfidence: (qid, c) => update((s) => ({ ...s, confidence: { ...s.confidence, [qid]: c } })),
    setErrorReason: (qid, reason) => update((s) => ({ ...s, errors: { ...s.errors, [qid]: { ...(s.errors[qid] ?? { addedAt: Date.now(), resolved: false }), reason } } })),
    setErrorNote: (qid, note) => update((s) => ({ ...s, errors: { ...s.errors, [qid]: { ...(s.errors[qid] ?? { addedAt: Date.now(), resolved: false }), note } } })),
    resolveError: (qid, resolved) => update((s) => s.errors[qid] ? ({ ...s, errors: { ...s.errors, [qid]: { ...s.errors[qid], resolved } } }) : s),
    addToQueue: (qid) => update((s) => ({ ...s, errors: { ...s.errors, [qid]: { ...(s.errors[qid] ?? { addedAt: Date.now() }), resolved: false } } })),
    togglePlanTask: (key) => update((s) => ({ ...s, planTasks: { ...s.planTasks, [key]: !s.planTasks[key] } })),
    toggleBusy: (day) => update((s) => ({ ...s, busyDays: { ...s.busyDays, [day]: !s.busyDays[day] } })),
    setStartDate: (d) => update((s) => ({ ...s, startDate: d })),
    completeSetup: (startDate, target) => update((s) => ({ ...s, startDate, target, setupDone: true })),
    setTarget: (target) => update((s) => ({ ...s, target })),
    saveTest: (t) => update((s) => ({ ...s, tests: [...s.tests, t] })),
    saveMock: (m) => update((s) => ({ ...s, mocks: [...s.mocks.filter((x) => x.id !== m.id), m] })),
    deleteMock: (id) => update((s) => ({ ...s, mocks: s.mocks.filter((x) => x.id !== id) })),
    setActiveTest: (t) => update((s) => ({ ...s, activeTest: t })),
    setPractice: (p) => update((s) => ({ ...s, practice: p })),
    toggleChecklist: (key) => update((s) => ({ ...s, checklist: { ...s.checklist, [key]: !s.checklist[key] } })),
    replaceAll: (n) => setState(normalize(n)),
    reset: () => setState(emptyState()),
  }), [state, persistent, record, update, sync, cloud, auth]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider missing');
  return s;
}

/** Questions that should be re-attempted: wrong and unresolved, or marked low confidence. */
export function reattemptQueue(s: AppState): string[] {
  const wrong = Object.entries(s.errors).filter(([, e]) => !e.resolved).map(([id]) => id);
  const low = Object.entries(s.confidence).filter(([id, c]) => c === 1 && !wrong.includes(id)).map(([id]) => id);
  return [...wrong, ...low].filter((id) => QMAP[id]);
}
