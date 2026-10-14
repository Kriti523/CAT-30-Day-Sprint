# Validation Report

First run on 23 September 2026; re-run on 14 October 2026 after 54 QA questions were added. Reproduce with `python3 content/build_data.py`, `npm test`, `python3 scripts/ui_test.py` and `python3 scripts/auth_test.py`.

## Summary
| Check | Result |
|---|---|
| VARC / DILR / QA question counts | **100 / 100 / 154** ✅ (every QA subtopic has at least 5) |
| Every question complete (topic, subtopic, difficulty, time, answer, solution, fast method, hint, trap, note) | ✅ 354/354 |
| QA answers independently recomputed in Python | ✅ 154/154 match; no distractor equals the computed value |
| DILR answers re-derived by brute-force set solvers | ✅ 100/100 match; arrangement and logic sets have a unique solution (solver asserts uniqueness) |
| VARC RC answers supported by passage text | ✅ 64/64 have verbatim evidence quotes found in the passage |
| VARC VA structural checks | ✅ 36/36 (jumble keys are permutations; odd-one-out keys in range; summary/completion evidence present) |
| Exact duplicate questions | ✅ none |
| Near-duplicates (text similarity > 0.85) | ✅ none (five new questions were replaced during authoring) |
| MCQ option sanity (4 distinct options, valid key) | ✅ |
| Answer-key position balance | ✅ correct answers spread evenly over A–D in each section (220 MCQs: 55 / 57 / 55 / 53); the build fails if a section drifts |
| Option-letter references in explanations | ✅ every ⟦X⟧ marker names a real option and resolves for reshuffled reattempts |
| Logic tests (`npm test`) | ✅ 3,289 passed, 0 failed |
| Browser tests (`scripts/ui_test.py`, Chromium) | ✅ 78 passed, 0 failed |
| Accounts, sync and paid access (`scripts/auth_test.py`, fake Supabase) | ✅ 37 passed, 0 failed |
| Database security rules (`supabase/schema.sql` on Postgres) | ✅ 22 checks: own rows only, no self-granted access, reports write-only |
| Accessibility (axe-core 4.13, every page, light and dark) | ✅ no violations |
| TypeScript (strict) | ✅ 0 errors |
| Production bundle | ✅ `dist/index.html` (single file) builds without errors |

## How answers were validated
- **QA:** each question has a `check` function that computes the answer independently, often by brute force (for example, enumerating all integer solutions, iterating permutations or simulating a race). The build fails if the key differs or if a distractor also matches.
- **DILR:** each set has a solver that encodes the clues exactly as written and enumerates all possibilities (permutations, match outcomes, Venn regions, max-flow, Dijkstra, critical path, full integer search for missing table values). It asserts a unique solution where the questions need one, then computes every answer, including "if a clue is removed" counts.
- **VARC:** RC keys cite exact passage text, checked verbatim. Distractors were written to fail for a stated reason (too extreme, contradicted, out of scope, partial), and each solution explains why. Para jumbles were built around explicit linkage (openers, demonstratives, connectors) to give one defensible order; odd-one-out sentences are off-topic by design.
- **Consistency fixes made during validation:** redesigned D01–D05, D19 and D20 clue sets until the solvers found exactly one solution; replaced a near-duplicate remainder question; upgraded 15 QA questions to raise the Hard share; converted 17 QA TITA items to MCQ to match CAT's ratio; normalised VARC subtopic labels.

## Limitations (stated, not hidden)
- **VARC correctness cannot be proven by code.** The evidence check confirms that the supporting text exists; the judgement that the keyed option is the best one was made by careful review, not by an independent human panel.
- **Difficulty labels and time estimates** are the author's estimates.
- **Vite was not run**: the npm registry was blocked in the build environment. The app was type-checked and bundled with esbuild and the Tailwind CLI instead. `npm install && npm run dev` should work on a normal machine but has not been tested here.
- Google Fonts were blocked during the browser tests, so the tests ran with fallback fonts.
- Paper-trend figures are reconstructions; conflicts are labelled in the app and in SOURCES.md.

