/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ground: 'var(--ground)', surface: 'var(--surface)', sunk: 'var(--sunk)',
        ink: 'var(--ink)', muted: 'var(--muted)', faint: 'var(--faint)', line: 'var(--line)',
        accent: 'var(--accent)', 'accent-ink': 'var(--accent-ink)', 'accent-soft': 'var(--accent-soft)',
        good: 'var(--good)', bad: 'var(--bad)', warn: 'var(--warn)',
        'good-soft': 'var(--good-soft)', 'bad-soft': 'var(--bad-soft)', 'warn-soft': 'var(--warn-soft)',
        varc: 'var(--varc)', dilr: 'var(--dilr)', qa: 'var(--qa)', mark: 'var(--mark)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
