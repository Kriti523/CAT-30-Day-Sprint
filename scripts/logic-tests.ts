// Logic tests: run with `npm test` (bundled by esbuild, executed by node).
import { QUESTIONS, SETS, QMAP, isCorrect, expandRefs, normalise } from '../src/lib/data';
import { PLAN } from '../src/data/plan';
import { RANKED, classify } from '../src/data/priorities';
import { buildSection, scoreSection, marksFor } from '../src/lib/tests';
import { applyAttempt, emptyState, hasProgress, mergeStates, normalize } from '../src/lib/state';
import { SECTIONS } from '../src/types';

let pass = 0; const fails: string[] = [];
const ok = (c: boolean, m: string) => { if (c) pass++; else fails.push(m); };

// 1. counts
for (const s of SECTIONS) ok(QUESTIONS.filter((q) => q.section === s).length === 100, `${s} count`);
ok(new Set(QUESTIONS.map((q) => q.id)).size === 300, 'unique ids');
// 2. every stored answer is accepted by the checker; wrong answers are rejected
for (const q of QUESTIONS) {
  ok(isCorrect(q, String(q.answer)), `${q.id} key accepted`);
  if (q.type === 'MCQ') for (let i = 0; i < 4; i++) if (i !== Number(q.answer)) ok(!isCorrect(q, String(i)), `${q.id} distractor ${i} rejected`);
  else ok(!isCorrect(q, '999999'), `${q.id} wrong TITA rejected`);
  ok(!isCorrect(q, ''), `${q.id} empty rejected`);
  ok(q.solution.length > 0 && !!q.hint && !!q.trap && !!q.note && !!q.fast, `${q.id} complete`);
  ok(!/⟦/.test(JSON.stringify(q)), `${q.id} no unresolved option markers`);
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
ok(v.length === 24 && d.length === 20 && qa.length === 22, `section sizes ${v.length}/${d.length}/${qa.length}`);
ok(new Set([...v, ...d, ...qa]).size === 66, 'no duplicates in mock');
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
// 6. recording answers and merging two devices' progress (cloud sync)
const e0 = emptyState();
ok(!hasProgress(e0), 'empty state has no progress');
const r1 = applyAttempt(e0, mcq.id, String(mcq.answer), 42.4);
ok(r1.ok && r1.state.attempts[mcq.id].n === 1 && r1.state.attempts[mcq.id].t === 42 && hasProgress(r1.state), 'applyAttempt records a correct answer');
ok(e0.attempts[mcq.id] === undefined, 'applyAttempt does not mutate its input');
const wrongGiven = String((Number(mcq.answer) + 1) % 4);
const r2 = applyAttempt(r1.state, mcq.id, wrongGiven, 10);
ok(!r2.ok && r2.state.attempts[mcq.id].n === 2 && r2.state.errors[mcq.id]?.resolved === false && r2.state.attempts[mcq.id].everCorrect, 'wrong answer goes to the error log, keeps everCorrect');
ok(applyAttempt(r2.state, mcq.id, String(mcq.answer), 5).state.errors[mcq.id].resolved, 'a later right answer resolves the error');
const att = (n: number, at: number, correct = true) => ({ n, correct, everCorrect: correct, last: '', t: 1, at, history: [] });
const local = normalize({ attempts: { A: att(2, 50), B: att(1, 10) }, bookmarks: { A: true }, notes: { A: 'local note' }, startDate: '2026-11-16',
  errors: { B: { addedAt: 1, resolved: false } }, tests: [{ id: 't2', startedAt: 20 } as never], mocks: [{ id: 'm1', name: 'local' } as never] });
const remote = normalize({ attempts: { A: att(1, 90), B: att(3, 5, false), C: att(1, 7) }, bookmarks: { C: true }, notes: { A: 'remote note', C: 'c' }, startDate: '2026-11-09',
  errors: { B: { addedAt: 2, resolved: true, reason: 'Guessed' } }, tests: [{ id: 't1', startedAt: 10 } as never], mocks: [{ id: 'm1', name: 'remote' } as never, { id: 'm2', name: 'r2' } as never] });
const m = mergeStates(local, remote);
ok(m.attempts.A.n === 2 && m.attempts.B.n === 3 && m.attempts.C.n === 1, 'merge keeps the attempt answered more often, from either side');
ok(m.errors.B.reason === 'Guessed', 'merge takes the error-log entry from the side whose attempt won');
ok(m.bookmarks.A && m.bookmarks.C && m.notes.A === 'local note' && m.notes.C === 'c', 'merge unions bookmarks and notes, this device wins clashes');
ok(m.tests.map((t) => t.id).join() === 't1,t2' && m.mocks.length === 2 && m.mocks.find((x) => x.id === 'm1')!.name === 'local', 'merge combines tests and mocks by id');
ok(m.startDate === '2026-11-16' && m.v === 1, "merge keeps this device's settings");
const tie = mergeStates(normalize({ attempts: { A: att(1, 5) } }), normalize({ attempts: { A: att(1, 9) } }));
ok(tie.attempts.A.at === 9, 'equal attempt counts: the more recent one wins');
ok(JSON.stringify(mergeStates(remote, remote)) === JSON.stringify(normalize({ ...remote, tests: remote.tests })), 'merging a state with itself changes nothing');
// the landing page's warm-up questions exist and are one per section
const TRIAL = ['Q001', 'V097', 'D063'];
ok(TRIAL.every((id) => QMAP[id]) && new Set(TRIAL.map((id) => QMAP[id].section)).size === 3, 'warm-up has one question per section');
ok(!!QMAP.D063.setId && !!SETS.find((s) => s.id === QMAP.D063.setId), 'warm-up DILR question has its data set');

console.log(`logic tests: ${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log(fails.slice(0, 30).join('\n')); process.exit(1); }
