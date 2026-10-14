import type { ErrorEntry } from '../types';

const DAY = 86_400_000;
/** Days until a missed question comes back: after the miss, then after each correct reattempt. */
export const STEPS = [1, 3, 7];

export const startOfDay = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

/**
 * The error-log entry after an attempt. A miss (re)starts the schedule. A correct answer on or after the due
 * day moves it to the next step, and the last step resolves it. A correct answer before it is due, such as
 * straight after reading the solution, doesn't count.
 */
export function afterAttempt(prev: ErrorEntry | undefined, ok: boolean, now: number): ErrorEntry | undefined {
  if (!ok) return { ...(prev ?? { addedAt: now }), resolved: false, stage: 0, due: startOfDay(now) + STEPS[0] * DAY };
  if (!prev || prev.resolved || (prev.due ?? 0) > now) return prev;
  const stage = (prev.stage ?? 0) + 1;
  return stage >= STEPS.length ? { ...prev, stage, resolved: true } : { ...prev, stage, due: startOfDay(now) + STEPS[stage] * DAY };
}

/** Open and due now (entries from before scheduling have no due date, so they are due). */
export const isDue = (e: ErrorEntry, now: number) => !e.resolved && (e.due ?? 0) <= now;
