import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request from your React app starting with /api...
      '/api': {
        // ...will be forwarded to your live Render backend
        target: 'https://sm-poc-backend.onrender.com',
        changeOrigin: true, // This is important for virtual hosts
      },
    },
  },
})