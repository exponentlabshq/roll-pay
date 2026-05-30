/**
 * HoloCard — the signature Visa-style holo-chrome card on the Card
 * screen. Brand §6 "The Card" + §3.3 holo gradient.
 *
 * Visual:
 *   - 1.586 : 1 aspect (real ISO 7810 ID-1 card ratio).
 *   - Iridescent diagonal sweep across lime / cyan / coral / lime that
 *     animates its background-position from 0%→100% over 8s linearly,
 *     looping forever.
 *   - Animation is gated by `@media (prefers-reduced-motion: no-preference)`
 *     in CSS (see src/app/styles/app.css `@keyframes holoShift`), so
 *     turning on reduce-motion eliminates the animation but the card
 *     keeps its static iridescent paint (validation M2-A13).
 *
 * Card overlay (absolute inset-0):
 *   - top-left: lowercase "roll" wordmark in Bricolage Grotesque.
 *   - top-right: a small EMV-style chip (a static gradient block).
 *   - middle: mocked PAN "5212  ••••  ••••  0007" in Space Mono.
 *   - bottom row: "STABLECOIN · USDC" left + "VISA" right.
 *
 * Fulfills:
 *   - M2-A05 (gradient contains ≥2 of #C8FF3D / #5BE8FF / #FF5A36)
 *   - M2-A13 (reduced-motion → no continuous animation on card)
 */
export default function HoloCard() {
  return (
    <div
      data-testid="holo-card"
      class="holo-card relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-md"
      style={{
        // Brand §3.3 — holo-chrome card gradient. Inlined so the gradient
        // string is visible to computed-style assertions even before
        // the stylesheet finishes parsing.
        backgroundImage:
          'linear-gradient(120deg, #C8FF3D 0%, #5BE8FF 33%, #FF5A36 66%, #C8FF3D 100%)',
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 50%',
      }}
    >
      {/* Subtle ink scrim so the overlay text stays legible against the
          bright holo paint. Kept low-opacity per brand rule §10
          ("texture every dark section"). */}
      <div class="absolute inset-0 bg-ink/10 pointer-events-none" />

      <div class="absolute inset-0 p-5 flex flex-col justify-between">
        {/* top row: wordmark + EMV chip */}
        <div class="flex items-start justify-between">
          <span class="font-display text-2xl text-ink lowercase tracking-tight">
            roll
          </span>
          <div
            aria-hidden="true"
            class="w-10 h-7 rounded-sm border border-ink/40"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #d4b85a 0%, #f1dd84 40%, #b8973a 100%)',
            }}
          />
        </div>

        {/* PAN */}
        <p class="font-mono text-lg text-ink tracking-wider">
          5212&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;0007
        </p>

        {/* bottom row: rail label + network */}
        <div class="flex items-end justify-between">
          <span class="font-body text-xs uppercase tracking-wider text-ink/70">
            Stablecoin · USDC
          </span>
          <span class="font-display text-ink italic">VISA</span>
        </div>
      </div>
    </div>
  );
}
