// Logic tests: run with `npm test` (bundled by esbuild, executed by node).
import { QUESTIONS, SETS, QMAP, isCorrect, expandRefs, normalise, displayOrder, letters } from '../src/lib/data';
import { PLAN } from '../src/data/plan';
import { RANKED, classify } from '../src/data/priorities';
import { buildSection, scoreSection, marksFor } from '../src/lib/tests';
import { emptyState } from '../src/lib/store';
import { SECTIONS } from '../src/types';
import { buildSchedule } from '../src/lib/schedule';
import { afterAttempt, isDue } from '../src/lib/review';
import { streak } from '../src/lib/stats';
import { claimLicense, type ClaimDeps } from '../supabase/functions/claim-license/claim';

let pass = 0; const fails: string[] = [];
const ok = (c: boolean, m: string) => { if (c) pass++; else fails.push(m); };

// 1. counts
const EXPECTED: Record<string, number> = { VARC: 100, DILR: 100, QA: 154 };
for (const s of SECTIONS) ok(QUESTIONS.filter((q) => q.section === s).length === EXPECTED[s], `${s} count`);
ok(new Set(QUESTIONS.map((q) => q.id)).size === QUESTIONS.length && QUESTIONS.length === 354, 'unique ids');
{
  const subs = new Map<string, number>();
  for (const q of QUESTIONS) if (q.section === 'QA') subs.set(q.subtopic, (subs.get(q.subtopic) ?? 0) + 1);
  ok([...subs.values()].every((n) => n >= 5), 'every QA subtopic has at least 5 questions');
}
// 2. every stored answer is accepted by the checker; wrong answers are rejected
for (const q of QUESTIONS) {
  ok(isCorrect(q, String(q.answer)), `${q.id} key accepted`);
  if (q.type === 'MCQ') for (let i = 0; i < 4; i++) if (i !== Number(q.answer)) ok(!isCorrect(q, String(i)), `${q.id} distractor ${i} rejected`);
  else ok(!isCorrect(q, '999999'), `${q.id} wrong TITA rejected`);
  ok(!isCorrect(q, ''), `${q.id} empty rejected`);
  ok(q.solution.length > 0 && !!q.hint && !!q.trap && !!q.note && !!q.fast, `${q.id} complete`);
  {
    // Option references are kept as ⟦X⟧ so they follow re-ordered options; only shuffled MCQs may use them.
    const text = [...q.solution, q.fast, q.hint, q.trap, q.note].join(' ');
    const marks = text.match(/⟦[^⟧]*⟧/g) ?? [];
    ok(marks.every((m) => /^⟦[A-D]⟧$/.test(m)) && (marks.length === 0 || (q.type === 'MCQ' && !q.noshuffle && !!q.options && marks.every((m) => 'ABCD'.indexOf(m[1]) < q.options!.length))), `${q.id} option markers are valid`);
    const order = displayOrder(q, 1);
    ok(!/[⟦⟧]/.test(letters(text, order)) && !/[⟦⟧]/.test(letters(text)), `${q.id} markers all resolve`);
    if (order) ok(order.indexOf(Number(q.answer)) !== Number(q.answer) && [...order].sort().join() === q.options!.map((_, i) => i).join(), `${q.id} reattempt order moves the answer`);
  }
  if (q.setId) ok(!!SETS.find((s) => s.id === q.setId), `${q.id} set exists`);
}
ok(isCorrect(QMAP['Q018'].type === 'TITA' ? QMAP['Q018'] : QMAP['Q036'], QMAP['Q036'].answer + ' '), 'TITA trims whitespace');
ok(normalise(' 1,540 ') === '1540', 'normalise commas');
// 3. plan
ok(PLAN.length === 30, '30 plan days');
for (const d of PLAN) {
  const sum = d.blocks.reduce((a, b) => a + b.min, 0);
  ok(sum === d.minutes, `day ${d.day} blocks sum ${sum} != ${d.minutes}`);
  const cap = d.kind === 'Weekday' ? 120 : d.kind === 'Saturday' ? 240 : 300;
  ok(d.minutes <= cap, `day ${d.day} exceeds availability`);
  ok(!!d.fallback, `day ${d.day} fallback`);
  for (const b of d.blocks) if (b.refs) ok(expandRefs(b.refs).length > 0, `day ${d.day} refs ${b.refs} resolve`);
  if (d.fallbackRefs) ok(expandRefs(d.fallbackRefs).length > 0, `day ${d.day} fallback refs`);
  const kindExpected = [6].includes((d.day - 1) % 7 + 1) ? 'Saturday' : (d.day - 1) % 7 + 1 === 7 ? 'Sunday' : 'Weekday';
  ok(d.kind === kindExpected, `day ${d.day} kind ${d.kind} expected ${kindExpected}`);
}
ok(PLAN.filter((d) => d.week === 1).length === 7 && PLAN.filter((d) => d.week === 4).length === 9, 'phase lengths');
ok(expandRefs(['Q001-Q011']).length === 11 && expandRefs(['D07']).length === 5 && expandRefs(['R01']).length === 4, 'expandRefs');
// 4. tests
const st = emptyState();
const v = buildSection('VARC', st, 1), d = buildSection('DILR', st, 1), qa = buildSection('QA', st, 1);
ok(v.length === 24 && d.length === 22 && qa.length === 22, `section sizes ${v.length}/${d.length}/${qa.length}`);
ok(new Set([...v, ...d, ...qa]).size === 68, 'no duplicates in mock');
ok(new Set(d.map((id) => QMAP[id].setId)).size === 5, 'DILR section uses five sets');
ok(qa.filter((id) => QMAP[id].topic === 'Arithmetic').length === 8, 'QA arithmetic quota');
st.attempts = Object.fromEntries(qa.map((id) => [id, { n: 1, correct: true, everCorrect: true, last: '', t: 1, at: 1, history: [] }]));
const qa2 = buildSection('QA', st, 2);
ok(qa2.filter((id) => qa.includes(id)).length <= 4, 'second QA test prefers unseen questions');
const mcq = QUESTIONS.find((q) => q.type === 'MCQ')!, tita = QUESTIONS.find((q) => q.type === 'TITA')!;
ok(marksFor(mcq, String(mcq.answer)) === 3 && marksFor(mcq, String((Number(mcq.answer) + 1) % 4)) === -1, 'MCQ marking');
ok(marksFor(tita, '999999') === 0 && marksFor(tita, String(tita.answer)) === 3 && marksFor(tita, '') === 0, 'TITA marking');
const sc = scoreSection([mcq.id, tita.id], { [mcq.id]: String(mcq.answer), [tita.id]: '999999' });
ok(sc.score === 3 && sc.correct === 1 && sc.wrong === 1 && sc.attempted === 2, 'section score');
// 5. priorities
ok(RANKED.every((t) => t.score >= 0 && t.score <= 100), 'scores in range');
ok(classify(75) === 'Must Master' && classify(74) === 'Should Master' && classify(45) === 'Selective Practice' && classify(44) === 'Low Priority', 'classes');
ok(new Set(RANKED.map((t) => t.cls)).size === 4, 'all four classes used');

