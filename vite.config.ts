import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite setup for running the app locally (npm install && npm run dev).
export default defineConfig({
  plugins: [react()],
  base: './',
});
