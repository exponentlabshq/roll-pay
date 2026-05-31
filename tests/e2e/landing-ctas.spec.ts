import { test, expect } from '@playwright/test';

/**
 * Landing-page CTA wiring (M4-A10+).
 *
 * The marketing landing at `/` has three "Get the app" entry points
 * (nav, hero, and the dedicated `#get` section) plus a nav "Log in"
 * button. All four must point at the PWA at `/app/` so a visitor can
 * showcase the app from the marketing page:
 *
 *   - "Log in"             → `/app/`            (lands on Home if onboarded, else Splash)
 *   - "Get the app" (×3)   → `/app/?demo=fresh` (wipes the demo store for the full Splash→Onboarding→Home flow)
 *
 * The footer "Get the app" anchor is intentionally NOT covered here —
 * it remains an on-page nav link to the `#get` section.
 *
 * Restricted to the desktop-chrome project for the same reason as
 * `landing.spec.ts`: the landing is desktop-tuned and the mobile
 * viewport re-flows the hero in ways unrelated to this feature.
 */
test.describe('landing CTAs', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop-chrome',
      'landing-cta assertions run on desktop-chrome only'
    );
  });

  test('nav and hero CTAs point at the PWA demo', async ({ page }) => {
    await page.goto('/');

    // Nav "Log in" → /app/
    const navLogin = page.locator('.nav-cta a.btn-ghost');
    await expect(navLogin).toHaveAttribute('href', /\/app\/$/);

    // Nav "Get the app" → /app/?demo=fresh
    const navGet = page.locator('.nav-cta a.btn-primary');
    await expect(navGet).toHaveAttribute('href', /\/app\/\?demo=fresh$/);

    // Hero "Get the app →" → /app/?demo=fresh
    const heroGet = page.locator('.hero-cta a.btn-primary');
    await expect(heroGet).toHaveAttribute('href', /\/app\/\?demo=fresh$/);

    // #get section "Get the app →" (btn-dark) → /app/?demo=fresh
    const finalGet = page.locator('#get a.btn-dark');
    await expect(finalGet).toHaveAttribute('href', /\/app\/\?demo=fresh$/);
  });

  test('clicking nav "Get the app" navigates to /app/?demo=fresh', async ({ page }) => {
    await page.goto('/');

    // Click the nav CTA and wait for the URL to change to the PWA demo
    // entry. `waitForURL` resolving with this pattern is itself the
    // navigation assertion — at the instant the SPA loads, the URL
    // contains `/app/?demo=fresh`. The PWA's demo bootstrap then
    // consumes the `?demo=fresh` flag and uses `history.replaceState`
    // to drop the query before routing to `#/splash`, so we only
    // assert the lasting pathname (`/app/`) afterwards.
    await Promise.all([
      page.waitForURL(/\/app\/\?demo=fresh/),
      page.locator('.nav-cta a.btn-primary').click(),
    ]);

    expect(new URL(page.url()).pathname).toBe('/app/');
  });
});
