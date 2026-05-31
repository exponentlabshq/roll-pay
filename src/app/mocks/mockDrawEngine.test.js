/**
 * Tests for the deterministic mock draw engine.
 *
 * The "first draw of session = guaranteed win" guarantee is the demo's
 * second dopamine moment. We pin it with a loop of 50 trials. We also
 * assert the odds cap (≤ 50% win rate even at very high entries) by
 * stubbing Math.random with values straddling the 0.5 boundary —
 * this verifies the clamp deterministically rather than via statistical
 * sampling (which was flaky at 1000 trials with observed rates up to
 * 0.529).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { rollDraw } from './mockDrawEngine';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('rollDraw', () => {
  it('firstDraw=true returns { win: true, prize: pool }', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollDraw({ entries: 5, prizePool: 10000, firstDraw: true });
      expect(result.win).toBe(true);
      expect(typeof result.prize).toBe('number');
      expect(result.prize).toBeGreaterThan(0);
      expect(result.prize).toBe(10000);
    }
  });

  it('firstDraw=false with entries=0 always returns { win: false, prize: 0 }', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDraw({ entries: 0, prizePool: 10000, firstDraw: false });
      expect(result).toEqual({ win: false, prize: 0 });
    }
  });

  it('prize is a positive number when win=true', () => {
    // First-draw guarantee is the easiest way to force a win deterministically.
    const result = rollDraw({ entries: 0, prizePool: 10000, firstDraw: true });
    expect(result.win).toBe(true);
    expect(typeof result.prize).toBe('number');
    expect(result.prize).toBeGreaterThan(0);
  });

  it('win rate stays ≤ 50% even at high entries (odds cap)', () => {
    // The engine computes `odds = min(0.5, entries/100)`. With
    // entries=200 (which would otherwise be 2.0), odds must be clamped
    // to exactly 0.5. We verify this deterministically by sampling
    // Math.random at values straddling that 0.5 boundary.
    const randSpy = vi.spyOn(Math, 'random');

    // Just BELOW the 0.5 clamp → win (random < odds).
    randSpy.mockReturnValueOnce(0.499);
    const winResult = rollDraw({ entries: 200, prizePool: 10000, firstDraw: false });
    expect(winResult.win).toBe(true);
    expect(winResult.prize).toBe(10000);

    // Just ABOVE the 0.5 clamp → loss. If the clamp were missing,
    // entries/100 = 2.0 would treat all randoms as a win; this asserts
    // the cap is in force.
    randSpy.mockReturnValueOnce(0.501);
    const lossResult = rollDraw({ entries: 200, prizePool: 10000, firstDraw: false });
    expect(lossResult.win).toBe(false);
    expect(lossResult.prize).toBe(0);

    // Exactly at the 0.5 boundary → loss as well (strict `<` in engine).
    randSpy.mockReturnValueOnce(0.5);
    const boundaryResult = rollDraw({ entries: 1000, prizePool: 10000, firstDraw: false });
    expect(boundaryResult.win).toBe(false);
  });
});
