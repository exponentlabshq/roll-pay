import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

// Vitest config for the /app PWA. Runs Preact components + the Zustand
// store in jsdom. Scoped only to src/app/** so we never accidentally
// pull the landing code into the test pipeline.
//
// Zustand v5 imports `react` from its hooks module — alias it to
// `preact/compat` so we don't have to add `react` as a dep just for
// the test runtime. This mirrors the alias @preact/preset-vite sets for
// the app build.
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/app/**/*.test.{js,jsx}'],
    // Inline zustand so Vite's resolver applies the `react` →
    // `preact/compat` alias above instead of Node's ESM loader trying
    // to resolve the literal `react` package.
    server: {
      deps: {
        inline: ['zustand'],
      },
    },
  },
});
