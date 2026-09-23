import questionsJson from '../data/questions.json';
import setsJson from '../data/sets.json';
import type { Question, QSet, Section } from '../types';

export const QUESTIONS = questionsJson as unknown as Question[];
export const SETS = setsJson as unknown as QSet[];
export const QMAP: Record<string, Question> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
export const SETMAP: Record<string, QSet> = Object.fromEntries(SETS.map((s) => [s.id, s]));

export const bySection = (s: Section) => QUESTIONS.filter((q) => q.section === s);
export const setQuestions = (setId: string) => QUESTIONS.filter((q) => q.setId === setId);

/** Normalise a typed answer: trims, removes commas/spaces/₹/%, and compares numerically when possible. */
export function normalise(s: string): string {
  return String(s).trim().replace(/[,\s₹%]/g, '').toLowerCase();
}

export function isCorrect(q: Question, given: string): boolean {
  if (given === '' || given == null) return false;
  if (q.type === 'MCQ') return String(q.answer) === String(given);
  const a = normalise(String(q.answer));
  const g = normalise(given);
  if (a === g) return true;
  const na = Number(a), ng = Number(g);
  return !Number.isNaN(na) && !Number.isNaN(ng) && Math.abs(na - ng) < 1e-9;
}

export function answerLabel(q: Question): string {
  if (q.type === 'MCQ' && q.options) {
    const i = Number(q.answer);
    return `${'ABCD'[i]}. ${q.options[i]}`;
  }
  return String(q.answer);
}

/** Expand "Q001-Q011" style ranges and set ids ("D07") into question ids. */
export function expandRefs(refs: string[]): string[] {
  const out: string[] = [];
  for (const r of refs) {
    if (SETMAP[r]) { out.push(...setQuestions(r).map((q) => q.id)); continue; }
    const m = r.match(/^([QDV])(\d{3})-\1?(\d{3})$/);
    if (m) {
      const [, p, a, b] = m;
      for (let i = Number(a); i <= Number(b); i++) out.push(`${p}${String(i).padStart(3, '0')}`);
      continue;
    }
    if (QMAP[r]) out.push(r);
  }
  return out.filter((id, i) => QMAP[id] && out.indexOf(id) === i);
}

export const fmtTime = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};

export function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = arr.slice();
  let x = seed % 2147483647 || 1;
  const rnd = () => (x = (x * 16807) % 2147483647) / 2147483647;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
