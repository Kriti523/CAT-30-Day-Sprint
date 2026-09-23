import { useState } from 'react';
import { QMAP } from '../lib/data';
import { useNav } from '../lib/nav';
import { reattemptQueue, useStore } from '../lib/store';
import { ERROR_REASONS } from '../types';
import { Meter, PageHead, Panel, SectionTag, StatusPill } from '../components/ui';

export default function Errors() {
  const { state, setErrorReason, setErrorNote, resolveError } = useStore();
  const { startSession } = useNav();
  const [showResolved, setShowResolved] = useState(false);
  const entries = Object.entries(state.errors).filter(([id]) => QMAP[id]).sort((a, b) => b[1].addedAt - a[1].addedAt);
  const open = entries.filter(([, e]) => !e.resolved);
  const shown = showResolved ? entries : open;
  const queue = reattemptQueue(state);
  const reasonCounts = ERROR_REASONS.map((r) => ({ r, n: entries.filter(([, e]) => e.reason === r).length }));
  const maxN = Math.max(1, ...reasonCounts.map((x) => x.n));
  const untagged = entries.filter(([, e]) => !e.reason).length;

  return (
    <div>
      <PageHead eyebrow="Wrong answers are logged automatically" title="Error log & reattempt queue"
        actions={<button className="btn btn-primary" disabled={!queue.length} onClick={() => startSession(queue, 'Reattempt queue')}>Start reattempt queue ({queue.length})</button>}>
        A question leaves the queue when you answer it correctly. Low-confidence questions (rated “Low”) are queued too. Tag every miss with a reason — the pattern tells you what to fix.
      </PageHead>

      <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
        <Panel title="Why you miss questions">
          <ul className="grid gap-2 text-sm">
            {reasonCounts.map(({ r, n }) => (
              <li key={r}>
                <div className="flex justify-between"><span>{r}</span><span className="num">{n}</span></div>
                <Meter value={n} max={maxN} color="var(--seq-3)" label={r} />
              </li>
            ))}
          </ul>
          {untagged > 0 && <p className="mt-3 text-sm text-muted">{untagged} entr{untagged === 1 ? 'y has' : 'ies have'} no reason yet.</p>}
        </Panel>
        <Panel title={`${showResolved ? 'All entries' : 'Open entries'} (${shown.length})`}
          aside={<label className="inline-flex items-center gap-2 text-sm"><input id="show-resolved" type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} /> Show resolved</label>}>
          {shown.length === 0 ? <p className="text-muted">No open errors. Wrong answers from practice and tests will appear here.</p> : (
            <ul className="grid gap-3">
              {shown.map(([id, e]) => {
                const q = QMAP[id];
                const a = state.attempts[id];
                return (
                  <li key={id} className="rounded-lg border p-3" style={{ borderColor: 'var(--line)' }}>
                    <div className="flex flex-wrap items-center gap-2">
                      <SectionTag s={q.section} /><span className="mono text-sm font-semibold">{id}</span>
                      <span className="text-sm text-muted">{q.subtopic}</span>
                      <span className="ml-auto flex items-center gap-2">
                        {a && <span className="text-xs text-muted num">{a.n} attempt{a.n > 1 ? 's' : ''}</span>}
                        {e.resolved ? <StatusPill tone="good">Resolved</StatusPill> : <StatusPill tone="bad">Open</StatusPill>}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm">{q.text.split('\n')[0]}</p>
                    <p className="mt-1 text-xs text-muted"><span className="label">Rule · </span>{q.note}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[auto_1fr_auto]">
                      <select id={`er-${id}`} className="field" value={e.reason ?? ''} onChange={(ev) => setErrorReason(id, ev.target.value as never)} aria-label="Reason">
                        <option value="">Reason…</option>{ERROR_REASONS.map((r) => <option key={r}>{r}</option>)}
                      </select>
                      <input id={`en-${id}`} className="field" placeholder="What will you do differently?" value={e.note ?? ''} onChange={(ev) => setErrorNote(id, ev.target.value)} />
                      <div className="flex gap-2">
                        <button className="btn btn-sm" onClick={() => startSession([id], `Reattempt ${id}`)}>Reattempt</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => resolveError(id, !e.resolved)}>{e.resolved ? 'Reopen' : 'Mark resolved'}</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
