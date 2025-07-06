import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows connections from other devices
    port: 5173, // optional; can be omitted to let Vite use any available port
    strictPort: false, // allows fallback to another port if 5173 is in use
  }
})
