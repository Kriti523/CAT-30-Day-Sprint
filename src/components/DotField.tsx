import { useEffect, useRef } from 'react';
import { onSchemeChange } from '../lib/theme';

/** 300 dots, one per question in the bank: 100 VARC, 100 DILR, 100 QA (coloured left to right). */
const TOTAL = 300;
const SECTION_VARS = ['--varc', '--dilr', '--qa'];

interface Dot { x: number; y: number; tx: number; ty: number; vx: number; vy: number; c: number }

/** Grid points that fall inside `text` drawn to fill a w×h box, about `TOTAL` of them, sorted left to right. */
function glyphPoints(text: string, w: number, h: number): { pts: { x: number; y: number }[]; r: number } {
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.round(w));
  off.height = Math.max(1, Math.round(h));
  const o = off.getContext('2d', { willReadFrequently: true })!;
  let size = h * 1.3; // digits are ~0.7 em tall, so this fills most of the box
  const font = (s: number) => `800 ${s}px "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif`;
  o.font = font(size);
  const width = o.measureText(text).width;
  if (width > w * 0.94) size *= (w * 0.94) / width;
  o.font = font(size);
  o.textAlign = 'center';
  o.textBaseline = 'middle';
  o.fillText(text, w / 2, h / 2 + size * 0.05);
  const img = o.getImageData(0, 0, off.width, off.height).data;
  const inside = (x: number, y: number) => img[(Math.round(y) * off.width + Math.round(x)) * 4 + 3] > 128;

  let filled = 0;
  for (let y = 0; y < off.height; y += 2) for (let x = 0; x < off.width; x += 2) if (inside(x, y)) filled++;
  let step = Math.max(2, Math.sqrt((filled * 4) / TOTAL));
  let pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 12; i++) {
    pts = [];
    for (let y = step / 2; y < off.height; y += step) {
      for (let x = step / 2; x < off.width; x += step) if (inside(x, y)) pts.push({ x, y });
    }
    if (pts.length >= TOTAL) break;
    step *= 0.93;
  }
  if (pts.length > TOTAL) { // keep an even spread of exactly TOTAL
    const k = pts.length / TOTAL;
    pts = Array.from({ length: TOTAL }, (_, i) => pts[Math.floor(i * k)]);
  }
  while (pts.length && pts.length < TOTAL) pts.push(pts[pts.length % Math.max(1, pts.length)]);
  pts.sort((a, b) => a.x - b.x || a.y - b.y);
  return { pts, r: step * 0.36 };
}

/**
 * A number drawn with 300 coloured dots that fly into place and scatter away from the pointer.
 * Static (no motion) when the visitor prefers reduced motion.
 */
export function DotField({ text, label, className = '' }: { text: string; label: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let dots: Dot[] = [];
    let radius = 3, w = 0, h = 0, raf = 0, alive = true;
    let colors = ['#2a78d6', '#eb6834', '#1baf7a'];
    const pointer = { x: -1e4, y: -1e4 };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = SECTION_VARS.map((v, i) => cs.getPropertyValue(v).trim() || colors[i]);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = colors[c];
        ctx.beginPath();
        for (const d of dots) {
          if (d.c !== c) continue;
          ctx.moveTo(d.x + radius, d.y);
          ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const step = () => {
      raf = 0;
      let moving = false;
      const reach = Math.max(60, radius * 18);
      for (const d of dots) {
        let ax = (d.tx - d.x) * 0.06, ay = (d.ty - d.y) * 0.06;
        const dx = d.x - pointer.x, dy = d.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < reach * reach) {
          const dist = Math.sqrt(dist2) || 1;
          const push = (1 - dist / reach) * 3.2;
          ax += (dx / dist) * push; ay += (dy / dist) * push;
        }
        d.vx = (d.vx + ax) * 0.8;
        d.vy = (d.vy + ay) * 0.8;
        d.x += d.vx; d.y += d.vy;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02 || Math.abs(d.tx - d.x) + Math.abs(d.ty - d.y) > 0.3) moving = true;
      }
      draw();
      if (moving && alive) raf = requestAnimationFrame(step);
    };
    const wake = () => { if (!raf && alive && !still) raf = requestAnimationFrame(step); };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const { pts, r } = glyphPoints(text, w, h);
      radius = r;
      const fresh = dots.length === 0;
      dots = pts.map((p, i) => {
        const prev = dots[i];
        const start = still ? p : prev ?? { x: w / 2 + (Math.random() - 0.5) * w * 1.4, y: h / 2 + (Math.random() - 0.5) * h * 1.4 };
        return { x: start.x, y: start.y, tx: p.x, ty: p.y, vx: 0, vy: 0, c: Math.min(2, Math.floor((i / pts.length) * 3)) };
      });
      if (still || !fresh) draw();
      wake();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top;
      wake();
    };
    const onLeave = () => { pointer.x = pointer.y = -1e4; wake(); };

    readColors();
    // Wait for the display font so the digits keep their shape (fall back after a moment).
    const fontReady = document.fonts?.load('800 100px "Bricolage Grotesque"') ?? Promise.resolve();
    void Promise.race([fontReady, new Promise((r) => setTimeout(r, 1200))]).then(() => { if (alive) layout(); });

    const ro = new ResizeObserver(() => { if (dots.length) layout(); });
    ro.observe(canvas);
    if (!still) {
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerdown', onMove);
      canvas.addEventListener('pointerleave', onLeave);
      canvas.addEventListener('pointerup', onLeave);
    }
    const offScheme = onSchemeChange(() => { readColors(); draw(); });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      offScheme();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerup', onLeave);
    };
  }, [text]);

  return <canvas ref={ref} role="img" aria-label={label} className={`block h-full w-full touch-pan-y ${className}`} />;
}
