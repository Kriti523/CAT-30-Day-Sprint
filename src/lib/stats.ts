import type { AppState, Question, Section } from '../types';
import { QUESTIONS } from './data';
import { toISODate } from './dates';

export interface Agg { total: number; attempted: number; correct: number; accuracy: number | null; avgTime: number | null }

export function aggregate(state: AppState, qs: Question[]): Agg {
  let attempted = 0, correct = 0, time = 0;
  for (const q of qs) {
    const a = state.attempts[q.id];
    if (!a) continue;
    attempted++; if (a.correct) correct++; time += a.t;
  }
  return { total: qs.length, attempted, correct, accuracy: attempted ? correct / attempted : null, avgTime: attempted ? time / attempted : null };
}

export function bySubtopic(state: AppState, section?: Section) {
  const map = new Map<string, Question[]>();
  for (const q of QUESTIONS) {
    if (section && q.section !== section) continue;
    const k = `${q.section}|${q.subtopic}`;
    map.set(k, [...(map.get(k) ?? []), q]);
  }
  return [...map.entries()].map(([k, qs]) => {
    const [sec, sub] = k.split('|');
    return { section: sec as Section, subtopic: sub, qs, ...aggregate(state, qs) };
  });
}

export const fmtDate = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export function daysUntil(iso: string, now = new Date()): number {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(y, m - 1, d).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((t - today) / 86400000);
}

export const pct = (v: number | null) => (v === null ? '—' : `${Math.round(v * 100)}%`);

/** Days (yyyy-mm-dd) with any practice: an answered question or a finished test. */
export function activeDays(s: AppState): Set<string> {
  const days = new Set<string>();
  for (const a of Object.values(s.attempts)) for (const h of a.history ?? [{ at: a.at }]) days.add(toISODate(new Date(h.at)));
  for (const t of s.tests) days.add(toISODate(new Date(t.finishedAt)));
  return days;
}

/** Consecutive days of practice up to today. Today not practised yet doesn't break it until the day is over. */
export function streak(s: AppState, now = new Date()): number {
  const days = activeDays(s);
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(toISODate(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(toISODate(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
