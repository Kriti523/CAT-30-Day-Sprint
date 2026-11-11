import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

/** Short commit id, shown in crash reports: Vercel's build env first, then the local git checkout. */
function version() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  if (sha) return sha.slice(0, 7);
  try { return execSync('git rev-parse --short HEAD').toString().trim(); } catch { return 'dev'; }
}

// Standard Vite setup for running the app locally (npm install && npm run dev).
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { __APP_VERSION__: JSON.stringify(version()) },
  // Supabase only redirects back to allow-listed URLs (http://localhost:5173/**), so fail loudly instead of
  // silently moving to 5174 when the port is busy.
  server: { port: 5173, strictPort: true },
});
