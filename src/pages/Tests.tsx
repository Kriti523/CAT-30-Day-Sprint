import { useEffect, useMemo, useRef, useState } from 'react';
import { QMAP, SETMAP, fmtTime, isCorrect } from '../lib/data';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import { SECTION_MINUTES, buildSection, marksFor, scoreSection, sectionLeft } from '../lib/tests';
import { SECTIONS, type RunningTest, type Section, type TestResult } from '../types';
import { AnswerInput, RichText, SetContext, Solution } from '../components/QuestionView';
import { Calculator } from '../components/Calculator';
import { LineChart } from '../components/charts';
import { Note, PageHead, Panel, StatusPill, secVar } from '../components/ui';
import { usePlan } from '../lib/usePlan';
import { fmtDate } from '../lib/stats';

export default function Tests() {
  const store = useStore();
  const { state, setActiveTest } = store;
  const run = state.activeTest;
  const nav = useNav();
  const [result, setResult] = useState<TestResult | null>(null);
  const { schedule } = usePlan();
  const firstTest = schedule.find((x) => x.d.blocks.some((b) => b.testSection));

  const start = (which: Section | 'FULL') => {
    const secs = which === 'FULL' ? SECTIONS : [which];
    const sections = secs.map((s) => ({ s, ids: buildSection(s, state) }));
    setResult(null);
    setActiveTest({
      kind: which === 'FULL' ? 'full' : 'sectional', sections,
      cur: 0, qi: 0, answers: {}, marked: {}, visited: { [sections[0].ids[0]]: true }, spent: {}, sectionStart: Date.now(), startedAt: Date.now(),
    });
  };

  useEffect(() => {
    // A plan block opens a test; a test already running takes priority.
    if (nav.pendingTest) { if (!run) start(nav.pendingTest); nav.clearPendingTest(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.pendingTest]);

  const finish = (r: RunningTest) => {
    const qids = r.sections.flatMap((x) => x.ids);
    const perSection: TestResult['perSection'] = {};
    for (const x of r.sections) perSection[x.s] = scoreSection(x.ids, r.answers);
    for (const id of qids) if (r.answers[id] !== undefined && r.answers[id] !== '') store.record(id, r.answers[id], r.spent[id] ?? 0);
    const t: TestResult = {
      id: `T${Date.now()}`, kind: r.kind, sections: r.sections.map((x) => x.s), startedAt: r.startedAt, finishedAt: Date.now(),
      qids, answers: r.answers, spent: r.spent, score: Object.values(perSection).reduce((a, b) => a + b.score, 0), perSection,
    };
    store.saveTest(t);
    setActiveTest(null);
    setResult(t);
  };

  if (run) return <Runner run={run} setRun={setActiveTest} onFinish={finish} />;
  if (result) return <Result t={result} onClose={() => setResult(null)} />;

  const history = state.tests.slice(-12);
  return (
    <div>
      <PageHead eyebrow="40 minutes per section · +3 / −1 · TITA has no negative" title="Sectional tests & in-app mock">
        Tests follow the CAT 2024–25 pattern and prefer questions you have not attempted: VARC = 4 passages + 8 VA (24 Qs), DILR = 5 sets (22 Qs), QA = 22 Qs in CAT proportions. As in the exam you get an on-screen calculator and keypad, and solutions stay hidden until you submit. If you leave or reload, the test waits for you, but its clock keeps running.
      </PageHead>
      <div className="grid gap-4 md:grid-cols-4">
        {SECTIONS.map((s) => (
          <Panel key={s}>
            <div className="flex items-center gap-2"><span className="dot" style={{ background: secVar(s) }} /><span className="label">{s} sectional</span></div>
            <p className="mt-1 text-sm text-muted">{s === 'VARC' ? '4 RC passages + 8 VA · 24 Qs' : s === 'DILR' ? '5 sets · 22 Qs · choose wisely' : '22 Qs · 8 arith, 7 algebra, 3 geo, 2 numbers, 2 modern'}</p>
            <button className="btn btn-primary mt-3" onClick={() => start(s)}>Start {SECTION_MINUTES}-min test</button>
          </Panel>
        ))}
        <Panel>
          <div className="label">Full in-app mock</div>
          <p className="mt-1 text-sm text-muted">VARC → DILR → QA, 40 min each, no switching back. 68 Qs · 204 marks.</p>
          <button className="btn btn-primary mt-3" onClick={() => start('FULL')}>Start 120-min mock</button>
        </Panel>
      </div>
      <div className="mt-4"><Note>The bank holds enough fresh material for roughly four complete in-app mocks. For true exam simulation, also take the official IIM mock and full-length external mocks (see the plan’s weekend days) and log them on the Mock Analysis page.</Note></div>

      <Panel className="mt-6" title="Test history">
        {history.length === 0 ? <p className="text-muted">No tests yet.{firstTest ? ` Your plan’s first in-app sectional is on Day ${firstTest.n} (${fmtDate(firstTest.date)}).` : ''}</p> : (
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

/** CAT palette states: not visited, not answered, answered, marked for review, answered and marked. */
function paletteState(r: RunningTest, id: string) {
  const ans = r.answers[id] !== undefined && r.answers[id] !== '';
  if (r.marked[id]) return ans ? 'answered-marked' : 'marked';
  if (ans) return 'answered';
  return r.visited[id] ? 'not-answered' : 'not-visited';
}
const PALETTE_LEGEND: [string, string][] = [
  ['not-visited', 'Not visited'], ['not-answered', 'Not answered'], ['answered', 'Answered'],
  ['marked', 'Marked for review'], ['answered-marked', 'Answered & marked (counts as answered)'],
];

function Runner({ run, setRun, onFinish }: { run: RunningTest; setRun: (r: RunningTest | null) => void; onFinish: (r: RunningTest) => void }) {
  const sec = run.sections[run.cur];
  const id = sec.ids[run.qi];
  const q = QMAP[id];
  const set = q.setId ? SETMAP[q.setId] : undefined;
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState<'submit' | 'discard' | null>(null);
  const [calc, setCalc] = useState(false);
  const qStart = useRef(Date.now());
  const runRef = useRef(run);
  runRef.current = run;

  const left = sectionLeft(run, now);

  const withSpent = (r: RunningTest): RunningTest => {
    const cur = r.sections[r.cur].ids[r.qi];
    const add = (Date.now() - qStart.current) / 1000;
    qStart.current = Date.now();
    return { ...r, spent: { ...r.spent, [cur]: (r.spent[cur] ?? 0) + add } };
  };
  const goTo = (qi: number) => {
    const next = sec.ids[qi];
    setRun({ ...withSpent(run), qi, visited: { ...run.visited, [next]: true } });
  };
  const submitSection = (r: RunningTest) => {
    const r2 = withSpent(r);
    setConfirm(null);
    if (r2.cur < r2.sections.length - 1) {
      const first = r2.sections[r2.cur + 1].ids[0];
      setRun({ ...r2, cur: r2.cur + 1, qi: 0, sectionStart: Date.now(), visited: { ...r2.visited, [first]: true } });
    } else onFinish(r2);
  };

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  // Time up (also when it ran out while you were away): the section is submitted as it stands.
  useEffect(() => { if (left <= 0) submitSection(runRef.current); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left <= 0]);

  const answered = sec.ids.filter((x) => run.answers[x] !== undefined && run.answers[x] !== '').length;

  return (
    <div>
      <div className="sticky z-10 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2"
        style={{ top: 'calc(var(--head-bottom) + 4px)', background: 'var(--surface)', borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2">
          <span className="dot" style={{ background: secVar(sec.s) }} />
          <strong>{sec.s}</strong>
          <span className="text-sm text-muted"><span className="hidden sm:inline">{run.kind === 'full' ? `Section ${run.cur + 1} of 3` : 'Sectional'} · </span>{answered}/{sec.ids.length} answered</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="num rounded-md px-2 py-0.5 text-lg font-semibold" aria-live="polite" aria-label="Time left in this section"
            style={{ background: left < 300 ? 'var(--bad-soft)' : 'var(--sunk)', color: left < 300 ? 'var(--bad)' : 'var(--ink)' }}>{fmtTime(Math.max(0, left))}</span>
          <button className="btn btn-sm" aria-pressed={calc} onClick={() => setCalc((c) => !c)}>Calculator</button>
          {confirm === 'submit' ? (
            <>
              <span className="text-sm">Submit {sec.s}? You can’t return.</span>
              <button className="btn btn-sm btn-primary" onClick={() => submitSection(run)}>Yes, submit</button>
              <button className="btn btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
            </>
          ) : <button className="btn btn-sm" onClick={() => setConfirm('submit')}>Submit section</button>}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className={set ? 'grid gap-4 xl:grid-cols-2' : ''}>
          {set && <div className="panel p-4 sm:p-5 xl:max-h-[75vh] xl:overflow-y-auto"><SetContext set={set} exam /></div>}
          <div className="panel p-4 sm:p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="chip mono">Q{run.qi + 1}</span><span className="chip">{q.type}</span>
              <span className="chip">{q.type === 'MCQ' ? '+3 / −1' : '+3 / 0'}</span>
            </div>
            <div className="mb-4"><RichText text={q.text} /></div>
            <AnswerInput q={q} exam value={run.answers[id] ?? ''} onChange={(v) => setRun({ ...run, answers: { ...run.answers, [id]: v } })} />
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
          <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
            {sec.ids.map((x, i) => {
              const st = paletteState(run, x);
              return (
                <button key={x} onClick={() => goTo(i)} className={`pal ${st} ${i === run.qi ? 'current' : ''}`}
                  aria-label={`Question ${i + 1}: ${PALETTE_LEGEND.find(([k]) => k === st)![1].toLowerCase()}`} aria-current={i === run.qi}>{i + 1}</button>
              );
            })}
          </div>
          <ul className="mt-3 grid gap-1.5 text-xs text-muted">
            {PALETTE_LEGEND.map(([k, label]) => <li key={k} className="flex items-center gap-2"><span className={`pal ${k} inline-block w-6 text-center`} aria-hidden>&nbsp;</span>{label}</li>)}
          </ul>
          <div className="mt-3 border-t pt-3 text-sm" style={{ borderColor: 'var(--line)' }}>
            {confirm === 'discard' ? (
              <div className="grid gap-2">
                <span>Discard this test? Answers won’t be saved.</span>
                <span className="flex gap-2">
                  <button className="btn btn-sm" style={{ background: 'var(--bad)', color: '#fff', borderColor: 'var(--bad)' }} onClick={() => setRun(null)}>Discard</button>
                  <button className="btn btn-sm" onClick={() => setConfirm(null)}>Keep going</button>
                </span>
              </div>
            ) : <button className="btn btn-sm btn-ghost -ml-2" onClick={() => setConfirm('discard')}>Discard test</button>}
          </div>
        </aside>
      </div>
      {calc && <Calculator onClose={() => setCalc(false)} />}
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
