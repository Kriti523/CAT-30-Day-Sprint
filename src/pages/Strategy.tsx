import { EXAM_DAY, RULES, SECTION_PLANS, TARGETS, WORKING_PRO_TIPS } from '../data/strategy';
import { NEXT_EXAM } from '../data/research';
import { Note, PageHead, Panel, secVar } from '../components/ui';
import type { Section } from '../types';

export default function Strategy() {
  return (
    <div>
      <PageHead eyebrow={`CAT ${NEXT_EXAM.year} · ${NEXT_EXAM.label}`} title="Exam strategy">
        A fixed plan for each 40-minute section, targets that give you a realistic shot at 99+, and the logistics for exam day. Rehearse this plan in every mock from Week 3 onward.
      </PageHead>

      <Panel title="Working targets for a 99+ attempt" className="mb-6">
        <div className="scroll-x">
          <table className="data">
            <thead><tr><th>Section</th><th>Attempts</th><th>Correct</th><th>Net marks (approx.)</th><th>How</th></tr></thead>
            <tbody>{TARGETS.rows.map((r) => (
              <tr key={r.section}><td><span className="inline-flex items-center gap-2"><span className="dot" style={{ background: secVar(r.section as Section) }} />{r.section}</span></td>
                <td className="num">{r.attempts}</td><td className="num">{r.correct}</td><td className="num">{r.netMarks}</td><td>{r.plan}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="mt-3"><Note tone="warn">{TARGETS.note}</Note></div>
      </Panel>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {SECTION_PLANS.map((s) => (
          <Panel key={s.section} title={<span className="inline-flex items-center gap-2"><span className="dot" style={{ background: secVar(s.section as Section) }} />{s.section} plan</span>}>
            <ol className="grid list-decimal gap-2 pl-5 text-[0.95rem]">{s.points.map((p) => <li key={p}>{p}</li>)}</ol>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Rules that shape strategy"><ul className="grid list-disc gap-2 pl-5 text-[0.95rem]">{RULES.map((r) => <li key={r}>{r}</li>)}</ul></Panel>
        <Panel title="Exam-day checklist"><ul className="grid gap-2 text-[0.95rem]">{EXAM_DAY.map((r, i) => <li key={r} className="flex gap-2"><input id={`exam-${i}`} type="checkbox" className="mt-1.5" aria-label={r} /><span>{r}</span></li>)}</ul>
          <p className="mt-3 text-xs text-muted">Always follow the instructions printed on your admit card and on iimcat.ac.in; they override anything here.</p></Panel>
        <Panel title="For working professionals"><ul className="grid list-disc gap-2 pl-5 text-[0.95rem]">{WORKING_PRO_TIPS.map((r) => <li key={r}>{r}</li>)}</ul></Panel>
      </div>
    </div>
  );
}
