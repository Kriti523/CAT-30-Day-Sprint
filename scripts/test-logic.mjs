import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'dist/logic-tests.cjs');
await build({ entryPoints: [path.join(root, 'scripts/logic-tests.ts')], bundle: true, platform: 'node', format: 'cjs', outfile: out, jsx: 'automatic', logLevel: 'error',
  external: ['react', 'react-dom', 'react/jsx-runtime'] });
execFileSync(process.execPath, [out], { stdio: 'inherit' });
