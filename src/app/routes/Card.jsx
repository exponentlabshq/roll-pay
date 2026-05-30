import { useEffect, useState } from 'preact/hooks';
import HoloCard from '../components/HoloCard.jsx';
import CelebrationOverlay from '../components/CelebrationOverlay.jsx';
import { useRollStore } from '../store/index.js';

/**
 * Card route (M2-F03) — the Tap-to-Pay hero screen.
 *
 * Layout (mobile-first 390×844):
 *   - <HoloCard/> — the signature iridescent Visa-style card.
 *   - "Tap to Pay" primary CTA — lime fill, ink text, pill radius,
 *     ≥44×44 (M2-A06). On press, store.recordTap() runs and the result
 *     drives the celebration UX.
 *   - subtle microcopy under the CTA explaining the "Maybe" honestly.
 *   - transactions list placeholder div (filled out in M3-F08).
 *
 * Celebration behavior:
 *   - On a FREE result we render the full-screen <CelebrationOverlay
 *     variant="free"/> (M2-A07 + M2-A11 + M2-A12).
 *   - On a CHARGED result we render a short inline confirmation
 *     "Charged $X.XX — not this time" that fades after ~2s (M2-A08
 *     evidence path — at least one of five follow-up taps will hit
 *     this branch under the 25% free / 75% charged engine).
 *
 * The very first tap of a fresh session is guaranteed free via the
 * store's `sessionFlags.firstTap` flag → mockSpendEngine.
 */
function formatDollars(cents) {
  return (cents / 100).toFixed(2);
}

export default function Card() {
  const recordTap = useRollStore((s) => s.recordTap);
  const [overlay, setOverlay] = useState(null); // 'free' or null
  const [chargedToast, setChargedToast] = useState(null); // {amount} or null

  // Clear the charged-toast 2 s after it appears.
  useEffect(() => {
    if (!chargedToast) return;
    const id = setTimeout(() => setChargedToast(null), 2000);
    return () => clearTimeout(id);
  }, [chargedToast]);

  function handleTap() {
    const result = recordTap();
    if (result.free) {
      setOverlay('free');
    } else {
      setChargedToast({ amount: result.charged });
    }
  }

  return (
    <section class="px-6 pt-8">
      <h1 class="font-display text-3xl text-cream">Card</h1>

      <div class="mt-6">
        <HoloCard />
      </div>

      <button
        type="button"
        data-testid="tap-to-pay"
        onClick={handleTap}
        class="mt-8 w-full h-14 min-h-[44px] rounded-pill bg-lime text-ink font-body font-bold text-lg shadow-lime"
      >
        Tap to Pay
      </button>

      <p class="mt-3 font-body text-xs text-text-muted text-center">
        Every tap is a roll. Maybe it's on us.
      </p>

      {chargedToast && (
        <p
          data-testid="charged-toast"
          class="mt-4 font-mono text-sm text-cream text-center"
        >
          Charged ${formatDollars(chargedToast.amount)} — not this time
        </p>
      )}

      <div
        data-testid="transactions-placeholder"
        class="mt-8 rounded-md bg-ink-soft p-4 font-body text-sm text-text-muted"
      >
        Recent activity will appear here.
      </div>

      {overlay === 'free' && (
        <CelebrationOverlay
          variant="free"
          amount={0}
          onDismiss={() => setOverlay(null)}
        />
      )}
    </section>
  );
}
