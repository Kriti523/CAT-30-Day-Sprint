import { useState } from 'react';
import { SHEETS } from '../data/formulas';
import { PageHead, secVar } from '../components/ui';

export default function Formulas() {
  const [sel, setSel] = useState<string>('all');
  const sheets = sel === 'all' ? SHEETS : SHEETS.filter((s) => s.id === sel);
  return (
    <div>
      <PageHead eyebrow="Quick revision" title="Formula & revision sheets">
        One page per area, laid out to print cleanly from your browser. Revise with active recall: cover the right-hand column, say it, check.
      </PageHead>
      <div className="no-print mb-4 flex flex-wrap gap-2">
        {[{ id: 'all', title: 'All sheets' }, ...SHEETS].map((s) => (
          <button key={s.id} className="btn btn-sm" aria-pressed={sel === s.id} onClick={() => setSel(s.id)}
            style={sel === s.id ? { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)' } : undefined}>{s.title}</button>
        ))}
      </div>
      <div className="grid gap-5">
        {sheets.map((s) => (
          <section key={s.id} className="panel p-4 sm:p-6">
            <div className="mb-3 flex items-center gap-2"><span className="dot" style={{ background: secVar(s.section) }} /><span className="label">{s.section}</span></div>
            <h2 className="mb-4 text-2xl font-bold">{s.title}</h2>
            <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
              {s.groups.map((g) => (
                <div key={g.name} style={{ breakInside: 'avoid' }}>
                  <h3 className="mb-1.5 font-bold">{g.name}</h3>
                  <dl className="grid gap-1.5">
                    {g.items.map(([k, v]) => (
                      <div key={k} className="grid gap-x-3 border-b pb-1.5 text-[0.95rem] sm:grid-cols-[10rem_1fr]" style={{ borderColor: 'var(--line)' }}>
                        <dt className="font-semibold">{k}</dt><dd className="mono text-[0.88rem]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
