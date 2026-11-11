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
| ☁️ Supabase Postgres | Progress synced across devices (`progress`), crash reports (`client_errors`) |
| 💾 localStorage | Offline copy of progress (per account), theme choice |
| 📈 Vercel Web Analytics | Cookieless page-view counts |
| 🧪 Playwright | Browser testing |
| 🤖 GitHub Actions | Typecheck, build, logic + UI tests on every PR |

### Accounts

Visitors land on a public home page (`src/pages/Landing.tsx`) with a 3-question warm-up they can try without an account; `#login` / `#signup` open the login screen, backed by Supabase Auth (project `cat-30-day-sprint`). The project URL and publishable key are in `src/lib/supabase.ts`; to use another project, copy `.env.example` to `.env` and change the values.

**Progress sync.** Progress is kept in localStorage (per account, so the app works offline) and synced to the `progress` table, one row per user, readable and writable only by that user. Each write carries the revision it was based on; when two devices changed things since they last synced, `mergeStates` in `src/lib/state.ts` combines them (most-attempted answer wins, tests and mocks are combined, this device wins other clashes). The first account to log in on a browser adopts any progress saved there before sign-in, including the warm-up answers. The schema is in `supabase/migrations/`.

**Crash reports** from signed-in users go to the `client_errors` table (Supabase dashboard → Table Editor); nothing can read them through the API. **Page views** are counted by Vercel Web Analytics once it is enabled in the Vercel project (Analytics tab); only the path is sent, never the URL hash.

"Continue with Google" needs the Google provider switched on in Supabase (Authentication → Sign In / Providers → Google) with an OAuth client from Google Cloud Console whose authorised redirect URI is `https://cebpgcjvjgwhslwlotlh.supabase.co/auth/v1/callback`. Until then the button says Google sign-in isn't set up.

### Development

```bash
npm install
npm run dev            # http://localhost:5173 (fixed port: it matches the Supabase redirect URLs)
npm run build          # typecheck + production build
npm test               # logic tests (questions, plan, scoring, sync merge)
npm run build:offline  # single-file dist/index.html, used by the UI test
python scripts/ui_test.py   # Playwright UI test (pip install playwright && python -m playwright install chromium)
```

The UI test runs offline: it blocks all Supabase requests and signs in with a synthetic session, so it needs no account. The same checks run on every pull request (`.github/workflows/ci.yml`).

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
