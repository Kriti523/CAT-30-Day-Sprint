# Login / Sign-up — Test Guide

Covers email and Google sign-in, sessions, log out, per-account progress, the privacy page and Google publishing, in three phases:

1. **Local:** test on your computer before pushing (the live site is still the old version).
2. **Deploy:** push, and check Vercel picked it up.
3. **Live:** repeat the key checks on https://cat-30-day-sprint.vercel.app and publish the Google app.

Mark each test ✅ / ❌. If something fails, note the test number and the exact message you saw.

---

## Status

| Item | State |
|---|---|
| Supabase project `cat-30-day-sprint` | ✅ Configured (Site URL, Redirect URLs) |
| Google OAuth client + provider | ✅ Configured |
| Google sign-in (local) | ✅ Tested |
| Email sign-up / login | ⬜ Not tested yet (Phase 1, sections B–C) |
| New code on the live site | ⬜ Not pushed (old version is live) |
| Google app published | ⬜ Needs the live privacy page first (Phase 3) |

---

## Before you start

**Run the app locally**

```bash
npm install
npm run dev
```

Open http://localhost:5173. Keep it running while you test, because email confirmation links come back to it.

**What you need**

- **Two or three email inboxes you can open.** Gmail "plus" addresses work: `yourname+a@gmail.com` and `yourname+b@gmail.com` are separate accounts to the app but both arrive in your inbox.
- **A private / incognito window**, which acts as a brand-new visitor.
- **DevTools** (F12) → Application → Local Storage → `http://localhost:5173`, to see what the app stores:

| Key | Meaning |
|---|---|
| `cat30-sprint:visited` | This browser has opened the site before ("Welcome back") |
| `sb-cebpgcjvjgwhslwlotlh-auth-token` | The logged-in session |
| `cat30-sprint:v1:<user id>` | That account's progress |
| `cat30-sprint:v1` | Old progress from before accounts existed (adopted on first login) |

**Email limits**

*Confirm email* is **on** in Supabase, so new email accounts must click a link before logging in. Supabase's built-in sender only sends **a few emails per hour**. If sign-up says **"email rate limit exceeded"**, either wait an hour, or switch it off for testing (Authentication → Sign In / Providers → Email → *Confirm email* off) and turn it back on afterwards. Check spam if an email doesn't arrive within a minute or two.

---

# Phase 1: Local tests (http://localhost:5173)

### A. Welcome message

| # | Steps | Expected |
|---|---|---|
| A1 | Open the site in a private window | Heading **"Welcome"**, line *"Log in, or create an account to start your sprint."* |
| A2 | Reload | Heading **"Welcome back"**, line *"Log in to continue your sprint."* |
| A3 | Click the **Sign up** tab | Heading **"Create your account"** |

### B. Email sign-up  ⬜ not tested yet

| # | Steps | Expected |
|---|---|---|
| B1 | Sign up tab → any email, password `abc` → **Create account** | Red *"Use at least 6 characters for your password."* Nothing is sent |
| B2 | Sign up with a **new** email (`+a`) and a 6+ character password | Green *"Check you+a@… for a confirmation link, then log in here."* Screen switches to the Log in tab with your email already filled in (password empty) |
| B3 | Before clicking the email link, log in with that account | Red *"Email not confirmed"* |
| B4 | Open the email from Supabase ("Confirm your signup") → click the link | A tab opens at `localhost:5173` already logged in, with your email in the sidebar |
| B5 | Sign up again with the **same** confirmed email | Red *"An account with this email already exists. Log in instead."* Screen switches to Log in |
| B6 | Supabase → Authentication → Users | The account is listed, provider **email**, with a "Last signed in" time |

> If B4 opens `localhost:3000` or the live site instead of `localhost:5173`, check that `http://localhost:5173/**` is in Supabase → URL Configuration → Redirect URLs. The email is confirmed anyway, so you can still log in by hand.

### C. Email login  ⬜ not tested yet

