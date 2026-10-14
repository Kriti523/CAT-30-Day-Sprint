import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite setup for running the app locally (npm install && npm run dev).
// Link previews (WhatsApp, Telegram, X) need absolute URLs, so og:url and og:image are added only when
// VITE_SITE_URL says where the app is hosted. VITE_PLAUSIBLE_DOMAIN adds cookieless visit counts.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const site = (env.VITE_SITE_URL || '').replace(/\/$/, '');
  const plausible = env.VITE_PLAUSIBLE_DOMAIN;
  return {
    plugins: [react(), {
      name: 'link-preview',
      transformIndexHtml: (html: string) => {
        let head = '';
        if (site) head += `  <meta property="og:url" content="${site}/" />\n    <meta property="og:image" content="${site}/og.png" />\n`;
        // Cookieless visit counts, only when configured.
        if (plausible) head += `    <script defer data-domain="${plausible}" src="https://plausible.io/js/script.js"></script>\n`;
        return head ? html.replace('</head>', `${head}  </head>`) : html;
      },
    }],
    base: './',
  };
});
