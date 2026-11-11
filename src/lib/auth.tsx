import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import AuthScreen from '../pages/Auth';

interface Auth { user: User; signOut: () => Promise<void> }

const Ctx = createContext<Auth | null>(null);

/** Shows the login/signup screen until Supabase has a session, then renders the app for that user. */
export function AuthGate({ children }: { children: (user: User) => ReactNode }) {
  // undefined = still reading the stored session; null = signed out.
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const user = session?.user;
  const auth = useMemo<Auth | null>(() => user ? {
    user,
    signOut: async () => { await supabase.auth.signOut({ scope: 'local' }); },
  } : null, [user]);

  if (session === undefined) return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading…</div>;
  if (!auth) return <AuthScreen />;
  return <Ctx.Provider value={auth}>{children(auth.user)}</Ctx.Provider>;
}

export function useAuth() {
  const a = useContext(Ctx);
  if (!a) throw new Error('AuthGate missing');
  return a;
}
