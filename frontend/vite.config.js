import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // IMPORTANT: ensures built files use relative paths
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3001' }
  }
})

