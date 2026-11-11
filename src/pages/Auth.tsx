import { useEffect, useState, type FormEvent } from 'react';
import { isAuthRetryableFetchError, type AuthError } from '@supabase/supabase-js';
import { providerEnabled, supabase } from '../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';

const OFFLINE = 'Could not reach the sign-in server. Check your connection and try again.';

/** supabase-js returns (not throws) network failures, as "Failed to fetch"-style errors. */
function message(error: AuthError) {
  if (isAuthRetryableFetchError(error)) return OFFLINE;
  if (error.message === 'Invalid login credentials') return 'Wrong email or password.';
  return error.message;
}

type Mode = 'login' | 'signup';

/** New-account password rules (letters may be upper or lower case). Log in doesn't check them, so older passwords still work. */
const PW_RULES = [
  { label: 'At least 8 characters', need: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'A letter (a–z or A–Z)', need: 'a letter', test: (p: string) => /\p{L}/u.test(p) },
  { label: 'A number (0–9)', need: 'a number', test: (p: string) => /\p{N}/u.test(p) },
  { label: 'A special character, like ! @ # $ %', need: 'a special character', test: (p: string) => /[^\p{L}\p{N}\s]/u.test(p) },
];

const VISITED_KEY = 'cat30-sprint:visited';

/** True when this browser has opened the site before (first-time visitors see "Welcome", not "Welcome back"). */
function visitedBefore(): boolean {
  try { return window.localStorage.getItem(VISITED_KEY) !== null; } catch { return false; }
}

const POINTS = [
  ['300', 'original CAT-style questions with solutions'],
  ['30', 'day plan built for working professionals'],
  ['3', 'sections tracked: VARC, DILR and QA'],
];

/** Keeps #login / #signup in the address bar in step with the tab, without adding history entries. */
function showMode(m: Mode) {
  try { history.replaceState(null, '', `${window.location.pathname}#${m}`); } catch { /* sandboxed frames may refuse */ }
}

