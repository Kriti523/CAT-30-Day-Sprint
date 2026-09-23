import { useState } from 'react';
import { useStore, toISO } from '../lib/store';
import { SECTIONS, type MockLog, type Section } from '../types';
import { LineChart, CAT } from '../components/charts';
import { PageHead, Panel } from '../components/ui';

const blank = (): MockLog => ({
  id: `M${Date.now()}`, name: '', date: toISO(new Date()), source: '',
  rows: { VARC: { attempted: 0, correct: 0, minutes: 40, percentile: '' }, DILR: { attempted: 0, correct: 0, minutes: 40, percentile: '' }, QA: { attempted: 0, correct: 0, minutes: 40, percentile: '' } },
  percentile: '', leftDoable: '', timeSinks: '', setSelection: '', errorTypes: '', nextActions: '',
});

/** Upper-bound penalty estimate: assumes every wrong answer was an MCQ (−1). */
const est = (r: { attempted: number; correct: number }) => 3 * r.correct - Math.max(0, r.attempted - r.correct);

const PROMPTS: { key: keyof MockLog; label: string; placeholder: string }[] = [
  { key: 'leftDoable', label: 'Doable questions I left or got wrong', placeholder: 'e.g. QA Q7 (ratio) — knew it, skipped in pass 1; DILR set 3 Q2 misread "at least"' },
  { key: 'timeSinks', label: 'Where time went', placeholder: 'e.g. 14 min on RC passage 4 for 2 correct; 9 min on a geometry question I then got wrong' },
  { key: 'setSelection', label: 'Set / passage selection review', placeholder: 'e.g. Picked the tournament set after the scan; the bar-graph set was easier in hindsight' },
  { key: 'errorTypes', label: 'Error types (concept, calculation, misread, trap, guess)', placeholder: 'e.g. 3 calculation, 2 trap options in RC, 1 guessed MCQ' },
  { key: 'nextActions', label: 'Three actions before the next mock', placeholder: 'e.g. 1) Redo all ratio questions 2) 2 RC passages daily at 8 min 3) Scan all DILR sets before choosing' },
];

