// Build-time settings (from .env). Both are optional; see .env.example.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
