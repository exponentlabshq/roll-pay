import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useRollStore, entries as entriesSelector } from '../store/index.js';

/**
 * Home dashboard (M2-F02).
 *
 * Layout (mobile-first 390px):
 *   - top app bar: "roll" wordmark + a settings cog (acts as a tiny
 *     ResetDemoButton for now — taps store.reset() and routes back to
 *     /splash so the demo can be restarted in one tap).
 *   - eyebrow "BALANCE" label + the BIG mono balance (Space Mono,
 *     clamp(2.5rem,12vw,4.5rem)) — the loudest pixel on the screen.
 *   - row: "You have N entries" and "Next draw in HHh MMm".
 *     The countdown re-renders every 1s via a local clock state; the
 *     balance re-renders on each store change driven by tickYield in
 *     main.jsx.
 *   - 2-column CTA grid: secondary Add Money + primary lime Card.
 *
 * Fulfills:
 *   M2-A01 (mono balance), M2-A02 (ticks up over 10s — store-driven),
 *   M2-A03 (entries + countdown), M2-A04 (CTAs reachable in one tap).
 */

function formatDollars(cents) {
  return (cents / 100).toFixed(2);
}

function formatCountdown(ms) {
  const clamped = Math.max(0, ms);
  const h = Math.floor(clamped / 3_600_000);
  const m = Math.floor((clamped % 3_600_000) / 60_000);
  const s = Math.floor((clamped % 60_000) / 1000);
  // HH MM SS — seconds make the 1s re-render visible (M2-A03 expects
  // the displayed value to decrease when re-read after 2 seconds).
  return `${h}h ${m}m ${String(s).padStart(2, '0')}s`;
}

export default function Home() {
  const balance = useRollStore((s) => s.balance);
  const nextDrawAt = useRollStore((s) => s.nextDrawAt);
  const entries = useRollStore(entriesSelector);
  const reset = useRollStore((s) => s.reset);

  // Local clock state — bumped every second so the countdown re-renders
  // without needing the store to update. Cleared on unmount.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleReset = () => {
    reset();
    route('/splash');
  };

  return (
    <section class="px-6 pt-6">
      {/* Top app bar */}
      <header class="flex items-center justify-between">
        <span class="font-display text-2xl text-cream lowercase tracking-tight">
          roll
        </span>
        <button
          type="button"
          aria-label="Reset demo"
          onClick={handleReset}
          class="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted"
        >
          <span aria-hidden="true" class="text-2xl leading-none">⚙</span>
        </button>
      </header>

      {/* Eyebrow + BIG balance */}
      <div class="mt-10">
        <p class="font-body uppercase tracking-wider text-text-muted text-xs">
          Balance
        </p>
        <p
          data-testid="home-balance"
          class="font-mono text-cream leading-none mt-2"
          style={{ fontSize: 'clamp(2.5rem, 12vw, 4.5rem)' }}
        >
          ${formatDollars(balance)}
        </p>
      </div>

      {/* Entries + Countdown */}
      <div class="mt-6 flex items-center justify-between font-body text-sm text-text-muted">
        <span>
          You have{' '}
          <span data-testid="home-entries" class="text-cream font-semibold">
            {entries}
          </span>{' '}
          entries
        </span>
        <span>
          Next draw in{' '}
          <span data-testid="home-countdown" class="text-cream font-semibold">
            {formatCountdown(nextDrawAt - now)}
          </span>
        </span>
      </div>

      {/* CTAs */}
      <div class="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => route('/add')}
          class="w-full min-h-12 h-12 px-6 rounded-pill bg-transparent border border-[#FFF7E6]/30 text-cream font-body"
        >
          Add Money
        </button>
        <button
          type="button"
          onClick={() => route('/card')}
          class="w-full min-h-12 h-12 px-6 rounded-pill bg-lime text-ink font-bold shadow-lime"
        >
          Card
        </button>
      </div>
    </section>
  );
}
