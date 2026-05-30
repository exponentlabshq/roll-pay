import { useRollStore } from '../store/index.js';

// M1 placeholder. Real Add Money screen (amount input + success
// animation) lands in M3.
export default function AddMoney() {
  const balance = useRollStore((s) => s.balance);
  const dollars = (balance / 100).toFixed(2);
  return (
    <section class="px-6 pt-8">
      <h1 class="font-display text-3xl text-cream">AddMoney</h1>
      <p class="font-mono text-cream mt-4">Balance ${dollars}</p>
    </section>
  );
}
