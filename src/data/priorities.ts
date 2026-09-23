import type { Section } from '../types';

/* Priority Score (0–100) = 10 × weighted average of five 0–10 ratings:
 *   Frequency across 2023–25          30%
 *   Consistency across slots          20%
 *   Scoring potential (accuracy/time) 20%
 *   Foundational importance           15%
 *   Improvability within 30 days      15%
 * Frequency/consistency ratings come from the reconstructed counts on the
 * Trends page; the other three are analyst judgements and are labelled so.
 */
export const WEIGHTS = { freq: 0.3, cons: 0.2, score: 0.2, found: 0.15, improve: 0.15 } as const;

export type PriorityClass = 'Must Master' | 'Should Master' | 'Selective Practice' | 'Low Priority';

export interface TopicPriority {
  section: Section;
  topic: string;
  ratings: { freq: number; cons: number; score: number; found: number; improve: number };
  evidence: string;
  bankFilter?: string; // bank subtopic/topic keyword
}

export const TOPICS: TopicPriority[] = [
  // ---------------- QA
  { section: 'QA', topic: 'Percentages, profit, loss & discount', ratings: { freq: 8, cons: 9, score: 9, found: 10, improve: 9 }, evidence: 'Profit/loss/interest 6–7 per year; percentages underpin every DI set.', bankFilter: 'Percent|Profit' },
  { section: 'QA', topic: 'Ratio, proportion, averages & mixtures', ratings: { freq: 9, cons: 9, score: 8, found: 9, improve: 9 }, evidence: '8, 12 and 9 questions in 2023–25; up to 5 in a single slot (2024 S1).', bankFilter: 'Ratio|Averages|Mixtures' },
  { section: 'QA', topic: 'Time, speed, distance & work', ratings: { freq: 8, cons: 9, score: 7, found: 8, improve: 8 }, evidence: '9, 6 and 8 questions; present in every slot.', bankFilter: 'Time' },
  { section: 'QA', topic: 'Simple & compound interest', ratings: { freq: 5, cons: 6, score: 8, found: 6, improve: 9 }, evidence: 'Counted inside profit/interest; 1–2 per year on its own.', bankFilter: 'Interest' },
  { section: 'QA', topic: 'Linear equations, inequalities & modulus', ratings: { freq: 9, cons: 9, score: 7, found: 9, improve: 7 }, evidence: '10, 5 and 10 questions – the single largest algebra block.', bankFilter: 'Linear|Inequal' },
  { section: 'QA', topic: 'Quadratics & polynomials', ratings: { freq: 6, cons: 8, score: 7, found: 8, improve: 8 }, evidence: '5, 4 and 5 questions; appears in 8 of 9 slots.', bankFilter: 'Quadratic' },
  { section: 'QA', topic: 'Logarithms, surds & indices', ratings: { freq: 6, cons: 8, score: 8, found: 6, improve: 8 }, evidence: '4, 7 and 3 questions; short, formula-driven.', bankFilter: 'Logarithm' },
  { section: 'QA', topic: 'Progressions & series', ratings: { freq: 6, cons: 8, score: 7, found: 6, improve: 7 }, evidence: '7, 4 and 5 questions.', bankFilter: 'Progression' },
  { section: 'QA', topic: 'Geometry (triangles, circles, polygons)', ratings: { freq: 8, cons: 10, score: 6, found: 7, improve: 6 }, evidence: 'Exactly ~3 per slot every year (8–9 per year).', bankFilter: 'Triangles|Circles|Polygons|Quadrilaterals' },
  { section: 'QA', topic: 'Number systems', ratings: { freq: 7, cons: 9, score: 5, found: 7, improve: 5 }, evidence: '6–9 per year; often among the harder questions.', bankFilter: 'Remainder|Factor|HCF|Units|Divisib' },
  { section: 'QA', topic: 'Mensuration', ratings: { freq: 3, cons: 5, score: 7, found: 5, improve: 8 }, evidence: 'Usually 0–1 per slot, folded into geometry counts.', bankFilter: 'Mensuration' },
  { section: 'QA', topic: 'Functions & graphs', ratings: { freq: 4, cons: 6, score: 5, found: 6, improve: 5 }, evidence: '2, 4 and 3 questions.', bankFilter: 'Functions' },
  { section: 'QA', topic: 'P&C and probability', ratings: { freq: 3, cons: 6, score: 6, found: 5, improve: 6 }, evidence: '0–1 per slot in sub-topic counts; broader "modern math" (incl. sets, progressions) is 3–4 per slot.', bankFilter: 'Permutation|Combination|Probability' },
  { section: 'QA', topic: 'Coordinate geometry', ratings: { freq: 3, cons: 4, score: 6, found: 4, improve: 7 }, evidence: 'Occasional; mostly inside geometry.', bankFilter: 'Coordinate' },
  { section: 'QA', topic: 'Trigonometry / heights & distances', ratings: { freq: 1, cons: 2, score: 5, found: 3, improve: 6 }, evidence: 'Not reported in 2023–25 analyses.' },
  // ---------------- DILR
  { section: 'DILR', topic: 'Set selection (meta-skill)', ratings: { freq: 10, cons: 10, score: 10, found: 10, improve: 10 }, evidence: 'Every slot mixed approachable and trap sets; good attempts are 2–3 sets.' },
  { section: 'DILR', topic: 'Tables & charts DI (incl. missing values)', ratings: { freq: 9, cons: 10, score: 8, found: 8, improve: 8 }, evidence: 'Bar/line/candlestick/scatter/table sets in every 2024–25 slot.', bankFilter: 'Tables|Charts' },
  { section: 'DILR', topic: 'Arrangements (linear, circular, grid)', ratings: { freq: 8, cons: 8, score: 8, found: 9, improve: 8 }, evidence: 'Circular arrangement in two 2025 slots; arrangement sets each year.', bankFilter: 'Arrangements' },
  { section: 'DILR', topic: 'Quant-based caselets & percentages', ratings: { freq: 7, cons: 8, score: 7, found: 7, improve: 7 }, evidence: '"Mathematical reasoning" = 10 Qs in 2023 S2/S3; currency exchange, trade balance in 2025.', bankFilter: 'Caselets' },
  { section: 'DILR', topic: 'Distribution & selection', ratings: { freq: 7, cons: 7, score: 7, found: 8, improve: 7 }, evidence: 'Selection & distribution 2023 S3; author–books, balls & holes 2025.', bankFilter: 'Distribution' },
  { section: 'DILR', topic: 'Venn diagrams & set-based sets', ratings: { freq: 5, cons: 6, score: 8, found: 7, improve: 9 }, evidence: 'OTT Venn (2024 S3), 4-set Venn (2025 S2).', bankFilter: 'Venn' },
  { section: 'DILR', topic: 'Games & tournaments', ratings: { freq: 6, cons: 7, score: 6, found: 7, improve: 7 }, evidence: 'Tournament set 2024 S1; ratings/scoring sets recur.', bankFilter: 'Games' },
  { section: 'DILR', topic: 'Scheduling & time-based sets', ratings: { freq: 6, cons: 6, score: 6, found: 6, improve: 7 }, evidence: 'Train movement/ticketing and call-log sets in 2025.', bankFilter: 'Scheduling' },
  { section: 'DILR', topic: 'Hybrid (LR + DI) sets', ratings: { freq: 6, cons: 7, score: 5, found: 6, improve: 5 }, evidence: 'Several 2025 sets combined a data table with logical clues.', bankFilter: 'Hybrid' },
  { section: 'DILR', topic: 'Networks & routes', ratings: { freq: 5, cons: 6, score: 6, found: 5, improve: 7 }, evidence: 'Routes & networks 2023 S3; roads/ATM placement 2024.', bankFilter: 'Networks' },
  { section: 'DILR', topic: 'Cubes, dice & pure number puzzles', ratings: { freq: 2, cons: 2, score: 4, found: 4, improve: 4 }, evidence: 'Rare in 2023–25; skip unless everything else is strong.' },
  // ---------------- VARC
  { section: 'VARC', topic: 'RC – main idea & inference', ratings: { freq: 10, cons: 10, score: 8, found: 10, improve: 7 }, evidence: '16 of 24 VARC questions are RC every year; inference/main idea dominate.', bankFilter: 'Main idea|Inference' },
  { section: 'VARC', topic: 'Para summary', ratings: { freq: 7, cons: 9, score: 8, found: 7, improve: 8 }, evidence: '2–3 per slot in all three years.', bankFilter: 'Para summary' },
  { section: 'VARC', topic: "RC – tone & author's view", ratings: { freq: 7, cons: 8, score: 8, found: 7, improve: 8 }, evidence: 'Present in most passages; quick to answer once the stance is clear.', bankFilter: "Tone|Author" },
  { section: 'VARC', topic: 'Odd sentence out', ratings: { freq: 6, cons: 9, score: 7, found: 6, improve: 8 }, evidence: '2 per slot in 2023, 2024 and 2025 (TITA – no negative).', bankFilter: 'Odd' },
  { section: 'VARC', topic: 'Para completion & sentence placement', ratings: { freq: 6, cons: 8, score: 6, found: 6, improve: 7 }, evidence: '2–3 per slot (label varies by source).', bankFilter: 'completion|placement' },
  { section: 'VARC', topic: 'Para jumbles', ratings: { freq: 6, cons: 7, score: 6, found: 6, improve: 7 }, evidence: '2 per slot in 2023 and 2025; conflicting reports for 2024.', bankFilter: 'jumble' },
  { section: 'VARC', topic: 'RC – detail, strengthen/weaken, application', ratings: { freq: 5, cons: 6, score: 6, found: 6, improve: 6 }, evidence: 'Appear in a minority of RC questions.', bankFilter: 'Detail|Strengthen|Application|Vocabulary|Purpose' },
  { section: 'VARC', topic: 'Vocabulary / grammar drills', ratings: { freq: 0, cons: 0, score: 3, found: 4, improve: 4 }, evidence: 'Not tested as standalone questions in 2023–25.' },
];

export function score(t: TopicPriority): number {
  const r = t.ratings;
  return Math.round(10 * (r.freq * WEIGHTS.freq + r.cons * WEIGHTS.cons + r.score * WEIGHTS.score + r.found * WEIGHTS.found + r.improve * WEIGHTS.improve));
}

export function classify(s: number): PriorityClass {
  if (s >= 75) return 'Must Master';
  if (s >= 60) return 'Should Master';
  if (s >= 45) return 'Selective Practice';
  return 'Low Priority';
}

export const CLASSES: PriorityClass[] = ['Must Master', 'Should Master', 'Selective Practice', 'Low Priority'];

export const RANKED = TOPICS.map((t) => ({ ...t, score: score(t), cls: classify(score(t)) })).sort((a, b) => b.score - a.score);
