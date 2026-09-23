import { useState } from 'react';
import { DILR_STRUCTURE, GOOD_ATTEMPTS_2025, INSIGHTS, NEXT_EXAM, PATTERN, PERCENTILE_SCORES, QA_BROAD, QA_SUB, SOURCES, VARC_STRUCTURE } from '../data/research';
import { GroupedBars, SEQ3 } from '../components/charts';
import { Note, PageHead, Panel, Reliab } from '../components/ui';

const srcName = (k: string) => SOURCES.find((s) => s.key === k)?.name ?? k;
const YEARS = [2023, 2024, 2025];

function Cite({ keys }: { keys: string[] }) {
  return <span className="text-xs text-muted">Source: {keys.map((k, i) => {
    const s = SOURCES.find((x) => x.key === k);
    return <span key={k}>{i > 0 && '; '}{s ? <a href={s.url} target="_blank" rel="noreferrer">{s.name}</a> : k}</span>;
  })}</span>;
}

export default function Trends() {
  const [tableView, setTableView] = useState(false);
  const maxSub = Math.max(...QA_SUB.y2023, ...QA_SUB.y2024, ...QA_SUB.y2025);
  return (
    <div>
      <PageHead eyebrow="CAT 2023 · 2024 · 2025 — all slots" title="Previous-paper trends">
        IIMs publish the pattern and response sheets, not topic counts. Every topic count here is a <strong>reconstruction</strong> by coaching institutes; where sources disagree, the conflict is shown rather than averaged. Next exam: CAT {NEXT_EXAM.year} by {NEXT_EXAM.iim}, {NEXT_EXAM.label}.
      </PageHead>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INSIGHTS.map((i) => (
          <div key={i.title} className="panel p-4"><h3 className="font-bold">{i.title}</h3><p className="mt-1 text-sm text-muted">{i.body}</p></div>
        ))}
      </div>

      <Panel title="Exam pattern by year" className="mb-6">
        <div className="scroll-x">
          <table className="data">
            <thead><tr><th>Year</th><th>Convening IIM · date</th><th className="n">Total</th><th className="n">VARC</th><th className="n">DILR</th><th className="n">QA</th><th>TITA (VARC / DILR / QA)</th><th>Reliability</th></tr></thead>
            <tbody>{PATTERN.map((p) => (
              <tr key={p.year}>
                <td className="num font-semibold">{p.year}</td><td>{p.iim} · {p.date}</td>
                <td className="n num">{p.total}</td><td className="n num">{p.VARC}</td><td className="n num">{p.DILR}</td><td className="n num">{p.QA}</td>
                <td>{p.tita.VARC} / {p.tita.DILR} / {p.tita.QA}</td><td><Reliab r={p.reliability} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <ul className="mt-3 grid gap-1 text-sm text-muted">{PATTERN.map((p) => <li key={p.year}><strong className="text-ink">{p.year}:</strong> {p.note} <Cite keys={p.sources} /></li>)}</ul>
        <p className="mt-2 text-sm">All three years: 40 minutes per section, fixed order VARC → DILR → QA, +3 for a correct answer, −1 for a wrong MCQ, 0 for a wrong TITA.</p>
      </Panel>

      <Panel title="QA: broad topics per year (three slots summed)" className="mb-6"
        aside={<button className="btn btn-sm no-print" onClick={() => setTableView((t) => !t)}>{tableView ? 'Chart view' : 'Table view'}</button>}>
        {tableView ? (
          <div className="scroll-x"><table className="data"><thead><tr><th>Topic</th>{YEARS.map((y) => <th key={y} className="n">{y}</th>)}</tr></thead>
            <tbody>{QA_BROAD.categories.map((c, i) => <tr key={c}><td>{c}</td>{QA_BROAD.years.map((y) => <td key={y.year} className="n num">{y.values[i]}</td>)}</tr>)}</tbody></table></div>
        ) : (
          <GroupedBars ariaLabel="QA broad topic question counts for 2023, 2024 and 2025" categories={QA_BROAD.categories}
            series={QA_BROAD.years.map((y, i) => ({ name: String(y.year), values: y.values, color: SEQ3[i] }))} unit=" Qs" />
        )}
        <ul className="mt-3 grid gap-1 text-sm text-muted">
          {QA_BROAD.years.map((y) => <li key={y.year}><strong className="text-ink">{y.year}</strong> from {srcName(y.source)}. Cross-check: {y.cross}</li>)}
          <li>{QA_BROAD.note}</li>
        </ul>
      </Panel>

      <Panel title="QA: sub-topic counts (three slots summed)" className="mb-6" aside={<Cite keys={[QA_SUB.source]} />}>
        <div className="mb-2 flex flex-wrap gap-4 text-sm text-muted">
          {YEARS.map((y, i) => <span key={y} className="inline-flex items-center gap-1.5"><span style={{ width: 10, height: 10, borderRadius: 2, background: SEQ3[i] }} />{y}</span>)}
        </div>
        <ul className="grid gap-3">
          {QA_SUB.topics.map((t, i) => {
            const vals = [QA_SUB.y2023[i], QA_SUB.y2024[i], QA_SUB.y2025[i]];
            return (
              <li key={t} className="grid items-center gap-x-3 sm:grid-cols-[14rem_1fr]">
                <span className="text-sm">{t} <span className="num text-muted">· {vals.reduce((a, b) => a + b, 0)}</span></span>
                <span className="grid gap-[2px]">
                  {vals.map((v, j) => (
                    <span key={j} className="flex items-center gap-2" title={`${t} · ${YEARS[j]}: ${v}`}>
                      <span style={{ height: 7, width: `${(v / maxSub) * 85}%`, minWidth: v ? 3 : 0, background: SEQ3[j], borderRadius: '0 4px 4px 0' }} />
                      <span className="num text-xs text-muted">{v}</span>
                    </span>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm text-muted">{QA_SUB.note}</p>
      </Panel>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Panel title="VARC structure">
          <ul className="grid gap-3 text-sm">{VARC_STRUCTURE.map((v) => (
            <li key={v.year}><div className="flex flex-wrap items-center gap-2"><strong className="num">{v.year}</strong><Reliab r={v.status} /></div>
              <div>RC: {v.rc}</div><div>VA: {v.va}</div><div className="text-xs text-muted">{v.source}</div></li>
          ))}</ul>
        </Panel>
        <Panel title="DILR structure & set types">
          <ul className="grid gap-3 text-sm">{DILR_STRUCTURE.map((v) => (
            <li key={v.year}><div className="flex flex-wrap items-center gap-2"><strong className="num">{v.year}</strong><Reliab r={v.status} /></div>
              <div>{v.sets}</div><div className="text-muted">{v.types}</div><div className="text-xs text-muted">{v.source}</div></li>
          ))}</ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Scaled score at each percentile" aside={<Cite keys={[PERCENTILE_SCORES.source]} />}>
          <div className="scroll-x"><table className="data">
            <thead><tr><th>Year</th><th className="n">95 %ile</th><th className="n">99 %ile</th><th className="n">99.5 %ile</th><th>Sectional 99 %ile</th></tr></thead>
            <tbody>{PERCENTILE_SCORES.rows.map((r) => <tr key={r.year}><td className="num">{r.year}</td><td className="n num">{r.p95}</td><td className="n num">{r.p99}</td><td className="n num">{r.p995}</td><td>{r.sec99}</td></tr>)}</tbody>
          </table></div>
          <div className="mt-3"><Note tone="warn">Single source, scaled (normalised) scores — not raw marks, and they move with paper difficulty. Use them as a rough zone, not a target to the decimal.</Note></div>
        </Panel>
        <Panel title="CAT 2025 good attempts (95+ percentile)" aside={<Cite keys={['ims-2025', 'cracku-2025', 'gradsqr-2025']} />}>
          <ul className="grid gap-2 text-sm">{GOOD_ATTEMPTS_2025.map((g) => <li key={g.slot}><strong>{g.slot}:</strong> {g.p95}<div className="text-xs text-muted">Difficulty: {g.difficulty}</div></li>)}</ul>
          <p className="mt-3 text-sm text-muted">Difficulty ratings differ between institutes for the same slot — another reason to read these as estimates.</p>
        </Panel>
      </div>
    </div>
  );
}
