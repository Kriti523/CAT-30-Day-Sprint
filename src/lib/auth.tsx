import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { loadShell, whenIdle } from './chunks';
import Landing from '../pages/Landing';
import AuthScreen from '../pages/Auth';

interface Auth { user: User; signOut: () => Promise<void> }

const Ctx = createContext<Auth | null>(null);

export function Splash() {
  return <div className="grid min-h-screen place-items-center text-sm text-muted" role="status">Loading…</div>;
}

/** Shows the landing page or login screen until Supabase has a session, then renders the app for that user. */
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

  if (session === undefined) return <Splash />;
  if (!auth) return <Public />;
  return <Ctx.Provider value={auth}>{children(auth.user)}</Ctx.Provider>;
}

type View = 'landing' | 'login' | 'signup';

function currentView(): View {
  const { hash, search } = window.location;
  if (hash === '#signup') return 'signup';
  // A failed Google sign-in comes back with ?error_description=… or #error_description=…
  if (hash === '#login' || /error_description=/.test(hash + search)) return 'login';
  return 'landing';
}

/** Signed out: the landing page at "/", the login screen at "#login" / "#signup" (so Back works). */
function Public() {
  const [view, setView] = useState(currentView);

  useEffect(() => {
    const on = () => { setView(currentView()); window.scrollTo({ top: 0 }); };
    window.addEventListener('hashchange', on);
    // Fetch the app in the background so it opens instantly after sign-in.
    whenIdle(() => { void loadShell(); });
    return () => window.removeEventListener('hashchange', on);
  }, []);

  if (view === 'landing') return <Landing />;
  return <AuthScreen key={view} initialMode={view} />;
}

export function useAuth() {
  const a = useContext(Ctx);
  if (!a) throw new Error('AuthGate missing');
  return a;
}
