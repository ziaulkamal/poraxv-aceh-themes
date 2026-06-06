import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Port tetap 5174 (admin cms-media pakai 5173); harus cocok dgn CORS_ORIGINS backend.
  server: { port: 5174, strictPort: true },
})
