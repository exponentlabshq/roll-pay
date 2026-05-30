import { test, expect } from '@playwright/test';

/**
 * Hero loop (M2-F03 + M2-F04) — the two dopamine moments.
 *
 * Fresh demo session ⇒
 *   1. first tap of `Tap to Pay` on Card produces a free `$0.00`
 *      celebration rendered in Space Mono.
 *   2. first `Run the Draw` on Draw produces a `+$N` win celebration
 *      and the Home balance reflects the prize after dismissal.
 *
 * We bypass Splash/Onboarding via the dev-only `window.__rollStore`
 * handle so we exercise the hero loop directly without coupling this
 * spec to the onboarding copy (covered by supporting-flows.spec.ts).
 */
test.describe('hero loop', () => {
  // Mobile-only — the hero loop is tuned for 390×844.
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile-chrome',
      'hero loop runs on mobile-chrome only'
    );
  });

  test('first tap = $0.00 in Space Mono; first draw = win + balance bump', async ({
    page,
  }) => {
    await page.goto('/app/?demo=fresh');
    await page.waitForFunction(() => Boolean((window as any).__rollStore));

    // Programmatically complete onboarding so the first tap is still
    // guaranteed (sessionFlags.firstTap is a non-persisted runtime flag
    // and is unaffected by setState({onboarded: true})).
    await page.evaluate(() => {
      (window as any).__rollStore.setState({ onboarded: true });
      window.location.hash = '#/home';
    });

    const nav = page.locator('nav[aria-label="Primary"]');

    // Snapshot the Home balance BEFORE the draw so we can assert a
    // strict increase after the win dismisses.
    await nav.getByText('Home', { exact: true }).click();
    await expect(page.getByTestId('home-balance')).toBeVisible();
    const balanceBefore = await readCents(page);

    // --- First tap = free $0.00 -------------------------------------
    await nav.getByText('Card', { exact: true }).click();
    await page.getByTestId('tap-to-pay').click();

    const reveal = page.getByTestId('celebration-reveal');
    await expect(reveal).toBeVisible({ timeout: 3000 });
    await expect(reveal).toHaveText('$0.00');

    // The $0.00 element MUST be in Space Mono (brand rule §10 — the
    // loudest pixel). getComputedStyle returns the resolved stack with
    // 'Space Mono' as the first family on the celebration reveal.
    const family = await reveal.evaluate(
      (el) => getComputedStyle(el).fontFamily
    );
    expect(family).toContain('Space Mono');

    // Dismiss via the in-overlay button — clicking the overlay itself
    // also dismisses, but the button avoids relying on outer-click
    // hit-testing through the receipt card.
    await page.getByRole('button', { name: /tap to dismiss/i }).click();
    await expect(reveal).toBeHidden();

    // --- First draw = win + balance bump ---------------------------
    await nav.getByText('Draw', { exact: true }).click();
    await page.getByTestId('run-the-draw').click();

    const winReveal = page.getByTestId('celebration-reveal');
    await expect(winReveal).toBeVisible({ timeout: 3000 });
    await expect(winReveal).toHaveText(/^\+\$\d+/);
    await expect(page.getByTestId('celebration-overlay')).toBeVisible();

    await page.getByRole('button', { name: /tap to dismiss/i }).click();
    await expect(winReveal).toBeHidden();

    // Back to Home — balance must have increased by at least 1 cent.
    await nav.getByText('Home', { exact: true }).click();
    await expect(page.getByTestId('home-balance')).toBeVisible();
    const balanceAfter = await readCents(page);
    expect(balanceAfter).toBeGreaterThan(balanceBefore);
  });
});

/**
 * Parse the `$X.YZ` rendered on Home into integer cents. Falls back
 * to 0 if the element is missing.
 */
async function readCents(page: import('@playwright/test').Page): Promise<number> {
  const text = (await page.getByTestId('home-balance').textContent()) ?? '$0.00';
  const m = text.match(/\$?([0-9,]+)\.([0-9]{2})/);
  if (!m) return 0;
  const dollars = parseInt(m[1].replace(/,/g, ''), 10);
  const cents = parseInt(m[2], 10);
  return dollars * 100 + cents;
}
