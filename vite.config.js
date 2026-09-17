import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// On GitHub Pages the app is served from https://<user>.github.io/find-it/
// so the built files must use "/find-it/" as their base path. During local
// development ("npm run dev") we keep it at "/" so http://localhost:5173 works.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/find-it/' : '/',
  plugins: [react()],
}))
