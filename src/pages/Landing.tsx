import { Suspense, lazy, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode, type RefObject } from 'react';
import { DotField } from '../components/DotField';
import { ThemeToggle } from '../components/ThemeToggle';
import { loadTrial } from '../lib/chunks';
import { NEXT_EXAM, QA_BROAD } from '../data/research';

const Trial = lazy(loadTrial);

/* ---------------- facts shown on the page (kept in step with the app's data) ---------------- */

function daysToExam() {
  const [y, m, d] = NEXT_EXAM.date.split('-').map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86_400_000);
}

const TOPICS = [
  'Profit, Loss & Discount', 'Para jumble', 'Circular arrangement', 'Time, Speed & Distance', 'Inference', 'Three-set Venn',
  'Quadratic Equations', 'Odd sentence out', 'Round-robin points table', 'Remainders & Cyclicity', 'Tone / attitude',
  'Mixtures & Alligation', 'Shortest paths', 'Coordinate Geometry', 'Para summary', 'Probability', 'Knockout bracket',
  'Logarithms, Surds & Indices', 'Sentence placement', 'Day-slot scheduling', 'Ratio & Proportion', "Author's view",
];

/** The four weeks of the plan (src/data/plan.ts PHASES), as lanes on a track. */
const PHASES = [
  { lane: 1, name: 'Diagnosis & fundamentals', days: 'Days 1–7', goal: 'Find your baseline in all three sections, repair arithmetic and start an error log.', w: '23%', c: 'var(--varc)' },
  { lane: 2, name: 'High-weightage topics', days: 'Days 8–14', goal: 'Algebra, geometry, number systems and the core DILR set types, with first timed blocks.', w: '47%', c: 'var(--dilr)' },
  { lane: 3, name: 'Sectional practice & selection', days: 'Days 15–21', goal: '40-minute sectionals, choosing which DILR sets to attempt, and triaging hard questions.', w: '70%', c: 'var(--qa)' },
  { lane: 4, name: 'Mocks, revision & exam strategy', days: 'Days 22–30', goal: 'Full mocks with analysis, the reattempt queue and a fixed exam-day plan. No new topics late.', w: '100%', c: 'var(--accent)' },
];

/* ---------------- small helpers ---------------- */

/** Adds .is-in to [data-reveal] elements as they scroll into view. */
function useReveal(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-reveal]') ?? []);
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [root]);
}

