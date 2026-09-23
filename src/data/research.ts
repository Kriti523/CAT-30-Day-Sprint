/* Previous-paper analysis for CAT 2023–2025.
 *
 * IMPORTANT: IIMs do not publish topic-wise breakdowns. Question papers are
 * released only as candidate response sheets; every topic count below is a
 * RECONSTRUCTION by coaching institutes from candidates' memory/response
 * sheets. Where two sources disagree the conflict is shown, not averaged away.
 */

export type Reliability = 'Official' | 'Cross-checked (2+ sources)' | 'Single source' | 'Conflicting';

export interface Source {
  key: string;
  name: string;
  url: string;
  kind: 'Official / exam body' | 'Coaching analysis' | 'Education portal';
  usedFor: string;
}

export const SOURCES: Source[] = [
  { key: 'iim', name: 'CAT official website (iimcat.ac.in)', url: 'https://iimcat.ac.in', kind: 'Official / exam body', usedFor: 'Primary authority for exam date, pattern and notices. Could not be fetched from this environment (HTTP 403); official facts were confirmed via two secondary reports of the official notification.' },
  { key: 'cracku-notif', name: 'Cracku – CAT 2026 notification summary', url: 'https://cracku.in/cat-2026-notification-pdf-out/', kind: 'Coaching analysis', usedFor: 'CAT 2026 date (29 Nov 2026), registration window, eligibility.' },
  { key: 'shiksha-cat', name: 'Shiksha – CAT 2026 exam page', url: 'https://www.shiksha.com/mba/cat-exam', kind: 'Education portal', usedFor: 'CAT 2026 date and conducting IIM (IIM Indore).' },
  { key: 'careers360-dates', name: 'Careers360 – CAT exam dates', url: 'https://www.careers360.com/mba/articles/cat-exam-dates', kind: 'Education portal', usedFor: 'CAT 2026 date, IIM Indore, three slots, 204 total marks.' },
  { key: 'ims-2025', name: 'IMS – CAT 2025 exam analysis (all slots)', url: 'https://www.imsindia.com/blog/cat/cat-exam-analysis-2025/', kind: 'Coaching analysis', usedFor: '2025 pattern (68 Qs, 40 min/section), MCQ/TITA split, RC topics, VA types, DILR sets, QA broad-topic counts, good attempts.' },
  { key: 'toprankers-topic', name: 'Toprankers – CAT topic-wise analysis 2023–2025', url: 'https://www.toprankers.com/cat-topic-wise-analysis', kind: 'Coaching analysis', usedFor: 'QA sub-topic counts per slot for 2023, 2024, 2025; VARC and DILR structure.' },
  { key: 'toprankers-2025', name: 'Toprankers – CAT 2025 slot-wise analysis', url: 'https://www.toprankers.com/cat-exam-analysis', kind: 'Coaching analysis', usedFor: '2025 TITA counts, VA types, DILR set list (cross-check for IMS).' },
  { key: 'gradsqr-2025', name: 'GradSquare – CAT 2025 Slot 2 analysis', url: 'https://gradsqr.com/cat-2025-slot-2-analysis/', kind: 'Coaching analysis', usedFor: 'Independent 2025 Slot-2 counts (QA topics, TITA, VA types) – shows conflicts with IMS.' },
  { key: 'cracku-2025', name: 'Cracku – CAT 2025 exam analysis', url: 'https://cracku.in/cat-exam-analysis-2025/', kind: 'Coaching analysis', usedFor: '2025 difficulty and good attempts (Slot 1).' },
  { key: 'cracku-qa-2024', name: 'Cracku – CAT 2024 Quant analysis', url: 'https://cracku.in/cat-quant-exam-analysis-2024/', kind: 'Coaching analysis', usedFor: '2024 QA broad-topic counts per slot, 14 MCQ + 8 TITA, difficulty split.' },
  { key: 'hitbullseye-2024', name: 'Hitbullseye – CAT 2024 analysis', url: 'https://mba.hitbullseye.com/cat/cat-2024-analysis.php', kind: 'Coaching analysis', usedFor: '2024 section structure (68 Qs), MCQ/TITA per section, RC topics, VA types, DILR set types.' },
  { key: 'pw-2023', name: 'PW – CAT 2023 exam analysis', url: 'https://www.pw.live/mba/exams/cat-exam-analysis-2023', kind: 'Education portal', usedFor: '2023 structure: 66 Qs (24/20/22), difficulty by section.' },
  { key: 'insideiim-2023', name: 'InsideIIM – CAT 2023 slot-wise analysis', url: 'https://insideiim.com/cat-2023-exam-slot-wise-analysis-and-percentile-predictions', kind: 'Education portal', usedFor: '2023 QA broad-topic counts per slot, VA types, DILR 4 sets × 5, RC topics.' },
  { key: 'cracku-pct', name: 'Cracku – CAT score vs percentile', url: 'https://cracku.in/cat-score-vs-percentile-2026/', kind: 'Coaching analysis', usedFor: 'Scaled scores reported at 95/99/99.5 percentile (2023–2025). Single source – treat as indicative.' },
];

