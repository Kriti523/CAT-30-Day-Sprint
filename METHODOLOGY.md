# Methodology

## 1. Paper analysis
1. **Scope:** CAT 2023, 2024 and 2025, all three slots each.
2. **Source hierarchy:** official IIM information (pattern, dates) first, then reports of the official notification, then coaching-institute paper analyses (IMS, Cracku, Toprankers, Hitbullseye, GradSquare, InsideIIM, PW).
3. **Verification rule:** a figure is marked *Cross-checked* only when two or more independent sources agree (±1 for topic counts, because institutes classify borderline topics differently). Otherwise it is *Single source*, *Conflicting* (both values shown) or *Not verified*.
4. **Aggregation:** topic counts are summed across the three slots of a year. Nothing is averaged across conflicting sources.

### Findings used to shape the bank and the plan
- Stable structure since 2024: 68 Qs, 24 VARC / 22 DILR / 22 QA, 40 min per section; RC is always 16 of the 24 VARC questions.
- QA: arithmetic ≈ 7–8 per slot and algebra ≈ 5–7 per slot (together ~60–65%); geometry ~3 per slot; number systems 1–3; modern math 2–4.
- DILR: 4–5 sets; a mix of DI (tables, bar/line/scatter charts), arrangements, games/ratings, networks, Venn sets and quant-heavy caselets; about half of the 2025 DILR questions were TITA.
- VARC: VA holds at 8 questions (summary, odd one out, jumbles, completion/placement); no vocabulary or grammar questions.
- Recurring traps: successive percentages treated as additive, % change on the wrong base, off-by-one in AP counts, log/inequality domains, ordered vs unordered counting, extreme options in RC, share-vs-amount in pie charts.

## 2. Question bank design
| Section | Distribution | Rationale |
|---|---|---|
| QA (100) | Arithmetic 38 · Algebra 33 (incl. 6 progressions) · Geometry & mensuration 14 · Number systems 10 · Modern math 5 | Mirrors ~35–38% arithmetic, ~30% algebra, ~13% geometry in 2023–25; modern math kept small (0–1 P&C/probability per slot) |
| QA type | 66 MCQ / 34 TITA | CAT QA is 14 MCQ + 8 TITA (36% TITA) |
| QA difficulty | 32 Easy / 48 Medium / 20 Hard | A 99+ target needs a solid medium core and triage practice on hard questions |
| DILR (100) | 20 sets × 5, two each of: arrangements, scheduling, distribution/selection, games & tournaments, networks, tables, charts, caselets, Venn, hybrid | Covers every set family seen in 2023–25 |
| DILR type | 48 MCQ / 52 TITA | ~50% TITA in 2025 DILR |
| VARC (100) | 64 RC (16 passages × 4) + 36 VA (9 each of summary, jumble, odd one out, completion/placement) | RC = 2/3 of VARC; VA types rotate equally |
| VARC type | 82 MCQ / 18 TITA | CAT VARC has 4 TITA of 24 (jumbles and odd one out) |

**Authoring rules:** all content is original. QA questions carry an independent Python computation. DILR sets carry a brute-force solver that re-derives every answer from the clues exactly as stated. RC answers carry verbatim evidence quotes from the passage. MCQ options are shuffled deterministically at build time so the answer key has no positional bias; explanation text refers to options through markers that are remapped.

## 3. Topic priority score
`Priority = 10 × (0.30·Frequency + 0.20·Consistency + 0.20·Scoring potential + 0.15·Foundational importance + 0.15·Improvability in 30 days)`, each rated 0–10.

- Frequency and consistency come from the reconstructed 2023–25 counts.
- Scoring potential, foundational importance and 30-day improvability are analyst judgements (labelled as such in the app).
- Classes: **Must Master ≥ 75 · Should Master 60–74 · Selective Practice 45–59 · Low Priority < 45**.

