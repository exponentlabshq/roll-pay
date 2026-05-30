import { useRollStore } from '../store/index.js';

// M1 placeholder. Real Splash (logo + tagline + Get Started CTA) lands
// in M3.
export default function Splash() {
  const onboarded = useRollStore((s) => s.onboarded);
  return (
    <section class="px-6 pt-8">
      <h1 class="font-display text-3xl text-cream">Splash</h1>
      <p class="font-mono text-cream mt-4">Onboarded: {String(onboarded)}</p>
    </section>
  );
}
