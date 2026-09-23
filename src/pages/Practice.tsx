import { useEffect, useMemo, useRef, useState } from 'react';
import { QMAP, fmtTime } from '../lib/data';
import { useNav, type Session } from '../lib/nav';
import { useStore } from '../lib/store';
import { QuestionView } from '../components/QuestionView';
import { PageHead } from '../components/ui';

export default function Practice({ session, setSession }: { session: Session | null; setSession: (s: Session | null) => void }) {
  const { go } = useNav();
  const { state } = useStore();
  const started = useRef(Date.now());
  const [left, setLeft] = useState(0);
  const budget = useMemo(() => (session ? session.ids.reduce((a, id) => a + (QMAP[id]?.time ?? 0), 0) : 0), [session]);

  useEffect(() => { started.current = Date.now(); }, [session?.ids.join(',')]);
  useEffect(() => {
    if (!session?.timed) return;
    const tick = () => setLeft(budget - Math.floor((Date.now() - started.current) / 1000));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [session?.timed, budget, session?.ids.join(',')]);

  if (!session) {
    return (
      <div>
        <PageHead title="Practice" />
        <p className="panel p-6">No practice session is open. Start one from the <button className="underline" onClick={() => go('bank')}>question bank</button>, the <button className="underline" onClick={() => go('plan')}>study plan</button> or the <button className="underline" onClick={() => go('errors')}>reattempt queue</button>.</p>
      </div>
    );
  }

  const q = QMAP[session.ids[session.index]];
  const move = (d: number) => setSession({ ...session, index: Math.max(0, Math.min(session.ids.length - 1, session.index + d)) });
  const sessionAnswered = session.ids.filter((id) => (state.attempts[id]?.at ?? 0) >= started.current);
  const right = sessionAnswered.filter((id) => state.attempts[id].correct).length;
  const atEnd = session.index === session.ids.length - 1;

  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="label">{session.timed ? 'Timed practice' : 'Untimed practice'}</div>
          <h1 className="truncate text-xl font-bold">{session.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="chip num">{sessionAnswered.length}/{session.ids.length} answered · {right} right</span>
          {session.timed && (
            <span className="chip num" style={left < 0 ? { background: 'var(--bad-soft)', color: 'var(--bad)' } : left < 120 ? { background: 'var(--warn-soft)', color: 'var(--warn)' } : undefined}
              aria-live="polite">{left >= 0 ? `${fmtTime(left)} left` : `${fmtTime(-left)} over budget`}</span>
          )}
          <button className="btn btn-sm" onClick={() => setSession({ ...session, timed: !session.timed })}>{session.timed ? 'Switch to untimed' : 'Switch to timed'}</button>
          <button className="btn btn-sm btn-ghost" onClick={() => { setSession(null); go('bank'); }}>End session</button>
        </div>
      </div>

      <div className="no-print scroll-x mb-4 flex gap-1 pb-1" aria-label="Questions in this session">
        {session.ids.map((id, i) => {
          const a = state.attempts[id];
          const fresh = a && a.at >= started.current;
          const bg = fresh ? (a.correct ? 'var(--good-soft)' : 'var(--bad-soft)') : 'var(--surface)';
          return (
            <button key={id + i} onClick={() => setSession({ ...session, index: i })} aria-current={i === session.index}
              className="mono shrink-0 rounded-md border px-2 py-1 text-xs"
              style={{ background: bg, borderColor: i === session.index ? 'var(--accent)' : 'var(--line)', borderWidth: i === session.index ? 2 : 1 }}>
              {id}
            </button>
          );
        })}
      </div>

      <QuestionView q={q} position={`${session.index + 1} of ${session.ids.length}`}
        onNext={atEnd ? undefined : () => move(1)} onPrev={session.index > 0 ? () => move(-1) : undefined} />

      {atEnd && sessionAnswered.length > 0 && (
        <div className="panel mt-4 flex flex-wrap items-center justify-between gap-3 p-4">
          <div><div className="label">Session summary</div><div className="num">{right}/{sessionAnswered.length} correct · {fmtTime((Date.now() - started.current) / 1000)} elapsed</div></div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => go('errors')}>Review error log</button>
            <button className="btn btn-primary" onClick={() => { setSession(null); go('dashboard'); }}>Finish</button>
          </div>
        </div>
      )}
    </div>
  );
}