| # | Steps | Expected |
|---|---|---|
| C1 | Log out → correct email, **wrong** password | Red *"Wrong email or password."* |
| C2 | An email that was never registered | Same: *"Wrong email or password."* |
| C3 | Click **Show** / **Hide** next to Password | Password text is shown / hidden |
| C4 | Correct email and password → **Log in** | Dashboard opens; sidebar shows **Signed in** and the email |
| C5 | Log out, type email and password, press **Enter** | Same as C4 |
| C6 | Watch the button while logging in | It reads *"Please wait…"* and can't be clicked twice |

### D. Staying logged in & logging out

| # | Steps | Expected |
|---|---|---|
| D1 | Logged in → reload | Brief *"Loading…"*, then the app, without the login screen |
| D2 | Close the tab, open http://localhost:5173 again | Still logged in |
| D3 | Desktop: sidebar → **Log out** | Login screen with "Welcome back"; the `sb-…-auth-token` key is gone |
| D4 | Phone width (DevTools → device toolbar, e.g. iPhone 12) → header → **Log out** | Same as D3 |
| D5 | After logging out, press the browser's **Back** button | Still the login screen |

### E. Separate progress per account

| # | Steps | Expected |
|---|---|---|
| E1 | Log in as **A** (`+a`) → Question bank → answer one question and bookmark it | Dashboard shows 1 attempted |
| E2 | Log out → sign up / log in as **B** (`+b`) | B's dashboard shows **0/300**, no bookmark |
| E3 | Log out → log in as **A** | A's attempt and bookmark are still there |
| E4 | Log out. In DevTools → Console run `localStorage.setItem('cat30-sprint:v1', JSON.stringify({ bookmarks: { Q001: true } }))`, then log in with an account that has **never** logged in on this browser (e.g. a Google account or `+c`) | That account has Q001 bookmarked; the `cat30-sprint:v1` key is gone |

### F. Google  ✅ basic sign-in tested

| # | Steps | Expected |
|---|---|---|
| F1 | ✅ **Continue with Google** → pick an account | Back in the app, logged in with that Gmail address |
| F2 | Sign up tab → **Sign up with Google** with a Google account new to the app | Logged in; new user with provider **google** in Supabase |
| F3 | Click Continue with Google, then press **Back** or cancel on Google's screen | You come back to the login screen; if Google reports an error, a red *"Google sign-in failed: …"* appears and the address bar is cleaned |
| F4 | Use Google with the **same Gmail** as a confirmed email/password account (e.g. sign up `yourname@gmail.com` by email first, confirm it, then use Google with that Gmail) | Same account: same progress; in Supabase **one** user with both **email** and **google** |
| F5 | Log out after a Google login → Continue with Google again | Logs straight back in (Google may skip the account picker) |

### G. Errors & layout

| # | Steps | Expected |
|---|---|---|
| G1 | DevTools → Network → **Offline** → try to Log in | Red *"Could not reach the sign-in server. Check your connection and try again."* |
| G2 | Still offline → **Continue with Google** | Same connection message. Switch back to **No throttling** afterwards |
| G3 | Phone width | Card fits, with no sideways scrolling; Google button and form stacked |
| G4 | Switch the OS to dark / light mode | Login screen follows the theme; text stays readable |
| G5 | Get an error, then switch between Log in / Sign up | The red/green message clears |
| G6 | Type an email and password in **Sign up**, then click the **Log in** tab (and back) | Each tab's fields are empty; nothing typed in one tab appears in the other |

### H. Privacy page

| # | Steps | Expected |
|---|---|---|
| H1 | Bottom of the login card → **Privacy policy** | `localhost:5173/privacy.html` opens |
| H2 | Read it through | Contact email is right; content matches what the app does |
| H3 | Click **← Back to CAT Sprint** | Returns to the login screen |
| H4 | Phone width and dark/light mode | Readable, no sideways scrolling |

**✅ Phase 1 done when B, C, E and H pass.** Then push.

---

