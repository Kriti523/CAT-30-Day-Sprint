import { useState } from 'react';

/** Formats a result the way a basic calculator shows it: no float noise, at most 12 significant digits. */
const fmt = (n: number) => (Number.isFinite(n) ? String(parseFloat(n.toPrecision(12))) : 'Error');

type Op = '+' | '−' | '×' | '÷';
const apply = (a: number, op: Op, b: number) => (op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b);

/** The CAT's on-screen calculator: a basic, mouse-only calculator with memory, √, % and 1/x. */
export function Calculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);   // the next digit starts a new number
  const [mem, setMem] = useState(0);
  const cur = () => Number(display);
  const show = (n: number) => { setDisplay(fmt(n)); setFresh(true); };

  const digit = (d: string) => {
    if (display === 'Error') { setDisplay(d === '.' ? '0.' : d); setFresh(false); return; }
    if (fresh) { setDisplay(d === '.' ? '0.' : d); setFresh(false); return; }
    if (d === '.' && display.includes('.')) return;
    if (display.replace(/[-.]/g, '').length >= 14) return;
    setDisplay(display === '0' && d !== '.' ? d : display + d);
  };
  const binary = (next: Op) => {
    if (op && acc !== null && !fresh) { const r = apply(acc, op, cur()); show(r); setAcc(r); }
    else { setAcc(cur()); setFresh(true); }
    setOp(next);
  };
  const equals = () => { if (op && acc !== null) { show(apply(acc, op, cur())); setAcc(null); setOp(null); } };
  const unary = (f: (x: number) => number) => show(f(cur()));
  const percent = () => show(op && acc !== null && (op === '+' || op === '−') ? (acc * cur()) / 100 : cur() / 100);
  const back = () => { if (!fresh && display !== 'Error') setDisplay(display.length > 1 && display !== '-0' ? display.slice(0, -1).replace(/^-$/, '0') : '0'); };
  const clearAll = () => { setDisplay('0'); setAcc(null); setOp(null); setFresh(true); };

  const keys: [string, () => void, string?][][] = [
    [['MC', () => setMem(0), 'Clear memory'], ['MR', () => show(mem), 'Recall memory'], ['MS', () => setMem(cur()), 'Store in memory'], ['M+', () => setMem(mem + cur()), 'Add to memory'], ['M−', () => setMem(mem - cur()), 'Subtract from memory']],
    [['←', back, 'Backspace'], ['CE', () => { setDisplay('0'); setFresh(true); }, 'Clear entry'], ['C', clearAll, 'Clear all'], ['±', () => setDisplay(display.startsWith('-') ? display.slice(1) : display === '0' ? '0' : '-' + display), 'Change sign'], ['√', () => unary(Math.sqrt), 'Square root']],
    [['7', () => digit('7')], ['8', () => digit('8')], ['9', () => digit('9')], ['÷', () => binary('÷'), 'Divide'], ['%', percent, 'Percent']],
    [['4', () => digit('4')], ['5', () => digit('5')], ['6', () => digit('6')], ['×', () => binary('×'), 'Multiply'], ['1/x', () => unary((x) => 1 / x), 'Reciprocal']],
    [['1', () => digit('1')], ['2', () => digit('2')], ['3', () => digit('3')], ['−', () => binary('−'), 'Subtract'], ['=', equals, 'Equals']],
    [['0', () => digit('0')], ['.', () => digit('.'), 'Decimal point'], ['+', () => binary('+'), 'Add']],
  ];

  return (
    <div className="calc panel lift no-print" role="dialog" aria-label="Calculator">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="label">Calculator</span>
        <button className="btn btn-sm btn-ghost" onClick={onClose} aria-label="Close calculator">✕</button>
      </div>
      <div className="calc-screen num" aria-live="polite">
        <span className="text-xs text-muted">{mem !== 0 ? 'M' : ''}{acc !== null && op ? ` ${fmt(acc)} ${op}` : ''}</span>
        <span className="text-2xl font-semibold">{display}</span>
      </div>
      <div className="calc-keys">
        {keys.flat().map(([label, fn, aria]) => (
          <button key={label} type="button" className={`calc-key ${/^[0-9.]$/.test(label) ? 'is-digit' : ''} ${label === '=' ? 'is-eq' : ''} ${label === '0' ? 'is-zero' : ''}`}
            onClick={fn} aria-label={aria ?? label}>{label}</button>
        ))}
      </div>
    </div>
  );
}
