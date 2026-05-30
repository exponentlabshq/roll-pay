/**
 * Tests for the deterministic mock draw engine.
 *
 * The "first draw of session = guaranteed win" guarantee is the demo's
 * second dopamine moment. We pin it with a loop of 50 trials. We also
 * assert the odds cap (≤ 50% win rate even at very high entries) to
 * prevent any future tweak from making the draw a guaranteed payout
 * that breaks expectations.
 */
import { describe, it, expect } from 'vitest';
import { rollDraw } from './mockDrawEngine';

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
    const trials = 1000;
    let wins = 0;
    for (let i = 0; i < trials; i++) {
      const result = rollDraw({ entries: 500, prizePool: 10000, firstDraw: false });
      if (result.win) wins++;
    }
    const winRate = wins / trials;
    expect(winRate).toBeLessThanOrEqual(0.5);
  });
});
