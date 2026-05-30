/**
 * useReducedMotion — Preact hook that mirrors the user's
 * `prefers-reduced-motion: reduce` media-query into React state.
 *
 * Returns `true` if the user has asked the OS/browser to reduce
 * motion, `false` otherwise. Updates if the preference flips at
 * runtime (toggling the OS setting / Chrome devtools CDP emulation).
 *
 * Used by Confetti (returns null when true) and HoloCard (skips the
 * looping background-position animation) to honor brand rule §7 and
 * validation contract M2-A13.
 */
import { useEffect, useState } from 'preact/hooks';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setReduced(e.matches);
    // addEventListener is the modern API; fall back to addListener for
    // older Safari just in case.
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}