## Browser test log
| Check | Result |
|---|---|
| first run opens the plan setup | ✅ |
| setup previews a shortened plan for 20 days | ✅ |
| setup previews a 46-day plan with consolidation days | ✅ |
| dashboard shows the target | ✅ |
| search "remainder" returns 7 QA results | ✅ |
| QA Hard filter = 36 (expected 36) | ✅ |
| QA TITA filter = 62 (expected 62) | ✅ |
| DILR shows 100 | ✅ |
| VARC shows 100 | ✅ |
| question timer running (0:02) | ✅ |
| hint shows | ✅ |
| correct MCQ marked correct | ✅ |
| solution shown | ✅ |
| fast method + trap shown | ✅ |
| wrong TITA marked incorrect | ✅ |
| bookmark persisted | ✅ |
| note persisted | ✅ |
| confidence persisted | ✅ |
| attempt persisted | ✅ |
| error log entry persisted | ✅ |
| a miss comes back tomorrow; the low-confidence question is due now | ✅ |
| DILR bar chart renders | ✅ |
| timed random session shows countdown | ✅ |
| calendar runs from the start date to the exam | ✅ |
| busy-day fallback shows | ✅ |
| QA sectional has 22 questions | ✅ |
| test result page | ✅ |
| VARC sectional has 24 questions | ✅ |
| DILR sectional has 22 questions | ✅ |
| test answers are typed on the on-screen keypad | ✅ |
| keypad enters a negative answer | ✅ |
| DILR test includes a typed-answer question | ✅ |
| calculator works (12 × 3 = 36) | ✅ |
| leaving a test shows a Resume banner | ✅ |
| test resumes with answers kept (Sectional · 1/22 answered) | ✅ |
| test survives a reload | ✅ |
| palette shows CAT states | ✅ |
| discarding ends the test without saving it | ✅ |
| Back returns to the previous page | ✅ |
| practice session survives a reload | ✅ |
| exam-day checklist ticks are kept | ✅ |
| a reattempt shows shuffled options and the previous result | ✅ |
| dashboard shows the practice streak | ✅ |
| keyboard: B then Enter answers a question | ✅ |
| without accounts, a report is shown ready to copy | ✅ |
| theme switch: Dark applies the dark theme | ✅ |
| theme choice survives a reload | ✅ |
| mock results show benchmarks and set review | ✅ |
| mock results give an indicative percentile band | ✅ |
| a full mock is logged on Mock analysis automatically | ✅ |
| a priority opens its topic primer | ✅ |
| every primer except set selection (a skill, not a question type) has a Practise button | ✅ |
| Paper trends page renders | ✅ |
| Topic priorities page renders | ✅ |
| Formula sheets page renders | ✅ |
| Mock analysis page renders | ✅ |
| Exam strategy page renders | ✅ |
| Sources page renders | ✅ |
| Your data page renders | ✅ |
| mock saved and trend shown | ✅ |
| priority ratings expand | ✅ |
| desktop: hamburger hides sidebar, page widens (1134 -> 1366) | ✅ |
| desktop: closed sidebar stays closed after reload | ✅ |
| desktop: hamburger brings sidebar back | ✅ |
| mobile: no horizontal page scroll (390 <= 390) | ✅ |
| dark theme applied (rgb(16, 19, 18)) | ✅ |
| mobile: menu drawer starts closed | ✅ |
| mobile: drawer closes after picking a page | ✅ |
| mobile Study plan: no horizontal scroll (390) | ✅ |
| mobile Paper trends: no horizontal scroll (390) | ✅ |
| mobile Topic priorities: no horizontal scroll (390) | ✅ |
| mobile Sectional tests: no horizontal scroll (390) | ✅ |
| mobile: hamburger opens the drawer | ✅ |
| mobile: Escape closes the drawer | ✅ |
| mobile: a passage opens on the Passage tab | ✅ |
| mobile: the Question tab shows the options | ✅ |
| data-theme=light overrides OS dark | ✅ |
| no console/page errors ([]) | ✅ |

