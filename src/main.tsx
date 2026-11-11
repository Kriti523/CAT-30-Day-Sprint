import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { StoreProvider } from './lib/store';
import { AuthGate } from './lib/auth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthGate>
      {(user) => (
        <StoreProvider key={user.id} userId={user.id}>
          <App />
        </StoreProvider>
      )}
    </AuthGate>
  </StrictMode>,
);
