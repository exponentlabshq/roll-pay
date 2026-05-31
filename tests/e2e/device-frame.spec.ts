import { test, expect } from '@playwright/test';

/**
 * Device-frame overlay (M5-F01).
 *
 * Two surfaces both wrap the live PWA in an iPhone 17 Pro Max-style
 * mock when the viewport is ≥ 768px:
 *
 *   - Surface A — landing page `/` `#play` section: the live `/app/`
 *     rendered inside an iframe inside a `.device-frame` block.
 *   - Surface B — the PWA itself at `/app/`: `<DeviceFrame>` wraps
 *     the app shell (root `<main>`) so the BottomNav pins to the
 *     phone frame's inner bottom rather than the window's.
 *
 * Below 768px both surfaces fall back to the pre-frame behaviour:
 *   - The landing `#play` section's `.device-frame` block is hidden
 *     by media query.
 *   - The PWA's `<DeviceFrame>` becomes a passthrough (renders
 *     `{children}` verbatim, no wrapper).
 *
 * The two viewports come from the two Playwright projects defined in
 * `playwright.config.ts`: `mobile-chrome` (Pixel 5 — 393×851) for the
 * < 768px assertions and `desktop-chrome` (1280×720 default) for the
 * ≥ 768px assertions.
 */

const PWA_DEMO_URL = '/app/?demo=fresh';

test.describe('device frame — mobile passthrough', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile-chrome',
      'mobile passthrough only runs on mobile-chrome'
    );
  });

  test('PWA at /app/ renders edge-to-edge (no frame wrapper)', async ({ page }) => {
    await page.goto(PWA_DEMO_URL);
    // Wait for the PWA to mount.
    await page.waitForFunction(() => Boolean((window as any).__rollStore));

    // The DeviceFrame returns the children verbatim below 768px, so
    // neither the frame nor the wrapping stage element should exist.
    await expect(page.locator('[data-testid="device-frame"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="device-frame-stage"]')).toHaveCount(0);

    // The app's root <main> should span the body's full width
    // (mobile-first, edge-to-edge).
    const widths = await page.evaluate(() => ({
      body: document.body.clientWidth,
      main: document.querySelector('main')?.clientWidth ?? 0,
    }));
    expect(widths.main).toBe(widths.body);
  });

  test('landing /#play frame is hidden via media query', async ({ page }) => {
    await page.goto('/');
    // The element exists in the DOM but `display: none` per
    // src/styles/device-frame.css's `@media (max-width: 767px)` rule.
    const frame = page.locator('#play .device-frame');
    await expect(frame).toHaveCount(1);
    const display = await frame.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('none');
  });
});

test.describe('device frame — desktop overlay', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop-chrome',
      'desktop frame only runs on desktop-chrome'
    );
  });

  test('PWA at /app/ is wrapped in a 470×990 frame with 440×956 inner viewport', async ({
    page,
  }) => {
    await page.goto(PWA_DEMO_URL);
    await page.waitForFunction(() => Boolean((window as any).__rollStore));

    const frame = page.locator('[data-testid="device-frame"]');
    const inner = page.locator('[data-testid="device-frame-inner"]');
    await expect(frame).toBeVisible();
    await expect(inner).toBeVisible();

    const frameBox = await frame.boundingBox();
    const innerBox = await inner.boundingBox();
    expect(frameBox).not.toBeNull();
    expect(innerBox).not.toBeNull();
    // Outer frame is 470×990 (±10 px tolerance for sub-pixel layout).
    expect(Math.abs((frameBox!.width ?? 0) - 470)).toBeLessThanOrEqual(10);
    expect(Math.abs((frameBox!.height ?? 0) - 990)).toBeLessThanOrEqual(10);
    // Inner viewport is the iPhone 17 Pro Max logical size, 440×956.
    expect(Math.abs((innerBox!.width ?? 0) - 440)).toBeLessThanOrEqual(5);
    expect(Math.abs((innerBox!.height ?? 0) - 956)).toBeLessThanOrEqual(5);
  });

  test('PWA bottom-nav pins to the bottom of the inner viewport, not the window', async ({
    page,
  }) => {
    await page.goto(PWA_DEMO_URL);
    await page.waitForFunction(() => Boolean((window as any).__rollStore));

    // Bypass Splash/Onboarding so the BottomNav renders.
    await page.evaluate(() => {
      (window as any).__rollStore.setState({ onboarded: true });
      window.location.hash = '#/home';
    });

    const nav = page.locator('nav[aria-label="Primary"]');
    const inner = page.locator('[data-testid="device-frame-inner"]');
    await expect(nav).toBeVisible();
    await expect(inner).toBeVisible();

    // The fixed-position nav is captured by the inner viewport's
    // containing block (via translateZ(0)), so its bottom edge
    // matches the inner viewport's bottom edge — NOT the window's
    // bottom edge (which would be `viewport.height`).
    const innerBox = await inner.boundingBox();
    const navBox = await nav.boundingBox();
    expect(innerBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(Math.abs((navBox!.y + navBox!.height) - (innerBox!.y + innerBox!.height))).toBeLessThanOrEqual(2);
  });

  test('landing /#play renders the live PWA inside a phone frame', async ({ page }) => {
    await page.goto('/');
    const frame = page.locator('#play .device-frame');
    await frame.scrollIntoViewIfNeeded();
    await expect(frame).toBeVisible();

    // The frame holds an iframe pointing at the demo entry of /app/.
    const iframe = frame.locator('iframe.device-frame__iframe');
    await expect(iframe).toHaveCount(1);
    const src = await iframe.getAttribute('src');
    expect(src).toMatch(/\/app\/\?demo=fresh$/);

    // Same physical dimensions as Surface B's inner viewport.
    const iframeBox = await iframe.boundingBox();
    expect(iframeBox).not.toBeNull();
    expect(Math.abs((iframeBox!.width ?? 0) - 440)).toBeLessThanOrEqual(5);
    expect(Math.abs((iframeBox!.height ?? 0) - 956)).toBeLessThanOrEqual(5);
  });
});
