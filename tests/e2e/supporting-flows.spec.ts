import { test, expect } from '@playwright/test';

/**
 * Supporting flows: Splash → Onboarding (×3) → Home.
 *
 * Mirrors the Milestone-3 contract assertions for the cold-start
 * walkthrough. Runs in the mobile viewport because the splash + the
 * onboarding carousel are chrome-less full-bleed flows tuned for
 * 390×844.
 */
test.describe('supporting flows', () => {
  // Mobile-only — splash + onboarding are full-bleed mobile flows.
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile-chrome',
      'supporting flows run on mobile-chrome only'
    );
  });

  test('splash → onboarding ×3 → signup → home', async ({ page }) => {
    await page.goto('/app/?demo=fresh');

    // Splash always presents a single "Get Started" CTA.
    const start = page.getByRole('button', { name: /get started/i });
    await expect(start).toBeVisible();
    await start.click();

    // Onboarding screen 1 — copy 1 ("Hold money..."). The component
    // tags the active copy line with data-testid="onboarding-copy".
    const copy = page.getByTestId('onboarding-copy');
    await expect(copy).toContainText(/hold money/i);

    // Advance via the Next button (the swipe path is covered by the
    // Vitest unit suite for Onboarding).
    await page.getByRole('button', { name: /^next$/i }).click();
    await expect(copy).toContainText(/some purchases are free/i);
    await page.getByRole('button', { name: /^next$/i }).click();
    await expect(copy).toContainText(/opportunities that pay you/i);

    // Step 3 → sign-up form. Any non-empty input is accepted.
    await page.getByTestId('onboarding-copy'); // ensure final screen mounted
    await page.locator('input[aria-label="Sign up"] input, input[placeholder="email or phone"]').first().fill('test@example.com');
    await page.getByRole('button', { name: /^sign up$/i }).click();

    // Land on Home — hash routes to /home and bottom nav appears.
    await expect.poll(() => new URL(page.url()).hash).toBe('#/home');
    await expect(page.locator('nav[aria-label="Primary"]')).toBeVisible();
  });
});
