import { useState } from 'react';
import { PHASES, PLAN } from '../data/plan';
import { useStore } from '../lib/store';
import { dateForDay, planDayIndex } from '../lib/stats';
import { PlanDayCard } from '../components/PlanDay';
import { Note, PageHead } from '../components/ui';

const WEEK_TINT = ['var(--seq-1)', 'var(--seq-2)', 'var(--seq-3)', 'var(--seq-4)'];

export default function PlanPage() {
  const { state, setStartDate } = useStore();
  const todayIdx = planDayIndex(state.startDate);
  const [sel, setSel] = useState(Math.min(30, Math.max(1, todayIdx)));
  const [all, setAll] = useState(false);
  const startDow = dateForDay(state.startDate, 1).getDay();

  const status = (day: number) => {
    const d = PLAN[day - 1];
    if (state.busyDays[day]) return state.planTasks[`${day}:fb`] ? 'fallback' : 'busy';
    const done = d.blocks.filter((_, i) => state.planTasks[`${day}:${i}`]).length;
    return done === d.blocks.length ? 'done' : done ? 'partial' : 'todo';
  };
  const statusStyle: Record<string, { label: string; bg: string; fg: string }> = {
    done: { label: 'Done', bg: 'var(--good-soft)', fg: 'var(--good)' },
    fallback: { label: 'Fallback done', bg: 'var(--good-soft)', fg: 'var(--good)' },
    partial: { label: 'In progress', bg: 'var(--accent-soft)', fg: 'var(--accent)' },
    busy: { label: 'Busy day', bg: 'var(--warn-soft)', fg: 'var(--warn)' },
    todo: { label: '', bg: 'var(--surface)', fg: 'var(--muted)' },
  };

  return (
    <div>
      <PageHead eyebrow="Weekdays 2 h · Saturday 4 h · Sunday 5 h · busy day 45 min" title="30-day study plan"
        actions={<button className="btn" onClick={() => setAll((a) => !a)}>{all ? 'Show calendar' : 'List all 30 days'}</button>}>
        Every day lists what to study, which questions to solve, whether it is timed, and the accuracy and time targets. Tick blocks off as you go; on a heavy office day, switch to the 45-minute fallback.
      </PageHead>

      <div className="no-print mb-5 flex flex-wrap items-end gap-4">
        <label className="grid gap-1 text-sm">
          <span className="label">Plan start date (Day 1)</span>
          <input id="start-date" type="date" className="field" style={{ width: 'auto' }} value={state.startDate} onChange={(e) => e.target.value && setStartDate(e.target.value)} />
        </label>
        {startDow !== 1 && <Note tone="warn">Day 1 is designed as a Monday so that the 4- and 5-hour blocks fall on Saturday and Sunday. Your start date is not a Monday, so move the weekend-labelled days to your own days off.</Note>}
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {PHASES.map((p, i) => (
          <div key={p.week} className="panel p-3">
            <div className="flex items-center gap-2"><span style={{ width: 12, height: 12, borderRadius: 3, background: WEEK_TINT[i] }} /><span className="label">Week {p.week} · Days {p.days}</span></div>
            <div className="mt-1 font-bold">{p.name}</div>
            <p className="mt-1 text-sm text-muted">{p.goal}</p>
          </div>
        ))}
      </div>

      {all ? (
        <div className="grid gap-4">{PLAN.map((d) => <PlanDayCard key={d.day} d={d} />)}</div>
      ) : (
        <>
          <div className="scroll-x no-print">
            <div className="grid min-w-[560px] grid-cols-7 gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => <div key={w} className="label text-center">{w}</div>)}
              {Array.from({ length: (startDow + 6) % 7 }).map((_, i) => <div key={`pad${i}`} />)}
              {PLAN.map((d) => {
                const st = statusStyle[status(d.day)];
                const date = dateForDay(state.startDate, d.day);
                const isToday = d.day === todayIdx;
                return (
                  <button key={d.day} onClick={() => setSel(d.day)} aria-pressed={sel === d.day}
                    className="flex min-h-[92px] flex-col rounded-lg border p-1.5 text-left"
                    style={{ background: st.bg, borderColor: sel === d.day ? 'var(--accent)' : 'var(--line)', borderWidth: sel === d.day ? 2 : 1, borderTop: `4px solid ${WEEK_TINT[d.week - 1]}` }}>
                    <span className="flex items-center justify-between text-xs">
                      <span className="num font-bold">Day {d.day}</span>
                      <span className="text-muted">{date.getDate()}/{date.getMonth() + 1}</span>
                    </span>
                    <span className="mt-0.5 text-[0.78rem] leading-tight">{d.focus}</span>
                    <span className="mt-auto flex items-center justify-between text-[0.7rem]">
                      <span className="num text-muted">{d.minutes}′</span>
                      {isToday ? <span className="font-bold" style={{ color: 'var(--accent)' }}>Today</span> : <span style={{ color: st.fg }}>{st.label}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-5"><PlanDayCard d={PLAN[sel - 1]} /></div>
        </>
      )}
    </div>
  );
}