export interface YearPattern {
  year: number; iim: string; date: string; total: number;
  VARC: number; DILR: number; QA: number; minutesPerSection: number;
  tita: { VARC: string; DILR: string; QA: string };
  reliability: Reliability; note: string; sources: string[];
}

export const PATTERN: YearPattern[] = [
  { year: 2023, iim: 'IIM Lucknow', date: '26 Nov 2023', total: 66, VARC: 24, DILR: 20, QA: 22, minutesPerSection: 40,
    tita: { VARC: 'not verified', DILR: 'not verified', QA: 'not verified' },
    reliability: 'Cross-checked (2+ sources)', note: 'Section counts agree across PW and InsideIIM. Convening IIM and date are widely reported but were not re-verified on iimcat.ac.in in this session. Reliable per-section TITA counts for 2023 were not found.',
    sources: ['pw-2023', 'insideiim-2023'] },
  { year: 2024, iim: 'IIM Calcutta', date: '24 Nov 2024', total: 68, VARC: 24, DILR: 22, QA: 22, minutesPerSection: 40,
    tita: { VARC: '2', DILR: '10', QA: '8' },
    reliability: 'Cross-checked (2+ sources)', note: 'QA 14 MCQ + 8 TITA agrees across Cracku and Hitbullseye. VARC/DILR TITA counts come from Hitbullseye only.',
    sources: ['hitbullseye-2024', 'cracku-qa-2024'] },
  { year: 2025, iim: 'IIM Kozhikode', date: '30 Nov 2025', total: 68, VARC: 24, DILR: 22, QA: 22, minutesPerSection: 40,
    tita: { VARC: '4', DILR: '11 (GradSquare Slot 2: 8)', QA: '7–8 (GradSquare Slot 2: 6)' },
    reliability: 'Conflicting', note: 'VARC 4 TITA agreed by IMS, Toprankers and GradSquare. DILR and QA TITA counts differ between sources; IMS says 11 and 8, Toprankers 11 and 7, GradSquare (Slot 2) 8 and 6.',
    sources: ['ims-2025', 'toprankers-2025', 'gradsqr-2025'] },
];

export const NEXT_EXAM = { year: 2026, iim: 'IIM Indore', date: '2026-11-29', label: 'Sunday, 29 November 2026 (three slots)', sources: ['cracku-notif', 'shiksha-cat', 'careers360-dates'] };

/** QA broad-topic counts summed over the three slots of each year. */
export const QA_BROAD = {
  categories: ['Arithmetic', 'Algebra', 'Geometry', 'Number Systems', 'Modern Math'],
  years: [
    { year: 2023, values: [22, 20, 9, 6, 9], source: 'insideiim-2023', cross: 'Toprankers sub-topics give Arithmetic 23, Geometry 8 – within ±1.' },
    { year: 2024, values: [24, 19, 9, 5, 9], source: 'cracku-qa-2024', cross: 'Toprankers sub-topics give Arithmetic 25, Geometry 8 – within ±1.' },
    { year: 2025, values: [23, 14, 9, 9, 11], source: 'ims-2025', cross: 'Toprankers gives Arithmetic 23 and Geometry 9 – exact match. GradSquare Slot 2 differs (Algebra 7, Modern Math 0).' },
  ],
  note: 'Institutes classify borderline topics differently (e.g. progressions are "Algebra" for some and "Modern Math" for others), so treat ±1–2 as noise.',
};

/** QA sub-topic counts (three slots summed), Toprankers reconstruction. */
export const QA_SUB = {
  source: 'toprankers-topic',
  topics: ['Linear eq. & inequalities', 'Ratio, averages & mixtures', 'Time, speed, distance & work', 'Profit, loss & interest', 'Geometry & mensuration', 'Number systems', 'Progressions & series', 'Quadratics & polynomials', 'Logs, surds & indices', 'Functions & graphs', 'P&C and probability'],
  y2023: [10, 8, 9, 6, 8, 7, 7, 5, 4, 2, 0],
  y2024: [5, 12, 6, 7, 8, 8, 4, 4, 7, 4, 1],
  y2025: [10, 9, 8, 6, 9, 6, 5, 5, 3, 3, 1],
  note: '2025 "Mixtures & Solutions" (3) folded into Ratio, averages & mixtures. Sums are 66, 66 and 65 (the 2025 source has a one-question gap).',
};

