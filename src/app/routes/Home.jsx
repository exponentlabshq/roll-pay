import { useRollStore } from '../store/index.js';

// M1 placeholder. Real Home dashboard lands in M2 (balance, entries,
// countdown, CTAs). For now we just read one piece of store state so
// the shell wiring is provably end-to-end.
export default function Home() {
  const balance = useRollStore((s) => s.balance);
  const dollars = (balance / 100).toFixed(2);
  return (
    <section class="px-6 pt-8">
      <h1 class="font-display text-3xl text-cream">Home</h1>
      <p class="font-mono text-cream mt-4">Balance ${dollars}</p>
    </section>
  );
}