export default function Mocks() {
  const { state, saveMock, deleteMock } = useStore();
  const [form, setForm] = useState<MockLog>(blank);
  const [saved, setSaved] = useState('');
  const mocks = state.mocks.slice().sort((a, b) => a.date.localeCompare(b.date));

  const setRow = (s: Section, k: 'attempted' | 'correct' | 'minutes' | 'percentile', v: string) =>
    setForm((f) => ({ ...f, rows: { ...f.rows, [s]: { ...f.rows[s], [k]: k === 'percentile' ? v : Math.max(0, Number(v) || 0) } } }));

  const total = SECTIONS.reduce((a, s) => a + est(form.rows[s]), 0);

  return (
    <div>
      <PageHead eyebrow="After every full mock or sectional" title="Mock analysis">
        Spend as long analysing a mock as taking it. Log each mock here — from this app, the official IIM mock or any coaching series — then read the trend and your reflections before the next one.
      </PageHead>

      {mocks.length > 0 && (
        <Panel title="Score trend (estimated raw marks)" className="mb-6">
          <LineChart ariaLabel="Mock score trend" labels={mocks.map((m) => m.name || m.date)}
            series={[
              { name: 'Total', values: mocks.map((m) => SECTIONS.reduce((a, s) => a + est(m.rows[s]), 0)), color: 'var(--ink)' },
              ...SECTIONS.map((s, i) => ({ name: s, values: mocks.map((m) => est(m.rows[s])), color: CAT[i] })),
            ]} />
          <div className="scroll-x mt-3">
            <table className="data">
              <thead><tr><th>Mock</th><th>Date</th>{SECTIONS.map((s) => <th key={s} className="n">{s} (att/cor)</th>)}<th className="n">Est. marks</th><th>Percentile</th><th></th></tr></thead>
              <tbody>{mocks.slice().reverse().map((m) => (
                <tr key={m.id}>
                  <td>{m.name || '—'}<div className="text-xs text-muted">{m.source}</div></td><td>{m.date}</td>
                  {SECTIONS.map((s) => <td key={s} className="n num">{m.rows[s].attempted}/{m.rows[s].correct}</td>)}
                  <td className="n num font-semibold">{SECTIONS.reduce((a, s) => a + est(m.rows[s]), 0)}</td><td>{m.percentile || '—'}</td>
                  <td className="no-print whitespace-nowrap"><button className="btn btn-sm" onClick={() => setForm(m)}>Edit</button> <button className="btn btn-sm btn-ghost" onClick={() => deleteMock(m.id)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>
      )}

      <form className="panel p-4 sm:p-6" onSubmit={(e) => { e.preventDefault(); saveMock(form); setSaved(`Saved “${form.name || form.date}”.`); setForm(blank()); }}>
        <h2 className="mb-4 text-xl font-bold">Mock analysis template</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1"><span className="label">Mock name</span><input id="mock-name" className="field" placeholder="e.g. Mock 2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="grid gap-1"><span className="label">Date</span><input id="mock-date" type="date" className="field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
          <label className="grid gap-1"><span className="label">Source</span><input id="mock-source" className="field" placeholder="e.g. IIM official mock / coaching series / in-app" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></label>
        </div>

        <div className="scroll-x mt-4">
          <table className="data">
            <thead><tr><th>Section</th><th className="n">Attempted</th><th className="n">Correct</th><th className="n">Minutes used</th><th>Percentile (if given)</th><th className="n">Accuracy</th><th className="n">Est. marks</th></tr></thead>
            <tbody>{SECTIONS.map((s) => {
              const r = form.rows[s];
              return (
                <tr key={s}>
                  <td className="font-semibold">{s}</td>
                  {(['attempted', 'correct', 'minutes'] as const).map((k) => (
                    <td key={k} className="n"><input id={`mock-${s}-${k}`} type="number" min={0} className="field num" style={{ width: '5rem', textAlign: 'right' }} value={r[k]} onChange={(e) => setRow(s, k, e.target.value)} aria-label={`${s} ${k}`} /></td>
                  ))}
                  <td><input id={`mock-${s}-pct`} className="field" style={{ width: '7rem' }} value={r.percentile} onChange={(e) => setRow(s, 'percentile', e.target.value)} aria-label={`${s} percentile`} /></td>
                  <td className="n num">{r.attempted ? Math.round((100 * r.correct) / r.attempted) : 0}%</td>
                  <td className="n num">{est(r)}</td>
                </tr>
              );
            })}
              <tr><td className="font-semibold">Total</td><td className="n num">{SECTIONS.reduce((a, s) => a + form.rows[s].attempted, 0)}</td><td className="n num">{SECTIONS.reduce((a, s) => a + form.rows[s].correct, 0)}</td><td className="n num">{SECTIONS.reduce((a, s) => a + form.rows[s].minutes, 0)}</td>
                <td><input id="mock-pct" className="field" style={{ width: '7rem' }} placeholder="overall" value={form.percentile} onChange={(e) => setForm({ ...form, percentile: e.target.value })} aria-label="Overall percentile" /></td><td></td><td className="n num font-semibold">{total}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-1 text-xs text-muted">Estimated marks = 3 × correct − wrong answers, assuming every wrong answer was an MCQ (so it is a lower bound when some wrong answers were TITA).</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {PROMPTS.map((p) => (
            <label key={p.key} className="grid gap-1">
              <span className="label">{p.label}</span>
              <textarea id={`mock-${p.key}`} className="field" rows={3} placeholder={p.placeholder} value={form[p.key] as string} onChange={(e) => setForm({ ...form, [p.key]: e.target.value })} />
            </label>
          ))}
        </div>
        <div className="no-print mt-4 flex flex-wrap items-center gap-2">
          <button type="submit" className="btn btn-primary">Save analysis</button>
          <button type="button" className="btn btn-ghost" onClick={() => setForm(blank())}>Clear form</button>
          {saved && <span className="text-sm" role="status" style={{ color: 'var(--good)' }}>{saved}</span>}
        </div>
      </form>
    </div>
  );
}
