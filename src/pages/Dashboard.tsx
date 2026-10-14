import { useState } from 'react';
import { NEXT_EXAM } from '../data/research';
import { RANKED } from '../data/priorities';
import { QUESTIONS, bySection } from '../lib/data';
import { useNav } from '../lib/nav';
import { reattemptQueue, useStore } from '../lib/store';
import { activeDays, aggregate, bySubtopic, daysUntil, fmtDate, pct, streak } from '../lib/stats';
import { toISODate } from '../lib/dates';
import { usePlan } from '../lib/usePlan';
import { useAuth } from '../lib/auth';
import { SECTIONS } from '../types';
import { PlanDayCard } from '../components/PlanDay';
import { Meter, PageHead, Panel, SECTION_NAME, secVar } from '../components/ui';
import { fmtTime } from '../lib/data';

export default function Dashboard() {
  const { state } = useStore();
  const { go, startSession } = useNav();
  const [mSec, setMSec] = useState<(typeof SECTIONS)[number]>('QA');
  const plan = usePlan();
  const { entitled } = useAuth();
  const totalDays = plan.schedule.length;
  // Before the plan starts show its first day, after it ends its last.
  const today = plan.today ?? (plan.phase === 'before' ? plan.schedule[0] : plan.schedule[totalDays - 1]);
  const queue = reattemptQueue(state);
  const total = aggregate(state, QUESTIONS);
  const toExam = daysUntil(NEXT_EXAM.date);
  const weak = bySubtopic(state).filter((t) => t.attempted >= 2 && (t.accuracy ?? 1) < 0.7).sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0)).slice(0, 5);
  const must = RANKED.filter((t) => t.cls === 'Must Master');

  const status = plan.phase === 'during' ? `Day ${plan.today!.n} of ${totalDays}` : plan.phase === 'before' ? `Plan starts ${fmtDate(plan.schedule[0].date)}` : plan.phase === 'after' ? 'Plan complete' : 'Exam day';

  return (
    <div>
      <PageHead eyebrow={status} title="Your CAT sprint"
        actions={<>
          <button className="btn btn-primary" onClick={() => go('plan')}>Open today’s plan</button>
          <button className="btn" onClick={() => startSession(queue, 'Reattempt queue')} disabled={!queue.length}>Reattempt queue · {queue.length}</button>
        </>}>
        {toExam > 0 ? <>CAT {NEXT_EXAM.year} is on <strong>{NEXT_EXAM.label}</strong>, <span className="num">{toExam}</span> day{toExam === 1 ? '' : 's'} away. </> : null}
        {state.target ? <>Your target: <strong>{state.target === '99.5' ? '99.5+' : state.target}th percentile</strong> (<button className="underline underline-offset-2" onClick={() => go('strategy')}>what it takes</button>). </> : null}
        Weekdays 2 hours, weekends 4–5, and a 45-minute fallback for busy days.
      </PageHead>

      {/* On phones today's work comes first; on wider screens the stats lead. */}
      <div className="flex flex-col gap-6">
      <div className="order-2 grid gap-4 md:order-1 md:grid-cols-4">
        <Panel className="md:col-span-1">
          <div className="label">All sections</div>
          <div className="mt-1 display text-4xl font-bold num">{total.attempted}<span className="text-lg text-muted">/300</span></div>
          <div className="text-sm text-muted">questions attempted · accuracy {pct(total.accuracy)}</div>
          <div className="mt-3"><Meter value={total.attempted} max={300} label="Questions attempted" /></div>
          <div className="mt-3 text-sm"><span className="num font-semibold">{plan.done}</span>/{totalDays} plan days complete</div>
          <Streak />
        </Panel>
        {SECTIONS.map((s) => {
          const a = aggregate(state, bySection(s));
          const est = bySection(s).filter((q) => state.attempts[q.id]).reduce((x, q) => x + q.time, 0) / Math.max(1, a.attempted);
          return (
            <Panel key={s}>
              <div className="flex items-center gap-2"><span className="dot" style={{ background: secVar(s) }} /><span className="label">{s}</span></div>
              <div className="mt-1 text-xs text-muted">{SECTION_NAME[s]}</div>
              <div className="mt-2 flex items-baseline gap-2"><span className="display text-3xl font-bold num">{pct(a.accuracy)}</span><span className="text-sm text-muted">accuracy</span></div>
              <div className="text-sm text-muted num">{a.attempted}/100 attempted{a.avgTime !== null && <> · {fmtTime(a.avgTime)} avg vs {fmtTime(est)} est.</>}</div>
              <div className="mt-2"><Meter value={a.attempted} color={secVar(s)} label={`${s} attempted`} /></div>
              <button className="btn btn-sm btn-ghost mt-2 -ml-2" onClick={() => go('bank', { bankSection: s })}>Open {s} bank →</button>
            </Panel>
          );
        })}
      </div>

      <div className="order-1 grid gap-4 md:order-2 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="label mb-2">{plan.phase === 'during' ? 'Today' : plan.phase === 'before' ? 'Day 1 preview' : 'Final day'}</div>
          {!entitled ? (
            <Panel title={`Your ${totalDays}-day plan is ready`}>
              <p className="text-muted">Every day, what to study and which questions to solve, fitted to the days you have before CAT. It’s part of full access; the free sample has 20 questions to try.</p>
              <div className="mt-3 flex flex-wrap gap-2"><button className="btn btn-primary" onClick={() => go('unlock')}>See full access</button><button className="btn" onClick={() => go('bank')}>Try the sample</button></div>
            </Panel>
          ) : today ? <PlanDayCard s={today} total={totalDays} compact /> : <p className="panel p-4 text-muted">Your plan has ended. Good luck in the exam.</p>}
        </div>
        <div className="grid content-start gap-4">
          <Panel title="Needs attention">
            <ul className="grid gap-2 text-sm">
              <li className="flex items-center justify-between gap-2"><span>Reattempt queue (due now)</span><button className="btn btn-sm" onClick={() => go('errors')}>{queue.length}</button></li>
              <li className="flex items-center justify-between gap-2"><span>Bookmarked questions</span><button className="btn btn-sm" onClick={() => startSession(Object.keys(state.bookmarks), 'Bookmarks')} disabled={!Object.keys(state.bookmarks).length}>{Object.keys(state.bookmarks).length}</button></li>
              <li className="flex items-center justify-between gap-2"><span>Mocks analysed</span><button className="btn btn-sm" onClick={() => go('mocks')}>{state.mocks.length}</button></li>
            </ul>
            <div className="mt-4 label">Weakest topics (≥ 2 attempts, &lt; 70%)</div>
            {weak.length ? (
              <ul className="mt-1 grid gap-1.5 text-sm">
                {weak.map((w) => (
                  <li key={w.section + w.subtopic} className="flex items-center gap-2">
                    <span className="dot" style={{ background: secVar(w.section) }} />
                    <button className="flex-1 text-left underline-offset-2 hover:underline" onClick={() => startSession(w.qs.map((q) => q.id), `${w.subtopic} drill`)}>{w.subtopic}</button>
                    <span className="num text-muted">{pct(w.accuracy)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-1 text-sm text-muted">Nothing flagged yet. Topics appear here after two or more attempts below 70%.</p>}
          </Panel>
          <Panel title="Must-master topics" aside={<button className="btn btn-sm btn-ghost" onClick={() => go('priorities')}>All priorities →</button>}>
            <ul className="grid gap-1 text-sm">
              {must.map((t) => {
                const re = t.bankFilter ? new RegExp(t.bankFilter, 'i') : null;
                const ids = re ? QUESTIONS.filter((q) => q.section === t.section && (re.test(q.subtopic) || re.test(q.topic))).map((q) => q.id) : [];
                return (
                <li key={t.topic} className="flex items-center gap-2">
                  <span className="dot" style={{ background: secVar(t.section) }} />
                  {ids.length
                    ? <button className="flex-1 text-left underline-offset-2 hover:underline" onClick={() => startSession(ids, t.topic)}>{t.topic}</button>
                    : <span className="flex-1">{t.topic}</span>}
                  <span className="num font-semibold">{t.score}</span>
                </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>

      </div>

      <Panel className="mt-6" title="Topic mastery" aside={
        <div className="no-print flex gap-1" role="tablist" aria-label="Section">
          {SECTIONS.map((s) => (
            <button key={s} role="tab" aria-selected={mSec === s} className="btn btn-sm" onClick={() => setMSec(s)}
              style={mSec === s ? { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)' } : undefined}>{s}</button>
          ))}
        </div>}>
        <p className="mb-3 text-sm text-muted">Bar = share of the topic attempted · number = accuracy. Tap a topic to open it in the bank.</p>
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {bySubtopic(state, mSec).map((t) => (
            <li key={t.subtopic}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <button className="text-left hover:underline" onClick={() => go('bank', { bankSection: mSec, bankQuery: t.subtopic })}>{t.subtopic}</button>
                <span className="num text-muted">{t.attempted}/{t.total} · {pct(t.accuracy)}</span>
              </div>
              <Meter value={t.attempted} max={t.total} color={secVar(mSec)} label={`${t.subtopic} attempted`} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/** Days in a row with practice, and the last seven days at a glance. */
function Streak() {
  const { state } = useStore();
  const n = streak(state);
  const days = activeDays(state);
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + i));
  const practisedToday = days.has(toISODate(today));
  return (
    <div className="mt-3 border-t pt-3 text-sm" style={{ borderColor: 'var(--line)' }}>
      <div><span className="num font-semibold">{n}</span>-day streak{n > 0 && !practisedToday ? ' · practise today to keep it' : ''}</div>
      <div className="mt-1.5 flex gap-1" aria-label="Practice in the last seven days">
        {week.map((d) => {
          const on = days.has(toISODate(d));
          return <span key={d.getTime()} title={`${fmtDate(d)}${on ? ': practised' : ''}`} className="h-2.5 flex-1 rounded-sm" style={{ background: on ? 'var(--good)' : 'var(--sunk)' }} />;
        })}
      </div>
    </div>
  );
}