// Schedule: the plan laid over the real calendar up to the exam
{
  const exact = buildSchedule('2026-10-19', '2026-11-18'); // Monday start, exactly 30 days
  ok(exact.length === 30 && exact.every((x, i) => x.d.day === i + 1), 'a 30-day Monday start reproduces the original plan order');
  const long = buildSchedule('2026-10-14', '2026-11-29');   // Wednesday start, 46 days
  const longPlan = long.filter((x) => x.d.day <= 30).map((x) => x.d.day);
  ok(long.length === 46 && new Set(longPlan).size === 30, `46 days keep all 30 plan days (${new Set(longPlan).size})`);
  ok(long.filter((x) => x.d.day > 30).length === 16, '46 days add 16 consolidation days');
  ok(long[44].d.day === 29 && long[45].d.day === 30 && long[45].iso === '2026-11-28', 'plan ends with revision, then the light day before the exam');
  ok(long[0].d.day === 1, 'plan opens with the QA diagnostic');
  ok(long.filter((x) => ![0, 6].includes(x.date.getDay())).slice(0, 5).map((x) => x.d.day).join() === '1,2,3,4,5', 'consolidation days only start after the first five weekday plan days');
  const weekendPlan = [6, 7, 13, 14, 20, 21, 27, 28];
  ok(long.every((x) => weekendPlan.includes(x.d.day) ? [0, 6].includes(x.date.getDay()) : true), 'long plan days fall on weekends');
  const short = buildSchedule('2026-11-09', '2026-11-29');  // 20 days
  const shortDays = short.map((x) => x.d.day);
  ok(short.length === 20 && new Set(shortDays).size === 20 && shortDays.every((d) => d <= 30), 'a 20-day plan keeps 20 distinct plan days, no extras');
  ok([1, 2, 3, 6, 15, 16, 23, 28, 29, 30].every((d) => shortDays.includes(d)), 'short plans keep diagnostics, sectionals and the final mock');
  ok(buildSchedule('2026-11-29', '2026-11-29').length === 0 && buildSchedule('2026-11-28', '2026-11-29').map((x) => x.d.day).join() === '30', 'edge cases right before the exam');
  for (let start = 1; start <= 28; start++) {
    const sch = buildSchedule(`2026-11-${String(start).padStart(2, '0')}`, '2026-11-29');
    const ids = sch.map((x) => x.d.day);
    ok(sch.length === 29 - start && new Set(ids).size === ids.length, `start 11-${start}: one entry per day, no repeats`);
  }
}
// Spaced reattempts: a miss comes back after 1, 3 and 7 days; correct answers before they are due don't count
{
  const day = (n: number, h = 10) => new Date(2026, 9, 14 + n, h).getTime();
  let e = afterAttempt(undefined, false, day(0))!;
  ok(!e.resolved && e.stage === 0 && !isDue(e, day(0, 23)) && isDue(e, day(1, 0)), 'a miss is due from the next day');
  ok(afterAttempt(e, true, day(0, 11)) === e, 'right straight after the solution does not count');
  e = afterAttempt(e, true, day(1))!; ok(e.stage === 1 && !isDue(e, day(3)) && isDue(e, day(4, 0)), 'first correct reattempt: back in 3 days');
  e = afterAttempt(e, true, day(4))!; ok(e.stage === 2 && !e.resolved && isDue(e, day(11, 0)), 'second: back in 7 days');
  e = afterAttempt(e, true, day(11))!; ok(e.resolved, 'third correct reattempt resolves it');
  const again = afterAttempt(e, false, day(12))!; ok(!again.resolved && again.stage === 0 && again.addedAt === e.addedAt, 'missing it again restarts the schedule');
  ok(afterAttempt(undefined, true, day(0)) === undefined, 'a right answer on a new question adds nothing');
  ok(afterAttempt({ addedAt: 1, resolved: false }, true, day(0))!.stage === 1, 'entries from before scheduling count as due');
}

