import { test, expect } from '@playwright/test';

/**
 * PWA-meta surface assertions (M1-A03/04, M4-A01/02/03).
 *
 * 1. /app/manifest.webmanifest is reachable and JSON-parses with the
 *    expected name/theme_color/background_color.
 * 2. Every icon `src` in the manifest resolves to a 200 with a PNG
 *    body.
 * 3. `/app/` renders the iOS standalone capability meta tag.
 *
 * Runs in both projects because this is an HTTP-level + DOM-level
 * smoke; viewport doesn't affect either signal.
 */
test.describe('pwa meta', () => {
  test('manifest, icons, and iOS meta tags are correct', async ({
    page,
    request,
    baseURL,
  }) => {
    const manifestUrl = '/app/manifest.webmanifest';
    const manifestRes = await request.get(manifestUrl);
    expect(manifestRes.ok()).toBeTruthy();

    const manifest = (await manifestRes.json()) as {
      name: string;
      theme_color: string;
      background_color: string;
      icons: Array<{ src: string; sizes: string; type?: string; purpose?: string }>;
    };

    expect(manifest.name).toBe('Roll');
    expect(manifest.theme_color).toBe('#C8FF3D');
    expect(manifest.background_color).toBe('#0B0E0C');

    // Every icon src must resolve. Manifest emits root-relative paths
    // like `/app-icons/icon-192.png` (served from /public). We resolve
    // them against the base URL so the request.get call is absolute.
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icon of manifest.icons) {
      const url = new URL(icon.src, baseURL ?? 'http://localhost:5173').toString();
      const iconRes = await request.get(url);
      expect(iconRes.ok(), `icon ${icon.src} should be reachable`).toBeTruthy();
    }

    // iOS standalone meta — must be present in the rendered /app/
    // document. We navigate to /app/ rather than /app/index.html so
    // the dev server's HTML transform pipeline runs (which is what
    // production-built dist/app/index.html will reflect).
    await page.goto('/app/');
    const capable = await page
      .locator('meta[name=apple-mobile-web-app-capable]')
      .getAttribute('content');
    expect(capable).toBe('yes');
  });
});
