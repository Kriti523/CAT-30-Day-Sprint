import { useState, type FormEvent, type ReactNode } from 'react';
import { useAuth } from '../lib/auth';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import type { SyncStatus } from '../lib/sync';
import { PageHead, Panel, Note } from '../components/ui';

type Mode = 'signin' | 'signup' | 'reset';

const STATUS: Partial<Record<SyncStatus, [string, string]>> = {
  saved: ['var(--good)', 'All progress is saved to your account.'],
  saving: ['var(--warn)', 'Saving your latest changes…'],
  offline: ['var(--bad)', 'Offline. Changes are kept on this device and upload when you’re back online.'],
};

export default function AccountPage() {
  const auth = useAuth();
  const [notice, setNotice] = useState('');

  if (!auth.enabled) {
    return (
      <PageHead eyebrow="Account" title="Accounts aren’t set up">
        This copy of the app has no sign-in, so progress is saved in this browser only. See “Your data” to back it up or move it.
      </PageHead>
    );
  }
  if (auth.recovering) return <NewPassword onDone={() => setNotice('Password updated.')} />;
  if (auth.user) return <SignedIn email={auth.user.email} notice={notice} />;
  return <SignInForm />;
}

function SignedIn({ email, notice }: { email: string; notice: string }) {
  const { sync, signOut } = useStore();
  const [busy, setBusy] = useState(false);
  const [color, text] = STATUS[sync] ?? ['var(--faint)', ''];
  return (
    <div>
      <PageHead eyebrow="Account" title="Your account">
        Your progress, notes, bookmarks, error log, plan ticks and mock logs are saved to your account, so they’re the same on every device where you sign in.
      </PageHead>
      {notice && <p className="mb-4 text-sm" role="status">{notice}</p>}
      <Panel className="max-w-lg">
        <p>Signed in as <strong className="break-all">{email}</strong></p>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted" role="status"><span className="dot" style={{ background: color }} aria-hidden />{text}</p>
        {sync === 'offline' && <div className="mt-3"><Note tone="warn">If you sign out now, unsaved changes stay on this device and upload the next time you sign in here.</Note></div>}
        <button className="btn mt-4" disabled={busy} onClick={async () => { setBusy(true); await signOut(); }}>{busy ? 'Signing out…' : 'Sign out'}</button>
      </Panel>
    </div>
  );
}

function SignInForm() {
  const auth = useAuth();
  const { go } = useNav();
  const { state } = useStore();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const attempted = Object.keys(state.attempts).length;

  const switchTo = (m: Mode) => { setMode(m); setError(''); setInfo(''); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(''); setInfo('');
    if (mode === 'signin') {
      const err = await auth.signIn(email.trim(), password);
      if (err) setError(err); else go('dashboard');
    } else if (mode === 'signup') {
      const { error: err, confirm } = await auth.signUp(email.trim(), password);
      if (err) setError(err);
      else if (confirm) { setInfo(`We’ve sent a confirmation link to ${email.trim()}. Open it to finish creating your account.`); setPassword(''); }
      else go('dashboard');
    } else {
      const err = await auth.sendReset(email.trim());
      if (err) setError(err); else setInfo(`If ${email.trim()} has an account, a link to reset the password is on its way.`);
    }
    setBusy(false);
  };

  const title = { signin: 'Sign in', signup: 'Create an account', reset: 'Reset your password' }[mode];
  return (
    <div>
      <PageHead eyebrow="Account" title={title}>
        Sign in to keep your progress in your account instead of this browser, and pick up where you left off on any device.
      </PageHead>
      <Panel className="max-w-md">
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Email">
            <input id="auth-email" className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          {mode !== 'reset' && (
            <Field label="Password">
              <input id="auth-password" className="field" type="password" required minLength={mode === 'signup' ? 6 : undefined}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
          )}
          {error && <p className="text-sm" style={{ color: 'var(--bad)' }} role="alert">{error}</p>}
          {info && <p className="text-sm" role="status">{info}</p>}
          <button className="btn btn-primary justify-center" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : { signin: 'Sign in', signup: 'Create account', reset: 'Send reset link' }[mode]}
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {mode !== 'signin' && <TextLink onClick={() => switchTo('signin')}>Sign in instead</TextLink>}
          {mode !== 'signup' && <TextLink onClick={() => switchTo('signup')}>Create an account</TextLink>}
          {mode === 'signin' && <TextLink onClick={() => switchTo('reset')}>Forgot password?</TextLink>}
        </div>
      </Panel>
      {mode !== 'reset' && attempted > 0 && (
        <p className="mt-4 max-w-md text-sm text-muted">
          A new account starts with the progress already on this device ({attempted} question{attempted === 1 ? '' : 's'} attempted). Signing in to an existing account shows that account’s progress instead.
        </p>
      )}
    </div>
  );
}

function NewPassword({ onDone }: { onDone: () => void }) {
  const auth = useAuth();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    const err = await auth.setPassword(password);
    setBusy(false);
    if (err) setError(err); else onDone();
  };
  return (
    <div>
      <PageHead eyebrow="Account" title="Choose a new password" />
      <Panel className="max-w-md">
        <form onSubmit={submit} className="grid gap-3">
          <Field label="New password">
            <input id="auth-new-password" className="field" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error && <p className="text-sm" style={{ color: 'var(--bad)' }} role="alert">{error}</p>}
          <button className="btn btn-primary justify-center" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save password'}</button>
        </form>
      </Panel>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1"><span className="label">{label}</span>{children}</label>;
}

function TextLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button className="font-semibold underline-offset-2 hover:underline" style={{ color: 'var(--accent)' }} onClick={onClick}>{children}</button>;
}
