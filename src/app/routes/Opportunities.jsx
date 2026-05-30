import { useRollStore } from '../store/index.js';

// M1 placeholder. Real Opportunities feed lands in M3.
export default function Opportunities() {
  const streak = useRollStore((s) => s.streak);
  return (
    <section class="px-6 pt-8">
      <h1 class="font-display text-3xl text-cream">Opportunities</h1>
      <p class="font-mono text-cream mt-4">Streak {streak}</p>
    </section>
  );
}
