import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev-time proxy: forward /user -> Login service and /character -> Character service
    proxy: {
      '/user': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/character': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
