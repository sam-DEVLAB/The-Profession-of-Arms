import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/the-profession-of-arms/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
});
