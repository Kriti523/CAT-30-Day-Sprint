import { PLAN, type PlanDay } from '../data/plan';
import { toISODate } from './dates';

/** One calendar day of the plan. `n` counts from 1 on the start date; `d.day` is the plan day it carries (101+ for extra days). */
export interface ScheduledDay { n: number; date: Date; iso: string; d: PlanDay }

/* When there are fewer days than the plan needs, these go first. Diagnostics, sectionals and mocks
 * matter most; topic days follow by how much they move the score (see Topic priorities). */
const WEEKDAY_PRIORITY = [1, 2, 3, 15, 16, 23, 25, 26, 4, 5, 8, 10, 22, 9, 17, 19, 11, 12, 18, 24];
const WEEKEND_PRIORITY = [6, 28, 20, 14, 27, 7, 13, 21];
/** The plan's last two days (revision, then a light day) always fall on the two days before the exam. */
const TAIL = [29, 30];

const byDay = (n: number) => PLAN.find((p) => p.day === n)!;
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

function parse(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Spreads `extra` slots evenly among `core` ones (true marks an extra slot), after the first `lead` core
 *  days, so the plan always opens with its diagnostics and foundations in a row. */
function interleave(core: number, extra: number, lead: number): boolean[] {
  const head = Math.min(lead, core);
  const total = core - head + extra;
  const tail = Array.from({ length: total }, (_, i) => Math.floor(((i + 1) * extra) / total) > Math.floor((i * extra) / total));
  return [...Array<boolean>(head).fill(false), ...tail];
}

/** Extra days for a long runway: practice and review that use everything learnt so far. The plan's own
 *  weekends already hold its mocks, so extra weekends go deep on weak spots instead of adding more. */
function extraDay(id: number, weekend: boolean): PlanDay {
  return weekend ? {
    day: id, week: 4, kind: 'Saturday', minutes: 240, focus: 'Weak-spot deep dive',
    blocks: [
      { min: 60, section: 'All', mode: 'Review', title: 'Re-solve your misses', detail: 'Work the reattempt queue without looking at notes first.', action: 'reattempt' },
      { min: 45, section: 'All', mode: 'Learn', title: 'Weakest topic, from the formula sheet up', detail: 'Pick the lowest-accuracy topic on the Dashboard; revise its sheet, then practise it from the bank.' },
      { min: 90, section: 'All', mode: 'Timed', title: 'Mixed timed drill', detail: '15 questions you have not tried, at exam pace; then review every miss.', action: 'random' },
      { min: 45, section: 'All', mode: 'Review', title: 'Error-log rules', detail: 'Read your error log and write one rule for each repeated mistake.' },
    ],
    accuracy: '≥ 70%', time: 'Exam pace', revision: 'One rule per repeated mistake',
    fallback: '30 min reattempt queue + one formula sheet.',
  } : {
    day: id, week: 4, kind: 'Weekday', minutes: 120, focus: 'Consolidation: mixed drill + reattempts',
    blocks: [
      { min: 45, section: 'All', mode: 'Timed', title: 'Mixed timed drill', detail: '15 questions you have not tried yet, across all three sections, at exam pace.', action: 'random' },
      { min: 35, section: 'All', mode: 'Review', title: 'Review the drill', detail: 'Tag every miss with a reason and add a note for anything you guessed.' },
      { min: 30, section: 'All', mode: 'Review', title: 'Reattempt queue', detail: 'Clear what is due.', action: 'reattempt' },
      { min: 10, section: 'All', mode: 'Learn', title: 'Formula recall', detail: 'Cover the right-hand column of one formula sheet and recite it.' },
    ],
    accuracy: '≥ 70%', time: 'Exam pace', revision: 'Error log: one rule per miss',
    fallback: '20 min reattempt queue + 25 min on 6 random questions.',
  };
}

/**
 * Lays the 30-day plan over the real calendar from `startISO` to the day before `examISO`.
 * Weekdays get the 2-hour days and weekends the long ones, whatever weekday the plan starts on.
 * With fewer days the most important plan days are kept (in their original order); with more,
 * consolidation days are spread through the plan.
 */
export function buildSchedule(startISO: string, examISO: string): ScheduledDay[] {
  const start = parse(startISO), exam = parse(examISO);
  const dates: Date[] = [];
  for (let d = new Date(start); d < exam; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) dates.push(d);
  if (!dates.length) return [];

  const tail = TAIL.slice(-Math.min(TAIL.length, dates.length));
  const rest = dates.slice(0, dates.length - tail.length);
  const weekdaySlots = rest.filter((d) => !isWeekend(d)).length;
  const weekendSlots = rest.length - weekdaySlots;

  const weekdays = WEEKDAY_PRIORITY.slice(0, weekdaySlots);
  const weekends = WEEKEND_PRIORITY.slice(0, weekendSlots);
  // Spare weekend slots take weekday plan days that didn't fit; a weekend has room for them.
  const spill = WEEKDAY_PRIORITY.slice(weekdays.length, weekdays.length + Math.max(0, weekendSlots - weekends.length));
  const wdQueue = [...weekdays].sort((a, b) => a - b);
  const weQueue = [...weekends, ...spill].sort((a, b) => a - b);
  const wdExtra = interleave(wdQueue.length, weekdaySlots - wdQueue.length, 5);
  const weExtra = interleave(weQueue.length, weekendSlots - weQueue.length, 1);

  let wi = 0, ei = 0;
  const out: ScheduledDay[] = rest.map((date, i) => {
    const weekend = isWeekend(date);
    const extra = weekend ? weExtra[ei++] : wdExtra[wi++];
    const d = extra ? extraDay(101 + i, weekend) : byDay((weekend ? weQueue : wdQueue).shift()!);
    return { n: i + 1, date, iso: toISODate(date), d };
  });
  tail.forEach((day, j) => {
    const date = dates[rest.length + j];
    out.push({ n: rest.length + j + 1, date, iso: toISODate(date), d: byDay(day) });
  });
  return out;
}

/** How many of the 30 plan days the schedule includes. */
export const planDaysIncluded = (s: ScheduledDay[]) => s.filter((x) => x.d.day <= 30).length;
