import { supabase } from './cloud';

/** Build-time product settings (see .env.example). All optional. */
export const BUY_URL = import.meta.env.VITE_BUY_URL || '';
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || '';
/** Paid access: needs accounts. Until a purchase is verified the app runs as a free sample. */
export const PAYWALL = import.meta.env.VITE_REQUIRE_PURCHASE === 'true' && !!supabase;

/** Cookieless page-view counting with Plausible, when VITE_PLAUSIBLE_DOMAIN is set (see vite.config.ts). */
export const ANALYTICS = !!import.meta.env.VITE_PLAUSIBLE_DOMAIN;
/** Counts a product event (no personal data). Does nothing without analytics. */
export function track(event: string) {
  try { (window as unknown as { plausible?: (e: string) => void }).plausible?.(event); } catch { /* ignore */ }
}
