import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AppState } from '../types';

/** Where Supabase keeps the signed-in session in this browser. */
export const AUTH_KEY = 'cat30-sprint:auth';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Accounts are optional: a build without Supabase settings has no sign-in and saves to this browser only. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key, { auth: { storageKey: AUTH_KEY } }) : null;

function db() {
  if (!supabase) throw new Error('Accounts are not configured');
  return supabase.from('progress');
}

/** One row per account in the `progress` table (see supabase/schema.sql). `version` goes up by one on every save. */
export interface CloudRow { state: AppState; version: number; edited_at: string }

export async function fetchProgress(uid: string): Promise<CloudRow | null> {
  const { data, error } = await db().select('state, version, edited_at').eq('user_id', uid).maybeSingle();
  if (error) throw error;
  return data as CloudRow | null;
}

/**
 * Saves only if the account copy is still at `base` (null = no copy yet), so one device never silently
 * overwrites another's newer save. Returns the new version, or null when another device saved first.
 */
export async function saveProgress(uid: string, state: AppState, base: number | null, editedAt: number): Promise<number | null> {
  const edited_at = new Date(editedAt).toISOString();
  if (base === null) {
    const { error } = await db().insert({ user_id: uid, state, version: 1, edited_at });
    if (error?.code === '23505') return null; // a copy already exists
    if (error) throw error;
    return 1;
  }
  const { data, error } = await db().update({ state, version: base + 1, edited_at }).eq('user_id', uid).eq('version', base).select('version');
  if (error) throw error;
  return data.length ? base + 1 : null;
}

/** Sends a problem report about a question (see the reports table in supabase/schema.sql). */
export async function sendReport(questionId: string, reason: string, message: string) {
  if (!supabase) throw new Error('Reports need accounts to be configured');
  const { error } = await supabase.from('reports').insert({ question_id: questionId, reason, message: message.slice(0, 1000) });
  if (error) throw error;
}