/** In-page links scroll smoothly without touching the URL hash (the hash picks landing vs login). */
function jump(id: string) {
  return (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-[3px]" aria-hidden>
        <span className="dot" style={{ background: 'var(--varc)', width: 9, height: 9 }} />
        <span className="dot" style={{ background: 'var(--dilr)', width: 9, height: 9 }} />
        <span className="dot" style={{ background: 'var(--qa)', width: 9, height: 9 }} />
      </span>
      <span className="display text-lg font-bold leading-none">CAT Sprint</span>
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="label mb-3" style={{ letterSpacing: '0.14em' }}>{children}</div>;
}

/* ---------------- page ---------------- */

export default function Landing() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const days = daysToExam();
  const counting = days > 0;
  const examDay = days === 0;
  // What the dots (and the race bib) spell: the countdown, "GO" on exam day, then the size of the bank.
  const big = counting ? String(days) : examDay ? 'GO' : '300';
  const [trial, setTrial] = useState(false);

  return (
    <div ref={root} className="landing min-h-screen">
      {/* Nav */}
      <header className="landing-nav sticky top-0 z-30 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 sm:px-6">
          <a href="#" onClick={jump('top')} aria-label="CAT Sprint home"><Logo /></a>
          <nav className="ml-6 hidden gap-5 text-sm font-semibold md:flex" aria-label="On this page">
            <a href="#try" onClick={jump('try')} style={{ color: 'var(--ink)' }}>Try it</a>
            <a href="#how" onClick={jump('how')} style={{ color: 'var(--ink)' }}>How it works</a>
            <a href="#inside" onClick={jump('inside')} style={{ color: 'var(--ink)' }}>What's inside</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <a href="#login" className="btn btn-ghost btn-sm">Log in</a>
            <a href="#signup" className="btn btn-primary btn-sm">Start free</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="lanes relative">
        <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-6 lg:pb-24 lg:pt-20">
          <div className="relative z-10">
            <div className="chip mb-6" style={{ background: 'var(--surface)' }}>
              <span className="live-dot" aria-hidden />
              {counting ? <>CAT {NEXT_EXAM.year} · {NEXT_EXAM.label.split(' (')[0]}</> : examDay ? <>CAT {NEXT_EXAM.year} is today · good luck</> : <>Start early for next year's CAT</>}
            </div>
            <h1 className="hero-title display">
              {counting ? <>Every question counts.<br /><em className="swash">So does every day.</em></>
                : examDay ? <>Today's the day.<br /><em className="swash">Trust your practice.</em></>
                : <>Three hundred questions.<br /><em className="swash">One focused plan.</em></>}
            </h1>
            {examDay ? (
              <p className="mt-6 max-w-[34rem] text-lg text-muted">
                Admit card, original photo ID, an early start. In the hall: read each question twice, leave a set that isn't opening up,
                and take a breath between sections. <strong style={{ color: 'var(--ink)' }}>You've done the work.</strong>
              </p>
            ) : (
              <p className="mt-6 max-w-[34rem] text-lg text-muted">
                A CAT plan built for people with a day job: <strong style={{ color: 'var(--ink)' }}>300 original questions</strong> with step-by-step solutions,
                timed 40-minute sectionals, an error log that brings your mistakes back, and a day-by-day plan that fits around work.
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#try" onClick={(e) => { jump('try')(e); setTrial(true); }} className="btn btn-primary px-5 py-2.5 text-base">{examDay ? 'Warm up with 3 questions' : 'Try 3 questions, no sign-up'}</a>
              <a href="#signup" className="btn px-5 py-2.5 text-base">Create free account</a>
            </div>
            <p className="mt-4 text-sm text-muted">Free · phone and laptop · progress syncs to your account</p>
          </div>

          <div className="relative" data-reveal style={d(0.1)}>
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
              <DotField text={big}
                label={counting ? `${days} ${days === 1 ? 'day' : 'days'} to CAT, drawn with 300 dots, one per question` : examDay ? 'GO: exam day, drawn with 300 dots, one per question' : '300, drawn with one dot per question'} />
            </div>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3 px-1">
              <div>
                <div className="num text-sm font-semibold uppercase tracking-widest">{counting ? `${days} ${days === 1 ? 'day' : 'days'} to CAT` : examDay ? 'Exam day' : '300 questions'}</div>
                <div className="text-xs text-muted">Each dot is one question in the bank. Run a finger or cursor through them.</div>
              </div>
              <div className="flex gap-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5"><span className="dot" style={{ background: 'var(--varc)' }} />VARC 100</span>
                <span className="inline-flex items-center gap-1.5"><span className="dot" style={{ background: 'var(--dilr)' }} />DILR 100</span>
                <span className="inline-flex items-center gap-1.5"><span className="dot" style={{ background: 'var(--qa)' }} />QA 100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic ticker */}
      <div className="ticker border-y py-3" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className={`flex shrink-0 ${copy ? 'ticker-dup' : ''}`} aria-hidden={copy ? true : undefined} aria-label={copy ? undefined : 'Topics covered'}>
              {TOPICS.map((t, i) => (
                <li key={t} className="num flex items-center whitespace-nowrap px-4 text-xs uppercase tracking-widest text-muted">
                  <span className="dot mr-3" style={{ background: ['var(--qa)', 'var(--varc)', 'var(--dilr)'][i % 3], width: 6, height: 6 }} aria-hidden />{t}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Try it */}
      <section id="try" className="scroll-mt-16">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
          <div data-reveal>
            <Eyebrow>Try before you sign up</Eyebrow>
            <h2 className="display text-4xl font-bold leading-[1.05] sm:text-5xl">Three questions.<br />One from each section.</h2>
            <p className="mt-5 max-w-md text-muted">Each one is timed against a target solving time. Then see the full solution, a faster method and the trap each question sets.</p>
            <ul className="mt-6 grid gap-2 text-sm">
              <li className="flex items-center gap-2"><span className="dot" style={{ background: 'var(--qa)' }} /> QA · Profit, loss & discount</li>
              <li className="flex items-center gap-2"><span className="dot" style={{ background: 'var(--varc)' }} /> VARC · Para completion</li>
              <li className="flex items-center gap-2"><span className="dot" style={{ background: 'var(--dilr)' }} /> DILR · A revenue-vs-expenses data set</li>
            </ul>
          </div>
          <div data-reveal style={d(0.1)}>
            {trial ? (
              <Suspense fallback={<div className="panel lift grid min-h-[320px] place-items-center text-sm text-muted" role="status">Loading questions…</div>}>
                <Trial />
              </Suspense>
            ) : (
              <div className="panel lift relative overflow-hidden p-6 sm:p-8">
                <div className="bib-band absolute inset-x-0 top-0 h-1.5" aria-hidden />
                <div className="flex items-baseline justify-between gap-4">
                  <div className="label">Warm-up</div>
                  <div className="num text-sm text-muted">≈ 5 min</div>
                </div>
                <div className="display mt-3 text-3xl font-bold">Ready when you are.</div>
                <p className="mt-2 text-muted">No account needed. A stopwatch starts with each question.</p>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  {[['QA', 'var(--qa)', 'MCQ'], ['VARC', 'var(--varc)', 'MCQ'], ['DILR', 'var(--dilr)', 'Type-in']].map(([s, c, t], n) => (
                    <div key={s} className="rounded-lg border px-2 py-3" style={{ borderColor: 'var(--line)' }}>
                      <div className="num text-xs text-muted">Q{n + 1}</div>
                      <div className="font-bold" style={{ color: c }}>{s}</div>
                      <div className="text-xs text-muted">{t}</div>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-primary mt-6 w-full justify-center py-2.5 text-base"
                  onMouseEnter={() => { void loadTrial(); }} onFocus={() => { void loadTrial(); }} onClick={() => setTrial(true)}>
                  Start the warm-up
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works: lanes */}
      <section id="how" className="scroll-mt-16" style={{ background: 'var(--surface)' }}>
        <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6" data-reveal>
            <div>
              <Eyebrow>How the sprint runs</Eyebrow>
              <h2 className="display text-4xl font-bold leading-[1.05] sm:text-5xl">Four laps. One finish line.</h2>
            </div>
            <p className="max-w-sm text-muted">Two hours on weekdays, longer on weekends, and a 45-minute fallback for the days work wins. Mark a day busy and the plan bends instead of breaking.</p>
          </div>
          <ol>
            {PHASES.map((p, n) => (
              <li key={p.lane} className="lane grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 py-6 sm:grid-cols-[auto_1fr_auto] sm:gap-x-8" data-reveal style={d(n * 0.08)}>
                <span className="lane-no" aria-hidden>{p.lane}</span>
                <div className="min-w-0">
                  <div className="num text-xs font-semibold uppercase tracking-widest" style={{ color: p.c }}>Week {p.lane} · {p.days}</div>
                  <div className="display mt-1 text-xl font-bold sm:text-2xl">{p.name}</div>
                  <p className="mt-1 max-w-2xl text-muted">{p.goal}</p>
                </div>
                <span className="finish hidden sm:block" aria-hidden />
                <span className="lane-run" style={{ background: p.c, '--w': p.w, '--d': `${0.2 + n * 0.15}s` } as CSSProperties} aria-hidden />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What's inside: bento */}
      <section id="inside" className="scroll-mt-16">
        <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:py-24">
          <div data-reveal>
            <Eyebrow>What's inside</Eyebrow>
            <h2 className="display max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl">Everything a working candidate needs. Nothing they don't.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-6">
            {/* Question bank */}
            <div className="tile panel p-6 md:col-span-4" data-reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="label">Question bank</div>
                  <div className="num mt-2 text-6xl font-semibold leading-none sm:text-7xl">300</div>
                </div>
                <p className="max-w-xs text-sm text-muted">Original questions, each with a step-by-step solution, a fast method, the common trap and a revision note.</p>
              </div>
              <div className="mt-6 flex h-3 overflow-hidden rounded-full" aria-hidden>
                <span className="flex-1" style={{ background: 'var(--varc)' }} /><span className="flex-1" style={{ background: 'var(--dilr)' }} /><span className="flex-1" style={{ background: 'var(--qa)' }} />
              </div>
              <div className="mt-2 grid grid-cols-3 text-xs text-muted">
                <span>VARC · 16 passages + 36 VA</span><span className="text-center">DILR · 20 sets × 5</span><span className="text-right">QA · 100 questions</span>
              </div>
            </div>

            {/* Sectional timer */}
            <div className="tile panel flex items-center gap-5 p-6 md:col-span-2" data-reveal style={d(0.08)}>
              <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0" aria-hidden>
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--sunk)" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="66" transform="rotate(-90 50 50)" />
                <text x="50" y="56" textAnchor="middle" fontSize="18" fontWeight="600" fill="var(--ink)" fontFamily="JetBrains Mono, monospace">40:00</text>
              </svg>
              <div>
                <div className="label">Sectional tests</div>
                <p className="mt-1 text-sm">Timed 40-minute sections with CAT marking: <span className="num">+3</span>, <span className="num">−1</span> for a wrong MCQ, nothing lost on type-in answers.</p>
              </div>
            </div>

            {/* Error log */}
            <div className="tile panel p-6 md:col-span-2" data-reveal>
              <div className="label">Error log</div>
              <p className="mt-1 text-sm">Every miss gets a reason and comes back in your reattempt queue until you get it right.</p>
              <div className="mt-4 grid gap-2">
                {[['Q028', 'Time & Work', 'Calculation slip', 'var(--qa)'], ['V076', 'Para jumble', 'Misread question', 'var(--varc)'], ['D032', 'Round-robin points table', 'Trap option', 'var(--dilr)']].map(([id, t, r, c], n) => (
                  <div key={id} className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--line)', background: 'var(--ground)', marginLeft: n * 10 }}>
                    <span className="dot" style={{ background: c }} />
                    <span className="num text-xs text-muted">{id}</span>
                    <span className="min-w-0 flex-1 truncate">{t}</span>
                    <span className="chip" style={{ background: 'var(--bad-soft)', color: 'var(--bad)', borderColor: 'transparent' }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Paper trends */}
            <div className="tile panel p-6 md:col-span-2" data-reveal style={d(0.08)}>
              <div className="label">Paper trends</div>
              <p className="mt-1 text-sm">What CAT {QA_BROAD.years[QA_BROAD.years.length - 1].year} actually asked in QA, summed over its three slots.</p>
              <div className="mt-4 grid gap-1.5">
                {QA_BROAD.categories.map((c, i) => {
                  const v = QA_BROAD.years[QA_BROAD.years.length - 1].values[i];
                  return (
                    <div key={c} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-2 text-xs">
                      <span className="truncate text-muted">{c}</span>
                      <span className="h-2 rounded-full" style={{ background: 'var(--sunk)' }}>
                        <span className="block h-2 rounded-full" style={{ width: `${(v / 25) * 100}%`, background: 'var(--qa)' }} />
                      </span>
                      <span className="num text-right">{v}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formula sheets */}
            <div className="tile panel p-6 md:col-span-2" data-reveal style={d(0.16)}>
              <div className="label">Formula sheets</div>
              <p className="mt-1 text-sm">One page per topic, ready to print for the last week.</p>
              <div className="num mt-4 grid gap-2 rounded-lg p-3 text-[0.82rem]" style={{ background: 'var(--sunk)' }}>
                <span>a% then b% → a + b + ab/100</span>
                <span>SP = MP × (1 − d/100)</span>
                <span>ⁿCᵣ = n! / (r! (n − r)!)</span>
              </div>
            </div>

            {/* Sync */}
            <div className="tile panel flex flex-wrap items-center gap-6 p-6 md:col-span-3" data-reveal>
              <svg viewBox="0 0 120 70" className="h-16 w-28 shrink-0" aria-hidden fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round">
                <rect x="4" y="8" width="66" height="44" rx="5" /><path d="M0 60h74" strokeLinecap="round" />
                <rect x="88" y="14" width="28" height="50" rx="6" />
                <path d="M74 30c6-8 10-8 14-6" stroke="var(--accent)" strokeDasharray="4 4" strokeLinecap="round" />
              </svg>
              <div className="min-w-0 flex-1">
                <div className="label">Your account</div>
                <p className="mt-1 text-sm">Answer a question on your phone at lunch, pick up on your laptop at night. Progress syncs, and still works offline.</p>
              </div>
            </div>

            {/* Mock analysis */}
            <div className="tile panel p-6 md:col-span-3" data-reveal style={d(0.08)}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="label">Mock analysis</div>
                  <p className="mt-1 max-w-xs text-sm">Log every mock: attempts, accuracy, time sinks and the one thing to fix next.</p>
                </div>
                <svg viewBox="0 0 120 50" className="h-14 w-32 shrink-0" aria-hidden fill="none">
                  <polyline points="2,42 22,36 42,38 62,26 82,22 102,12 118,8" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {[[2, 42], [22, 36], [42, 38], [62, 26], [82, 22], [102, 12], [118, 8]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />)}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="manifesto">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:py-24">
          <div data-reveal>
            <div className="quote-mark" aria-hidden>“</div>
            <p className="display -mt-6 text-3xl font-bold leading-tight sm:text-5xl">You don't need more study material. You need a system.</p>
            <p className="mt-5 max-w-lg opacity-75">Preparing for CAT while working full-time isn't a content problem. It's a question of what to do tonight, in how long, and what to do again next week.</p>
          </div>
          <dl className="grid content-center gap-6 sm:grid-cols-3 lg:grid-cols-1" data-reveal style={d(0.1)}>
            {[['2 hrs', 'on weekdays'], ['4–5 hrs', 'on Saturdays and Sundays'], ['45 min', 'fallback when work wins']].map(([n, t]) => (
              <div key={t} className="border-l-4 pl-4" style={{ borderColor: 'var(--dilr)' }}>
                <dt className="num text-3xl font-semibold">{n}</dt>
                <dd className="opacity-75">{t}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA: race bib */}
      <section>
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div data-reveal>
            <Eyebrow>Your number</Eyebrow>
            <h2 className="display text-4xl font-bold leading-[1.05] sm:text-6xl">Pin it on.<br />{examDay ? 'Run your race.' : 'Start the sprint.'}</h2>
            <p className="mt-5 max-w-md text-lg text-muted">
              {counting ? <>{days} {days === 1 ? 'day is' : 'days are'} enough to move your percentile, if every one of them has a plan. It's free to start.</>
                : examDay ? <>It's race day. Go and do what you practised, then come back for what comes next.</>
                : <>Start months ahead and the last 30 days become revision, not panic. It's free to start.</>}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#signup" className="btn btn-primary px-5 py-2.5 text-base">Create free account</a>
              <a href="#login" className="btn px-5 py-2.5 text-base">I already have one</a>
            </div>
          </div>
          <div className="flex justify-center" data-reveal style={d(0.15)}>
            <a href="#signup" className="bib block w-full max-w-[380px] overflow-hidden" aria-label="Create a free account">
              <span className="bib-pin" style={{ top: 18, left: 16 }} /><span className="bib-pin" style={{ top: 18, right: 16 }} />
              <span className="bib-pin" style={{ bottom: 18, left: 16 }} /><span className="bib-pin" style={{ bottom: 18, right: 16 }} />
              <div className="bib-band h-3" />
              <div className="px-10 pb-10 pt-8 text-center" style={{ color: 'var(--ink)' }}>
                <div className="num text-xs font-semibold uppercase tracking-[0.3em] text-muted">CAT Sprint · {NEXT_EXAM.year}</div>
                <div className="bib-no mt-2">{counting ? String(days).padStart(2, '0') : big}</div>
                <div className="num text-xs uppercase tracking-[0.25em] text-muted">{counting ? (days === 1 ? 'day to go' : 'days to go') : examDay ? 'exam day' : 'questions'}</div>
                <div className="mx-auto mt-6 w-48 border-b-2 border-dashed pb-1 text-sm text-muted" style={{ borderColor: 'var(--line)' }}>your name here</div>
                <div className="btn btn-primary mt-6">Start free →</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-8 text-sm sm:px-6">
          <Logo />
          <a href="privacy.html">Privacy policy</a>
          <a href="#login">Log in</a>
          <ThemeToggle className="sm:hidden" />
          <span className="ml-auto text-xs text-muted">Independent practice app. Not affiliated with the IIMs or the CAT exam.</span>
        </div>
      </footer>
    </div>
  );
}
