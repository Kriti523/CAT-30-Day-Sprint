import { useRef, useState } from 'react';
import { QMAP, SETMAP, fmtTime, isCorrect } from '../lib/data';
import { AnswerInput, RichText, SetContext, Solution, useStopwatch } from '../components/QuestionView';
import { DiffTag, SectionTag, secVar } from '../components/ui';
import { LEGACY_KEY, applyAttempt, loadLocal, saveLocal } from '../lib/state';

/** One question per section, chosen to be short and representative (QA arithmetic, VA para completion, a DI set). */
const IDS = ['Q001', 'V097', 'D063'];

interface Result { id: string; ok: boolean; t: number }

/**
 * The landing page's "try 3 questions" warm-up. Answers are saved like pre-account progress (LEGACY_KEY),
 * so if the visitor signs up on this device they move into the new account.
 */
export default function Trial() {
  const [i, setI] = useState(0);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const top = useRef<HTMLDivElement>(null);
  const done = i >= IDS.length;
  const q = QMAP[IDS[Math.min(i, IDS.length - 1)]];
  const sec = useStopwatch(!checked && !done, done ? 'done' : q.id);
  const set = q.setId ? SETMAP[q.setId] : undefined;

  function check() {
    const ok = isCorrect(q, value);
    setChecked(true);
    setResults((r) => [...r, { id: q.id, ok, t: sec }]);
    const saved = loadLocal(LEGACY_KEY);
    if (saved.persistent) saveLocal(LEGACY_KEY, applyAttempt(saved.state, q.id, value, sec).state);
  }
  function next() {
    setI((n) => n + 1);
    setValue('');
    setChecked(false);
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function restart() { setI(0); setValue(''); setChecked(false); setResults([]); }

  if (done) {
    const right = results.filter((r) => r.ok).length;
    const total = results.reduce((s, r) => s + r.t, 0);
    return (
      <div ref={top} className="trial-card panel lift scroll-mt-24 p-5 sm:p-7">
        <div className="label">Warm-up complete</div>
        <div className="display mt-1 text-3xl font-bold sm:text-4xl">{right} of {IDS.length} right in <span className="num">{fmtTime(total)}</span></div>
        <ul className="mt-5 grid gap-2">
          {results.map((r) => {
            const rq = QMAP[r.id];
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2" style={{ background: 'var(--sunk)' }}>
                <span className="font-bold" style={{ color: r.ok ? 'var(--good)' : 'var(--bad)' }}>{r.ok ? '✓' : '✗'}</span>
                <SectionTag s={rq.section} />
                <span className="min-w-0 flex-1 truncate text-sm">{rq.subtopic}</span>
                <span className="num text-sm">{fmtTime(r.t)} <span className="text-muted">/ target {fmtTime(rq.time)}</span></span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-muted">That was 3 of 300. Each one comes with a step-by-step solution, a faster method and the trap it sets, and the app brings back the ones you miss.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href="#signup" className="btn btn-primary">Save this and keep going</a>
          <button type="button" className="btn" onClick={restart}>Try again</button>
        </div>
        <p className="mt-3 text-xs text-muted">Create your account on this device and these answers move into it.</p>
      </div>
    );
  }

  return (
    <div ref={top} className="trial-card panel lift scroll-mt-24 overflow-hidden">
      {/* exam-style header strip */}
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-6" style={{ borderColor: 'var(--line)', background: 'var(--sunk)' }}>
        <SectionTag s={q.section} />
        <DiffTag d={q.difficulty} />
        <span className="text-sm font-semibold">Question {i + 1} of {IDS.length}</span>
        <div className="flex gap-1" aria-hidden>
          {IDS.map((id, n) => (
            <span key={id} className="h-1.5 w-6 rounded-full" style={{ background: n <= i ? secVar(QMAP[id].section) : 'var(--line)', opacity: n < i ? 0.55 : 1 }} />
          ))}
        </div>
        <span className="num ml-auto text-sm" aria-live="off" title="Time on this question">
          ⏱ {fmtTime(sec)} <span className="text-muted">/ {fmtTime(q.time)}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:p-6">
        {set && <div className="rounded-lg border p-3 text-[0.95rem]" style={{ borderColor: 'var(--line)' }}><SetContext set={set} /></div>}
        <RichText text={q.text} />
        <AnswerInput q={q} value={value} onChange={setValue} locked={checked} reveal={checked} />
        {!checked ? (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary" disabled={!value.trim()} onClick={check}>Check answer</button>
            <span className="text-xs text-muted">{q.type === 'TITA' ? 'Type the number: no options, no negative marking.' : 'Pick one option.'}</span>
          </div>
        ) : (
          <>
            <Solution q={q} given={value} />
            <div><button type="button" className="btn btn-primary" onClick={next}>{i + 1 < IDS.length ? 'Next question →' : 'See my result →'}</button></div>
          </>
        )}
      </div>
    </div>
  );
}
