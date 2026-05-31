import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    preact({ include: ['src/app/**/*.{js,jsx}'] }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // workbox-window handles registration in src/app/main.jsx
      scope: '/app/',
      base: '/app/',
      buildBase: '/',
      filename: 'sw.js',
      // Emit the manifest under /app/ so the link href in dist/app/index.html
      // (which is `<link rel="manifest" href="/app/manifest.webmanifest">`)
      // resolves to a real file rather than being swallowed by the SPA
      // fallback. Lighthouse / Chrome install prompts require the manifest
      // to actually be fetchable; previously it was emitted at dist root and
      // every PWA installability audit failed.
      manifestFilename: 'app/manifest.webmanifest',
      includeAssets: [],
      manifest: {
        name: 'Roll',
        short_name: 'Roll',
        description: 'Buy now. Pay maybe.',
        start_url: '/app/',
        scope: '/app/',
        display: 'standalone',
        background_color: '#0B0E0C',
        theme_color: '#C8FF3D',
        icons: [
          { src: '/app-icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/app-icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/app-icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['app/**/*.{html,js,css,png,svg,webmanifest}'],
        navigateFallback: '/app/index.html',
        navigateFallbackDenylist: [/^\/(?!app)/],
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true,
        type: 'module',
        // Keep the dev-mode manifest URL stable at /app/manifest.webmanifest
        // (matches M1-A03 — fetch http://localhost:5173/app/manifest.webmanifest).
        // We only relocated `manifestFilename` to `app/manifest.webmanifest`
        // so prod (buildBase: '/') emits dist/app/manifest.webmanifest matching
        // the injected <link rel="manifest"> href.
        webManifestUrl: '/app/manifest.webmanifest',
      },
    }),
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
