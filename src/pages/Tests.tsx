import { useEffect, useMemo, useRef, useState } from 'react';
import { QMAP, SETMAP, fmtTime, isCorrect } from '../lib/data';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import { SECTION_MINUTES, buildSection, marksFor, scoreSection } from '../lib/tests';
import { SECTIONS, type Section, type TestResult } from '../types';
import { AnswerInput, RichText, SetContext, Solution } from '../components/QuestionView';
import { LineChart } from '../components/charts';
import { Note, PageHead, Panel, StatusPill, secVar } from '../components/ui';

interface Running {
  kind: 'sectional' | 'full';
  sections: { s: Section; ids: string[] }[];
  cur: number;           // section index
  qi: number;            // question index inside section
  answers: Record<string, string>;
  marked: Record<string, boolean>;
  spent: Record<string, number>;
  sectionStart: number;
  startedAt: number;
}

export default function Tests() {
  const store = useStore();
  const { state } = store;
  const nav = useNav();
  const [run, setRun] = useState<Running | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);

  const start = (which: Section | 'FULL') => {
    const secs = which === 'FULL' ? SECTIONS : [which];
    setResult(null);
    setRun({
      kind: which === 'FULL' ? 'full' : 'sectional',
      sections: secs.map((s) => ({ s, ids: buildSection(s, state) })),
      cur: 0, qi: 0, answers: {}, marked: {}, spent: {}, sectionStart: Date.now(), startedAt: Date.now(),
    });
  };

  useEffect(() => {
    if (nav.pendingTest && !run) { start(nav.pendingTest); nav.clearPendingTest(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.pendingTest]);

  const finish = (r: Running) => {
    const qids = r.sections.flatMap((x) => x.ids);
    const perSection: TestResult['perSection'] = {};
    for (const x of r.sections) perSection[x.s] = scoreSection(x.ids, r.answers);
    for (const id of qids) if (r.answers[id] !== undefined && r.answers[id] !== '') store.record(id, r.answers[id], r.spent[id] ?? 0);
    const t: TestResult = {
      id: `T${Date.now()}`, kind: r.kind, sections: r.sections.map((x) => x.s), startedAt: r.startedAt, finishedAt: Date.now(),
      qids, answers: r.answers, score: Object.values(perSection).reduce((a, b) => a + b.score, 0), perSection,
    };
    store.saveTest(t);
    setRun(null);
    setResult(t);
  };

  if (run) return <Runner run={run} setRun={setRun} onFinish={finish} />;
  if (result) return <Result t={result} onClose={() => setResult(null)} />;

  const history = state.tests.slice(-12);
  return (
    <div>
      <PageHead eyebrow="40 minutes per section · +3 / −1 · TITA has no negative" title="Sectional tests & in-app mock">
        Tests are built CAT-style from the bank and prefer questions you have not attempted: VARC = 4 passages + 8 VA (24 Qs), DILR = 4 sets (20 Qs), QA = 22 Qs in CAT proportions. Solutions stay hidden until you submit.
      </PageHead>
      <div className="grid gap-4 md:grid-cols-4">
        {SECTIONS.map((s) => (
          <Panel key={s}>
            <div className="flex items-center gap-2"><span className="dot" style={{ background: secVar(s) }} /><span className="label">{s} sectional</span></div>
            <p className="mt-1 text-sm text-muted">{s === 'VARC' ? '4 RC passages + 8 VA · 24 Qs' : s === 'DILR' ? '4 sets · 20 Qs · choose wisely' : '22 Qs · 8 arith, 7 algebra, 3 geo, 2 numbers, 2 modern'}</p>
            <button className="btn btn-primary mt-3" onClick={() => start(s)}>Start {SECTION_MINUTES}-min test</button>
          </Panel>
        ))}
        <Panel>
          <div className="label">Full in-app mock</div>
          <p className="mt-1 text-sm text-muted">VARC → DILR → QA, 40 min each, no switching back. 66 Qs.</p>
          <button className="btn btn-primary mt-3" onClick={() => start('FULL')}>Start 120-min mock</button>
        </Panel>
      </div>
      <div className="mt-4"><Note>The bank holds enough fresh material for roughly four complete in-app mocks. For true exam simulation, also take the official IIM mock and full-length external mocks (see the plan’s weekend days) and log them on the Mock Analysis page.</Note></div>

      <Panel className="mt-6" title="Test history">
        {history.length === 0 ? <p className="text-muted">No tests yet. Your first in-app sectional appears in the plan on Day 15.</p> : (
          <>
            <LineChart ariaLabel="Test scores over time" labels={history.map((_, i) => `#${state.tests.length - history.length + i + 1}`)}
              series={[{ name: 'Score', values: history.map((t) => t.score), color: 'var(--accent)' }]} />
            <div className="scroll-x mt-3">
              <table className="data">
                <thead><tr><th>Date</th><th>Type</th><th>Sections</th><th className="n">Attempted</th><th className="n">Correct</th><th className="n">Score</th><th></th></tr></thead>
                <tbody>
                  {state.tests.slice().reverse().map((t) => {
                    const att = Object.values(t.perSection).reduce((a, b) => a + b.attempted, 0);
                    const cor = Object.values(t.perSection).reduce((a, b) => a + b.correct, 0);
                    return (
                      <tr key={t.id}>
                        <td>{new Date(t.finishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                        <td>{t.kind === 'full' ? 'Full mock' : 'Sectional'}</td>
                        <td>{t.sections.join(', ')}</td>
                        <td className="n num">{att}/{t.qids.length}</td><td className="n num">{cor}</td><td className="n num font-semibold">{t.score}</td>
                        <td><button className="btn btn-sm" onClick={() => setResult(t)}>Review</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

function Runner({ run, setRun, onFinish }: { run: Running; setRun: (r: Running) => void; onFinish: (r: Running) => void }) {
  const sec = run.sections[run.cur];
  const id = sec.ids[run.qi];
  const q = QMAP[id];
  const set = q.setId ? SETMAP[q.setId] : undefined;
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const qStart = useRef(Date.now());
  const runRef = useRef(run);
  runRef.current = run;

  const left = SECTION_MINUTES * 60 - Math.floor((now - run.sectionStart) / 1000);

  const withSpent = (r: Running): Running => {
    const cur = r.sections[r.cur].ids[r.qi];
    const add = (Date.now() - qStart.current) / 1000;
    qStart.current = Date.now();
    return { ...r, spent: { ...r.spent, [cur]: (r.spent[cur] ?? 0) + add } };
  };
  const goTo = (qi: number) => setRun({ ...withSpent(run), qi });
  const submitSection = (r: Running) => {
    const r2 = withSpent(r);
    setConfirm(false);
    if (r2.cur < r2.sections.length - 1) setRun({ ...r2, cur: r2.cur + 1, qi: 0, sectionStart: Date.now() });
    else onFinish(r2);
  };

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (left <= 0) submitSection(runRef.current); /* auto-submit at 0 */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left <= 0]);

  const answered = sec.ids.filter((x) => run.answers[x] !== undefined && run.answers[x] !== '').length;

  return (
    <div>
      <div className="sticky z-10 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 4px)', background: 'var(--surface)', borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2">
          <span className="dot" style={{ background: secVar(sec.s) }} />
          <strong>{sec.s}</strong>
          <span className="text-sm text-muted">{run.kind === 'full' ? `Section ${run.cur + 1} of 3` : 'Sectional'} · {answered}/{sec.ids.length} answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="num rounded-md px-2 py-0.5 text-lg font-semibold" aria-live="polite"
            style={{ background: left < 300 ? 'var(--bad-soft)' : 'var(--sunk)', color: left < 300 ? 'var(--bad)' : 'var(--ink)' }}>{fmtTime(left)}</span>
          {confirm ? (
            <>
              <span className="text-sm">Submit {sec.s}? You can’t return.</span>
              <button className="btn btn-sm btn-primary" onClick={() => submitSection(run)}>Yes, submit</button>
              <button className="btn btn-sm" onClick={() => setConfirm(false)}>Cancel</button>
            </>
          ) : <button className="btn btn-sm" onClick={() => setConfirm(true)}>Submit section</button>}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className={set ? 'grid gap-4 xl:grid-cols-2' : ''}>
          {set && <div className="panel p-4 sm:p-5 xl:max-h-[75vh] xl:overflow-y-auto"><SetContext set={set} /></div>}
          <div className="panel p-4 sm:p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="chip mono">Q{run.qi + 1}</span><span className="chip">{q.type}</span>
              <span className="chip">{q.type === 'MCQ' ? '+3 / −1' : '+3 / 0'}</span>
            </div>
            <div className="mb-4"><RichText text={q.text} /></div>
            <AnswerInput q={q} value={run.answers[id] ?? ''} onChange={(v) => setRun({ ...run, answers: { ...run.answers, [id]: v } })} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn" disabled={run.qi === 0} onClick={() => goTo(run.qi - 1)}>← Previous</button>
              <button className="btn btn-primary" disabled={run.qi === sec.ids.length - 1} onClick={() => goTo(run.qi + 1)}>Save & next →</button>
              <button className="btn" aria-pressed={!!run.marked[id]} onClick={() => setRun({ ...run, marked: { ...run.marked, [id]: !run.marked[id] } })}>{run.marked[id] ? 'Unmark review' : 'Mark for review'}</button>
              <button className="btn btn-ghost" onClick={() => { const a = { ...run.answers }; delete a[id]; setRun({ ...run, answers: a }); }}>Clear response</button>
            </div>
          </div>
        </div>
        <aside className="panel h-fit p-3">
          <div className="label mb-2">Question palette</div>
          <div className="grid grid-cols-6 gap-1 lg:grid-cols-5">
            {sec.ids.map((x, i) => {
              const ans = run.answers[x] !== undefined && run.answers[x] !== '';
              const bg = run.marked[x] ? 'var(--warn-soft)' : ans ? 'var(--good-soft)' : 'var(--surface)';
              return (
                <button key={x} onClick={() => goTo(i)} className="num rounded border py-1 text-xs"
                  style={{ background: bg, borderColor: i === run.qi ? 'var(--accent)' : 'var(--line)', borderWidth: i === run.qi ? 2 : 1 }}
                  aria-label={`Question ${i + 1}${ans ? ', answered' : ''}${run.marked[x] ? ', marked' : ''}`}>{i + 1}</button>
              );
            })}
          </div>
          <div className="mt-3 grid gap-1 text-xs text-muted">
            <span><span className="inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: 'var(--good-soft)', border: '1px solid var(--line)' }} /> answered</span>
            <span><span className="inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: 'var(--warn-soft)', border: '1px solid var(--line)' }} /> marked for review</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Result({ t, onClose }: { t: TestResult; onClose: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const rows = useMemo(() => t.sections.map((s) => ({ s, ...t.perSection[s] })), [t]);
  return (
    <div>
      <PageHead eyebrow={t.kind === 'full' ? 'Full in-app mock' : 'Sectional test'} title={`Score ${t.score}`}
        actions={<button className="btn" onClick={onClose}>Back to tests</button>}>
        Every answered question has been added to your attempts; wrong ones are in the error log and reattempt queue. Log reflections on the Mock Analysis page.
      </PageHead>
      <div className="scroll-x mb-6">
        <table className="data">
          <thead><tr><th>Section</th><th className="n">Questions</th><th className="n">Attempted</th><th className="n">Correct</th><th className="n">Wrong</th><th className="n">Accuracy</th><th className="n">Score</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.s}><td>{r.s}</td><td className="n num">{r.total}</td><td className="n num">{r.attempted}</td><td className="n num">{r.correct}</td><td className="n num">{r.wrong}</td>
              <td className="n num">{r.attempted ? Math.round((100 * r.correct) / r.attempted) : 0}%</td><td className="n num font-semibold">{r.score}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <Panel title="Review answers">
        <ul className="grid gap-2">
          {t.qids.map((id, i) => {
            const q = QMAP[id];
            const g = t.answers[id];
            const m = marksFor(q, g);
            return (
              <li key={id} className="rounded-lg border" style={{ borderColor: 'var(--line)' }}>
                <button className="flex w-full flex-wrap items-center gap-2 p-3 text-left" onClick={() => setOpen(open === id ? null : id)} aria-expanded={open === id}>
                  <span className="mono text-sm font-semibold">{i + 1}. {id}</span>
                  <span className="flex-1 truncate text-sm text-muted">{q.subtopic}</span>
                  {g === undefined || g === '' ? <StatusPill tone="neutral">Skipped</StatusPill> : isCorrect(q, g) ? <StatusPill tone="good">+3</StatusPill> : <StatusPill tone="bad">{m}</StatusPill>}
                </button>
                {open === id && (
                  <div className="border-t p-3" style={{ borderColor: 'var(--line)' }}>
                    {q.setId && <details className="mb-3"><summary className="cursor-pointer text-sm font-semibold">Show {q.section === 'VARC' ? 'passage' : 'set'}</summary><div className="mt-2"><SetContext set={SETMAP[q.setId]} evidence={q.evidence} /></div></details>}
                    <RichText text={q.text} />
                    <div className="mt-3"><AnswerInput q={q} value={g ?? ''} onChange={() => undefined} locked reveal /></div>
                    <Solution q={q} given={g ?? ''} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
