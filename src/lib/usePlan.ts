import { useMemo } from 'react';
import type { AppState } from '../types';
import type { PlanDay } from '../data/plan';
import { NEXT_EXAM } from '../data/research';
import { useStore } from './store';
import { buildSchedule, planDaysIncluded } from './schedule';
import { toISODate } from './dates';

/** A day counts as done when every block is ticked, or its 45-minute fallback is, on a busy day. */
export const isDayDone = (s: AppState, d: PlanDay) =>
  s.busyDays[d.day] ? !!s.planTasks[`${d.day}:fb`] : d.blocks.every((_, i) => s.planTasks[`${d.day}:${i}`]);

/** The plan laid over the calendar, and where today falls in it. */
export function usePlan() {
  const { state } = useStore();
  const exam = state.examDate || NEXT_EXAM.date;
  const schedule = useMemo(() => buildSchedule(state.startDate, exam), [state.startDate, exam]);
  const todayIso = toISODate(new Date());
  const today = schedule.find((x) => x.iso === todayIso);
  const phase: 'before' | 'during' | 'after' | 'none' =
    !schedule.length ? 'none' : today ? 'during' : todayIso < schedule[0].iso ? 'before' : 'after';
  const done = schedule.filter((x) => isDayDone(state, x.d)).length;
  return { schedule, today, phase, done, exam, included: planDaysIncluded(schedule) };
}
