import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import { AuthGate, Splash } from './lib/auth';
import { applyTheme, getTheme } from './lib/theme';
import { installErrorReporting } from './lib/errors';
import { loadShell } from './lib/chunks';
import { ErrorBoundary } from './components/ErrorBoundary';

applyTheme(getTheme());
installErrorReporting();

const Shell = lazy(loadShell);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthGate>
        {(user) => (
          <Suspense fallback={<Splash />}>
            <Shell key={user.id} userId={user.id} />
          </Suspense>
        )}
      </AuthGate>
    </ErrorBoundary>
    {/* Cookieless page views (Vercel Web Analytics). Only the path is sent: the hash can hold sign-in tokens. */}
    <Analytics beforeSend={(e) => ({ ...e, url: e.url.split('#')[0].split('?')[0] })} />
  </StrictMode>,
);
