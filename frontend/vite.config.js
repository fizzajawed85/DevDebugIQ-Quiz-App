import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // important: makes assets relative
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3001' }
  }
})
