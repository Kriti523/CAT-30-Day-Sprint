// Build-time settings (from .env). All are optional; see .env.example.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_REQUIRE_PURCHASE?: string;
  readonly VITE_BUY_URL?: string;
  readonly VITE_SUPPORT_EMAIL?: string;
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
