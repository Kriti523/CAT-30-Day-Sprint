import { supabase } from './cloud';

/** Build-time product settings (see .env.example). All optional. */
export const BUY_URL = import.meta.env.VITE_BUY_URL || '';
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || '';
/** Paid access: needs accounts. Until a purchase is verified the app runs as a free sample. */
export const PAYWALL = import.meta.env.VITE_REQUIRE_PURCHASE === 'true' && !!supabase;
