import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppState } from '../types';
import { supabase } from './supabase';
import { mergeStates, normalize } from './state';

export type SyncStatus = 'syncing' | 'synced' | 'offline' | 'error';

/** Last cloud revision this device has seen, and whether it has changes the cloud doesn't. */
interface Meta { rev: number; dirty: boolean }
const metaKey = (userId: string) => `cat30-sprint:sync:${userId}`;

function readMeta(userId: string, dirtyIfNew: boolean): Meta {
  try {
    const m = JSON.parse(localStorage.getItem(metaKey(userId)) ?? 'null');
    if (m && typeof m.rev === 'number') return { rev: m.rev, dirty: !!m.dirty };
  } catch { /* fall through */ }
  return { rev: 0, dirty: dirtyIfNew };
}
function writeMeta(userId: string, m: Meta) {
  try { localStorage.setItem(metaKey(userId), JSON.stringify(m)); } catch { /* sync still works this session */ }
}

const PUSH_DELAY = 1500;
const RETRY_DELAY = 30_000;

/**
 * Keeps this account's progress in the `progress` table in step with this device.
 * Each write carries the revision it was based on; if another device wrote first, the two are merged
 * (see mergeStates) and written again. Works offline: changes wait in localStorage and go up on reconnect.
 */
export function useCloudSync(userId: string, state: AppState, setState: (s: AppState) => void, dirtyIfNew: boolean): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>('syncing');
  const meta = useRef<Meta>(readMeta(userId, dirtyIfNew));
  const latest = useRef(state);
  latest.current = state;
  const seen = useRef(state);          // last state the effect below has looked at
  const fromCloud = useRef<AppState | null>(null);
  const edits = useRef(0);             // local changes so far, to spot edits made mid-request
  const busy = useRef(false);
  const again = useRef(false);
  const timer = useRef<number>();

  const setMeta = useCallback((m: Meta) => { meta.current = m; writeMeta(userId, m); }, [userId]);
  const apply = useCallback((s: AppState) => { fromCloud.current = s; seen.current = s; setState(s); }, [setState]);

  const run = useCallback(async () => {
    if (busy.current) { again.current = true; return; }
    busy.current = true;
    setStatus('syncing');
    try {
      for (let tries = 0; tries < 4; tries++) {
        const { data, error } = await supabase.from('progress').select('state, rev').eq('user_id', userId).maybeSingle();
        if (error) throw error;
        const m = meta.current;
        const sentEdits = edits.current;

        if (!data) { // first sync for this account: upload what this device has
          const { error: e } = await supabase.from('progress').insert({ user_id: userId, state: latest.current, rev: 1 });
          if (e?.code === '23505') continue; // another device created it a moment ago
          if (e) throw e;
          setMeta({ rev: 1, dirty: edits.current !== sentEdits });
          break;
        }
        if (!m.dirty) {
          if (data.rev !== m.rev) apply(normalize(data.state as Partial<AppState>));
          setMeta({ rev: data.rev, dirty: false });
          break;
        }
        // This device has changes. If the cloud moved on since we last synced, merge first.
        let next = latest.current;
        if (data.rev !== m.rev) {
          next = mergeStates(latest.current, normalize(data.state as Partial<AppState>));
          apply(next);
        }
        const { data: rows, error: e } = await supabase.from('progress')
          .update({ state: next, rev: data.rev + 1 }).eq('user_id', userId).eq('rev', data.rev).select('rev');
        if (e) throw e;
        if (!rows?.length) continue; // lost a race with another device: fetch and merge again
        setMeta({ rev: data.rev + 1, dirty: edits.current !== sentEdits });
        break;
      }
      setStatus('synced');
    } catch {
      setStatus(navigator.onLine === false ? 'offline' : 'error');
      // Offline waits for the "online" event; anything else (server hiccup) retries in a while.
      if (navigator.onLine !== false) { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => { void run(); }, RETRY_DELAY); }
    } finally {
      busy.current = false;
      if (again.current) { again.current = false; void run(); }
    }
  }, [userId, apply, setMeta]);

  // Local edits: remember them and push shortly after the last one.
  useEffect(() => {
    if (state === seen.current) return;
    seen.current = state;
    if (state === fromCloud.current) { fromCloud.current = null; return; }
    edits.current++;
    if (!meta.current.dirty) setMeta({ ...meta.current, dirty: true });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { void run(); }, PUSH_DELAY);
  }, [state, run, setMeta]);

  // Pull on start, when the tab comes back into view or the connection returns; push right away when leaving.
  useEffect(() => {
    void run();
    const onVisible = () => {
      if (document.visibilityState === 'visible' || meta.current.dirty) { window.clearTimeout(timer.current); void run(); }
    };
    const onOnline = () => { void run(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
      window.clearTimeout(timer.current);
    };
  }, [run]);

  return status;
}
