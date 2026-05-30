/**
 * Roll PWA — Zustand store.
 *
 * Single source of truth for the mocked demo: balance, transactions,
 * draw state, onboarding flag, and the per-session "first-tap /
 * first-draw guaranteed win" flags.
 *
 * Persistence:
 *   - Key:        `roll-pwa-store` in localStorage.
 *   - Excluded:   `sessionFlags` (via `partialize` AND via `merge`).
 *   - Reset path: `?demo=fresh` wipes the key before the store mounts
 *                 (handled in src/app/main.jsx).
 *
 * Why exclude sessionFlags on BOTH save and rehydrate:
 *   `partialize` only filters what we write. If anything (a previous
 *   build, a test, a stale tab) already persisted sessionFlags, a fresh
 *   load would inherit them and break the "first tap is always free"
 *   demo guarantee. The custom `merge` reasserts the in-memory default
 *   for `sessionFlags` on every rehydrate.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { rollSpend } from '../mocks/mockSpendEngine.js';
import { rollDraw } from '../mocks/mockDrawEngine.js';

// Rotating mock merchant list for recordTap() so the transaction
// history doesn't look like a stuck loop. Kept inline (not a separate
// mockTransactions module) so this file stays self-contained for M2-F01.
const MOCK_MERCHANTS = [
  "Joe's Pizza",
  'Blue Bottle Coffee',
  'CVS Pharmacy',
  'Whole Foods',
  'Trader Joe',
  'Chipotle',
  'Sweetgreen',
];

function pickMerchant() {
  return MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)];
}

// Default state. Kept as a function so `reset()` can grab a fresh copy
// (including a fresh `nextDrawAt` 24 h from now) and never accidentally
// share array/object references with the live store.
function createDefaultState() {
  const now = Date.now();
  return {
    // money — always cents
    balance: 2000, // $20.00

    // gamification
    streak: 0,
    clovers: 0,
    nextDrawAt: now + 24 * 60 * 60 * 1000,

    // seed history (architecture.md: { id, merchant, amount, free, ts })
    transactions: [
      {
        id: 'tx-seed-1',
        merchant: 'Blue Bottle Coffee',
        amount: 540,
        free: true,
        ts: now - 1000 * 60 * 60 * 6,
      },
      {
        id: 'tx-seed-2',
        merchant: "Joe's Pizza",
        amount: 1850,
        free: false,
        ts: now - 1000 * 60 * 60 * 24,
      },
      {
        id: 'tx-seed-3',
        merchant: 'CVS Pharmacy',
        amount: 1245,
        free: false,
        ts: now - 1000 * 60 * 60 * 30,
      },
      {
        id: 'tx-seed-4',
        merchant: 'Whole Foods',
        amount: 3210,
        free: false,
        ts: now - 1000 * 60 * 60 * 48,
      },
      {
        id: 'tx-seed-5',
        merchant: 'Trader Joe',
        amount: 2780,
        free: false,
        ts: now - 1000 * 60 * 60 * 72,
      },
    ],

    // per-session flags — NEVER persisted
    sessionFlags: { firstTap: true, firstDraw: true },

    // onboarding
    onboarded: false,
  };
}

export const useRollStore = create(
  persist(
    (set, get) => ({
      ...createDefaultState(),

      // ---- actions ----
      // Reset only the data slots — do NOT replace the whole state object,
      // because that would also wipe the action methods bound by `create`.
      // (Originally written with `set(..., true)` which replaces; that left
      // a store with no callable actions after reset.)
      reset() {
        set(createDefaultState());
      },

      addMoney(cents) {
        if (typeof cents !== 'number' || cents <= 0) return;
        set({ balance: get().balance + cents });
      },

      // Roll a single Tap-to-Pay. Defaults amount to $11 (1100 cents)
      // matching the demo card-receipt mock total. The first tap of a
      // session is guaranteed free via sessionFlags.firstTap.
      // Side effects: pushes a transaction row, flips firstTap=false
      // on first call. Returns the engine result so the caller can
      // render the celebration overlay.
      recordTap(amount = 1100) {
        const state = get();
        const result = rollSpend({
          amount,
          firstTap: state.sessionFlags.firstTap,
        });
        const tx = {
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          merchant: pickMerchant(),
          amount,
          free: result.free,
          ts: Date.now(),
        };
        set({
          transactions: [tx, ...state.transactions],
          sessionFlags: { ...state.sessionFlags, firstTap: false },
        });
        return result;
      },

      // Roll a single Daily Draw. Uses the entries() selector for the
      // current ticket count and a fixed $100 prize pool (10000 cents).
      // The first draw of a session is guaranteed to win via
      // sessionFlags.firstDraw. Side effects: balance += prize on win,
      // flips firstDraw=false. Returns the engine result.
      recordDraw(prizePool = 10000) {
        const state = get();
        const result = rollDraw({
          entries: entries(state),
          prizePool,
          firstDraw: state.sessionFlags.firstDraw,
        });
        set({
          balance: result.win ? state.balance + result.prize : state.balance,
          sessionFlags: { ...state.sessionFlags, firstDraw: false },
        });
        return result;
      },

      // Adds 1–4 cents to balance to simulate continuous yield.
      tickYield() {
        const drip = 1 + Math.floor(Math.random() * 4);
        set({ balance: get().balance + drip });
      },

      completeOnboarding() {
        set({ onboarded: true });
      },
    }),
    {
      name: 'roll-pwa-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Only persist non-session state. `sessionFlags` is excluded so
      // each page load gets a fresh "first tap / first draw" guarantee.
      partialize: (state) => {
        const { sessionFlags, ...rest } = state;
        return rest;
      },
      // Defensive belt-and-suspenders: if any stale snapshot ever wrote
      // sessionFlags, we still force the in-memory defaults on rehydrate.
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState || {}),
        sessionFlags: currentState.sessionFlags,
      }),
    }
  )
);

// Selector — entries are derived, not stored. floor(balance / 500) + 5
// (the +5 is a baseline so even a zero-balance user has some "skin").
export function entries(state) {
  return Math.floor(state.balance / 500) + 5;
}

// Dev-only debugging hook so QA / agent-browser can drive the store
// from the console: `window.__rollStore.setState({balance: 99999})`.
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  window.__rollStore = useRollStore;
}
