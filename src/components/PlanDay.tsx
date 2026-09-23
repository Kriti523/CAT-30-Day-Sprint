import type { PlanDay } from '../data/plan';
import { expandRefs } from '../lib/data';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import { dateForDay, fmtDate } from '../lib/stats';
import { SectionTag, StatusPill } from './ui';

const MODE_TONE: Record<string, 'accent' | 'neutral' | 'warn' | 'good'> = { Timed: 'warn', Untimed: 'neutral', Review: 'neutral', Mock: 'accent', Learn: 'good' };

export function PlanDayCard({ d, compact = false }: { d: PlanDay; compact?: boolean }) {
  const { state, togglePlanTask, toggleBusy } = useStore();
  const { startSession, go } = useNav();
  const busy = !!state.busyDays[d.day];
  const done = d.blocks.filter((_, i) => state.planTasks[`${d.day}:${i}`]).length;
  const fbDone = !!state.planTasks[`${d.day}:fb`];
  const date = dateForDay(state.startDate, d.day);

  return (
    <article className="panel p-4 sm:p-5">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="label">Day {d.day} · {fmtDate(date)} · {d.kind} · {d.minutes} min</div>
          <h3 className="mt-0.5 text-xl font-bold">{d.focus}</h3>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted num">{busy ? (fbDone ? 'Fallback done' : 'Busy-day mode') : `${done}/${d.blocks.length} done`}</span>
          <button className="btn btn-sm" aria-pressed={busy} onClick={() => toggleBusy(d.day)}>{busy ? 'Back to full plan' : 'Busy day? Use 45-min fallback'}</button>
        </div>
      </header>

      {busy ? (
        <div className="rounded-lg p-3" style={{ background: 'var(--warn-soft)' }}>
          <div className="label mb-1" style={{ color: 'var(--warn)' }}>45-minute fallback</div>
          <p>{d.fallback}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {d.fallbackRefs && <button className="btn btn-sm btn-primary" onClick={() => startSession(expandRefs(d.fallbackRefs!), `Day ${d.day} fallback`)}>Start fallback practice</button>}
            <label className="inline-flex items-center gap-2 text-sm"><input id={`fb-${d.day}`} type="checkbox" checked={fbDone} onChange={() => togglePlanTask(`${d.day}:fb`)} /> Mark fallback done</label>
          </div>
        </div>
      ) : (
        <ol className="grid gap-2">
          {d.blocks.map((b, i) => {
            const key = `${d.day}:${i}`;
            const checked = !!state.planTasks[key];
            const ids = b.refs ? expandRefs(b.refs) : [];
            return (
              <li key={i} className="flex gap-3 rounded-lg p-2.5" style={{ background: checked ? 'var(--good-soft)' : 'var(--sunk)' }}>
                <input id={`task-${key}`} type="checkbox" className="mt-1.5 h-4 w-4 flex-none" checked={checked} onChange={() => togglePlanTask(key)} aria-label={`Mark "${b.title}" done`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="num text-sm font-semibold">{b.min}′</span>
                    <SectionTag s={b.section} />
                    <StatusPill tone={MODE_TONE[b.mode]}>{b.mode}</StatusPill>
                    <span className="font-semibold">{b.title}</span>
                  </div>
                  {!compact && b.detail && <p className="mt-0.5 text-sm text-muted">{b.detail}</p>}
                  <div className="no-print mt-1 flex flex-wrap gap-2">
                    {ids.length > 0 && <button className="btn btn-sm" onClick={() => startSession(ids, `Day ${d.day}: ${b.title}`, b.mode === 'Timed')}>{b.mode === 'Timed' ? 'Start timed' : 'Start'} · {ids.length} Qs</button>}
                    {b.testSection && <button className="btn btn-sm" onClick={() => go('tests', { testSection: b.testSection })}>Open {b.testSection === 'FULL' ? 'full mock' : `${b.testSection} sectional`}</button>}
                    {b.mode === 'Mock' && !b.testSection && <button className="btn btn-sm btn-ghost" onClick={() => go('mocks')}>Log mock analysis</button>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
        <div><dt className="label">Accuracy target</dt><dd>{d.accuracy}</dd></div>
        <div><dt className="label">Time target</dt><dd>{d.time}</dd></div>
        <div><dt className="label">Revision & error log</dt><dd>{d.revision}</dd></div>
      </dl>
      {!busy && <p className="mt-2 text-xs text-muted"><span className="label">Fallback · </span>{d.fallback}</p>}
    </article>
  );
}
