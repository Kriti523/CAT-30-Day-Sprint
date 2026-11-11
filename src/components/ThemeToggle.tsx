import { useTheme, type ThemePref } from '../lib/theme';

const ICONS: Record<ThemePref, JSX.Element> = {
  light: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
};
const LABEL: Record<ThemePref, string> = { light: 'Light', system: 'Match device', dark: 'Dark' };

/** Three-way light / device / dark switch. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [pref, setPref] = useTheme();
  return (
    <div role="radiogroup" aria-label="Colour theme" className={`inline-flex rounded-full p-0.5 ${className}`} style={{ background: 'var(--sunk)' }}>
      {(['light', 'system', 'dark'] as ThemePref[]).map((t) => {
        const on = pref === t;
        return (
          <button key={t} type="button" role="radio" aria-checked={on} aria-label={LABEL[t]} title={LABEL[t]} onClick={() => setPref(t)}
            className="grid h-7 w-7 place-items-center rounded-full"
            style={on ? { background: 'var(--surface)', color: 'var(--ink)', boxShadow: 'var(--shadow)' } : { color: 'var(--muted)' }}>
            {ICONS[t]}
          </button>
        );
      })}
    </div>
  );
}
