import { useEffect, useState } from 'preact/hooks';
import CelebrationOverlay from '../components/CelebrationOverlay.jsx';
import { useRollStore, entries as entriesSelector } from '../store/index.js';

/**
 * Draw screen (M2-F04) — the second dopamine moment of the demo.
 *
 * Layout (mobile-first 390×844):
 *   - top: 'PRIZE' eyebrow + the big display-font 'WIN $100' (lime).
 *   - "You have N entries" pulled live from the entries selector
 *     (floor(balance/500) + 5).
 *   - HH:MMm countdown to `store.nextDrawAt`, re-rendered every minute
 *     (a fresh seed sits ~24 h out so seconds aren't meaningful).
 *   - explainer panel with the literal copy 'More balance = more
 *     entries' — M2-A09 asserts this exact substring (case-insensitive).
 *   - primary 'Run the Draw' demo trigger button (h-14, bg-lime,
 *     text-ink, full-width, font-bold). This is the dopamine button.
 *   - muted compliance note 'No purchase necessary. The Daily Roll is
 *     always free.' so the sweepstakes framing is honest.
 *
 * Trigger flow:
 *   - On click, call store.recordDraw() (defaults to a 10000-cent /
 *     $100 prize pool). The first draw of a fresh session is
 *     guaranteed to win via sessionFlags.firstDraw → mockDrawEngine.
 *   - WIN: render <CelebrationOverlay variant="draw" amount={prize}/>
 *     which paints '+$100' in font-mono text-lime at the largest font
 *     size, with confetti. Dismiss with tap or 3.5s auto-dismiss.
 *   - LOSS: render an inline muted card "Not this time — streak safe,
 *     +Clovers" — NO overlay, NO confetti (subsequent draws only).
 *
 * Fulfills:
 *   - M2-A09 (prize + entries + 'More balance = more entries' copy)
 *   - M2-A10 (first-draw guaranteed win, balance += prize)
 *   - M2-A11 (lime as the win color in the celebration)
 */
function formatCountdown(ms) {
  const clamped = Math.max(0, ms);
  const h = Math.floor(clamped / 3_600_000);
  const m = Math.floor((clamped % 3_600_000) / 60_000);
  // Format as "HHh MMm" so M2-A09 can find the countdown next to the
  // entries count. Padding minutes keeps the layout from jumping
  // between single- and double-digit values.
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

const PRIZE_POOL_CENTS = 10000; // $100 — must match store.recordDraw default.

export default function Draw() {
  const nextDrawAt = useRollStore((s) => s.nextDrawAt);
  const entries = useRollStore(entriesSelector);
  const recordDraw = useRollStore((s) => s.recordDraw);

  // Local clock so the countdown re-renders on its own. The nextDrawAt
  // sits ~24 h out so we only need minute-level resolution; 30s is
  // plenty and avoids a wasteful 1Hz tick on this screen.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Celebration state: 'win' shows the overlay; 'loss' shows an inline
  // muted card; null is the resting state.
  const [outcome, setOutcome] = useState(null);
  const [prize, setPrize] = useState(0);

  // Auto-clear the muted loss card after 3 s so the trigger is
  // re-armed without forcing the user to dismiss anything.
  useEffect(() => {
    if (outcome !== 'loss') return;
    const id = setTimeout(() => setOutcome(null), 3000);
    return () => clearTimeout(id);
  }, [outcome]);

  function handleRunDraw() {
    const result = recordDraw(PRIZE_POOL_CENTS);
    if (result.win) {
      setPrize(result.prize);
      setOutcome('win');
    } else {
      setOutcome('loss');
    }
  }

  return (
    <section class="px-6 pt-8">
      {/* PRIZE eyebrow + big display amount */}
      <p
        class="font-body uppercase tracking-wider text-text-muted text-xs"
        data-testid="draw-prize-label"
      >
        Prize
      </p>
      <h1
        data-testid="draw-prize-amount"
        class="font-display text-5xl text-lime leading-none mt-2"
      >
        WIN ${PRIZE_POOL_CENTS / 100}
      </h1>

      {/* Entries + countdown row */}
      <div class="mt-6 flex items-center justify-between font-body text-sm text-text-muted">
        <span>
          You have{' '}
          <span data-testid="draw-entries" class="text-cream font-semibold">
            {entries}
          </span>{' '}
          entries
        </span>
        <span>
          Next draw in{' '}
          <span data-testid="draw-countdown" class="text-cream font-semibold">
            {formatCountdown(nextDrawAt - now)}
          </span>
        </span>
      </div>

      {/* Explainer panel — M2-A09 wants the literal substring
          "More balance = more entries". Kept as a single heading so a
          textContent scan picks it up unambiguously. */}
      <div
        data-testid="draw-explainer"
        class="mt-6 rounded-md bg-ink-soft p-4"
      >
        <p class="font-display text-lg text-cream">
          More balance = more entries
        </p>
        <p class="mt-1 font-body text-sm text-text-muted">
          Every $5 you hold earns you another shot at the Daily Roll.
        </p>
      </div>

      {/* Primary trigger — full-width lime pill */}
      <button
        type="button"
        data-testid="run-the-draw"
        onClick={handleRunDraw}
        class="mt-8 w-full h-14 min-h-[44px] rounded-pill bg-lime text-ink font-body font-bold text-lg shadow-lime"
      >
        Run the Draw
      </button>

      {/* Inline muted loss card — no overlay, no confetti. Only shown
          AFTER the first-draw guarantee has been spent. */}
      {outcome === 'loss' && (
        <div
          data-testid="draw-loss-card"
          class="mt-4 rounded-md bg-ink-soft p-4 font-body text-sm text-text-muted text-center"
        >
          Not this time — streak safe, +Clovers
        </div>
      )}

      {/* Muted AMOE compliance note */}
      <p class="mt-6 font-body text-xs text-text-muted text-center">
        No purchase necessary. The Daily Roll is always free.
      </p>

      {/* Celebration overlay — only on a win. Reuses the M2-F03
          component; variant='draw' renders '+$N' in lime mono. */}
      {outcome === 'win' && (
        <CelebrationOverlay
          variant="draw"
          amount={prize}
          onDismiss={() => setOutcome(null)}
        />
      )}
    </section>
  );
}