// Streak: consecutive days with practice
{
  const st = emptyState();
  const at = (d: number, h = 9) => new Date(2026, 9, d, h).getTime();
  const now = new Date(2026, 9, 20, 18);
  ok(streak(st, now) === 0, 'no practice, no streak');
  st.attempts = { Q001: { n: 3, correct: true, everCorrect: true, last: '0', t: 30, at: at(19), history: [{ c: true, t: 30, at: at(17) }, { c: false, t: 30, at: at(18) }, { c: true, t: 30, at: at(19) }] } };
  ok(streak(st, now) === 3, 'today not practised yet keeps the streak to yesterday (3)');
  st.tests = [{ id: 'T', kind: 'sectional', sections: ['QA'], startedAt: at(20), finishedAt: at(20, 10), qids: [], answers: {}, score: 0, perSection: {} }];
  ok(streak(st, now) === 4, 'a finished test today extends it (4)');
  ok(streak(st, new Date(2026, 9, 22, 9)) === 0, 'a missed day breaks it');
}

// License claims (the claim-license function's logic, with a fake Gumroad and database)
async function licenseTests() {
  const owners = new Map<string, string>();
  const gumroad: Record<string, { refunded?: boolean; chargebacked?: boolean }> = { GOOD: {}, REFUNDED: { refunded: true }, CHARGEBACK: { chargebacked: true } };
  const deps: ClaimDeps = {
    verify: async (k) => (gumroad[k] ? { success: true, purchase: { email: 'buyer@example.com', ...gumroad[k] } } : { success: false, message: 'not found' }),
    ownerOf: async (k) => owners.get(k) ?? null,
    grant: async (u, k) => { if (owners.has(k) && owners.get(k) !== u) throw new Error('unique'); owners.set(k, u); },
  };
  const fail = (r: { ok: boolean }) => !r.ok;
  ok(fail(await claimLicense('u1', '  ', deps)), 'empty license key is rejected');
  ok(fail(await claimLicense('u1', 'NOPE', deps)), 'unknown license key is rejected');
  ok(fail(await claimLicense('u1', 'REFUNDED', deps)) && fail(await claimLicense('u1', 'CHARGEBACK', deps)), 'refunded or charged-back purchases are rejected');
  ok((await claimLicense('u1', ' GOOD ', deps)).ok && owners.get('GOOD') === 'u1', 'a valid key unlocks the account (whitespace trimmed)');
  ok((await claimLicense('u1', 'GOOD', deps)).ok, 'claiming your own key again is fine');
  ok(fail(await claimLicense('u2', 'GOOD', deps)), 'one key unlocks only one account');
  const racing: ClaimDeps = { ...deps, ownerOf: async () => null, grant: async () => { throw new Error('unique'); } };
  ok(fail(await claimLicense('u3', 'GOOD', racing)), 'a key taken by another account meanwhile is rejected');
}

licenseTests().then(() => {
  console.log(`logic tests: ${pass} passed, ${fails.length} failed`);
  if (fails.length) { console.log(fails.slice(0, 30).join('\n')); process.exit(1); }
});