export const VARC_STRUCTURE = [
  { year: 2023, rc: '16 (4 passages × 4)', va: 'Para jumbles 2 · Para completion 2 · Odd one out 2 · Summary 2', source: 'InsideIIM; Toprankers agrees on 16 RC', status: 'Cross-checked (2+ sources)' as Reliability },
  { year: 2024, rc: '16 (4 × 4)', va: 'Summary 3 · Odd one out 2 · Completion 3 (Hitbullseye) — Toprankers lists the third type as "insertion/jumbles"', source: 'Hitbullseye vs Toprankers', status: 'Conflicting' as Reliability },
  { year: 2025, rc: '16 (4 × 4)', va: 'Summary 2 · Para jumble 2 (TITA) · Odd one out 2 (TITA) · Completion/placement 2', source: 'IMS, GradSquare, Toprankers agree', status: 'Cross-checked (2+ sources)' as Reliability },
];

export const DILR_STRUCTURE = [
  { year: 2023, sets: '4 sets × 5 questions (20)', types: 'Puzzles, arrangement, "mathematical reasoning" sets, coin puzzle, selection & distribution, routes & networks', source: 'InsideIIM, Toprankers', status: 'Cross-checked (2+ sources)' as Reliability },
  { year: 2024, sets: '5 sets (4–5 Qs each), 22 total', types: 'Candlestick & bar-graph DI, tournaments, arrangement, network/roads, Venn (OTT), line graphs, ratings tables', source: 'Hitbullseye, Toprankers', status: 'Cross-checked (2+ sources)' as Reliability },
  { year: 2025, sets: '5 sets (4–5 Qs each), 22 total', types: 'Performance ratings, import–export data, circular arrangements (2 slots), yes/no responses, train ticketing, pollution index, scatter plot, currency exchange, trade balance, call logs', source: 'IMS, Toprankers, GradSquare', status: 'Cross-checked (2+ sources)' as Reliability },
];

/** Scaled score reported at each percentile. Single source (Cracku) – indicative only. */
export const PERCENTILE_SCORES = {
  source: 'cracku-pct',
  rows: [
    { year: 2025, p95: '62.3', p99: '84.8', p995: '93', sec99: 'VARC 44 · DILR 29.8 · QA 27.3' },
    { year: 2024, p95: '—', p99: '95.13', p995: '103.97', sec99: 'VARC 40.3 · DILR 37.8 · QA 33' },
    { year: 2023, p95: '—', p99: '—', p995: '—', sec99: 'VARC 39.83 · DILR 27.29 · QA 25.20' },
  ],
};

export const GOOD_ATTEMPTS_2025 = [
  { slot: 'Slot 1', p95: 'VARC 16–17 · DILR 12 · QA 12–13', difficulty: 'Moderate (IMS) / Moderate–Difficult (Cracku)' },
  { slot: 'Slot 2', p95: 'VARC 17–18 · DILR 10–11 · QA 9–10', difficulty: 'Moderate–Difficult (IMS) / "slightly easier than Slot 1" (GradSquare)' },
  { slot: 'Slot 3', p95: 'VARC 16–17 · DILR 10–11 · QA 10–11', difficulty: 'Moderate (IMS)' },
];

export const INSIGHTS = [
  { title: 'Structure is stable', body: 'Since 2024: 68 questions, 40 minutes per section, VARC → DILR → QA. RC is always 16 of 24 VARC questions (4 passages × 4).' },
  { title: 'Arithmetic + Algebra ≈ 60–65% of QA', body: 'Across nine slots, arithmetic averaged 7–8 and algebra 5–7 questions per slot. Geometry is a steady 3 per slot.' },
  { title: 'TITA is 25–35% of the paper', body: 'No negative marking on TITA. In 2025 about half of DILR was TITA, so guessing on MCQs no longer covers weak sets.' },
  { title: 'DILR rewards set selection', body: 'Every slot mixed 1–2 approachable sets with long, trap-heavy ones. Toppers solve 2–3 sets fully rather than touching all five.' },
  { title: 'VA types rotate, but stay at 8', body: 'Summary, odd-one-out, jumbles and completion/placement: two each in 2025. Vocabulary and grammar have not appeared in this period.' },
  { title: 'Recurring QA traps', body: 'Successive percentages treated as additive; base confusion in % change; off-by-one in AP counts; forgetting domains in logs and inequalities; ordered vs unordered counting.' },
];
