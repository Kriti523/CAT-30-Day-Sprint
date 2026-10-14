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

**354 original CAT-style questions**

| Section | Content |
|---|---|
| 🟣 VARC | 16 RC passages + 36 Verbal Ability questions |
| 🟠 DILR | 20 sets × 5 questions |
| 🟢 QA | 154 Quantitative Aptitude questions (every topic has at least 5) |

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

### 354 Questions

- 100 VARC
- 100 DILR
- 154 QA

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

## 🔐 Accounts & Sync (optional)

Out of the box the app needs no server: progress is saved in the browser. Connect a free [Supabase](https://supabase.com) project and people can **sign in**, so their progress belongs to their account and is the same on every device.

### Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, paste [`supabase/schema.sql`](supabase/schema.sql) and run it. It creates one `progress` row per account, readable and writable only by its owner.
3. Copy `.env.example` to `.env.local` and fill in the **Project URL** and the **publishable (anon) key** from the project's API settings. This key is meant to be public; the table's row-level security protects the data.
4. In **Authentication → URL Configuration**, set the **Site URL** (and a **Redirect URL**) to the address where the app is hosted. Confirmation and password-reset emails link back there, so those emails need the app on a web address, not opened as a local file.
5. **Email before launch:** Supabase's built-in email only sends to members of your Supabase team, at about 2 emails an hour. Before real users sign up, either set up custom SMTP (for example Resend) under **Authentication → Emails**, or turn off **Confirm email** so sign-up works straight away. Password reset still needs SMTP.
6. Rebuild with `npm run build` or `npm run build:offline`. The settings are built into the app; without them there is no sign-in and nothing changes.

### How it behaves

- A **new account** starts with the progress already on that device. Signing in to an **existing account** shows that account's progress.
- A copy is kept in the browser, so the app works **offline**; changes upload when the connection is back.
- If two devices both change progress while out of sync, the **most recent edit wins** for the whole of the progress (not item by item).
- **Sign out** affects only that device.
- `python3 scripts/auth_test.py` tests sign-up, sign-in, two-device sync, offline edits and password reset against a fake Supabase, so no real project is needed.

### Paid access (optional)

With accounts set up, you can make the full app require a purchase. Until a Gumroad license key is verified, people get a free sample: 20 questions from all three sections, plus the formula sheets, strategy and paper trends.

1. In Gumroad, turn on **Generate a unique license key per sale** for the product, and note its product ID.
2. Run the updated [`supabase/schema.sql`](supabase/schema.sql) (it adds the `entitlements` table).
3. Deploy the function and give it the product ID, with the [Supabase CLI](https://supabase.com/docs/guides/functions):
   `supabase functions deploy claim-license` and `supabase secrets set GUMROAD_PRODUCT_ID=...`
4. Set `VITE_REQUIRE_PURCHASE=true` and `VITE_BUY_URL` (your Gumroad page) in `.env.local`, and optionally `VITE_SUPPORT_EMAIL`. Rebuild.

Buyers sign in, enter the key from their receipt, and the account is unlocked on every device. One key unlocks one account; refunded or charged-back purchases are refused.

### Before you share the link

- Set `VITE_SITE_URL` to where the app is hosted, so links shared on WhatsApp or Telegram show a preview card (title, description and `public/og.png`).
- The app has an icon and a web app manifest, so it can be added to a phone's home screen.
- Students can flag a mistake with **Report a problem** on any question. With accounts set up, reports go to the `reports` table (read them in the Supabase dashboard); without, the app shows the report text to send to you.
- Optional: set `VITE_PLAUSIBLE_DOMAIN` for cookieless visit counts and a few events (setup done, test finished, signed up, unlocked) with [Plausible](https://plausible.io). The Privacy page mentions it only when it's on.

### Legal pages

Privacy, Terms and Refunds pages are linked from every page's footer, with a "not affiliated with the IIMs" line. They are plain-language drafts based on a 7-day refund policy: **review them, and have them checked, before you sell.**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | UI |
| 🔷 TypeScript | Application logic |
| ⚡ Vite | Development & build |
| 🎨 Tailwind CSS | Styling |
| 🐍 Python | Question/data generation & validation |
| 💾 localStorage | Local persistence |
| 🔐 Supabase | Optional accounts & sync |
| 🧪 Playwright | Browser testing |

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
├── supabase/
│   └── schema.sql (accounts & sync)
│
├── STUDY_PLAN.md
├── SOURCES.md
├── METHODOLOGY.md
└── VALIDATION_REPORT.md
