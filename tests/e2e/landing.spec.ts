import { test, expect } from '@playwright/test';

/**
 * Landing-page smoke (M4-A10 e2e coverage for `/`).
 *
 * The landing page is a vanilla JS Vite entry. Its only invariant
 * during this PWA mission is that it must continue to render its
 * pre-mission hero (split across two `<span class="ln">` lines) and
 * the holo-chrome card visual without redirecting to `/app/`.
 *
 * Restricted to the desktop-chrome project — the mobile-chrome run
 * uses a 393×851 viewport which would re-flow the desktop hero in
 * ways unrelated to this feature; desktop is the canonical surface
 * for the landing per `reference/`.
 */
test.describe('landing', () => {
  // Run only in desktop-chrome — the landing is desktop-tuned.
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop-chrome',
      'landing assertions run on desktop-chrome only'
    );
  });

  test('renders hero headline and holo card', async ({ page }) => {
    await page.goto('/');

    // The pre-mission hero ("Buy now." / "Pay maybe.") is split across
    // two <span class="ln"> lines inside an h1.hero-title. Concatenate
    // the h1 textContent and assert it contains either fragment so we
    // pass regardless of any line-break whitespace.
    const heroText = (await page.locator('h1.hero-title').textContent()) ?? '';
    expect(heroText.toLowerCase()).toMatch(/buy now/);
    expect(heroText.toLowerCase()).toMatch(/pay maybe/);

    // The holo card visual lives inside the hero (id="tiltCard"). It
    // is the signature visual element of the landing.
    await expect(page.locator('.holo-card')).toBeVisible();

    // Sanity: the landing did NOT redirect to /app/.
    expect(new URL(page.url()).pathname).toBe('/');
  });
});
