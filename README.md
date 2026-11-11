# 🎯 CAT 30-Day Sprint

> A focused, mobile-friendly CAT preparation app designed for working professionals with just **30 days to prepare**.

Built around a structured 30-day sprint covering **VARC, DILR and QA**, with practice, timed tests, error tracking, revision and progress analytics — all running locally in the browser.

---

## 🚀 What is CAT 30-Day Sprint?

Preparing for CAT while working full-time creates a very specific problem:

**You don't need more study material. You need a system.**

CAT 30-Day Sprint turns preparation into a structured daily workflow:

- 📚 Curated CAT-style question bank
- 🧠 Topic-wise practice
- ⏱️ Timed & untimed practice modes
- 📊 Progress tracking
- ❌ Error log + reattempt queue
- 📝 Personal notes & bookmarks
- 🎯 Topic priority system
- 🧪 Sectional tests
- 📈 Mock-test analysis
- 📅 30-day study plan
- 🧮 Formula sheets
- 💡 Hints, solutions & fast methods

---

## ✨ Features

### 📊 Dashboard

A single view of your preparation progress.

- Overall questions attempted
- VARC / DILR / QA progress
- Accuracy tracking
- Current study plan
- Reattempt queue
- Daily progress

---

### 📚 Question Bank

**300 original CAT-style questions**

| Section | Content |
|---|---|
| 🟣 VARC | 16 RC passages + 36 Verbal Ability questions |
| 🟠 DILR | 20 sets × 5 questions |
| 🟢 QA | 100 Quantitative Aptitude questions |

Each question includes:

- Topic & subtopic
- Difficulty
- Estimated solving time
- Answer
- Step-by-step solution
- Fast solving method
- Hint
- Common trap
- Revision note

---

### ⏱️ Practice Modes

Choose how you want to practice:

**Untimed**
> Learn → solve → understand

**Timed**
> Simulate CAT pressure

**Random**
> Mixed practice across topics

Each question also has a **per-question timer**.

---

### ❌ Error Log

Wrong answers shouldn't disappear after you see the solution.

The app maintains an error log containing:

- Question
- Your answer
- Correct answer
- Mistake type
- Confidence rating
- Notes
- Reattempt status

Questions can be added to a **reattempt queue** for targeted revision.

---

### 🎯 Topic Priorities

Topics are categorized using a priority score from **0–100**.

Each topic falls into one of four categories:

- 🔴 Must Master
- 🟠 Should Master
- 🟡 Selective Practice
- ⚪ Low Priority

This helps allocate limited preparation time where it matters.

---

### 📅 30-Day Study Plan

Designed around a working professional's schedule.

| Day | Study Time |
|---|---:|
| Monday–Friday | 2 hours |
| Saturday | 4 hours |
| Sunday | 5 hours |
| Busy-day fallback | 45 minutes |

The plan provides a structured daily sequence instead of leaving the learner to decide what to study every day.

---

### 🧪 Sectional Tests

CAT-style **40-minute sectional tests** for:

- VARC
- DILR
- QA

Includes CAT-style scoring with:

**+3 correct / −1 incorrect**

TITA questions have **no negative marking**.

---

### 📈 Mock Analysis

After a mock, analyze:

- Attempts
- Accuracy
- Time spent
- Section-wise performance
- Weak topics
- Strong topics
- Question selection
- Mistake patterns

The goal isn't just to know your score.

**It's to understand why you got that score.**

---

## 📊 Previous CAT Trend Analysis

The project also contains analysis of **CAT 2023–2025 papers across slots**.

Each figure is classified as:

- Official
- Cross-checked
- Single-source
- Conflicting

Topic priority scores are derived from the available evidence and are intended as a preparation aid rather than a prediction of the CAT paper.

---

## 🧠 What's Inside?

### 300 Questions

- 100 VARC
- 100 DILR
- 100 QA

### Study Resources

- Formula sheets
- Exam strategy
- Topic priorities
- Previous-paper analysis
- Revision notes
- Sources & methodology

### Tracking

- Dashboard
- 30-day calendar
- Error log
- Reattempt queue
- Bookmarks
- Notes
- Confidence ratings
- Mock analysis

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | UI |
| 🔷 TypeScript | Application logic |
| ⚡ Vite | Development & build |
| 🎨 Tailwind CSS | Styling |
| 🐍 Python | Question/data generation & validation |
| 🔐 Supabase Auth | Login / sign-up (email + password, Google) |
| 💾 localStorage | Local persistence (kept separately per account) |
| 🧪 Playwright | Browser testing |

### Accounts

The app opens on a login / sign-up screen backed by Supabase Auth (project `cat-30-day-sprint`). The project URL and publishable key are in `src/lib/supabase.ts`; to use another project, copy `.env.example` to `.env` and change the values. Progress still lives in the browser's localStorage, stored under each account's id. The first account to log in on a browser adopts any progress saved before accounts existed.

"Continue with Google" needs the Google provider switched on in Supabase (Authentication → Sign In / Providers → Google) with an OAuth client from Google Cloud Console whose authorised redirect URI is `https://cebpgcjvjgwhslwlotlh.supabase.co/auth/v1/callback`. Until then the button says Google sign-in isn't set up.

### Architecture

```text
CAT-30-Day-Sprint
│
├── content/
│   ├── QA questions
│   ├── DILR sets
│   └── VARC passages
│
├── scripts/
│   ├── data generation
│   ├── validation
│   └── testing
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── lib/
│   └── ...
│
├── public/
│
├── STUDY_PLAN.md
├── SOURCES.md
├── METHODOLOGY.md
└── VALIDATION_REPORT.md
