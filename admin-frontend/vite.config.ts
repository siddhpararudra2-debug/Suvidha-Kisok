import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Suvidha-Kisok/admin/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
})
