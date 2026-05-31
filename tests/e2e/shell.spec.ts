import { test, expect } from '@playwright/test';

/**
 * App shell smoke (M1-A07, M1-A08 covered via e2e).
 *
 * Bypasses Splash + Onboarding by setting `onboarded: true` on the
 * Zustand store via the dev-only `window.__rollStore` hook (exposed
 * in src/app/store/index.js under import.meta.env.DEV). The store
 * mounts inside main.jsx; we wait for it on each load.
 */
test.describe('app shell', () => {
  // Mobile-only — the PWA shell is tuned for 390×844.
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile-chrome',
      'shell assertions run on mobile-chrome only'
    );
  });

  test('bottom-nav exposes 4 tabs that route via hash', async ({ page }) => {
    await page.goto('/app/?demo=fresh');

    // Wait for the dev-only debug handle so we can flip onboarded.
    await page.waitForFunction(() => Boolean((window as any).__rollStore));

    // Skip Splash + Onboarding by marking the user onboarded and
    // jumping straight to /home in the hash router.
    await page.evaluate(() => {
      (window as any).__rollStore.setState({ onboarded: true });
      window.location.hash = '#/home';
    });

    // Bottom-nav lives at <nav aria-label="Primary">.
    const nav = page.locator('nav[aria-label="Primary"]');
    await expect(nav).toBeVisible();

    // All four labels must be visible — order is enforced in
    // src/app/components/BottomNav.jsx (Home, Opportunities, Draw, Card).
    for (const label of ['Home', 'Opportunities', 'Draw', 'Card']) {
      await expect(nav.getByText(label, { exact: true })).toBeVisible();
    }

    // Tap each tab; the hash must reflect that route.
    const navMap = [
      { label: 'Opportunities', hash: '#/opportunities' },
      { label: 'Draw', hash: '#/draw' },
      { label: 'Card', hash: '#/card' },
      { label: 'Home', hash: '#/home' },
    ];
    for (const { label, hash } of navMap) {
      await nav.getByText(label, { exact: true }).click();
      await expect.poll(() => new URL(page.url()).hash).toBe(hash);
    }
  });
});
