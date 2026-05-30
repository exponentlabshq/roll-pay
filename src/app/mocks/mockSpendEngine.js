/**
 * mockSpendEngine — pure function that decides whether a single
 * Tap-to-Pay roll is free or charged.
 *
 * Guarantees:
 *   - If `firstTap` is true: always returns { free: true, charged: 0 }.
 *     This is the demo's "first tap of the session = guaranteed Zero"
 *     dopamine moment.
 *   - Otherwise: a 25% chance of free (charged=0); 75% charged (=amount).
 *
 * No side effects, no I/O. Caller owns sessionFlags and transaction
 * history; this only resolves a single outcome.
 *
 * Asserted by:
 *   - M2-A14 unit-test contract
 *   - mockSpendEngine.test.js (4 tests, deterministic + statistical)
 */
export function rollSpend({ amount, firstTap }) {
  if (firstTap) return { free: true, charged: 0 };
  const free = Math.random() < 0.25;
  return { free, charged: free ? 0 : amount };
}
