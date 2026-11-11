/** Lazy chunks shared between screens, so a prefetch on the landing page is reused after sign-in. */
export const loadShell = () => import('../Shell');
export const loadTrial = () => import('../pages/Trial');

/** Runs `fn` when the browser is idle (or soon, where requestIdleCallback is missing). */
export function whenIdle(fn: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 4000 });
  else window.setTimeout(fn, 1500);
}
