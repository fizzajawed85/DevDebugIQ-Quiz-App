import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // relative paths for assets
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3001' }
  }
})