| Rank | Section | Topic | Freq | Cons | Score pot. | Found. | 30-day | **Priority** | Class |
|---:|---|---|---:|---:|---:|---:|---:|---:|---|
| 1 | DILR | Set selection (meta-skill) | 10 | 10 | 10 | 10 | 10 | **100** | Must Master |
| 2 | VARC | RC – main idea & inference | 10 | 10 | 8 | 10 | 7 | **92** | Must Master |
| 3 | QA | Percentages, profit, loss & discount | 8 | 9 | 9 | 10 | 9 | **89** | Must Master |
| 4 | QA | Ratio, proportion, averages & mixtures | 9 | 9 | 8 | 9 | 9 | **88** | Must Master |
| 5 | DILR | Tables & charts DI (incl. missing values) | 9 | 10 | 8 | 8 | 8 | **87** | Must Master |
| 6 | QA | Linear equations, inequalities & modulus | 9 | 9 | 7 | 9 | 7 | **83** | Must Master |
| 7 | DILR | Arrangements (linear, circular, grid) | 8 | 8 | 8 | 9 | 8 | **81** | Must Master |
| 8 | QA | Time, speed, distance & work | 8 | 9 | 7 | 8 | 8 | **80** | Must Master |
| 9 | VARC | Para summary | 7 | 9 | 8 | 7 | 8 | **78** | Must Master |
| 10 | QA | Geometry (triangles, circles, polygons) | 8 | 10 | 6 | 7 | 6 | **76** | Must Master |
| 11 | VARC | RC – tone & author's view | 7 | 8 | 8 | 7 | 8 | **76** | Must Master |
| 12 | QA | Quadratics & polynomials | 6 | 8 | 7 | 8 | 8 | **72** | Should Master |
| 13 | DILR | Quant-based caselets & percentages | 7 | 8 | 7 | 7 | 7 | **72** | Should Master |
| 14 | DILR | Distribution & selection | 7 | 7 | 7 | 8 | 7 | **72** | Should Master |
| 15 | QA | Logarithms, surds & indices | 6 | 8 | 8 | 6 | 8 | **71** | Should Master |
| 16 | VARC | Odd sentence out | 6 | 9 | 7 | 6 | 8 | **71** | Should Master |
| 17 | QA | Progressions & series | 6 | 8 | 7 | 6 | 7 | **67** | Should Master |
| 18 | QA | Number systems | 7 | 9 | 5 | 7 | 5 | **67** | Should Master |
| 19 | DILR | Venn diagrams & set-based sets | 5 | 6 | 8 | 7 | 9 | **67** | Should Master |
| 20 | QA | Simple & compound interest | 5 | 6 | 8 | 6 | 9 | **66** | Should Master |
| 21 | VARC | Para completion & sentence placement | 6 | 8 | 6 | 6 | 7 | **66** | Should Master |
| 22 | DILR | Games & tournaments | 6 | 7 | 6 | 7 | 7 | **65** | Should Master |
| 23 | VARC | Para jumbles | 6 | 7 | 6 | 6 | 7 | **64** | Should Master |
| 24 | DILR | Scheduling & time-based sets | 6 | 6 | 6 | 6 | 7 | **61** | Should Master |
| 25 | DILR | Hybrid (LR + DI) sets | 6 | 7 | 5 | 6 | 5 | **59** | Selective Practice |
| 26 | DILR | Networks & routes | 5 | 6 | 6 | 5 | 7 | **57** | Selective Practice |
| 27 | VARC | RC – detail, strengthen/weaken, application | 5 | 6 | 6 | 6 | 6 | **57** | Selective Practice |
| 28 | QA | Mensuration | 3 | 5 | 7 | 5 | 8 | **53** | Selective Practice |
| 29 | QA | Functions & graphs | 4 | 6 | 5 | 6 | 5 | **51** | Selective Practice |
| 30 | QA | P&C and probability | 3 | 6 | 6 | 5 | 6 | **50** | Selective Practice |
| 31 | QA | Coordinate geometry | 3 | 4 | 6 | 4 | 7 | **46** | Selective Practice |
| 32 | QA | Trigonometry / heights & distances | 1 | 2 | 5 | 3 | 6 | **31** | Low Priority |
| 33 | DILR | Cubes, dice & pure number puzzles | 2 | 2 | 4 | 4 | 4 | **30** | Low Priority |
| 34 | VARC | Vocabulary / grammar drills | 0 | 0 | 3 | 4 | 4 | **18** | Low Priority |

Weights: {"freq":0.3,"cons":0.2,"score":0.2,"found":0.15,"improve":0.15}


## 4. Study plan logic
- **Availability:** 120 min on weekdays, 240 on Saturday, 300 on Sunday; every day has a 45-minute fallback (tested: block minutes sum exactly to each day's budget).
- **Phases:** Week 1 diagnosis & fundamentals; Week 2 high-weightage topics; Week 3 sectional practice & selection strategy; Week 4 (Days 22–30) mocks, revision & exam strategy.
- Must-Master topics are covered first and revisited; full mocks fall on weekends (Days 6, 14, 20, 27, 28); in-app sectionals from Day 15 use unseen questions first; no new topics after Day 27.
- Accuracy targets rise from ≥ 70% untimed (Week 1) to ≥ 80–85% on attempts (Weeks 3–4). Section targets for a 99+ attempt are indicative, derived from 2024–25 good-attempt reports and single-source scaled scores.

## 5. Limitations
- Topic counts are reconstructions, not official data; 2025 TITA counts conflict; 2023 TITA counts are unverified.
- The percentile–score relationship depends on slot difficulty and normalisation, and the published figures come from one source.
- Difficulty labels in the bank are the author's estimates.
- The bank supports about four fresh in-app mocks; external full-length mocks (including the official IIM mock) are still needed.
