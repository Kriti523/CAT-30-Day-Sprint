import { useState } from 'react';
import { PHASES } from '../data/plan';
import { useStore } from '../lib/store';
import { fmtDate } from '../lib/stats';
import { isDayDone, usePlan } from '../lib/usePlan';
import { toISODate } from '../lib/dates';
import { PlanDayCard } from '../components/PlanDay';
import { Note, PageHead } from '../components/ui';
import { Unlock } from '../components/Unlock';
import { useAuth } from '../lib/auth';

const WEEK_TINT = ['var(--seq-1)', 'var(--seq-2)', 'var(--seq-3)', 'var(--seq-4)'];
const EXTRA_TINT = 'var(--line)';

export default function PlanPage() {
  const { state, setStartDate, setTarget } = useStore();
  const { schedule, today, done, exam, included } = usePlan();
  const [sel, setSel] = useState(today?.n ?? 1);
  const [all, setAll] = useState(false);
  const total = schedule.length;
  const extra = total - included;
  const selected = schedule[Math.min(sel, total) - 1];
  const { entitled } = useAuth();
  if (!entitled) return <div><PageHead title={total ? `Your ${total}-day plan` : 'Your study plan'} /><Unlock what="Your study plan" /></div>;

  const status = (s: (typeof schedule)[number]) => {
    const d = s.d;
    if (state.busyDays[d.day]) return state.planTasks[`${d.day}:fb`] ? 'fallback' : 'busy';
    if (isDayDone(state, d)) return 'done';
    return d.blocks.some((_, i) => state.planTasks[`${d.day}:${i}`]) ? 'partial' : 'todo';
  };
  const statusStyle: Record<string, { label: string; bg: string; fg: string }> = {
    done: { label: 'Done', bg: 'var(--good-soft)', fg: 'var(--good)' },
    fallback: { label: 'Fallback done', bg: 'var(--good-soft)', fg: 'var(--good)' },
    partial: { label: 'In progress', bg: 'var(--accent-soft)', fg: 'var(--accent)' },
    busy: { label: 'Busy day', bg: 'var(--warn-soft)', fg: 'var(--warn)' },
    todo: { label: '', bg: 'var(--surface)', fg: 'var(--muted)' },
  };

  const [ey, em, ed] = exam.split('-').map(Number);
  const examDate = new Date(ey, em - 1, ed);
  const startDow = schedule.length ? schedule[0].date.getDay() : 1;
  const coverage = !total ? '' : included === 30
    ? `It covers all 30 plan days${extra ? `, plus ${extra} consolidation day${extra === 1 ? '' : 's'} spread through it` : ''}.`
    : `There isn’t room for all 30 plan days, so it keeps the ${included} that matter most: diagnostics, sectionals, mocks and the highest-priority topics.`;

  return (
    <div>
      <PageHead eyebrow="Weekdays 2 h · weekends 4–5 h · busy day 45 min" title={total ? `Your ${total}-day plan` : 'Your study plan'}
        actions={total ? <button className="btn" onClick={() => setAll((a) => !a)}>{all ? 'Show calendar' : `List all ${total} days`}</button> : undefined}>
        {total
          ? <>From {fmtDate(schedule[0].date)} to {fmtDate(schedule[total - 1].date)}, the day before CAT. {coverage} Weekdays get the 2-hour days and weekends the long ones. Tick blocks off as you go; on a heavy office day, switch to the 45-minute fallback.</>
          : <>Pick a start date before the exam to build your plan.</>}
      </PageHead>

      <div className="no-print mb-5 flex flex-wrap items-end gap-4">
        <label className="grid gap-1 text-sm">
          <span className="label">Start date</span>
          <input id="start-date" type="date" className="field" style={{ width: 'auto' }} value={state.startDate} max={toISODate(new Date(ey, em - 1, ed - 1))}
            onChange={(e) => e.target.value && setStartDate(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="label">Target percentile</span>
          <select id="plan-target" className="field" style={{ width: 'auto' }} value={state.target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">Not set</option><option value="90">90th</option><option value="95">95th</option><option value="99">99th</option><option value="99.5">99.5+</option>
          </select>
        </label>
        {total > 0 && <span className="pb-2 text-sm text-muted num">{done}/{total} days done</span>}
        {!total && <Note tone="warn">That start date is on or after the exam ({fmtDate(examDate)}). Choose an earlier date.</Note>}
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {PHASES.map((p, i) => (
          <div key={p.week} className="panel p-3">
            <div className="flex items-center gap-2"><span style={{ width: 12, height: 12, borderRadius: 3, background: WEEK_TINT[i] }} /><span className="label">Phase {p.week}</span></div>
            <div className="mt-1 font-bold">{p.name}</div>
            <p className="mt-1 text-sm text-muted">{p.goal}</p>
          </div>
        ))}
      </div>

      {!total ? null : all ? (
        <div className="grid gap-4">{schedule.map((s) => <PlanDayCard key={s.iso} s={s} total={total} />)}</div>
      ) : (
        <>
          <div className="scroll-x no-print">
            <div className="grid min-w-[560px] grid-cols-7 gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => <div key={w} className="label text-center">{w}</div>)}
              {Array.from({ length: (startDow + 6) % 7 }).map((_, i) => <div key={`pad${i}`} />)}
              {schedule.map((s) => {
                const st = statusStyle[status(s)];
                const isToday = s.iso === today?.iso;
                const tint = s.d.day > 30 ? EXTRA_TINT : WEEK_TINT[s.d.week - 1];
                return (
                  <button key={s.iso} onClick={() => setSel(s.n)} aria-pressed={sel === s.n}
                    className="flex min-h-[92px] flex-col rounded-lg border p-1.5 text-left"
                    style={{ background: st.bg, borderColor: sel === s.n ? 'var(--accent)' : 'var(--line)', borderWidth: sel === s.n ? 2 : 1, borderTop: `4px solid ${tint}` }}>
                    <span className="flex items-center justify-between text-xs">
                      <span className="num font-bold">Day {s.n}</span>
                      <span className="text-muted">{s.date.getDate()}/{s.date.getMonth() + 1}</span>
                    </span>
                    <span className="mt-0.5 text-[0.78rem] leading-tight">{s.d.focus}</span>
                    <span className="mt-auto flex items-center justify-between text-[0.7rem]">
                      <span className="num text-muted">{s.d.minutes}′</span>
                      {isToday ? <span className="font-bold" style={{ color: 'var(--accent)' }}>Today</span> : <span style={{ color: st.fg }}>{st.label}</span>}
                    </span>
                  </button>
                );
              })}
              <div className="flex min-h-[92px] flex-col justify-center rounded-lg p-1.5 text-center" style={{ background: 'var(--ink)', color: 'var(--ground)' }}>
                <span className="text-xs">{examDate.getDate()}/{examDate.getMonth() + 1}</span>
                <span className="display text-lg font-bold">CAT</span>
              </div>
            </div>
          </div>
          {selected && <div className="mt-5"><PlanDayCard s={selected} total={total} /></div>}
        </>
      )}
    </div>
  );
}
