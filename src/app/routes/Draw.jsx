import { useRollStore } from '../store/index.js';

// M1 placeholder. Real Draw screen (prize + entries + win celebration)
// lands in M2.
export default function Draw() {
  const clovers = useRollStore((s) => s.clovers);
  return (
    <section class="px-6 pt-8">
      <h1 class="font-display text-3xl text-cream">Draw</h1>
      <p class="font-mono text-cream mt-4">Clovers {clovers}</p>
    </section>
  );
}
