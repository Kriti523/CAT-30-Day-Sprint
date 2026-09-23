import type { AppState, Question, Section } from '../types';
import { QMAP, QUESTIONS, SETS, isCorrect, setQuestions, shuffle } from './data';

export const SECTION_MINUTES = 40;

const unseenFirst = <T,>(items: T[], unseen: (t: T) => number, seed: number) =>
  shuffle(items, seed).sort((a, b) => unseen(b) - unseen(a));

/** Builds a CAT-shaped section, preferring questions the user has not attempted yet. */
export function buildSection(section: Section, state: AppState, seed = Date.now()): string[] {
  const unseenQ = (q: Question) => (state.attempts[q.id] ? 0 : 1);
  if (section === 'VARC') {
    const passages = unseenFirst(SETS.filter((s) => s.section === 'VARC'),
      (s) => setQuestions(s.id).filter((q) => !state.attempts[q.id]).length, seed).slice(0, 4);
    const va = QUESTIONS.filter((q) => q.section === 'VARC' && !q.setId);
    const groups = [['Para summary'], ['Para jumble'], ['Odd sentence out'], ['Para completion', 'Sentence placement']];
    const vaPick = groups.flatMap((g) => unseenFirst(va.filter((q) => g.includes(q.subtopic)), unseenQ, seed).slice(0, 2));
    return [...passages.flatMap((p) => setQuestions(p.id).map((q) => q.id)), ...vaPick.map((q) => q.id)];
  }
  if (section === 'DILR') {
    const sets = unseenFirst(SETS.filter((s) => s.section === 'DILR'),
      (s) => setQuestions(s.id).filter((q) => !state.attempts[q.id]).length, seed).slice(0, 4);
    return sets.flatMap((s) => setQuestions(s.id).map((q) => q.id));
  }
  const quota: Record<string, number> = { Arithmetic: 8, Algebra: 7, 'Geometry & Mensuration': 3, 'Number Systems': 2, 'Modern Math': 2 };
  const qa = QUESTIONS.filter((q) => q.section === 'QA');
  return Object.entries(quota).flatMap(([topic, n]) => unseenFirst(qa.filter((q) => q.topic === topic), unseenQ, seed).slice(0, n)).map((q) => q.id);
}

export function marksFor(q: Question, given: string | undefined): number {
  if (given === undefined || given === '') return 0;
  if (isCorrect(q, given)) return 3;
  return q.type === 'MCQ' ? -1 : 0;
}

export function scoreSection(ids: string[], answers: Record<string, string>) {
  let attempted = 0, correct = 0, wrong = 0, score = 0;
  for (const id of ids) {
    const g = answers[id];
    if (g === undefined || g === '') continue;
    attempted++;
    const q = QMAP[id];
    if (isCorrect(q, g)) correct++; else wrong++;
    score += marksFor(q, g);
  }
  return { attempted, correct, wrong, score, total: ids.length };
}
