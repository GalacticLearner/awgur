import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  define: {
    __BUILD_HASH__: JSON.stringify(process.env.GITHUB_SHA?.slice(0, 7) || 'local'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [react()],
})
