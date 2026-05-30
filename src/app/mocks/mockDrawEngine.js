/**
 * mockDrawEngine — pure function that decides whether a single Daily
 * Roll draw is a win.
 *
 * Guarantees:
 *   - If `firstDraw` is true: always returns { win: true, prize: prizePool }.
 *     This is the demo's "first draw of the session = guaranteed Win"
 *     dopamine moment.
 *   - Otherwise: win probability = min(0.5, entries / 100). This caps
 *     the win rate at 50% no matter how many entries a user has, so
 *     the draw stays meaningful rather than guaranteed.
 *
 * No side effects, no I/O. Caller owns sessionFlags and balance
 * accounting; this only resolves a single outcome.
 *
 * Asserted by:
 *   - M2-A15 unit-test contract
 *   - mockDrawEngine.test.js (4 tests, deterministic + statistical)
 */
export function rollDraw({ entries = 0, prizePool = 10000, firstDraw }) {
  if (firstDraw) return { win: true, prize: prizePool };
  const odds = Math.min(0.5, entries / 100);
  const win = Math.random() < odds;
  return { win, prize: win ? prizePool : 0 };
}
