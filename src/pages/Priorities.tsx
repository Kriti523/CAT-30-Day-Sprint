import { useState } from 'react';
import { CLASSES, RANKED, WEIGHTS, type PriorityClass } from '../data/priorities';
import { QUESTIONS } from '../lib/data';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import { aggregate, pct } from '../lib/stats';
import { SECTIONS, type Section } from '../types';
import { Note, PageHead, Panel, secVar } from '../components/ui';

const CLS_COLOR: Record<PriorityClass, string> = { 'Must Master': 'var(--seq-4)', 'Should Master': 'var(--seq-3)', 'Selective Practice': 'var(--seq-2)', 'Low Priority': 'var(--seq-1)' };
const CLS_NOTE: Record<PriorityClass, string> = {
  'Must Master': '≥ 75 · daily contact, full question coverage, reattempt every miss',
  'Should Master': '60–74 · cover once thoroughly, then timed revision',
  'Selective Practice': '45–59 · easy/medium questions only; skip hard ones in the exam',
  'Low Priority': '< 45 · only if everything above is strong',
};
const RATING_LABEL: Record<string, string> = { freq: 'Frequency 2023–25', cons: 'Consistency across slots', score: 'Scoring potential', found: 'Foundational importance', improve: 'Improvable in 30 days' };

export default function Priorities() {
  const [sec, setSec] = useState<Section | 'All'>('All');
  const [open, setOpen] = useState<string | null>(null);
  const { state } = useStore();
  const { startSession } = useNav();
  const rows = RANKED.filter((t) => sec === 'All' || t.section === sec);

  return (
    <div>
      <PageHead eyebrow="Priority Score 0–100" title="Topic priorities">
        Score = 10 × weighted rating: frequency {WEIGHTS.freq * 100}%, consistency {WEIGHTS.cons * 100}%, scoring potential {WEIGHTS.score * 100}%, foundational importance {WEIGHTS.found * 100}%, improvability in 30 days {WEIGHTS.improve * 100}%. Frequency and consistency come from the reconstructed counts; the other three are analyst judgements. Tap a topic to see its ratings.
      </PageHead>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {CLASSES.map((c) => (
          <div key={c} className="panel flex gap-3 p-3">
            <span style={{ width: 14, height: 14, borderRadius: 3, background: CLS_COLOR[c], marginTop: 3, flex: 'none' }} />
            <div><div className="font-bold">{c} <span className="num text-sm text-muted">· {RANKED.filter((t) => t.cls === c).length}</span></div><div className="text-sm text-muted">{CLS_NOTE[c]}</div></div>
          </div>
        ))}
      </div>

      <div className="no-print mb-3 flex flex-wrap gap-2">
        {(['All', ...SECTIONS] as const).map((s) => (
          <button key={s} className="btn btn-sm" aria-pressed={sec === s} onClick={() => setSec(s)}
            style={sec === s ? { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)' } : undefined}>{s}</button>
        ))}
      </div>

      <Panel>
        <div className="mb-2 hidden grid-cols-[1fr_minmax(8rem,40%)_3rem] gap-3 text-xs sm:grid"><span className="label">Topic</span><span className="label">Priority score</span><span className="label text-right">Score</span></div>
        <ul className="grid gap-1">
          {rows.map((t) => {
            const re = t.bankFilter ? new RegExp(t.bankFilter, 'i') : null;
            const qs = re ? QUESTIONS.filter((q) => q.section === t.section && (re.test(q.subtopic) || re.test(q.topic))) : [];
            const agg = aggregate(state, qs);
            const isOpen = open === t.topic;
            return (
              <li key={t.topic} className="rounded-lg" style={{ background: isOpen ? 'var(--sunk)' : undefined }}>
                <button className="grid w-full items-center gap-x-3 gap-y-1 rounded-lg px-2 py-2 text-left sm:grid-cols-[1fr_minmax(8rem,40%)_3rem]" onClick={() => setOpen(isOpen ? null : t.topic)} aria-expanded={isOpen}>
                  <span className="flex items-center gap-2"><span className="dot" style={{ background: secVar(t.section) }} /><span>{t.topic}</span><span className="text-xs text-muted">{t.section}</span></span>
                  <span className="flex items-center gap-2">
                    <span className="bar-track flex-1" style={{ height: 12 }} title={`${t.topic}: ${t.score} (${t.cls})`}><span className="bar-fill block" style={{ width: `${t.score}%`, background: CLS_COLOR[t.cls] }} /></span>
                    <span className="hidden w-28 text-xs text-muted md:inline">{t.cls}</span>
                  </span>
                  <span className="num text-right font-bold">{t.score}</span>
                </button>
                {isOpen && (
                  <div className="grid gap-3 px-3 pb-3 md:grid-cols-2">
                    <dl className="grid gap-1 text-sm">
                      {Object.entries(t.ratings).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[1fr_6rem_2rem] items-center gap-2">
                          <dt className="text-muted">{RATING_LABEL[k]}</dt>
                          <dd className="bar-track"><span className="bar-fill block" style={{ width: `${v * 10}%`, background: 'var(--seq-3)' }} /></dd>
                          <dd className="num text-right">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="text-sm">
                      <p><span className="label">Evidence · </span>{t.evidence}</p>
                      {qs.length > 0 ? (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-muted num">Your progress: {agg.attempted}/{qs.length} · {pct(agg.accuracy)}</span>
                          <button className="btn btn-sm btn-primary" onClick={() => startSession(qs.map((q) => q.id), t.topic)}>Practise {qs.length} Qs</button>
                        </div>
                      ) : <p className="mt-2 text-muted">No dedicated questions in the bank for this topic.</p>}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
      <div className="mt-4"><Note>These scores rank where the next hour of study pays most for a 30-day plan. They are not predictions of which topics will appear in CAT 2026.</Note></div>
    </div>
  );
}
