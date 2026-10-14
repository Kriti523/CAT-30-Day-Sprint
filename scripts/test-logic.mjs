import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'dist/logic-tests.cjs');
await build({ entryPoints: [path.join(root, 'scripts/logic-tests.ts')], bundle: true, platform: 'node', format: 'cjs', outfile: out, jsx: 'automatic', logLevel: 'error',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  // No accounts in the logic tests.
  define: { 'import.meta.env.VITE_SUPABASE_URL': '""', 'import.meta.env.VITE_SUPABASE_ANON_KEY': '""' } });
execFileSync(process.execPath, [out], { stdio: 'inherit' });
