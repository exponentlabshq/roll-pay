import { route } from 'preact-router';

/**
 * Splash screen (M3-F01).
 *
 * Full-bleed, chrome-less landing for a fresh demo. The brand rule
 * "dark sections need texture" is satisfied by a soft lime radial-glow
 * blob behind the wordmark. Single primary CTA — "Get Started" — pushes
 * the user into the Onboarding carousel.
 *
 * Fulfills:
 *   M3-A01 — `?demo=fresh` resets to Splash (routing handled in
 *            main.jsx; this component just renders the screen).
 *   M3-A02 — Roll logo + tagline + single CTA, no bottom nav (nav is
 *            hidden by App.jsx via the `/splash` route check).
 *   M3-A03 — Get Started advances to Onboarding screen 1.
 */
export default function Splash() {
  return (
    <section class="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Soft lime radial-glow blob — "dark sections need texture". */}
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(200,255,61,0.18) 0%, transparent 60%)',
        }}
      />

      {/* Centered content sits above the glow. */}
      <div class="relative flex flex-col items-center text-center">
        <h1 class="font-display text-7xl text-cream lowercase tracking-tight font-bold">
          roll
        </h1>
        <p class="font-display text-2xl text-text-muted mt-3">
          Buy now. Pay maybe.
        </p>

        <button
          type="button"
          onClick={() => route('/onboarding')}
          class="mt-16 bg-lime text-ink rounded-pill h-14 px-10 font-bold shadow-lime"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
