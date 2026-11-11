import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppState, Confidence, ErrorReason, MockLog, TestResult } from '../types';
import { QMAP, isCorrect } from './data';
import { applyAttempt, emptyState, hasProgress, loadLocal, normalize, saveLocal, userKey } from './state';
import { useCloudSync, type SyncStatus } from './sync';

export { emptyState, toISO } from './state';

interface Store {
  state: AppState;
  persistent: boolean;
  /** Where the cloud copy of this account's progress stands. */
  sync: SyncStatus;
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
  saveTest: (t: TestResult) => void;
  saveMock: (m: MockLog) => void;
  deleteMock: (id: string) => void;
  replaceAll: (s: AppState) => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const key = userKey(userId);
  const initial = useRef<ReturnType<typeof loadLocal>>();
  initial.current ??= loadLocal(key);
  const [state, setState] = useState<AppState>(initial.current.state);
  const [persistent, setPersistent] = useState(initial.current.persistent);

  useEffect(() => { setPersistent(saveLocal(key, state)); }, [key, state]);

  // Progress adopted from before sign-in (or older saves with no sync record yet) must go up to the cloud.
  const { adopted, state: first } = initial.current;
  const sync = useCloudSync(userId, state, setState, adopted || hasProgress(first));

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);

  const record = useCallback((qid: string, given: string, seconds: number) => {
    update((s) => applyAttempt(s, qid, given, seconds).state);
    return isCorrect(QMAP[qid], given);
  }, [update]);

  const store = useMemo<Store>(() => ({
    state, persistent, sync, record,
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
    saveTest: (t) => update((s) => ({ ...s, tests: [...s.tests, t] })),
    saveMock: (m) => update((s) => ({ ...s, mocks: [...s.mocks.filter((x) => x.id !== m.id), m] })),
    deleteMock: (id) => update((s) => ({ ...s, mocks: s.mocks.filter((x) => x.id !== id) })),
    replaceAll: (n) => setState(normalize(n)),
    reset: () => setState(emptyState()),
  }), [state, persistent, sync, record, update]);

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
