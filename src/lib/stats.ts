import type { AppState, Question, Section } from '../types';
import { QUESTIONS } from './data';

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

export function planDayIndex(startDate: string, now = new Date()): number {
  const [y, m, d] = startDate.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - start.getTime()) / 86400000) + 1; // day 1 = start date
}

export function dateForDay(startDate: string, day: number): Date {
  const [y, m, d] = startDate.split('-').map(Number);
  return new Date(y, m - 1, d + day - 1);
}

export const fmtDate = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export function daysUntil(iso: string, now = new Date()): number {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(y, m - 1, d).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((t - today) / 86400000);
}

export const pct = (v: number | null) => (v === null ? '—' : `${Math.round(v * 100)}%`);
