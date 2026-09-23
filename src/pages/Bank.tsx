import { useMemo, useState } from 'react';
import { QUESTIONS, SETMAP, shuffle } from '../lib/data';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import { aggregate, pct } from '../lib/stats';
import { SECTIONS, type Section } from '../types';
import { DiffTag, PageHead, SECTION_NAME, StatusPill, secVar } from '../components/ui';

type Status = 'all' | 'new' | 'right' | 'wrong' | 'bookmarked' | 'low' | 'noted';

export default function Bank() {
  const nav = useNav();
  const { state } = useStore();
  const [section, setSection] = useState<Section>(nav.bankSection);
  const [query, setQuery] = useState(nav.bankQuery);
  const [sub, setSub] = useState('');
  const [diff, setDiff] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState<Status>('all');
  const [randN, setRandN] = useState(10);

  const inSection = useMemo(() => QUESTIONS.filter((q) => q.section === section), [section]);
  const subs = useMemo(() => [...new Set(inSection.map((q) => q.subtopic))], [inSection]);

  const list = useMemo(() => {
    const ql = query.trim().toLowerCase();
    return inSection.filter((q) => {
      if (sub && q.subtopic !== sub) return false;
      if (diff && q.difficulty !== diff) return false;
      if (type && q.type !== type) return false;
      const a = state.attempts[q.id];
      if (status === 'new' && a) return false;
      if (status === 'right' && !a?.correct) return false;
      if (status === 'wrong' && (!a || a.correct)) return false;
      if (status === 'bookmarked' && !state.bookmarks[q.id]) return false;
      if (status === 'low' && state.confidence[q.id] !== 1) return false;
      if (status === 'noted' && !state.notes[q.id]) return false;
      if (ql) {
        const set = q.setId ? SETMAP[q.setId] : undefined;
        const hay = `${q.id} ${q.topic} ${q.subtopic} ${q.text} ${set?.title ?? ''} ${set?.subtopic ?? ''} ${set?.body ?? ''} ${state.notes[q.id] ?? ''}`.toLowerCase();
        if (!ql.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }, [inSection, sub, diff, type, status, query, state]);

  const agg = aggregate(state, inSection);
  const ids = list.map((q) => q.id);
  const title = `${section}${sub ? ` · ${sub}` : ''}${diff ? ` · ${diff}` : ''}${query ? ` · “${query}”` : ''}`;

  return (
    <div>
      <PageHead eyebrow="100 original questions per section" title="Question bank">
        Every question has a hint, a step-by-step solution, a fast method, the common trap and a one-line revision note. Search, filter, then practise the filtered list or a random draw from it.
      </PageHead>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Section">
        {SECTIONS.map((s) => (
          <button key={s} role="tab" aria-selected={section === s} className="btn" onClick={() => { setSection(s); setSub(''); }}
            style={section === s ? { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)' } : undefined}>
            <span className="dot" style={{ background: secVar(s) }} />{s}
          </button>
        ))}
      </div>

      <div className="panel mb-4 p-4">
        <div className="mb-3 text-sm text-muted">{SECTION_NAME[section]} · <span className="num">{agg.attempted}</span>/100 attempted · accuracy {pct(agg.accuracy)}</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <label className="grid gap-1 lg:col-span-2"><span className="label">Search</span>
            <input id="bank-search" className="field" type="search" placeholder="Words, topic or ID (e.g. remainder, Q045, circular)" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <label className="grid gap-1"><span className="label">Topic</span>
            <select id="bank-sub" className="field" value={sub} onChange={(e) => setSub(e.target.value)}>
              <option value="">All topics</option>{subs.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="grid gap-1"><span className="label">Difficulty</span>
            <select id="bank-diff" className="field" value={diff} onChange={(e) => setDiff(e.target.value)}>
              <option value="">Any</option><option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </label>
          <label className="grid gap-1"><span className="label">Type</span>
            <select id="bank-type" className="field" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">MCQ + TITA</option><option value="MCQ">MCQ</option><option value="TITA">TITA</option>
            </select>
          </label>
          <label className="grid gap-1"><span className="label">Status</span>
            <select id="bank-status" className="field" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              <option value="all">All</option><option value="new">Not attempted</option><option value="right">Last attempt right</option>
              <option value="wrong">Last attempt wrong</option><option value="bookmarked">Bookmarked</option><option value="low">Low confidence</option><option value="noted">Has a note</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button className="btn btn-primary" disabled={!ids.length} onClick={() => nav.startSession(ids, title)}>Practise these ({ids.length})</button>
          <button className="btn" disabled={!ids.length} onClick={() => nav.startSession(ids, `${title} · timed`, true)}>Timed</button>
          <span className="mx-1 h-6 w-px" style={{ background: 'var(--line)' }} />
          <label className="inline-flex items-center gap-2 text-sm">Random
            <input id="rand-n" type="number" min={1} max={50} className="field num" style={{ width: '4.5rem' }} value={randN} onChange={(e) => setRandN(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} />
          </label>
          <button className="btn" disabled={!ids.length} onClick={() => nav.startSession(shuffle(ids).slice(0, randN), `Random ${Math.min(randN, ids.length)} · ${title}`, true)}>Start random (timed)</button>
          <button className="btn btn-ghost" onClick={() => nav.startSession(shuffle(QUESTIONS.map((q) => q.id)).slice(0, randN), `Random ${randN} · all sections`, true)}>Random across all sections</button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="panel p-6 text-muted">No questions match these filters. Clear the search or set Status to “All”.</p>
      ) : (
        <ul className="panel divide-y" style={{ borderColor: 'var(--line)' }}>
          {list.map((q, i) => {
            const a = state.attempts[q.id];
            const set = q.setId ? SETMAP[q.setId] : undefined;
            return (
              <li key={q.id} style={{ borderColor: 'var(--line)' }}>
                <button className="flex w-full flex-wrap items-start gap-x-3 gap-y-1 px-4 py-3 text-left hover:bg-[var(--sunk)]"
                  onClick={() => nav.startSession([...ids.slice(i), ...ids.slice(0, i)], title)}>
                  <span className="mono w-12 flex-none pt-0.5 text-sm font-semibold">{q.id}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-muted">{set ? `${set.id} · ${set.title} — ` : ''}{q.subtopic}</span>
                    <span className="line-clamp-2 block">{q.text.split('\n')[0]}</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <DiffTag d={q.difficulty} />
                    <span className="chip">{q.type}</span>
                    {state.bookmarks[q.id] && <span className="chip" title="Bookmarked">★</span>}
                    {state.notes[q.id] && <span className="chip" title="Has a note">✎</span>}
                    {a ? <StatusPill tone={a.correct ? 'good' : 'bad'}>{a.correct ? 'Right' : 'Wrong'}</StatusPill> : <StatusPill tone="neutral">New</StatusPill>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
