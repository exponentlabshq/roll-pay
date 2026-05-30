import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    preact({ include: ['src/app/**/*.{js,jsx}'] }),
  ],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        app: 'app/index.html',
      },
    },
  },
  server: {
    port: 5173,
    open: false,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
