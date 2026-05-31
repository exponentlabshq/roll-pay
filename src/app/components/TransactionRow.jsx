/**
 * TransactionRow (M3-F04) — a single row in the Card screen's
 * "Recent" transactions list.
 *
 * Props:
 *   tx — { id, merchant, amount (cents), free (bool), ts (epoch ms) }
 *
 * Visual contract (M3-A14):
 *   - Free transactions: lime "FREE" chip on the merchant line +
 *     amount "$0.00" rendered in font-mono lime. The lime treatment
 *     is the "this one was on us" signal.
 *   - Normal transactions: amount "$X.XX" rendered in font-mono cream.
 *     No chip.
 *
 * Brand fidelity:
 *   - Money is always Space Mono (font-mono).
 *   - Lime (#C8FF3D) only on the win — i.e. the free chip + $0.00.
 *   - Merchant + relative time use the body face on cream / muted-cream.
 */
function formatDollars(cents) {
  return (cents / 100).toFixed(2);
}

// Relative-time formatter — "just now" / "Nm ago" / "Nh ago" / "Nd ago".
// Keeps the row dense without pulling in a date library.
function formatRelative(ts) {
  if (!ts || typeof ts !== 'number') return '';
  const delta = Date.now() - ts;
  if (delta < 60_000) return 'just now';
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(delta / 3_600_000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(delta / 86_400_000);
  return `${days}d ago`;
}

export default function TransactionRow({ tx }) {
  if (!tx) return null;
  const isFree = tx.free === true;
  const displayCents = isFree ? 0 : tx.amount;

  return (
    <li
      data-testid="transaction-row"
      data-free={isFree ? 'true' : 'false'}
      class="flex items-center w-full py-3 border-b border-ink-line/40"
    >
      {/* Left column: merchant + relative time */}
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-body text-cream text-sm truncate">
            {tx.merchant}
          </span>
          {isFree && (
            <span
              data-testid="free-chip"
              class="bg-lime text-ink rounded-pill px-2 py-0.5 font-mono text-xs uppercase tracking-wider"
            >
              FREE
            </span>
          )}
        </div>
        <div class="font-body text-text-muted text-xs mt-0.5">
          {formatRelative(tx.ts)}
        </div>
      </div>

      {/* Right column: amount */}
      <div class="pl-3 flex-shrink-0">
        <span
          data-testid="transaction-amount"
          class={
            isFree
              ? 'font-mono text-lime text-sm'
              : 'font-mono text-cream text-sm'
          }
        >
          ${formatDollars(displayCents)}
        </span>
      </div>
    </li>
  );
}
