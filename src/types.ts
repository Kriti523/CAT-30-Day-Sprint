export type Section = 'VARC' | 'DILR' | 'QA';
export const SECTIONS: Section[] = ['VARC', 'DILR', 'QA'];
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  section: Section;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  time: number; // estimated solving time, seconds
  type: 'MCQ' | 'TITA';
  text: string;
  options: string[] | null;
  answer: number | string;
  solution: string[];
  fast: string;
  hint: string;
  trap: string;
  note: string;
  setId?: string;
  evidence?: string[];
  sentences?: string[];
  noshuffle?: boolean;
}

export interface DataTable { caption: string; headers: string[]; rows: string[][] }
export interface ChartSpec {
  type: 'bar' | 'pie';
  title: string;
  labels: string[];
  series: { name: string; values: number[] }[];
}
export interface QSet {
  id: string;
  section: Section;
  topic: string;
  subtopic: string;
  title: string;
  body: string;
  tables?: DataTable[];
  chart?: ChartSpec;
}

export type Confidence = 1 | 2 | 3;
export type ErrorReason = 'Concept gap' | 'Calculation slip' | 'Misread question' | 'Time pressure' | 'Guessed' | 'Trap option';
export const ERROR_REASONS: ErrorReason[] = ['Concept gap', 'Calculation slip', 'Misread question', 'Time pressure', 'Guessed', 'Trap option'];

export interface AttemptRec {
  n: number;           // number of attempts
  correct: boolean;    // result of most recent attempt
  everCorrect: boolean;
  last: string;        // last answer given
  t: number;           // seconds on most recent attempt
  at: number;          // timestamp of most recent attempt
  history: { c: boolean; t: number; at: number }[];
}

export interface ErrorEntry { reason?: ErrorReason; note?: string; addedAt: number; resolved: boolean }

export interface TestResult {
  id: string;
  kind: 'sectional' | 'full';
  sections: Section[];
  startedAt: number;
  finishedAt: number;
  qids: string[];
  answers: Record<string, string>;
  score: number;
  perSection: Record<string, { attempted: number; correct: number; wrong: number; score: number; total: number }>;
}

export interface MockLog {
  id: string;
  name: string;
  date: string;
  source: string;
  rows: Record<Section, { attempted: number; correct: number; minutes: number; percentile: string }>;
  percentile: string;
  leftDoable: string;
  timeSinks: string;
  setSelection: string;
  errorTypes: string;
  nextActions: string;
}

export interface AppState {
  v: 1;
  attempts: Record<string, AttemptRec>;
  bookmarks: Record<string, true>;
  notes: Record<string, string>;
  confidence: Record<string, Confidence>;
  errors: Record<string, ErrorEntry>;
  planTasks: Record<string, boolean>;      // `${day}:${blockIndex}` -> done
  busyDays: Record<number, boolean>;       // day -> fallback used
  startDate: string;                       // yyyy-mm-dd
  examDate: string;
  tests: TestResult[];
  mocks: MockLog[];
}
