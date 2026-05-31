import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the Roll PWA (M4-F03).
 *
 * - `testDir` is `./tests/e2e` so unit specs under `src/app/**` keep
 *   running under Vitest exclusively.
 * - `fullyParallel: false` because the PWA's demo guarantees are
 *   per-session-stateful (first tap free / first draw win). Running
 *   specs in parallel inside the same browser context would race the
 *   `?demo=fresh` reset and break those assertions.
 * - `webServer` auto-starts `npm run dev` on :5173 and reuses an
 *   already-running dev server locally (handy when iterating). CI
 *   forces a fresh server.
 * - Two projects: `mobile-chrome` (the demo's intended viewport) and
 *   `desktop-chrome` (for the landing-at-`/` smoke). Each spec opts
 *   into a project via `test.use({ ... })`.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
  ],
});
