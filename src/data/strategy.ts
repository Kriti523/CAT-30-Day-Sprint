export const TARGETS = {
  note: 'Indicative only. Percentile depends on the slot, normalisation and everyone else’s performance – no attempt count guarantees a result. Figures are derived from 2024–25 good-attempt reports and scaled scores (Trends page) and assume +3/−1 marking.',
  rows: [
    { section: 'VARC', attempts: '19–21', correct: '15–17', netMarks: '≈ 42–48', plan: '4 RC passages in ~30 min + 8 VA in ~10 min' },
    { section: 'DILR', attempts: '11–14 (2½–3 sets)', correct: '10–12', netMarks: '≈ 28–34', plan: '3-min scan → best 2 sets fully → third set' },
    { section: 'QA', attempts: '14–16', correct: '11–13', netMarks: '≈ 30–36', plan: 'Two passes: easy/medium first, then selected hard ones' },
  ],
};

export const SECTION_PLANS = [
  { section: 'VARC', points: [
    'First 60 seconds: glance at all 8 VA questions; do the TITA ones (jumbles, odd one out) early — no negative marking.',
    'RC: pick passages by readability, not by position. Budget ~7–9 min per 4-question passage.',
    'Checkpoint: at 20 minutes, 2 passages + VA done.',
    'Never leave a TITA blank; for jumbles, the opener + one mandatory pair already narrows the order a lot.',
  ] },
  { section: 'DILR', points: [
    'Minutes 0–4: scan all sets; rank by clarity, conditions and question type.',
    'Solve the best set completely before touching the next.',
    'Stop-loss: 6 minutes without a foothold ⇒ move on. Come back only with 8+ minutes left.',
    'Checkpoint: at 20 minutes, one set done and the second under way.',
    'TITA-heavy sets carry no negative marking — attempt every TITA you can reason about.',
  ] },
  { section: 'QA', points: [
    'Pass 1 (≈ 20 min): questions you can finish in ≤ 2 minutes; skip on sight anything unfamiliar.',
    'Pass 2 (≈ 15 min): medium questions from the Must-Master topics.',
    'Last 5 min: TITA questions you have partially solved; avoid random MCQ guesses (−1).',
    'Use options: back-solve, plug extremes, check units digits before full calculation.',
  ] },
];

export const RULES = [
  'The section timer is fixed at 40 minutes and you cannot switch sections — plan each section on its own.',
  'MCQ: +3 correct, −1 wrong. TITA: +3 correct, 0 wrong. Unattempted: 0.',
  'An on-screen calculator is provided. Use it for DI arithmetic, not for things you can estimate.',
  'Accuracy beats volume: for a 99+ target, 3 wrong MCQs cost as much as one correct answer.',
];

export const EXAM_DAY = [
  'Admit card (printed) and an original, valid photo ID matching the admit card.',
  'Check the reporting time and gate-closing time on the admit card; arrive early.',
  'Visit or map the test centre route a day before; plan for traffic.',
  'Follow the admit card instructions on what you may carry; leave everything else at home.',
  'Sleep 7+ hours on the last two nights; no new material in the last 48 hours.',
  'During the exam: breathe for 10 seconds between sections; the previous section is over.',
];

export const WORKING_PRO_TIPS = [
  'Protect the first hour after waking or the hour after dinner — the same slot every day builds the habit.',
  'On a busy day do the 45-minute fallback rather than skipping; streaks matter more than perfect days.',
  'Use commutes for the formula sheets and your error-log rules, not for new questions.',
  'Take full mocks at your actual exam slot time on weekends.',
];
