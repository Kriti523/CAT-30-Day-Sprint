import { supabase } from './supabase';

/** Build id (commit) set by vite.config.ts; absent in the offline build. */
const VERSION = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'offline';
const MAX_PER_PAGE = 5;
let sent = 0;
const seen = new Set<string>();

/** Page name only: the hash can briefly hold sign-in tokens, which must never be sent anywhere. */
function page() {
  const h = window.location.hash;
  return window.location.pathname + (/^#[a-z]+$/.test(h) ? h : '');
}

function describe(err: unknown): { message: string; stack?: string } {
  if (err instanceof Error) return { message: `${err.name}: ${err.message}`, stack: err.stack };
  return { message: typeof err === 'string' ? err : JSON.stringify(err) ?? String(err) };
}

/** Noise we can't act on: browser extensions, resize loops, flaky connections. */
function ignorable(message: string, stack = '') {
  return /ResizeObserver loop|Failed to fetch|NetworkError|Load failed|chrome-extension:|moz-extension:/i.test(message + stack);
}

/**
 * Sends a crash report to the `client_errors` table (signed-in users only; read them in the Supabase dashboard).
 * Never throws; at most a few distinct reports per page load.
 */
export function reportError(err: unknown, source: string) {
  try {
    const { message, stack } = describe(err);
    const sig = `${message}|${stack?.split('\n')[1] ?? ''}`;
    if (sent >= MAX_PER_PAGE || seen.has(sig) || ignorable(message, stack)) return;
    seen.add(sig);
    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session || sent >= MAX_PER_PAGE) return;
      sent++;
      return supabase.from('client_errors').insert({
        message: message.slice(0, 1000), stack: stack?.slice(0, 4000), source: source.slice(0, 100),
        page: page().slice(0, 200), user_agent: navigator.userAgent.slice(0, 400), version: VERSION,
      });
    }).catch(() => { /* reporting must never cause another error */ });
  } catch { /* ignore */ }
}

export function installErrorReporting() {
  window.addEventListener('error', (e) => reportError(e.error ?? e.message, 'window.error'));
  window.addEventListener('unhandledrejection', (e) => reportError(e.reason, 'unhandledrejection'));
}
