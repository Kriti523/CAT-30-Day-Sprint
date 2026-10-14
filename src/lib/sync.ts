import type { AppState } from '../types';
import { fetchProgress, saveProgress } from './cloud';

/** `local`: no account, saved in this browser. `failed`: signed in, but the progress couldn't be loaded. */
export type SyncStatus = 'local' | 'loading' | 'saving' | 'saved' | 'offline' | 'failed';

interface Cache { state: AppState; version: number | null; dirty: boolean; editedAt: number }

const SAVE_DELAY = 1000;
const TIMEOUT = 10000;

function withTimeout<T>(p: Promise<T>, ms = TIMEOUT): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

/**
 * Keeps one account's progress in step with its row in Supabase.
 *
 * A copy is cached in this browser, so the app keeps working offline. Edits upload a second after they happen;
 * coming back to the tab pulls in anything saved from another device. If two devices both changed progress
 * since they last synced, the more recent edit wins (for the whole of the progress, not item by item).
 */
export class CloudSync {
  readonly state0: AppState;
  private state: AppState;
  private version: number | null;
  private dirty: boolean;
  private editedAt: number;
  private readonly hadCache: boolean;
  private firstPull = true;
  private movedGuest = false;
  private chain: Promise<void> = Promise.resolve();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private live = false;
  private apply: (s: AppState) => void = () => {};
  private report: (s: SyncStatus) => void = () => {};

  /** `normalize` fills in fields missing from progress saved by an older version of the app. */
  constructor(private uid: string, private normalize: (s?: Partial<AppState>) => AppState, private guest: { read: () => AppState; clear: () => void }) {
    const c = readCache(uid);
    this.hadCache = !!c;
    this.state = this.state0 = normalize(c?.state);
    this.version = c?.version ?? null;
    this.dirty = c?.dirty ?? false;
    this.editedAt = c?.editedAt ?? 0;
  }

  start(apply: (s: AppState) => void, report: (s: SyncStatus) => void) {
    this.apply = apply; this.report = report; this.live = true;
    window.addEventListener('online', this.onWake);
    document.addEventListener('visibilitychange', this.onWake);
    window.addEventListener('pagehide', this.onHide);
    report('loading');
    // First load: with a cached copy, don't keep the person waiting long on a slow network.
    void this.enqueue(() => this.pull(), () => this.report(this.hadCache ? 'offline' : 'failed'), this.hadCache ? 5000 : TIMEOUT);
  }

  stop() {
    this.live = false;
    clearTimeout(this.timer);
    window.removeEventListener('online', this.onWake);
    document.removeEventListener('visibilitychange', this.onWake);
    window.removeEventListener('pagehide', this.onHide);
  }

  /** Called with every new state; anything that isn't a copy just loaded from the account is the person's edit. */
  changed(s: AppState) {
    if (s === this.state) return;
    this.state = s; this.dirty = true; this.editedAt = Date.now();
    this.persist();
    this.report('saving');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.flush(), SAVE_DELAY);
  }

  /** Upload pending edits now. Resolves true when everything is saved to the account. */
  async flush(): Promise<boolean> {
    clearTimeout(this.timer);
    await this.enqueue(() => this.push());
    return !this.dirty;
  }

  retry() { this.report('loading'); void this.enqueue(() => this.pull(), () => this.report(this.hadCache ? 'offline' : 'failed')); }

  /** Remove this account's copy from the browser (on sign-out, once everything is uploaded). */
  forget() { try { localStorage.removeItem(cacheKey(this.uid)); } catch { /* ignore */ } }

  private onWake = () => {
    if (document.visibilityState !== 'visible') return;
    void this.enqueue(() => (this.dirty ? this.push() : this.pull()));
  };
  private onHide = () => { if (this.dirty) void this.flush(); };

  /** Network steps run one at a time, in order. */
  private enqueue(op: () => Promise<void>, onError = () => this.report('offline'), ms = TIMEOUT) {
    this.chain = this.chain.then(() => withTimeout(op(), ms)).catch(() => { if (this.live) onError(); });
    return this.chain;
  }

  private async push(): Promise<void> {
    if (!this.dirty) return;
    this.report('saving');
    const s = this.state;
    const v = await saveProgress(this.uid, s, this.version, this.editedAt);
    if (v === null) return this.pull(); // another device saved since this one last synced
    this.version = v;
    if (this.state === s) this.dirty = false;
    if (this.movedGuest) { this.guest.clear(); this.movedGuest = false; }
    this.persist();
    this.report(this.dirty ? 'saving' : 'saved');
  }

  private async pull(): Promise<void> {
    const row = await fetchProgress(this.uid);
    const first = this.firstPull;
    this.firstPull = false;
    if (!row) {
      this.version = null;
      // A new account: it starts with the progress made on this device before signing in.
      if (first && !this.hadCache) {
        this.take(this.guest.read());
        this.dirty = true; this.editedAt = Date.now(); this.movedGuest = true;
      }
      return this.dirty ? this.push() : this.report('saved');
    }
    if (this.dirty && (row.version === this.version || this.editedAt > Date.parse(row.edited_at))) {
      this.version = row.version; // this device's edits are the newer ones: they replace the account copy
      return this.push();
    }
    this.dirty = false;
    if (row.version !== this.version) { this.version = row.version; this.take(this.normalize(row.state)); }
    this.persist();
    this.report('saved');
  }

  private take(s: AppState) {
    this.state = s;
    if (this.live) this.apply(s);
  }

  private persist() {
    const c: Cache = { state: this.state, version: this.version, dirty: this.dirty, editedAt: this.editedAt };
    try { localStorage.setItem(cacheKey(this.uid), JSON.stringify(c)); } catch { /* the account copy still saves */ }
  }
}

const cacheKey = (uid: string) => `cat30-sprint:v1:user:${uid}`;

function readCache(uid: string): Cache | null {
  try {
    const raw = localStorage.getItem(cacheKey(uid));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
