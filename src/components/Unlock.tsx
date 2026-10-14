import { useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';
import { BUY_URL } from '../lib/config';
import { useNav } from '../lib/nav';
import { Panel } from './ui';
import { QUESTIONS } from '../lib/data';

/** Enter a Gumroad license key to unlock the signed-in account. */
export function LicenseForm() {
  const { claimLicense } = useAuth();
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    const err = await claimLicense(key);
    setBusy(false);
    if (err) setError(err);
  };
  return (
    <form onSubmit={submit} className="grid gap-2">
      <label className="grid gap-1"><span className="label">License key (from your Gumroad receipt)</span>
        <input id="license-key" className="field mono" autoComplete="off" spellCheck={false} required value={key} onChange={(e) => setKey(e.target.value)} placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX" />
      </label>
      {error && <p className="text-sm" style={{ color: 'var(--bad)' }} role="alert">{error}</p>}
      <button className="btn btn-primary justify-self-start" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Unlock'}</button>
    </form>
  );
}

const INCLUDED = [
  `All ${QUESTIONS.length} questions with hints, solutions, fast methods and traps`,
  'A day-by-day plan fitted to the days you have left',
  'Sectional tests and 68-question mocks in the CAT format',
  'Error log, spaced reattempts and mock analysis',
];

/** Shown in place of a part of the app that needs full access. */
export function Unlock({ what }: { what: string }) {
  const { user } = useAuth();
  const { go } = useNav();
  return (
    <Panel className="max-w-2xl">
      <div className="label">Free sample</div>
      <h2 className="mt-1 text-2xl font-bold">{what} {what.endsWith('s') ? 'are' : 'is'} part of full access</h2>
      <p className="mt-2 text-muted">The free sample has 20 questions from all three sections, the formula sheets, exam strategy and paper trends. Full access adds:</p>
      <ul className="mt-2 grid list-disc gap-1 pl-5">{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {BUY_URL && <a className="btn btn-primary" href={BUY_URL} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>Buy full access</a>}
        {!user && <button className="btn" onClick={() => go('account')}>Already bought? Sign in</button>}
      </div>
      {user && <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--line)' }}><div className="mb-2 font-semibold">Already bought?</div><LicenseForm /></div>}
    </Panel>
  );
}
