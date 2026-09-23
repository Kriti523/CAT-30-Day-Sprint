import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppState, Confidence, ErrorReason, MockLog, TestResult } from '../types';
import { QMAP, isCorrect } from './data';

const KEY = 'cat30-sprint:v1';

function nextMonday(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const add = (8 - x.getDay()) % 7 || 7; // always the coming Monday
  x.setDate(x.getDate() + (x.getDay() === 1 ? 0 : add));
  return toISO(x);
}
export function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function emptyState(): AppState {
  return {
    v: 1, attempts: {}, bookmarks: {}, notes: {}, confidence: {}, errors: {},
    planTasks: {}, busyDays: {}, startDate: nextMonday(), examDate: '2026-11-29', tests: [], mocks: [],
  };
}

/** localStorage can be missing or throw (private mode, blocked storage); the app works without it. */
function load(): { state: AppState; persistent: boolean } {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { state: emptyState(), persistent: true };
    const parsed = JSON.parse(raw);
    return { state: { ...emptyState(), ...parsed, v: 1 }, persistent: true };
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = useRef(load());
  const [state, setState] = useState<AppState>(initial.current.state);
  const [persistent, setPersistent] = useState(initial.current.persistent);

  useEffect(() => { setPersistent(save(state)); }, [state]);

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
    state, persistent, record,
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
    replaceAll: (n) => setState({ ...emptyState(), ...n, v: 1 }),
    reset: () => setState(emptyState()),
  }), [state, persistent, record, update]);

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
