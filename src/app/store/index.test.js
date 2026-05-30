/**
 * Tests for the Roll PWA Zustand store.
 *
 * These tests pin down the contract that downstream features (hero loop,
 * onboarding, demo-fresh reset) all depend on:
 *   1. The default state shape (balance/entries/onboarded/sessionFlags).
 *   2. addMoney mutates balance correctly.
 *   3. Zustand `persist` round-trips state through localStorage under
 *      the key `roll-pwa-store`.
 *   4. `sessionFlags` is excluded from persistence via `partialize` so
 *      the "first tap = guaranteed free" guarantee resets on every load.
 *   5. `reset()` restores all defaults.
 *
 * Each test uses `vi.resetModules()` + a fresh dynamic import so the
 * Zustand store's `create()` runs against a clean module-level closure.
 * We also clear localStorage between tests so persisted state from one
 * test does not bleed into the next.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { entries as entriesSelector } from './index.js';

const STORAGE_KEY = 'roll-pwa-store';

async function freshStore() {
  vi.resetModules();
  const mod = await import('./index.js');
  return mod;
}

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

describe('useRollStore — default state', () => {
  it('uses the documented defaults on first load', async () => {
    const { useRollStore } = await freshStore();
    const s = useRollStore.getState();
    expect(s.balance).toBe(2000);
    expect(s.onboarded).toBe(false);
    expect(s.sessionFlags.firstTap).toBe(true);
    expect(s.sessionFlags.firstDraw).toBe(true);
    // entries selector: floor(2000/500) + 5 = 9
    expect(entriesSelector(s)).toBe(9);
  });
});

describe('useRollStore — addMoney', () => {
  it('addMoney(500) increases balance from 2000 to 2500', async () => {
    const { useRollStore } = await freshStore();
    useRollStore.getState().addMoney(500);
    expect(useRollStore.getState().balance).toBe(2500);
  });
});

describe('useRollStore — persistence', () => {
  it('persists balance through a simulated reload', async () => {
    const { useRollStore } = await freshStore();
    useRollStore.setState({ balance: 99999 });

    // The persist middleware writes to localStorage synchronously after
    // each setState. Confirm the key landed.
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed.state.balance).toBe(99999);

    // Re-import the module — this simulates a page reload because
    // Zustand's `create()` re-runs and the persist middleware
    // rehydrates from localStorage.
    const reloaded = await freshStore();
    expect(reloaded.useRollStore.getState().balance).toBe(99999);
  });

  it('does NOT persist sessionFlags (partialize excludes it)', async () => {
    // Seed localStorage with a stored snapshot that includes
    // sessionFlags.firstTap=false. If the store persisted them, a fresh
    // import would see firstTap=false. With partialize excluding them,
    // we should still see firstTap=true after rehydration.
    const seed = {
      state: {
        balance: 2000,
        streak: 0,
        clovers: 0,
        transactions: [],
        nextDrawAt: Date.now() + 24 * 3600 * 1000,
        onboarded: false,
        sessionFlags: { firstTap: false, firstDraw: false },
      },
      version: 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));

    const { useRollStore } = await freshStore();
    expect(useRollStore.getState().sessionFlags.firstTap).toBe(true);
    expect(useRollStore.getState().sessionFlags.firstDraw).toBe(true);
  });
});

describe('useRollStore — reset', () => {
  it('reset() restores all defaults', async () => {
    const { useRollStore } = await freshStore();
    useRollStore.setState({
      balance: 88888,
      onboarded: true,
      streak: 42,
    });
    useRollStore.getState().reset();
    const s = useRollStore.getState();
    expect(s.balance).toBe(2000);
    expect(s.onboarded).toBe(false);
    expect(s.streak).toBe(0);
    expect(s.sessionFlags.firstTap).toBe(true);
    expect(s.sessionFlags.firstDraw).toBe(true);
  });
});
