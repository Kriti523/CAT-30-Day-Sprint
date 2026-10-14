import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'dist/logic-tests.cjs');
await build({ entryPoints: [path.join(root, 'scripts/logic-tests.ts')], bundle: true, platform: 'node', format: 'cjs', outfile: out, jsx: 'automatic', logLevel: 'error',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  // No accounts in the logic tests.
  define: Object.fromEntries(['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_REQUIRE_PURCHASE', 'VITE_BUY_URL', 'VITE_SUPPORT_EMAIL']
    .map((k) => [`import.meta.env.${k}`, '""'])) });
execFileSync(process.execPath, [out], { stdio: 'inherit' });
