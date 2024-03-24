import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000',
      // '/api': {
      //   target: process.env.API_URL,
      //   changeOrigin: true,
      //   secure: false,
      // },
    },
    port: 3000,
    hmr: {
      webSocketPort: 3000,
    },
    watch: {
      usePolling: true,
    },
  },
})
