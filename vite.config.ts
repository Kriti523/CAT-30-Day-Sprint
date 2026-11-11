import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite setup for running the app locally (npm install && npm run dev).
export default defineConfig({
  plugins: [react()],
  base: './',
  // Supabase only redirects back to allow-listed URLs (http://localhost:5173/**), so fail loudly instead of
  // silently moving to 5174 when the port is busy.
  server: { port: 5173, strictPort: true },
});
