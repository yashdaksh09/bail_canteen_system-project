import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    port: 5175, // 👈 yaha apna desired port number likho (e.g., 5175, 3000, etc.)
    open: true, // optional: browser automatically khulega
  },
})
