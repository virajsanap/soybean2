import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://3.16.192.151:8000/',
        changeOrigin: true,
        secure: true, // Set to true if using HTTPS
      },
    }
  }
})
