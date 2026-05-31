import { useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';
import clsx from 'clsx';
import { useRollStore } from '../store/index.js';

/**
 * Onboarding carousel (M3-F01).
 *
 * Three-screen swipeable carousel with exact PRD copy. Final screen has
 * a sign-up form that accepts any non-empty input (no validation), then
 * marks the user onboarded and routes to /home.
 *
 * Interaction:
 *   - Pointer drag (right-to-left) advances; (left-to-right) retreats.
 *   - "Next" button advances on screens 0 and 1.
 *   - "Sign up" button submits the form on screen 2.
 *   - "Back" affordance retreats on screens 1 and 2.
 *   - 50px horizontal drag threshold (M3-A05).
 *
 * Fulfills:
 *   M3-A03 — Step 1 renders with copy 1 + 1/3 indicator after Splash.
 *   M3-A04 — Three exact-copy screens in order.
 *   M3-A05 — Both swipe and click advance/retreat.
 *   M3-A06 — Sign-up form accepts any non-empty input.
 *   M3-A07 — Submitting lands on Home with bottom nav.
 *   M3-A08 — completeOnboarding() persists, so reload bypasses Splash.
 */

const SCREENS = [
  {
    icon: '💰',
    copy: 'Hold money, earn entries to win every week.',
  },
  {
    icon: '💳',
    copy: 'Spend on your card — some purchases are free.',
  },
  {
    icon: '✨',
    copy: 'Powered by opportunities that pay you.',
  },
];

const SWIPE_THRESHOLD = 50;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [signup, setSignup] = useState('');
  const completeOnboarding = useRollStore((s) => s.completeOnboarding);

  // Pointer-drag bookkeeping. Use a ref so the captured startX doesn't
  // trigger a re-render and so we can clear it on pointer cancel.
  const dragRef = useRef({ startX: null, activeId: null });

  const advance = () => {
    if (step < SCREENS.length - 1) setStep(step + 1);
  };
  const retreat = () => {
    if (step > 0) setStep(step - 1);
  };

  const onPointerDown = (e) => {
    dragRef.current = { startX: e.clientX, activeId: e.pointerId };
  };
  const onPointerMove = (_e) => {
    // No live-track movement needed — we only act on pointer up.
  };
  const onPointerUp = (e) => {
    const { startX, activeId } = dragRef.current;
    if (startX == null || activeId !== e.pointerId) return;
    const dx = e.clientX - startX;
    dragRef.current = { startX: null, activeId: null };
    if (dx < -SWIPE_THRESHOLD) advance();
    else if (dx > SWIPE_THRESHOLD) retreat();
  };
  const onPointerCancel = () => {
    dragRef.current = { startX: null, activeId: null };
  };

  const onSubmitSignup = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!signup.trim()) return; // disabled button guards this too
    completeOnboarding();
    route('/home');
  };

  const isFinal = step === SCREENS.length - 1;
  const screen = SCREENS[step];

  return (
    <section
      class="relative min-h-screen md:min-h-full md:h-full flex flex-col px-6 pt-6 pb-10"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* Top bar — back affordance only on steps > 0. */}
      <header class="flex items-center min-h-[44px]">
        {step > 0 ? (
          <button
            type="button"
            aria-label="Back"
            onClick={retreat}
            class="min-h-[44px] min-w-[44px] flex items-center justify-center text-cream"
          >
            <span aria-hidden="true" class="text-2xl leading-none">
              ←
            </span>
          </button>
        ) : (
          <span class="min-h-[44px] min-w-[44px]" aria-hidden="true" />
        )}
      </header>

      {/* Centered content area. */}
      <div class="flex-1 flex flex-col items-center justify-center text-center">
        <div aria-hidden="true" class="text-7xl mb-10 select-none">
          {screen.icon}
        </div>
        <p
          data-testid="onboarding-copy"
          class="font-display text-3xl text-cream max-w-xs"
        >
          {screen.copy}
        </p>
      </div>

      {/* Step indicator — 3 dots. */}
      <div
        class="flex items-center justify-center gap-2 mb-8"
        role="tablist"
        aria-label={`Step ${step + 1} of ${SCREENS.length}`}
      >
        {SCREENS.map((_, i) => (
          <span
            key={i}
            data-testid={`onboarding-dot-${i}`}
            data-active={i === step ? 'true' : 'false'}
            class={clsx(
              'h-2 w-2 rounded-pill',
              i === step ? 'bg-lime' : 'bg-ink-line'
            )}
          />
        ))}
      </div>

      {/* Bottom CTA — Next on 0/1, sign-up form on 2. */}
      {!isFinal ? (
        <button
          type="button"
          onClick={advance}
          class="w-full h-14 rounded-pill bg-lime text-ink font-bold shadow-lime"
        >
          Next
        </button>
      ) : (
        <form
          onSubmit={onSubmitSignup}
          class="flex flex-col gap-3"
          aria-label="Sign up"
        >
          <input
            type="text"
            placeholder="email or phone"
            value={signup}
            onInput={(e) => setSignup(e.currentTarget.value)}
            class="w-full h-14 rounded-pill bg-ink-soft border border-ink-line text-cream px-6 font-body placeholder:text-text-muted focus:outline-none focus:border-lime"
          />
          <button
            type="submit"
            disabled={!signup.trim()}
            class={clsx(
              'w-full h-14 rounded-pill font-bold transition-opacity',
              signup.trim()
                ? 'bg-lime text-ink shadow-lime'
                : 'bg-lime text-ink opacity-40 cursor-not-allowed'
            )}
          >
            Sign up
          </button>
        </form>
      )}
    </section>
  );
}
