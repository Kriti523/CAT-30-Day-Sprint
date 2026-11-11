import { useEffect, useState } from 'react';

/** "system" follows the OS; light/dark pin it via <html data-theme> (see the tokens in index.css). */
export type ThemePref = 'system' | 'light' | 'dark';

export const THEME_KEY = 'cat30-sprint:theme';
const EVENT = 'cat30-themechange';

export function getTheme(): ThemePref {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'light' || t === 'dark' ? t : 'system';
  } catch { return 'system'; }
}

export function applyTheme(t: ThemePref) {
  if (t === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

export function setTheme(t: ThemePref) {
  try {
    if (t === 'system') localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY, t);
  } catch { /* blocked storage: the choice lasts for this page only */ }
  applyTheme(t);
  window.dispatchEvent(new Event(EVENT));
}

/** Whether the page is currently drawn dark, whatever the preference. */
export function isDark() {
  const t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function useTheme(): [ThemePref, (t: ThemePref) => void] {
  const [pref, setPref] = useState(getTheme);
  useEffect(() => {
    const on = () => setPref(getTheme());
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return [pref, setTheme];
}

/** Re-runs `fn` whenever the drawn scheme changes (preference or OS setting), e.g. to repaint a canvas. */
export function onSchemeChange(fn: () => void): () => void {
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
  mq?.addEventListener?.('change', fn);
  window.addEventListener(EVENT, fn);
  return () => { mq?.removeEventListener?.('change', fn); window.removeEventListener(EVENT, fn); };
}
