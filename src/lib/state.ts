import type { AppState, AttemptRec } from '../types';
import { QMAP, isCorrect } from './data';

/** Progress saved before accounts existed, and a visitor's "try 3 questions" answers; the first login adopts it. */
export const LEGACY_KEY = 'cat30-sprint:v1';
export const userKey = (userId: string) => `${LEGACY_KEY}:${userId}`;

export function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function nextMonday(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const add = (8 - x.getDay()) % 7 || 7; // always the coming Monday
  x.setDate(x.getDate() + (x.getDay() === 1 ? 0 : add));
  return toISO(x);
}

export function emptyState(): AppState {
  return {
    v: 1, attempts: {}, bookmarks: {}, notes: {}, confidence: {}, errors: {},
    planTasks: {}, busyDays: {}, startDate: nextMonday(), examDate: '2026-11-29', tests: [], mocks: [],
  };
}

/** Fills fields missing from older saves or other devices. */
export const normalize = (s: Partial<AppState>): AppState => ({ ...emptyState(), ...s, v: 1 });

/** True once anything worth keeping has been recorded. */
export function hasProgress(s: AppState) {
  return Object.keys(s.attempts).length + Object.keys(s.bookmarks).length + Object.keys(s.notes).length
    + Object.keys(s.planTasks).length + s.tests.length + s.mocks.length > 0;
}

/** Records one answer: updates the attempt history and the error log. */
export function applyAttempt(s: AppState, qid: string, given: string, seconds: number): { state: AppState; ok: boolean } {
  const ok = isCorrect(QMAP[qid], given);
  const prev = s.attempts[qid];
  const now = Date.now();
  const rec: AttemptRec = {
    n: (prev?.n ?? 0) + 1, correct: ok, everCorrect: ok || !!prev?.everCorrect, last: given,
    t: Math.round(seconds), at: now,
    history: [...(prev?.history ?? []), { c: ok, t: Math.round(seconds), at: now }].slice(-10),
  };
  const errors = { ...s.errors };
  if (!ok) errors[qid] = { ...(errors[qid] ?? { addedAt: now }), resolved: false };
  else if (errors[qid]) errors[qid] = { ...errors[qid], resolved: true };
  return { state: { ...s, attempts: { ...s.attempts, [qid]: rec }, errors }, ok };
}

const byId = <T extends { id: string }>(remote: T[], local: T[]) => [...new Map([...remote, ...local].map((x) => [x.id, x])).values()];

/**
 * Combines progress made on two devices since they last synced.
 * Attempts keep whichever side answered more often (then more recently); the error-log entry follows that
 * attempt. Tests and mocks are combined by id. For everything else this device (`local`) wins a clash.
 */
export function mergeStates(local: AppState, remote: AppState): AppState {
  const attempts = { ...remote.attempts };
  for (const [id, a] of Object.entries(local.attempts)) {
    const b = attempts[id];
    if (!b || a.n > b.n || (a.n === b.n && a.at >= b.at)) attempts[id] = a;
  }
  const errors = { ...remote.errors, ...local.errors };
  for (const id of Object.keys(errors)) {
    const remoteWon = remote.attempts[id] && attempts[id] === remote.attempts[id] && attempts[id] !== local.attempts[id];
    if (remoteWon && remote.errors[id]) errors[id] = remote.errors[id];
  }
  return normalize({
    ...remote, ...local,
    attempts, errors,
    bookmarks: { ...remote.bookmarks, ...local.bookmarks },
    notes: { ...remote.notes, ...local.notes },
    confidence: { ...remote.confidence, ...local.confidence },
    planTasks: { ...remote.planTasks, ...local.planTasks },
    busyDays: { ...remote.busyDays, ...local.busyDays },
    tests: byId(remote.tests, local.tests).sort((a, b) => a.startedAt - b.startedAt),
    mocks: byId(remote.mocks, local.mocks),
  });
}

/** Reads saved progress; localStorage can be missing or throw (private mode, blocked storage). */
export function loadLocal(key: string): { state: AppState; persistent: boolean; adopted: boolean } {
  try {
    const own = window.localStorage.getItem(key);
    const legacy = key === LEGACY_KEY ? null : window.localStorage.getItem(LEGACY_KEY);
    const raw = own ?? legacy;
    if (!raw) return { state: emptyState(), persistent: true, adopted: false };
    return { state: normalize(JSON.parse(raw)), persistent: true, adopted: own === null };
  } catch {
    return { state: emptyState(), persistent: false, adopted: false };
  }
}

export function saveLocal(key: string, s: AppState): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(s));
    if (key !== LEGACY_KEY) window.localStorage.removeItem(LEGACY_KEY); // adopted by this account now
    return true;
  } catch { return false; }
}
