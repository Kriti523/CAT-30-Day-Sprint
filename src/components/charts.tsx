import { useState, type ReactNode } from 'react';

export const CAT = ['var(--cat-1)', 'var(--cat-2)', 'var(--cat-3)', 'var(--cat-4)', 'var(--cat-5)'];
export const SEQ3 = ['var(--seq-1)', 'var(--seq-2)', 'var(--seq-4)'];

interface Series { name: string; values: number[]; color: string }

function Legend({ series }: { series: { name: string; color: string }[] }) {
  if (series.length < 2) return null;
  return (
    <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
      {series.map((s) => (
        <span key={s.name} className="inline-flex items-center gap-1.5">
          <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, display: 'inline-block' }} />
          {s.name}
        </span>
      ))}
    </div>
  );
}

function Tip({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute z-10 rounded-md px-2 py-1 text-xs lift"
      style={{ left: `${x}%`, top: y, transform: 'translate(-50%, -110%)', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
      {children}
    </div>
  );
}

const niceMax = (m: number) => {
  if (m <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(m)));
  const n = m / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};

/** Vertical grouped bars. One y-scale, recessive grid, 2px gap between adjacent bars, hover tooltip per bar. */
export function GroupedBars({ categories, series, height = 240, unit = '', ariaLabel }: { categories: string[]; series: Series[]; height?: number; unit?: string; ariaLabel: string }) {
  const [hover, setHover] = useState<{ c: number; s: number } | null>(null);
  const W = 640, H = height, padL = 34, padR = 8, padT = 10, padB = 46;
  const max = niceMax(Math.max(...series.flatMap((s) => s.values)));
  const div = [5, 4, 2].find((d) => Number.isInteger(max / d)) ?? 4;
  const ticks = Array.from({ length: div + 1 }, (_, i) => (i * max) / div);
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const groupW = plotW / categories.length;
  const gap = 2;
  const barW = Math.min(28, (groupW * 0.72 - gap * (series.length - 1)) / series.length);
  const y = (v: number) => padT + plotH - (v / max) * plotH;
  const barX = (c: number, s: number) => padL + c * groupW + (groupW - (barW * series.length + gap * (series.length - 1))) / 2 + s * (barW + gap);
  return (
    <div>
      <Legend series={series} />
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={1} />
              <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--faint)" className="num">{+t.toFixed(1)}</text>
            </g>
          ))}
          {categories.map((cat, c) => (
            <g key={cat}>
              {series.map((s, si) => {
                const v = s.values[c];
                const h = Math.max(0, (v / max) * plotH);
                const x = barX(c, si);
                const r = Math.min(4, barW / 2, h);
                const active = hover && hover.c === c && hover.s === si;
                return (
                  <g key={s.name} onMouseEnter={() => setHover({ c, s: si })} onMouseLeave={() => setHover(null)}>
                    <rect x={x - 3} y={padT} width={barW + 6} height={plotH} fill="transparent" />
                    <path
                      d={`M${x},${y(0)} V${y(0) - h + r} Q${x},${y(0) - h} ${x + r},${y(0) - h} H${x + barW - r} Q${x + barW},${y(0) - h} ${x + barW},${y(0) - h + r} V${y(0)} Z`}
                      fill={s.color} opacity={hover && !active ? 0.55 : 1}>
                      <title>{`${cat} · ${s.name}: ${v}${unit}`}</title>
                    </path>
                  </g>
                );
              })}
              <foreignObject x={padL + c * groupW} y={H - padB + 6} width={groupW} height={padB - 6}>
                <div style={{ fontSize: 11, lineHeight: 1.15, color: 'var(--muted)', textAlign: 'center', padding: '0 2px' }}>{cat}</div>
              </foreignObject>
            </g>
          ))}
          <line x1={padL} x2={W - padR} y1={y(0)} y2={y(0)} stroke="var(--faint)" strokeWidth={1} />
        </svg>
        {hover && (
          <Tip x={((barX(hover.c, hover.s) + barW / 2) / W) * 100} y={0}>
            <strong>{series[hover.s].name}</strong> · {categories[hover.c]}: <span className="num">{series[hover.s].values[hover.c]}{unit}</span>
          </Tip>
        )}
      </div>
    </div>
  );
}

