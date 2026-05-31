import { useState, useEffect } from 'preact/hooks';

/**
 * Device-frame overlay for the PWA (M5-F01).
 *
 * The PWA is designed mobile-first (390×844). On large viewports it
 * was stretched edge-to-edge, which looked broken. This component
 * wraps the app shell in an iPhone 17 Pro Max-style mock when the
 * viewport is ≥ 768px (tablet + desktop) and passes through children
 * verbatim below that breakpoint so mobile behaviour is unchanged.
 *
 * Reference dimensions:
 *   - Inner (logical viewport):  440 × 956 (iPhone 17 Pro Max @1x)
 *   - Outer (with bezel):        ~470 × 990
 *
 * Containing-block trick:
 *   The PWA's `<BottomNav>` is `position: fixed`. Without help it
 *   pins to the browser viewport (the bottom of the window), not the
 *   phone frame. Applying `transform: translateZ(0)` to the inner
 *   wrapper makes it a containing block for fixed-position
 *   descendants per CSS Transforms §3, so the nav pins to the bottom
 *   of the 956px frame as intended.
 */
export default function DeviceFrame({ children }) {
  // Read the initial value synchronously so SSR-safe hydration sees
  // the same tree on first paint that the client renders. Falls back
  // to "narrow" (passthrough) in non-browser environments.
  const [isWide, setIsWide] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => setIsWide(e.matches);
    // Safari < 14 only supports the deprecated addListener API; modern
    // browsers prefer addEventListener('change'). Fall back gracefully.
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  if (!isWide) return <>{children}</>;

  return (
    <div
      data-testid="device-frame-stage"
      class="min-h-screen w-full bg-ink-soft flex items-center justify-center"
    >
      <div
        data-testid="device-frame"
        class="device-frame relative"
        style={{
          // Height-first sizing so the frame shrinks proportionally
          // on shorter desktop/tablet viewports. `height` caps at the
          // natural 990 px or `100dvh - 4rem` (2 rem breathing room
          // top + bottom), whichever is smaller; `aspect-ratio` then
          // drives the width. 2 rem (32 px) margin on top + bottom
          // keeps the frame from kissing the chrome.
          height: 'min(990px, calc(100dvh - 4rem))',
          width: 'auto',
          maxWidth: '100%',
          minWidth: 0,
          minHeight: '540px',
          aspectRatio: '440 / 956',
          margin: '2rem auto',
          background: '#1A1F1B',
          borderRadius: '60px',
          padding: '17px 15px',
          boxShadow:
            '0 30px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04), 0 0 60px rgba(200,255,61,.08)',
        }}
      >
        <div
          data-testid="device-frame-inner"
          class="device-frame__inner relative overflow-hidden bg-ink"
          style={{
            // Fill the frame's content box. With Tailwind's
            // border-box default the frame's `padding: 17px 15px` is
            // already subtracted from its content area, so 100% lands
            // at the intended inner viewport without re-subtracting
            // the bezel.
            width: '100%',
            height: '100%',
            borderRadius: '45px',
            // Establishes a containing block for fixed-position
            // descendants (e.g. the BottomNav) so they pin to the
            // frame's bottom, not the window's. LOAD-BEARING.
            transform: 'translateZ(0)',
          }}
        >
          <div
            class="device-frame__notch absolute left-1/2 -translate-x-1/2 z-50 bg-black"
            style={{
              top: '12px',
              width: '120px',
              height: '35px',
              borderRadius: '999px',
            }}
            aria-hidden="true"
          />
          {children}
        </div>
      </div>
    </div>
  );
}
