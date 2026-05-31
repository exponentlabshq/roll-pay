import { useEffect, useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';
import clsx from 'clsx';
import { useRollStore } from '../store/index.js';

/**
 * Add Money screen (M3-F02).
 *
 * Layout (mobile-first 390×844):
 *   - top: back affordance routing back to /home (44×44 min target).
 *   - eyebrow: "ADD MONEY" uppercase / tracking-wider / muted.
 *   - big amount display: `$` (smaller, text-3xl) + dollars.cents
 *     (font-mono, text-cream, text-6xl). A real <input type="text"
 *     inputMode="numeric"> sits invisibly over the display so the
 *     mobile numeric keyboard pops up on focus while the user sees
 *     the formatted currency. Non-digit characters are stripped on
 *     input — internal state is an integer count of cents.
 *   - preset chips: +$10 / +$25 / +$100 (set cents directly).
 *   - bottom CTA: lime "Add" pill, disabled until cents > 0.
 *
 * On submit:
 *   - shows a full-screen lime "Added" success layer with checkmark.
 *   - after 1200ms, applies addMoney(cents) and routes to /home.
 *
 * Fulfills:
 *   M3-A09 — `$`-prefixed currency input + disabled-when-zero "Add".
 *   M3-A10 — success animation + balance increases by entered amount.
 *   M3-A11 — entries recalc happens automatically via the store
 *            selector (`floor(balance/500)+5`).
 */

const PRESETS = [
  { label: '+$10', cents: 1000 },
  { label: '+$25', cents: 2500 },
  { label: '+$100', cents: 10000 },
];

const SUCCESS_MS = 1200;

function formatDollars(cents) {
  return (cents / 100).toFixed(2);
}

export default function AddMoney() {
  const [cents, setCents] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus the hidden input so the numeric keyboard appears on
  // mobile immediately. Skip when the success overlay is up so we
  // don't yank focus during the celebration.
  useEffect(() => {
    if (!showSuccess && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSuccess]);

  const onInput = (e) => {
    const raw = String(e.currentTarget.value || '').replace(/\D/g, '');
    const next = raw === '' ? 0 : parseInt(raw, 10);
    setCents(Number.isFinite(next) ? next : 0);
  };

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const setPreset = (value) => {
    setCents(value);
    focusInput();
  };

  const handleAdd = () => {
    if (cents === 0 || showSuccess) return;
    setShowSuccess(true);
    // setTimeout survives unmount; store update + nav happen even if
    // the success layer unmounts the component (it doesn't here —
    // the layer is rendered inside this component — but defensive).
    setTimeout(() => {
      useRollStore.getState().addMoney(cents);
      route('/home');
    }, SUCCESS_MS);
  };

  const disabled = cents === 0;
  // The hidden input mirrors the integer cents value so the browser's
  // controlled-input contract holds. Empty string when zero so the
  // user can start typing without first hitting Backspace.
  const inputValue = cents === 0 ? '' : String(cents);

  return (
    // min-h calc keeps the lime Add CTA sitting just above the 80px
    // (h-20) bottom-nav from App.jsx so it's tappable without overlap.
    // 6rem = nav height (5rem) + a comfortable gap (1rem). On desktop
    // (≥ md = 768px) the section is wrapped by <DeviceFrame> so we
    // size to 100% of the frame's inner viewport instead of 100vh,
    // otherwise the Add CTA gets pushed below the visible frame area.
    <section
      class="relative flex flex-col px-6 pt-6 pb-4 min-h-[calc(100vh-6rem)] md:min-h-full md:h-full"
    >
      {/* Top bar — back to /home. */}
      <header class="flex items-center min-h-[44px]">
        <button
          type="button"
          aria-label="Back"
          onClick={() => route('/home')}
          class="min-h-[44px] min-w-[44px] flex items-center justify-center text-cream"
        >
          <span aria-hidden="true" class="text-2xl leading-none">
            ←
          </span>
        </button>
      </header>

      {/* Eyebrow. */}
      <p class="mt-6 font-body uppercase tracking-wider text-text-muted text-xs">
        Add Money
      </p>

      {/* Amount input.
          The visible display is the formatted currency. A real
          <input> overlays it (opacity 0) so the mobile numeric
          keyboard appears on focus while the user sees the styled
          $X.XX number. */}
      <div
        class="relative mt-8 flex items-end justify-center cursor-text"
        onClick={focusInput}
      >
        <span
          aria-hidden="true"
          data-testid="add-money-display"
          class="font-mono text-cream leading-none flex items-end"
        >
          <span class="text-3xl pb-1 mr-1">$</span>
          <span class="text-6xl">{formatDollars(cents)}</span>
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          autoCorrect="off"
          spellcheck={false}
          aria-label="Amount in cents"
          data-testid="add-money-input"
          value={inputValue}
          onInput={onInput}
          class="absolute inset-0 w-full h-full opacity-0 text-transparent caret-transparent bg-transparent border-0 focus:outline-none"
        />
      </div>

      {/* Preset chips. */}
      <div class="mt-10 flex items-center justify-center gap-3">
        {PRESETS.map((p) => (
          <button
            key={p.cents}
            type="button"
            data-testid={`add-money-preset-${p.cents}`}
            onClick={() => setPreset(p.cents)}
            class="min-h-[44px] h-11 px-5 rounded-pill bg-ink-soft border border-ink-line text-cream font-body text-sm"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Spacer pushes Add to the bottom of the safe area. */}
      <div class="flex-1" />

      {/* Primary CTA — disabled when cents === 0. */}
      <button
        type="button"
        data-testid="add-money-submit"
        disabled={disabled}
        onClick={handleAdd}
        class={clsx(
          'w-full h-14 rounded-pill bg-lime text-ink font-bold shadow-lime',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        Add
      </button>

      {/* Success overlay — full-screen lime tint + checkmark + "Added". */}
      {showSuccess && (
        <div
          role="dialog"
          aria-label="Added"
          data-testid="add-money-success"
          class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-lime"
        >
          <svg
            aria-hidden="true"
            width="96"
            height="96"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-ink"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p class="mt-4 font-display text-4xl font-bold text-ink">Added</p>
        </div>
      )}
    </section>
  );
}