/** Donut with direct percentage labels in the legend list (identity never by colour alone). */
export function Donut({ labels, values, title }: { labels: string[]; values: number[]; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = values.reduce((a, b) => a + b, 0);
  const R = 70, r = 42, C = 90;
  let acc = 0;
  const arcs = values.map((v, i) => {
    const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2; acc += v;
    const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (rad: number, ang: number) => `${C + rad * Math.cos(ang)},${C + rad * Math.sin(ang)}`;
    return { i, d: `M${p(R, a0)} A${R},${R} 0 ${large} 1 ${p(R, a1)} L${p(r, a1)} A${r},${r} 0 ${large} 0 ${p(r, a0)} Z` };
  });
  return (
    <figure className="flex flex-wrap items-center gap-4">
      <svg viewBox="0 0 180 180" width={160} height={160} role="img" aria-label={title} className="max-w-full">
        {arcs.map((a) => (
          <path key={a.i} d={a.d} fill={CAT[a.i % CAT.length]} stroke="var(--surface)" strokeWidth={2}
            opacity={hover !== null && hover !== a.i ? 0.5 : 1} onMouseEnter={() => setHover(a.i)} onMouseLeave={() => setHover(null)}>
            <title>{`${labels[a.i]}: ${values[a.i]}%`}</title>
          </path>
        ))}
        <text x={C} y={C - 2} textAnchor="middle" fontSize="12" fill="var(--muted)">{hover !== null ? labels[hover] : 'Total'}</text>
        <text x={C} y={C + 15} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ink)" className="num">{hover !== null ? `${values[hover]}%` : `${total}%`}</text>
      </svg>
      <figcaption className="min-w-[9rem]">
        <div className="mb-1 text-sm font-semibold">{title}</div>
        <ul className="space-y-0.5 text-sm">
          {labels.map((l, i) => (
            <li key={l} className="flex items-center gap-2" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: CAT[i % CAT.length] }} />
              <span className="flex-1">{l}</span>
              <span className="num text-muted">{values[i]}%</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

/** Line chart for score history. 2px lines, ≥8px markers with a surface ring, crosshair tooltip. */
export function LineChart({ labels, series, ariaLabel, height = 220 }: { labels: string[]; series: Series[]; ariaLabel: string; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = height, padL = 36, padR = 14, padT = 12, padB = 30;
  const all = series.flatMap((s) => s.values);
  const max = niceMax(Math.max(1, ...all));
  const min = Math.min(0, ...all);
  const x = (i: number) => padL + (labels.length === 1 ? (W - padL - padR) / 2 : (i * (W - padL - padR)) / (labels.length - 1));
  const y = (v: number) => padT + (H - padT - padB) * (1 - (v - min) / (max - min || 1));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => min + f * (max - min));
  return (
    <div>
      <Legend series={series} />
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}
          onMouseLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--line)" />
              <text x={padL - 6} y={y(t) + 4} fontSize="11" textAnchor="end" fill="var(--faint)" className="num">{Math.round(t)}</text>
            </g>
          ))}
          {labels.map((l, i) => (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={x(i) - 20} y={padT} width={40} height={H - padT - padB} fill="transparent" />
              <text x={x(i)} y={H - 10} fontSize="11" textAnchor="middle" fill="var(--muted)">{l}</text>
            </g>
          ))}
          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="var(--faint)" strokeDasharray="3 3" />}
          {series.map((s) => (
            <g key={s.name}>
              <polyline points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={i === s.values.length - 1 || hover === i ? 5 : 4} fill={s.color} stroke="var(--surface)" strokeWidth={2} />
              ))}
            </g>
          ))}
        </svg>
        {hover !== null && (
          <Tip x={(x(hover) / W) * 100} y={0}>
            <strong>{labels[hover]}</strong>{series.map((s) => <span key={s.name}> · {s.name} <span className="num">{s.values[hover]}</span></span>)}
          </Tip>
        )}
      </div>
    </div>
  );
}
