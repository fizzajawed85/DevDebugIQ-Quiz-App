import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // relative paths for production
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'  // dev only
    }
  }
});
