// Offline build used where the npm registry is unavailable (no Vite).
// Produces:
//   dist/index.html     – single self-contained file, React bundled in (works fully offline)
//   dist/artifact.html  – same app, React 18 loaded from cdnjs (smaller; for hosting)
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const req = createRequire(import.meta.url);
mkdirSync(path.join(root, 'dist'), { recursive: true });

// 1. Tailwind CSS
const twCli = path.join(path.dirname(req.resolve('tailwindcss/package.json')), 'lib/cli.js');
const cssOut = path.join(root, 'dist/app.css');
execFileSync(process.execPath, [twCli, '-c', path.join(root, 'tailwind.config.js'), '-i', path.join(root, 'src/index.css'), '-o', cssOut, '--minify'], { cwd: root, stdio: 'inherit' });
const css = readFileSync(cssOut, 'utf8');

const common = {
  entryPoints: [path.join(root, 'src/main.tsx')], bundle: true, minify: true, format: 'iife', target: 'es2019',
  jsx: 'automatic', loader: { '.css': 'empty', '.json': 'json' }, write: false, legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"' },
};

// 2a. Fully bundled (React inside)
const bundled = await build({ ...common });
// 2b. React from CDN globals
const globals = {
  name: 'react-globals',
  setup(b) {
    const map = { react: 'react-global.js', 'react-dom/client': 'react-dom-global.js', 'react/jsx-runtime': 'jsx-global.js' };
    b.onResolve({ filter: /^(react|react-dom\/client|react\/jsx-runtime)$/ }, (a) => ({ path: path.join(root, 'scripts/offline', map[a.path]) }));
  },
};
const cdn = await build({ ...common, plugins: [globals] });

const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:wght@400;600;700&display=swap">';
const esc = (s) => s.replace(/<\/script/gi, '<\\/script');
const page = (js, head = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>CAT 30-Day Sprint</title>${fonts}<style>${css}</style>${head}</head><body><div id="root"></div><script>${esc(js)}</script></body></html>`;

writeFileSync(path.join(root, 'dist/index.html'), page(bundled.outputFiles[0].text));
const cdnScripts = '<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>';
// Artifact version: content only (the host adds doctype/head/body), title + style first.
// The published artifact uses the fully bundled (tested) build; the CDN variant is kept as artifact-cdn.html.
const artifact = `<title>CAT 30-Day Sprint</title>${fonts}<style>${css}</style><div id="root"></div><script>${esc(bundled.outputFiles[0].text)}</script>`;
writeFileSync(path.join(root, 'dist/artifact-cdn.html'), `<title>CAT 30-Day Sprint</title>${fonts}<style>${css}</style>${cdnScripts}<div id="root"></div><script>${esc(cdn.outputFiles[0].text)}</script>`);
writeFileSync(path.join(root, 'dist/artifact.html'), artifact);
for (const f of ['index.html', 'artifact.html']) console.log(f, (readFileSync(path.join(root, 'dist', f)).length / 1024).toFixed(0), 'KB');
