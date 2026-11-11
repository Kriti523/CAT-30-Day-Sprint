import { createClient } from '@supabase/supabase-js';

// The publishable key is designed to ship in browser code, so the project defaults live here;
// a .env file can point at another project. `env?.` because the offline esbuild bundle has no import.meta.env.
const env = import.meta.env as ImportMetaEnv | undefined;
const url = env?.VITE_SUPABASE_URL || 'https://cebpgcjvjgwhslwlotlh.supabase.co';
const key = env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_NbrMPMAGYCvrhJFVOgrQRQ_x1NQbXnc';

export const supabase = createClient(url, key);

/** Whether a social provider is switched on in the Supabase dashboard (public settings endpoint). */
export async function providerEnabled(provider: string): Promise<boolean> {
  const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
  if (!res.ok) throw new Error(`settings ${res.status}`);
  const settings = await res.json() as { external?: Record<string, boolean> };
  return !!settings.external?.[provider];
}
