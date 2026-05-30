/**
 * Tests for the deterministic mock spend engine.
 *
 * The "first tap of session = guaranteed free" invariant is the demo's
 * core dopamine moment, so we pin it with a loop of 50 trials. Everything
 * else is a pure function of inputs, so the only randomness is the 25%
 * "free" coin flip when firstTap=false — we cover that by:
 *   1. a statistical sanity check (≥1 non-free across 100 trials)
 *   2. a shape contract test
 *   3. a deterministic charged=amount test (Math.random stubbed)
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { rollSpend } from './mockSpendEngine';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('rollSpend', () => {
  it('firstTap=true always returns {free: true, charged: 0}', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollSpend({ amount: 1100, firstTap: true });
      expect(result).toEqual({ free: true, charged: 0 });
    }
  });

  it('firstTap=false produces some non-free results across 100 trials', () => {
    const results = Array.from({ length: 100 }, () =>
      rollSpend({ amount: 1100, firstTap: false })
    );
    expect(results.some((r) => r.free === false)).toBe(true);
  });

  it('returns shape { free: boolean, charged: number }', () => {
    const result = rollSpend({ amount: 1100, firstTap: false });
    expect(typeof result.free).toBe('boolean');
    expect(typeof result.charged).toBe('number');
  });

  it('charged equals amount when not free', () => {
    // Force the non-free branch by pinning Math.random above the 0.25 threshold.
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = rollSpend({ amount: 1100, firstTap: false });
    expect(result.free).toBe(false);
    expect(result.charged).toBe(1100);
  });
});
