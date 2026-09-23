# Validation Report

Run on 23 September 2026. Reproduce with `python3 content/build_data.py`, `npm test` and `python3 scripts/ui_test.py`.

## Summary
| Check | Result |
|---|---|
| VARC / DILR / QA question counts | **100 / 100 / 100** ✅ |
| Every question complete (topic, subtopic, difficulty, time, answer, solution, fast method, hint, trap, note) | ✅ 300/300 |
| QA answers independently recomputed in Python | ✅ 100/100 match; no distractor equals the computed value |
| DILR answers re-derived by brute-force set solvers | ✅ 100/100 match; arrangement and logic sets have a unique solution (solver asserts uniqueness) |
| VARC RC answers supported by passage text | ✅ 64/64 have verbatim evidence quotes found in the passage |
| VARC VA structural checks | ✅ 36/36 (jumble keys are permutations; odd-one-out keys in range; summary/completion evidence present) |
| Exact duplicate questions | ✅ none |
| Near-duplicates (text similarity > 0.85) | ✅ none (one pair found and replaced during authoring) |
| MCQ option sanity (4 distinct options, valid key) | ✅ |
| Answer-key position bias | ✅ removed by seeded shuffle (A/B/C/D spread per section in `content/validation_result.json`) |
| Logic tests (`npm test`) | ✅ 2,337 passed, 0 failed |
| Browser tests (`scripts/ui_test.py`, Chromium) | ✅ 42 passed, 0 failed |
| TypeScript (strict) | ✅ 0 errors |
| Production bundle | ✅ `dist/index.html` (single file, ~650 KB) builds without errors or warnings |

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
| dashboard renders | ✅ |
| search "remainder" returns 4 QA results | ✅ |
| QA Hard filter = 20 (expected 20) | ✅ |
| QA TITA filter = 34 (expected 34) | ✅ |
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
| reattempt queue has wrong + low-confidence (2) | ✅ |
| DILR bar chart renders | ✅ |
| timed random session shows countdown | ✅ |
| calendar shows 30 days | ✅ |
| busy-day fallback shows | ✅ |
| QA sectional has 22 questions | ✅ |
| test result page | ✅ |
| VARC sectional has 24 questions | ✅ |
| Paper trends page renders | ✅ |
| Topic priorities page renders | ✅ |
| Formula sheets page renders | ✅ |
| Mock analysis page renders | ✅ |
| Exam strategy page renders | ✅ |
| Sources page renders | ✅ |
| Your data page renders | ✅ |
| mock saved and trend shown | ✅ |
| priority ratings expand | ✅ |
| mobile: no horizontal page scroll (390 <= 390) | ✅ |
| dark theme applied (rgb(16, 19, 18)) | ✅ |
| mobile 30-day plan: no horizontal scroll (390) | ✅ |
| mobile Paper trends: no horizontal scroll (390) | ✅ |
| mobile Topic priorities: no horizontal scroll (390) | ✅ |
| mobile Sectional tests: no horizontal scroll (390) | ✅ |
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
  "total": 100,
  "mcq": 66,
  "tita": 34,
  "difficulty": {
   "Easy": 32,
   "Medium": 48,
   "Hard": 20
  },
  "topics": {
   "Arithmetic": 38,
   "Algebra": 33,
   "Number Systems": 10,
   "Geometry & Mensuration": 14,
   "Modern Math": 5
  },
  "subtopics": {
   "Profit, Loss & Discount": 4,
   "Percentages": 3,
   "Simple & Compound Interest": 4,
   "Ratio & Proportion": 5,
   "Averages": 4,
   "Mixtures & Alligation": 4,
   "Time & Work": 6,
   "Time, Speed & Distance": 8,
   "Linear Equations": 6,
   "Inequalities & Modulus": 5,
   "Quadratic Equations": 6,
   "Logarithms, Surds & Indices": 6,
   "Functions & Graphs": 4,
   "Progressions & Series": 6,
   "Remainders & Cyclicity": 4,
   "Factors": 2,
   "Factorials": 1,
   "Units Digit": 1,
   "HCF & LCM": 1,
   "Divisibility & Counting": 1,
   "Triangles": 3,
   "Circles": 4,
   "Polygons": 1,
   "Coordinate Geometry": 2,
   "Quadrilaterals": 1,
   "Mensuration": 3,
   "Permutations": 1,
   "Combinations": 2,
   "Probability": 2
  },
  "sets": 0
 }
}
```
