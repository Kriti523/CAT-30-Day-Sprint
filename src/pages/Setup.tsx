import { useMemo, useState } from 'react';
import { NEXT_EXAM } from '../data/research';
import { useStore } from '../lib/store';
import { buildSchedule, planDaysIncluded } from '../lib/schedule';
import { toISODate } from '../lib/dates';
import { daysUntil, fmtDate } from '../lib/stats';
import { Note, PageHead, Panel } from '../components/ui';

const TARGETS: [string, string, string][] = [
  ['90', '90th', 'Most newer IIMs and good non-IIM schools'],
  ['95', '95th', 'Newer IIMs and top non-IIM schools'],
  ['99', '99th', 'Older IIMs; the plan’s Strategy targets assume this'],
  ['99.5', '99.5+', 'IIM A, B, C territory'],
];

/** First run: when the plan starts and what the student is aiming for. */
export default function Setup() {
  const { state, completeSetup } = useStore();
  const exam = state.examDate || NEXT_EXAM.date;
  const [start, setStart] = useState(toISODate(new Date()));
  const [target, setTarget] = useState(state.target || '99');
  const schedule = useMemo(() => buildSchedule(start, exam), [start, exam]);
  const included = planDaysIncluded(schedule);
  const total = schedule.length;
  const [ey, em, ed] = exam.split('-').map(Number);

  return (
    <div>
      <PageHead eyebrow="Two questions" title="Let’s build your plan">
        CAT {NEXT_EXAM.year} is on {NEXT_EXAM.label}, {daysUntil(exam)} days from today. The plan fits itself to the days you have.
      </PageHead>
      <form className="grid max-w-2xl gap-4" onSubmit={(e) => { e.preventDefault(); if (total) completeSetup(start, target); }}>
        <Panel title="When do you start?">
          <label className="grid gap-1 text-sm" htmlFor="setup-start"><span className="label">Start date</span></label>
          <input id="setup-start" type="date" className="field" style={{ width: 'auto' }} value={start} max={toISODate(new Date(ey, em - 1, ed - 1))}
            onChange={(e) => e.target.value && setStart(e.target.value)} />
          <p className="mt-3 text-sm" role="status">
            {!total ? 'Choose a date before the exam.'
              : included === 30
                ? <>Your plan: <strong>{total} days</strong>, {fmtDate(schedule[0].date)} to {fmtDate(schedule[total - 1].date)}. It covers all 30 plan days{total > 30 ? <>, plus {total - 30} consolidation days of mixed drills, reattempts and mocks spread through it</> : null}.</>
                : <>Your plan: <strong>{total} days</strong>, {fmtDate(schedule[0].date)} to {fmtDate(schedule[total - 1].date)}. That isn’t room for all 30 plan days, so it keeps the {included} that matter most: diagnostics, sectionals, mocks and the highest-priority topics.</>}
          </p>
          {total > 0 && total < 14 && <div className="mt-2"><Note tone="warn">With under two weeks, focus on mocks, the reattempt queue and your strongest topics rather than new material.</Note></div>}
        </Panel>
        <Panel title="What percentile are you aiming for?">
          <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Target percentile">
            {TARGETS.map(([v, label, hint]) => (
              <label key={v} className="opt" style={{ cursor: 'pointer', ...(target === v ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : {}) }}>
                <input id={`target-${v}`} type="radio" name="target" value={v} checked={target === v} onChange={() => setTarget(v)} className="mt-1" />
                <span><strong>{label} percentile</strong><span className="block text-sm text-muted">{hint}</span></span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">Cut-offs vary by year, category and profile; this only sets the targets the app shows you. You can change it later on the plan page.</p>
        </Panel>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn btn-primary" disabled={!total}>Build my plan</button>
          <button type="button" className="btn btn-ghost" onClick={() => completeSetup(state.startDate, '')}>Skip for now</button>
        </div>
      </form>
    </div>
  );
}
