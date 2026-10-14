import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthError, User } from '@supabase/supabase-js';
import { AUTH_KEY, supabase } from './cloud';

export interface Account { id: string; email: string }

interface Auth {
  /** False when this build has no Supabase settings: no sign-in, progress stays in this browser. */
  enabled: boolean;
  user: Account | null;
  /** Opened from a password-reset email: the person is signed in and should choose a new password. */
  recovering: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; confirm: boolean }>;
  sendReset: (email: string) => Promise<string | null>;
  setPassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

/** The last signed-in account, so a reload opens straight into it (also offline) without waiting on the network. */
const USER_KEY = 'cat30-sprint:account';

function lastAccount(): Account | null {
  if (!supabase) return null;
  try {
    const a = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null');
    return a?.id ? { id: a.id, email: a.email ?? '' } : null;
  } catch { return null; }
}
function remember(a: Account | null) {
  try { if (a) localStorage.setItem(USER_KEY, JSON.stringify(a)); else localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
}
function hasStoredSession() {
  try { return localStorage.getItem(AUTH_KEY) !== null; } catch { return false; }
}

function friendly(e: AuthError | Error): string {
  if (e.name === 'AuthRetryableFetchError' || /fetch|network/i.test(e.message)) return 'Couldn’t reach the server. Check your connection and try again.';
  if (/invalid login credentials/i.test(e.message)) return 'Wrong email or password.';
  if (/email not confirmed/i.test(e.message)) return 'Please confirm your email first — open the link we sent you, then sign in.';
  return e.message;
}

/** Links in confirmation and reset emails come back to this page. */
const here = () => window.location.href.split('#')[0];

const Ctx = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(lastAccount);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const set = (a: Account | null) => {
      remember(a);
      setUser((cur) => (cur?.id === a?.id && cur?.email === a?.email ? cur : a));
    };
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) set(toAccount(session.user));
      // With no session at start-up, stay signed in only if the session is still stored: then the token just
      // couldn't be refreshed (offline). A rejected or missing session means signed out.
      else if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !hasStoredSession())) set(null);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const auth = useMemo<Auth>(() => ({
    enabled: !!supabase,
    user,
    recovering,
    signIn: async (email, password) => {
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      return error ? friendly(error) : null;
    },
    signUp: async (email, password) => {
      const { data, error } = await supabase!.auth.signUp({ email, password, options: { emailRedirectTo: here() } });
      if (error) return { error: friendly(error), confirm: false };
      // With email confirmation on, an existing address comes back as a user with no identities.
      if (data.user && data.user.identities?.length === 0) return { error: 'An account with this email already exists. Sign in instead.', confirm: false };
      return { error: null, confirm: !data.session };
    },
    sendReset: async (email) => {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo: here() });
      return error ? friendly(error) : null;
    },
    setPassword: async (password) => {
      const { error } = await supabase!.auth.updateUser({ password });
      if (error) return friendly(error);
      setRecovering(false);
      return null;
    },
    // Only this device: other devices stay signed in.
    signOut: async () => {
      const { error } = await supabase!.auth.signOut({ scope: 'local' });
      // Offline with an expired token, Supabase can give up before clearing the stored session.
      if (error) try { localStorage.removeItem(AUTH_KEY); } catch { /* ignore */ }
      remember(null);
      setUser(null);
      setRecovering(false);
    },
  }), [user, recovering]);

  return <Ctx.Provider value={auth}>{children}</Ctx.Provider>;
}

function toAccount(u: User): Account { return { id: u.id, email: u.email ?? '' }; }

export function useAuth() {
  const a = useContext(Ctx);
  if (!a) throw new Error('AuthProvider missing');
  return a;
}