## Final statistics
```
{
 "VARC": {
  "total": 100,
  "mcq": 82,
  "tita": 18,
  "difficulty": {
   "Medium": 54,
   "Hard": 28,
   "Easy": 18
  },
  "topics": {
   "Reading Comprehension": 64,
   "Verbal Ability": 36
  },
  "subtopics": {
   "Main idea": 16,
   "Purpose / analogy": 2,
   "Application": 3,
   "Tone / attitude": 4,
   "Inference": 15,
   "Detail": 9,
   "Author's view": 9,
   "Strengthen / weaken": 4,
   "Vocabulary in context": 2,
   "Para summary": 9,
   "Para jumble": 9,
   "Odd sentence out": 9,
   "Para completion": 6,
   "Sentence placement": 3
  },
  "sets": 16
 },
 "DILR": {
  "total": 100,
  "mcq": 48,
  "tita": 52,
  "difficulty": {
   "Medium": 55,
   "Easy": 23,
   "Hard": 22
  },
  "topics": {
   "Arrangements": 10,
   "Scheduling": 10,
   "Distribution": 10,
   "Games & Tournaments": 10,
   "Networks": 10,
   "Tables": 10,
   "Charts": 10,
   "Caselets": 10,
   "Venn Diagrams": 10,
   "Hybrid Sets": 10
  },
  "subtopics": {
   "Linear arrangement": 5,
   "Circular arrangement": 5,
   "Day-slot scheduling": 5,
   "Task dependencies (critical path)": 5,
   "Numeric distribution": 5,
   "Selection with conditions": 5,
   "Round-robin points table": 5,
   "Knockout bracket": 5,
   "Shortest paths": 5,
   "Flow / capacity network": 5,
   "Table with missing values": 5,
   "Ratings and scoring rules": 5,
   "Bar chart": 5,
   "Pie charts": 5,
   "Percentage caselet": 5,
   "Quant-based caselet": 5,
   "Three-set Venn": 5,
   "Maxima and minima in Venn": 5,
   "DI + LR hybrid": 5,
   "Arrangement + table": 5
  },
  "sets": 20
 },
 "QA": {
  "total": 154,
  "mcq": 92,
  "tita": 62,
  "difficulty": {
   "Easy": 45,
   "Medium": 73,
   "Hard": 36
  },
  "topics": {
   "Arithmetic": 44,
   "Algebra": 34,
   "Number Systems": 30,
   "Geometry & Mensuration": 30,
   "Modern Math": 16
  },
  "subtopics": {
   "Profit, Loss & Discount": 5,
   "Percentages": 5,
   "Simple & Compound Interest": 5,
   "Ratio & Proportion": 5,
   "Averages": 5,
   "Mixtures & Alligation": 5,
   "Time & Work": 6,
   "Time, Speed & Distance": 8,
   "Linear Equations": 6,
   "Inequalities & Modulus": 5,
   "Quadratic Equations": 6,
   "Logarithms, Surds & Indices": 6,
   "Functions & Graphs": 5,
   "Progressions & Series": 6,
   "Remainders & Cyclicity": 5,
   "Factors": 5,
   "Factorials": 5,
   "Units Digit": 5,
   "HCF & LCM": 5,
   "Divisibility & Counting": 5,
   "Triangles": 5,
   "Circles": 5,
   "Polygons": 5,
   "Coordinate Geometry": 5,
   "Quadrilaterals": 5,
   "Mensuration": 5,
   "Permutations": 5,
   "Combinations": 5,
   "Probability": 6
  },
  "sets": 0
 }
}
```
