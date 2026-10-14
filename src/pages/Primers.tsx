import { useState } from 'react';
import { PRIMERS } from '../data/primers';
import { RANKED } from '../data/priorities';
import { QUESTIONS } from '../lib/data';
import { useNav } from '../lib/nav';
import { SECTIONS, type Section } from '../types';
import { PageHead, Panel, SectionTag } from '../components/ui';

export const primerId = (topic: string) => `primer-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

/** Questions in the bank for a priority topic (same filter as the Topic priorities page). */
function questionsFor(topic: string, section: Section) {
  const filter = RANKED.find((t) => t.topic === topic)?.bankFilter;
  if (!filter) return [];
  const re = new RegExp(filter, 'i');
  return QUESTIONS.filter((q) => q.section === section && (re.test(q.subtopic) || re.test(q.topic))).map((q) => q.id);
}

export default function Primers() {
  const { startSession } = useNav();
  const [sec, setSec] = useState<Section | 'All'>('All');
  const shown = PRIMERS.filter((p) => sec === 'All' || p.section === sec);
  return (
    <div>
      <PageHead eyebrow="The Must-Master topics" title="Topic primers">
        A short lesson for each topic that moves the score most: the idea, a method you can repeat, one worked example and the traps to watch for. Read one, then practise it straight away.
      </PageHead>
      <div className="no-print mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Section">
        {(['All', ...SECTIONS] as const).map((s) => (
          <button key={s} role="tab" aria-selected={sec === s} className="btn btn-sm" onClick={() => setSec(s)}
            style={sec === s ? { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)' } : undefined}>{s}</button>
        ))}
      </div>
      <div className="grid gap-4">
        {shown.map((p) => {
          const ids = questionsFor(p.topic, p.section);
          return (
            <Panel key={p.topic} className="scroll-mt-24" title={<span id={primerId(p.topic)} className="inline-flex flex-wrap items-center gap-2"><SectionTag s={p.section} />{p.topic}</span>}
              aside={ids.length > 0 ? <button className="btn btn-sm btn-primary no-print" onClick={() => startSession(ids, p.topic)}>Practise {ids.length} Qs</button> : undefined}>
              <p className="prose-cat">{p.idea}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="label mb-1">Method</div>
                  <ol className="grid list-decimal gap-1.5 pl-5 text-[0.97rem]">{p.method.map((m) => <li key={m}>{m}</li>)}</ol>
                </div>
                <div className="rounded-lg p-3" style={{ background: 'var(--sunk)' }}>
                  <div className="label mb-1">Worked example</div>
                  <p className="font-semibold">{p.example.problem}</p>
                  <ol className="mt-2 grid list-decimal gap-1 pl-5 text-[0.95rem]">{p.example.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                </div>
              </div>
              <div className="mt-4">
                <div className="label mb-1">Traps</div>
                <ul className="grid list-disc gap-1 pl-5 text-[0.95rem]">{p.traps.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
