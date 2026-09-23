import type { ReactNode } from 'react';
import type { Section } from '../types';

export const SECTION_NAME: Record<Section, string> = {
  VARC: 'Verbal Ability & Reading Comprehension',
  DILR: 'Data Interpretation & Logical Reasoning',
  QA: 'Quantitative Aptitude',
};
export const secVar = (s: Section | 'All') => (s === 'All' ? 'var(--faint)' : `var(--${s.toLowerCase()})`);

export function SectionTag({ s }: { s: Section | 'All' }) {
  return (
    <span className="chip">
      <span className="dot" style={{ background: secVar(s) }} aria-hidden />
      {s}
    </span>
  );
}

export function DiffTag({ d }: { d: string }) {
  const bars = d === 'Easy' ? 1 : d === 'Medium' ? 2 : 3;
  return (
    <span className="chip" title={`Difficulty: ${d}`}>
      <span className="inline-flex gap-[2px]" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} style={{ width: 4, height: 10, borderRadius: 1, background: i <= bars ? 'var(--ink)' : 'var(--line)' }} />
        ))}
      </span>
      {d}
    </span>
  );
}

export function StatusPill({ tone, children }: { tone: 'good' | 'bad' | 'warn' | 'neutral' | 'accent'; children: ReactNode }) {
  const map = {
    good: ['var(--good-soft)', 'var(--good)'], bad: ['var(--bad-soft)', 'var(--bad)'], warn: ['var(--warn-soft)', 'var(--warn)'],
    neutral: ['var(--sunk)', 'var(--muted)'], accent: ['var(--accent-soft)', 'var(--accent)'],
  }[tone];
  return <span className="chip" style={{ background: map[0], color: map[1], borderColor: 'transparent' }}>{children}</span>;
}

export function PageHead({ eyebrow, title, children, actions }: { eyebrow?: string; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="label mb-1">{eyebrow}</div>}
        <h1 className="text-[1.9rem] leading-tight font-bold">{title}</h1>
        {children && <div className="mt-2 text-muted prose-cat">{children}</div>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, children, className = '', aside }: { title?: ReactNode; children: ReactNode; className?: string; aside?: ReactNode }) {
  return (
    <section className={`panel p-4 sm:p-5 ${className}`}>
      {(title || aside) && (
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function Meter({ value, max = 100, color = 'var(--accent)', label }: { value: number; max?: number; color?: string; label?: string }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="bar-track" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function Note({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warn' }) {
  return (
    <div className="rounded-lg px-3 py-2 text-sm" style={{ background: tone === 'warn' ? 'var(--warn-soft)' : 'var(--sunk)', color: tone === 'warn' ? 'var(--warn)' : 'var(--muted)' }}>
      {children}
    </div>
  );
}

/** Minimal tooltip-able wrapper for chart marks (native title for keyboard/touch + visual hover state). */
export function Reliab({ r }: { r: string }) {
  const tone = r.startsWith('Official') ? 'good' : r.startsWith('Cross') ? 'accent' : r.startsWith('Conflict') ? 'warn' : 'neutral';
  return <StatusPill tone={tone as 'good'}>{r}</StatusPill>;
}
