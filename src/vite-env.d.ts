/// <reference types="vite/client" />

/** Short commit id of this build (vite.config.ts `define`); undefined in the offline esbuild bundle. */
declare const __APP_VERSION__: string | undefined;

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}