# Phase 2: Deploy

| # | Steps | Expected |
|---|---|---|
| P1 | Commit and push (or merge the PR) to `main` | GitHub shows the commit on `main` |
| P2 | Vercel dashboard → project → **Deployments** (or the ✓ next to the commit on GitHub) | Newest **Production** deployment is **Ready** and its commit matches yours |
| P3 | If it **failed**, open the build log | Send me the error. Locally `npm run build` passes, so this is usually an environment difference |

---

# Phase 3: Live site (https://cat-30-day-sprint.vercel.app)

Use a **private window** so nothing from localhost carries over. Progress and logins are kept per site, so localhost and the live site don't share them.

### L. Live checks

| # | Steps | Expected |
|---|---|---|
| L1 | Open https://cat-30-day-sprint.vercel.app | Login screen (**"Welcome"**), not the old dashboard. If you still see the old app, hard-reload (Ctrl+Shift+R) |
| L2 | Open https://cat-30-day-sprint.vercel.app/privacy.html | Privacy policy (not 404) |
| L3 | **Sign up with email** using a fresh address (`+live`) | Green "check your email" message |
| L4 | Click the confirmation link | Opens **cat-30-day-sprint.vercel.app** (not localhost) already logged in |
| L5 | Log out → log in with that email and password | Dashboard |
| L6 | **Continue with Google** | Logged in with the Gmail address |
| L7 | Reload, close and reopen | Still logged in |
| L8 | **On your real phone**: open the site, log in with Google and with email | Works; layout fits the screen |
| L9 | Log out on the phone | Login screen |

### M. Publish the Google app

| # | Steps | Expected |
|---|---|---|
| M1 | Google Cloud → Google Auth Platform → **Branding**: Home page `https://cat-30-day-sprint.vercel.app`, Privacy policy `https://cat-30-day-sprint.vercel.app/privacy.html`, Authorised domains `cat-30-day-sprint.vercel.app` + `cebpgcjvjgwhslwlotlh.supabase.co` → **Save** | Saves without errors |
| M2 | **Audience → Publish app → Confirm** | Status shows **In production** |
| M3 | Ask someone who is **not** a test user (or use a Gmail you never added) to sign in with Google on the live site | They get in. A note like "continue to cebpgcjvjgwhslwlotlh.supabase.co" on Google's screen is normal |

**✅ All done when L1–L9 and M1–M3 pass.**

---

## Cleaning up

- Supabase → Authentication → Users → delete the test accounts (`+a`, `+b`, `+c`, `+live`).
- If you switched *Confirm email* off for testing, switch it back **on**.
- DevTools → Application → Local Storage → delete the `cat30-sprint:*` keys to start fresh.

## If something fails

| What you see | Likely cause | Fix |
|---|---|---|
| "email rate limit exceeded" | Supabase's built-in sender limit | Wait an hour, or turn *Confirm email* off while testing |
| No confirmation email | Spam folder, or rate limit | Check spam; wait; try another address |
| Confirmation link opens the wrong site | Redirect URLs missing that address | Supabase → URL Configuration → add `http://localhost:5173/**` and `https://cat-30-day-sprint.vercel.app/**` |
| Google: **redirect_uri_mismatch** | Google client redirect URI wrong | Must be exactly `https://cebpgcjvjgwhslwlotlh.supabase.co/auth/v1/callback` |
| Google: "Access blocked … app is being tested" | App not published, and this Gmail isn't a test user | Publish (M2) or add the Gmail as a test user |
| Live site still shows the old app | Deployment not finished, or cached | Check Vercel shows Ready; hard-reload |
| `/privacy.html` is 404 on the live site | New code not deployed | Phase 2 |

## Known limits

- Progress is saved in the browser, not in Supabase, so the same account on another device starts at 0/300.
- There is no "Forgot password" link yet.
- The offline single-file build (`npm run build:offline`) needs internet to log in.
- `scripts/ui_test.py` stops at the login screen until it's taught to log in.
