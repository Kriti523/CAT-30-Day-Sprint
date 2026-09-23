import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Confidence, Question, QSet } from '../types';
import { ERROR_REASONS } from '../types';
import { SETMAP, answerLabel, fmtTime, isCorrect } from '../lib/data';
import { useStore } from '../lib/store';
import { DiffTag, SectionTag, StatusPill } from './ui';
import { CAT, Donut, GroupedBars } from './charts';

/* ---------------- text helpers ---------------- */
function highlight(text: string, quotes: string[]): ReactNode {
  if (!quotes.length) return text;
  const parts: ReactNode[] = [];
  let rest = text, key = 0;
  while (rest) {
    let best = -1, bq = '';
    for (const q of quotes) {
      const i = rest.indexOf(q);
      if (i !== -1 && (best === -1 || i < best)) { best = i; bq = q; }
    }
    if (best === -1) { parts.push(rest); break; }
    parts.push(rest.slice(0, best));
    parts.push(<mark key={key++} className="ev">{bq}</mark>);
    rest = rest.slice(best + bq.length);
  }
  return parts;
}

export function RichText({ text, evidence = [] }: { text: string; evidence?: string[] }) {
  const paras = text.split(/\n\s*\n/);
  return (
    <div className="passage">
      {paras.map((p, i) => {
        const lines = p.split('\n');
        const listLike = lines.length > 1 && lines.every((l) => /^\s*(\d+\.|·)/.test(l));
        if (listLike) {
          return (
            <ol key={i} className="mb-3 space-y-1.5">
              {lines.map((l, j) => {
                const m = l.match(/^\s*(\d+\.|·)\s*(.*)$/);
                return (
                  <li key={j} className="flex gap-2">
                    <span className="num font-semibold text-muted" style={{ minWidth: '1.4rem' }}>{m?.[1] === '·' ? '•' : m?.[1]}</span>
                    <span>{highlight(m?.[2] ?? l, evidence)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }
        return <p key={i}>{highlight(lines.join(' '), evidence)}</p>;
      })}
    </div>
  );
}

export function SetContext({ set, evidence = [] }: { set: QSet; evidence?: string[] }) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <SectionTag s={set.section} />
        <span className="chip">{set.subtopic}</span>
        <span className="chip mono">{set.id}</span>
      </div>
      <h3 className="mb-3 text-xl font-bold">{set.title}</h3>
      <RichText text={set.body} evidence={evidence} />
      {set.chart && set.chart.type === 'bar' && (
        <figure className="my-4">
          <figcaption className="mb-1 text-sm font-semibold">{set.chart.title}</figcaption>
          <GroupedBars categories={set.chart.labels} ariaLabel={set.chart.title}
            series={set.chart.series.map((s, i) => ({ ...s, color: CAT[i] }))} />
        </figure>
      )}
      {set.chart && set.chart.type === 'pie' && (
        <div className="my-4 grid gap-4 sm:grid-cols-2">
          {set.chart.series.map((s) => <Donut key={s.name} labels={set.chart!.labels} values={s.values} title={s.name} />)}
        </div>
      )}
      {set.tables?.map((t) => (
        <div key={t.caption} className="my-3">
          <div className="label mb-1">{t.caption}</div>
          <div className="scroll-x">
            <table className="data">
              <thead><tr>{t.headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={/^[\d.?,-]+$/.test(c) ? 'n num' : ''}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- tools (bookmark, confidence, notes, error reason) ---------------- */
export function QuestionTools({ q, wrong }: { q: Question; wrong: boolean }) {
  const { state, toggleBookmark, setConfidence, setNote, setErrorReason } = useStore();
  const conf = state.confidence[q.id];
  const err = state.errors[q.id];
  const [open, setOpen] = useState(!!state.notes[q.id]);
  return (
    <div className="no-print mt-4 grid gap-3 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-sm" aria-pressed={!!state.bookmarks[q.id]} onClick={() => toggleBookmark(q.id)}>
          <span aria-hidden>{state.bookmarks[q.id] ? '★' : '☆'}</span>{state.bookmarks[q.id] ? 'Bookmarked' : 'Bookmark'}
        </button>
        <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Confidence">
          <span className="label mr-1">Confidence</span>
          {([1, 2, 3] as Confidence[]).map((c) => (
            <button key={c} role="radio" aria-checked={conf === c} className="btn btn-sm"
              style={conf === c ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'var(--accent)' } : undefined}
              onClick={() => setConfidence(q.id, c)}>{['Low', 'Medium', 'High'][c - 1]}</button>
          ))}
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => setOpen((o) => !o)}>{open ? 'Hide note' : 'Add note'}</button>
      </div>
      {wrong && (
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <span className="label">Why did you miss it?</span>
          <select id={`reason-${q.id}`} className="field" style={{ width: 'auto' }} value={err?.reason ?? ''}
            onChange={(e) => setErrorReason(q.id, e.target.value as never)}>
            <option value="">Choose a reason…</option>
            {ERROR_REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <span className="text-muted">Added to the error log and reattempt queue.</span>
        </label>
      )}
      {open && (
        <textarea id={`note-${q.id}`} className="field" rows={3} placeholder="Your note: the rule you want to remember next time"
          value={state.notes[q.id] ?? ''} onChange={(e) => setNote(q.id, e.target.value)} />
      )}
    </div>
  );
}

/* ---------------- solution block ---------------- */
export function Solution({ q, given }: { q: Question; given?: string }) {
  const ok = given !== undefined && isCorrect(q, given);
  return (
    <div className="mt-4 grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {given !== undefined && given !== '' ? (ok ? <StatusPill tone="good">✓ Correct</StatusPill> : <StatusPill tone="bad">✗ Incorrect</StatusPill>) : <StatusPill tone="neutral">Not answered</StatusPill>}
        <span className="text-sm">Answer: <strong>{answerLabel(q)}</strong></span>
        {given && !ok && <span className="text-sm text-muted">You answered: {q.type === 'MCQ' && q.options ? 'ABCD'[Number(given)] : given}</span>}
      </div>
      <div className="rounded-lg p-3" style={{ background: 'var(--sunk)' }}>
        <div className="label mb-1">Step-by-step solution</div>
        <ol className="list-decimal space-y-1 pl-5">{q.solution.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><div className="label mb-0.5">Fast method</div><p>{q.fast}</p></div>
        <div><div className="label mb-0.5">Common mistake / trap</div><p>{q.trap}</p></div>
        <div className="sm:col-span-2"><div className="label mb-0.5">Revision note</div><p>{q.note}</p></div>
      </div>
      {q.evidence && q.evidence.length > 0 && (
        <div>
          <div className="label mb-0.5">Supporting text</div>
          <ul className="space-y-1 text-sm">{q.evidence.map((e) => <li key={e}><mark className="ev">“{e}”</mark></li>)}</ul>
        </div>
      )}
    </div>
  );
}

/* ---------------- answer input ---------------- */
export function AnswerInput({ q, value, onChange, locked, reveal }: { q: Question; value: string; onChange: (v: string) => void; locked?: boolean; reveal?: boolean }) {
  if (q.type === 'MCQ' && q.options) {
    return (
      <div className="grid gap-2" role="radiogroup" aria-label="Options">
        {q.options.map((o, i) => {
          const sel = value === String(i);
          const cls = reveal ? (String(q.answer) === String(i) ? 'is-right' : sel ? 'is-wrong' : '') : '';
          return (
            <button key={i} role="radio" aria-checked={sel} disabled={locked} className={`opt ${cls}`} onClick={() => onChange(String(i))}>
              <span className="letter">{'ABCD'[i]}</span><span>{o}</span>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="label" htmlFor={`tita-${q.id}`}>Type your answer</label>
      <input id={`tita-${q.id}`} className="field num" style={{ maxWidth: '14rem' }} inputMode="decimal" autoComplete="off"
        value={value} disabled={locked} onChange={(e) => onChange(e.target.value)} placeholder={q.subtopic === 'Para jumble' ? 'e.g. 2413' : 'Number'} />
      <span className="text-xs text-muted">TITA · no negative marking</span>
    </div>
  );
}

/* ---------------- full practice view ---------------- */
/** Seconds spent while `running`; resets whenever `resetKey` changes. */
export function useStopwatch(running: boolean, resetKey: string) {
  const [sec, setSec] = useState(0);
  const acc = useRef(0);
  const since = useRef<number | null>(null);
  useEffect(() => { acc.current = 0; since.current = null; setSec(0); }, [resetKey]);
  useEffect(() => {
    if (!running) return;
    since.current = Date.now();
    const tick = () => setSec(Math.floor(acc.current + (Date.now() - (since.current ?? Date.now())) / 1000));
    const t = setInterval(tick, 500);
    return () => {
      clearInterval(t);
      if (since.current !== null) { acc.current += (Date.now() - since.current) / 1000; since.current = null; }
    };
  }, [running, resetKey]);
  return sec;
}

export function QuestionView({ q, onNext, onPrev, position }: { q: Question; onNext?: () => void; onPrev?: () => void; position?: string }) {
  const { state, record } = useStore();
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const sec = useStopwatch(submitted === null, q.id);
  const set = q.setId ? SETMAP[q.setId] : undefined;
  useEffect(() => { setValue(''); setSubmitted(null); setHint(false); }, [q.id]);

  const submit = () => { if (value === '') return; record(q.id, value, sec); setSubmitted(value); };
  const prev = state.attempts[q.id];
  const over = sec > q.time;

  const body = (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SectionTag s={q.section} />
        <span className="chip mono">{q.id}</span>
        <span className="chip">{q.topic} · {q.subtopic}</span>
        <DiffTag d={q.difficulty} />
        <span className="chip">{q.type}</span>
        <span className="chip num" title="Estimated solving time">~{fmtTime(q.time)}</span>
        {prev && <StatusPill tone={prev.correct ? 'good' : 'bad'}>Last try: {prev.correct ? 'right' : 'wrong'}</StatusPill>}
      </div>
      <div className="mb-4 text-[1.02rem]"><RichText text={q.text} /></div>
      <AnswerInput q={q} value={submitted ?? value} onChange={setValue} locked={submitted !== null} reveal={submitted !== null} />
      {hint && submitted === null && <div className="mt-3 rounded-lg p-3 text-sm" style={{ background: 'var(--accent-soft)' }}><span className="label">Hint · </span>{q.hint}</div>}
      <div className="no-print mt-4 flex flex-wrap items-center gap-2">
        {submitted === null ? (
          <>
            <button className="btn btn-primary" onClick={submit} disabled={value === ''}>Check answer</button>
            <button className="btn" onClick={() => setHint(true)} disabled={hint}>Show hint</button>
            <button className="btn btn-ghost" onClick={() => setSubmitted('')}>Show solution</button>
          </>
        ) : (
          onNext && <button className="btn btn-primary" onClick={onNext}>Next question →</button>
        )}
        {onPrev && <button className="btn btn-ghost" onClick={onPrev}>← Previous</button>}
        <span className="ml-auto flex items-center gap-2 text-sm">
          {position && <span className="text-muted">{position}</span>}
          <span className="num rounded-md px-2 py-0.5" style={{ background: over && submitted === null ? 'var(--warn-soft)' : 'var(--sunk)', color: over && submitted === null ? 'var(--warn)' : 'var(--ink)' }}
            aria-label="Time on this question">{fmtTime(sec)}</span>
        </span>
      </div>
      {submitted !== null && <Solution q={q} given={submitted} />}
      <QuestionTools q={q} wrong={submitted !== null && submitted !== '' && !isCorrect(q, submitted)} />
    </div>
  );

  if (!set) return <div className="panel p-4 sm:p-6">{body}</div>;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="panel p-4 sm:p-6 lg:max-h-[80vh] lg:overflow-y-auto">
        <SetContext set={set} evidence={submitted !== null ? q.evidence : []} />
      </div>
      <div className="panel p-4 sm:p-6">{body}</div>
    </div>
  );
}
