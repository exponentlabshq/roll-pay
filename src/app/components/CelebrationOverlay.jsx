/**
 * CelebrationOverlay — the full-screen receipt-style reveal that fires
 * when the user gets a Zero ($0.00 free purchase) or wins the Daily
 * Draw. This component owns the most important pixel in the app
 * (brand rule §10) — the BIG mono total — and is wrapped in a lime
 * radial glow with a confetti burst behind it.
 *
 * Props:
 *   - variant: 'free' | 'draw' — selects copy + amount source
 *   - amount:  number (cents) — only used by 'draw'; 'free' shows $0.00
 *   - onDismiss: () => void — called on click anywhere or after the
 *     auto-dismiss timeout (3500ms).
 *
 * Brand fidelity:
 *   - The reveal number is in `font-mono` (Space Mono) at the LARGEST
 *     font-size of any text in the overlay container (M2-A12).
 *   - Reveal is lime (`text-lime`) — the win color (M2-A11).
 *   - Confetti is overlaid behind the receipt card; it auto-disables
 *     under reduced-motion (M2-A13) via its own internal hook.
 *
 * Layout: `fixed inset-0 z-[100]` with an ink/90 backdrop and an
 * inset lime radial glow box-shadow to suggest the "win glow" effect.
 */
import { useEffect } from 'preact/hooks';
import Confetti from './Confetti.jsx';

const AUTO_DISMISS_MS = 3500;

export default function CelebrationOverlay({
  variant = 'free',
  amount = 0,
  onDismiss = () => {},
}) {
  // Auto-dismiss after 3.5s — long enough to read, short enough to
  // not over-trigger (brand §7: "earn the win"). Tap also dismisses.
  useEffect(() => {
    const id = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [onDismiss]);

  const isFree = variant === 'free';
  const merchant = isFree ? 'Blue Bottle Coffee · now' : 'Roll Daily Draw';
  const eyebrow = isFree ? 'You paid' : 'You won';
  const reveal = isFree ? '$0.00' : `+$${(amount / 100).toFixed(0)}`;
  const tagline = isFree ? 'On the house.' : 'Boom.';

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isFree ? 'Free purchase celebration' : 'Draw win celebration'}
      data-testid="celebration-overlay"
      onClick={onDismiss}
      class="fixed inset-0 z-[100] flex items-center justify-center px-6 cursor-pointer"
      style={{
        // Ink scrim + radial lime glow centered behind the receipt.
        backgroundColor: 'rgba(11,14,12,0.9)',
        backgroundImage:
          'radial-gradient(circle at 50% 50%, rgba(200,255,61,0.35) 0%, rgba(11,14,12,0) 60%)',
      }}
    >
      {/* Confetti is positioned absolute inside the overlay so it
          paints behind the receipt card but inside the lime glow. */}
      <Confetti />

      {/* Receipt-style card */}
      <div
        class="relative w-full max-w-sm rounded-lg bg-ink-soft p-6 shadow-lime"
        // Stop the auto-dismiss click on the receipt from propagating
        // when the user is interacting INSIDE the card — but per the
        // task, ANY click on overlay (including the dismiss button)
        // dismisses, so we let it propagate.
      >
        {/* merchant header */}
        <div class="flex items-center justify-between font-body text-xs uppercase tracking-wider text-text-muted">
          <span>{merchant}</span>
          <span aria-hidden="true">●●●</span>
        </div>

        {/* 1-line itemized list (free path only) */}
        {isFree && (
          <ul class="mt-4 font-mono text-sm text-cream space-y-1">
            <li class="flex justify-between">
              <span>Cortado</span>
              <span>$5.40</span>
            </li>
            <li class="flex justify-between">
              <span>Croissant</span>
              <span>$5.60</span>
            </li>
            <li class="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span>$11.00</span>
            </li>
          </ul>
        )}

        {/* eyebrow */}
        <p class="mt-6 font-body uppercase tracking-wider text-text-muted text-xs">
          {eyebrow}
        </p>

        {/* THE BIG REVEAL — must be the largest text in the overlay (M2-A12) */}
        <p
          data-testid="celebration-reveal"
          class="font-mono text-lime leading-none mt-2 text-7xl md:text-8xl"
        >
          {reveal}
        </p>

        {/* tagline */}
        <p class="mt-3 font-display text-2xl text-lime">{tagline}</p>

        {/* dismiss button — visible affordance even though tapping
            anywhere on the overlay also dismisses. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          class="mt-6 w-full min-h-[44px] h-11 rounded-pill border border-ink-line text-cream font-body text-sm"
        >
          Tap to dismiss
        </button>
      </div>
    </div>
  );
}
