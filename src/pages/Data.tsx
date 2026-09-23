import { useState } from 'react';
import { useStore } from '../lib/store';
import { PageHead, Panel, Note } from '../components/ui';

export default function DataPage() {
  const { state, replaceAll, reset, persistent } = useStore();
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const json = JSON.stringify(state);

  const copy = async () => {
    try { await navigator.clipboard.writeText(json); setMsg('Progress copied. Paste it into a note or file to keep a backup.'); }
    catch { setText(json); setMsg('Copying is blocked here — the backup is in the box below; select all and copy it.'); }
  };
  const importText = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !('attempts' in parsed)) throw new Error('not a backup');
      replaceAll(parsed); setMsg('Backup restored.'); setText('');
    } catch { setMsg('That text is not a valid backup. Paste the full text you exported earlier.'); }
  };

  return (
    <div>
      <PageHead eyebrow="Stored only in this browser" title="Your data">
        Progress, notes, bookmarks, confidence ratings, the error log, plan ticks and mock logs are saved in this browser’s local storage. Nothing is sent anywhere, so a different browser or device starts empty — use a backup to move it.
      </PageHead>
      {!persistent && <div className="mb-4"><Note tone="warn">Local storage is unavailable in this browser session, so changes will not survive a reload.</Note></div>}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Back up">
          <p className="text-sm text-muted">Copies your full progress as text ({Math.round(json.length / 1024)} KB).</p>
          <button className="btn btn-primary mt-3" onClick={copy}>Copy backup</button>
        </Panel>
        <Panel title="Restore">
          <label className="grid gap-1"><span className="label">Paste a backup, or load a backup file</span>
            <textarea id="backup-text" className="field mono text-xs" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder='{"v":1,"attempts":{…}}' />
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button className="btn" disabled={!text.trim()} onClick={() => importText(text)}>Restore from text</button>
            <label className="btn cursor-pointer">Load file<input id="backup-file" type="file" accept=".json,.txt,application/json,text/plain" className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) f.text().then(importText); }} /></label>
          </div>
        </Panel>
      </div>
      {msg && <p className="mt-3 text-sm" role="status">{msg}</p>}
      <Panel title="Start over" className="mt-4">
        <p className="text-sm text-muted">Erases all progress in this browser. Export a backup first if you might want it back.</p>
        {confirmReset ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm">Erase everything?</span>
            <button className="btn" style={{ background: 'var(--bad)', color: '#fff', borderColor: 'var(--bad)' }} onClick={() => { reset(); setConfirmReset(false); setMsg('All progress erased.'); }}>Yes, erase</button>
            <button className="btn" onClick={() => setConfirmReset(false)}>Cancel</button>
          </div>
        ) : <button className="btn mt-3" onClick={() => setConfirmReset(true)}>Erase all progress…</button>}
      </Panel>
    </div>
  );
}