export default function AuthScreen({ initialMode = 'login' }: { initialMode?: Mode }) {
  const [returning] = useState(visitedBefore);
  useEffect(() => { try { window.localStorage.setItem(VISITED_KEY, '1'); } catch { /* blocked storage: every visit looks like the first */ } }, []);
  const [mode, setModeState] = useState<Mode>(initialMode);
  const setMode = (m: Mode) => { setModeState(m); showMode(m); };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Each tab starts empty; only the automatic move to Log in after sign-up keeps the email.
  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m); setError(''); setInfo('');
    setEmail(''); setPassword(''); setShowPw(false);
  };

  // A failed or cancelled Google sign-in comes back as ?error_description=… or #error_description=…
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search.slice(1));
    const msg = params.get('error_description');
    if (!msg) return;
    setError(`Google sign-in failed: ${msg.replace(/\+/g, ' ')}`);
    showMode('login');
  }, []);

  async function google() {
    setError(''); setInfo('');
    setBusy(true);
    try {
      if (!(await providerEnabled('google'))) { setError('Google sign-in isn’t switched on for this app yet. Use email and password for now.'); setBusy(false); return; }
      // Leaves the page for Google; on return Supabase reads the session from the URL and AuthGate lets the user in.
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href.split('#')[0] } });
      if (error) { setError(message(error)); setBusy(false); }
    } catch {
      setError(OFFLINE);
      setBusy(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(''); setInfo('');
    const missing = PW_RULES.filter((r) => !r.test(password)).map((r) => r.need);
    if (mode === 'signup' && missing.length) { setError(`Your password still needs ${missing.join(', ')}.`); return; }
    setBusy(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(message(error));
        // On success AuthGate receives the session and swaps this screen for the app.
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { emailRedirectTo: window.location.href.split('#')[0] },
        });
        if (error) setError(message(error));
        // Supabase returns a user with no identities (and no error) when the email is already registered.
        else if (data.user && !data.user.identities?.length) { setMode('login'); setError('An account with this email already exists. Log in instead.'); }
        else if (!data.session) { setMode('login'); setPassword(''); setInfo(`Check ${email} for a confirmation link, then log in here.`); }
      }
    } catch {
      setError(OFFLINE);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4 pb-10 pt-16">
      <div className="absolute inset-x-0 top-0 mx-auto flex max-w-[880px] items-center justify-between px-4 py-3">
        <a href="#" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>← Home</a>
        <ThemeToggle />
      </div>
      <div className="grid w-full max-w-[880px] items-center gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="display text-3xl font-bold leading-none sm:text-4xl">CAT Sprint</div>
          <p className="mt-3 max-w-[40ch] text-muted">A focused CAT plan. Sign in to pick up your practice, error log and progress where you left them, on any device.</p>
          <ul className="mt-6 hidden space-y-3 sm:block">
            {POINTS.map(([n, t]) => (
              <li key={n} className="flex items-baseline gap-3">
                <span className="num w-10 text-right text-xl font-semibold" style={{ color: 'var(--accent)' }}>{n}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel lift p-5 sm:p-6">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg p-1" style={{ background: 'var(--sunk)' }} role="tablist" aria-label="Account">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => switchMode(m)}
                className="rounded-md py-1.5 text-sm font-semibold"
                style={mode === m ? { background: 'var(--surface)', color: 'var(--ink)', boxShadow: 'var(--shadow)' } : { color: 'var(--muted)' }}>
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-bold">{mode === 'signup' ? 'Create your account' : returning ? 'Welcome back' : 'Welcome'}</h1>
          <p className="mt-1 text-sm text-muted">
            {mode === 'signup' ? 'It takes a few seconds. Your progress is saved to your account and follows you to every device.'
              : returning ? 'Log in to continue your sprint.' : 'Log in, or create an account to start your sprint.'}
          </p>

          <button type="button" onClick={google} disabled={busy} className="btn mt-5 w-full justify-center py-2">
            <GoogleLogo />
            {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
          </button>

          <div className="my-4 flex items-center gap-3 text-xs text-muted" aria-hidden>
            <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
            or with email
            <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="mb-1 block text-sm font-semibold">Email</label>
              <input id="auth-email" type="email" required autoComplete="email" className="field"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <label htmlFor="auth-password" className="text-sm font-semibold">Password</label>
                <button type="button" className="text-xs font-semibold" style={{ color: 'var(--accent)' }} onClick={() => setShowPw((v) => !v)}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              <input id="auth-password" type={showPw ? 'text' : 'password'} required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="field"
                aria-describedby={mode === 'signup' ? 'pw-rules' : undefined}
                value={password} onChange={(e) => setPassword(e.target.value)} />
              {mode === 'signup' && (
                <ul id="pw-rules" className="mt-2 grid gap-0.5 text-xs" aria-label="Password must have">
                  {PW_RULES.map((r) => {
                    const ok = r.test(password);
                    return (
                      <li key={r.need} className="flex items-center gap-1.5" style={{ color: ok ? 'var(--good)' : 'var(--muted)' }}>
                        <span aria-hidden className="inline-block w-3 text-center font-bold">{ok ? '✓' : '•'}</span>
                        {r.label}<span className="sr-only">{ok ? ' (done)' : ' (missing)'}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {error && <div role="alert" className="rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--bad-soft)', color: 'var(--bad)' }}>{error}</div>}
            {info && <div role="status" className="rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--good-soft)', color: 'var(--good)' }}>{info}</div>}

            <button type="submit" className="btn btn-primary w-full justify-center py-2" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted">
            {mode === 'login' ? 'New here? ' : 'Already have an account? '}
            <button type="button" className="font-semibold" style={{ color: 'var(--accent)' }} onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Create an account' : 'Log in'}
            </button>
          </p>
          <p className="mt-3 border-t pt-3 text-center text-xs text-muted" style={{ borderColor: 'var(--line)' }}>
            How we handle your data: <a href="privacy.html" className="font-semibold">Privacy policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
