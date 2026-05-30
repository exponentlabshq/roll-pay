// Interactive "Tap to pay" demo. Wires up the #tapBtn → fake-merchant rotation
// → suspense → countdown to $0.00 → confetti burst.

import { burst } from './confetti.js';

const merchants = [
  ["Joe's Pizza", '2 slices + drink', '$11.00'],
  ['Blue Bottle', 'Oat latte + tip', '$7.25'],
  ['CVS Pharmacy', 'Snacks run', '$14.40'],
  ['Chipotle', 'Burrito bowl', '$13.10'],
  ['Boba Guys', 'Brown sugar milk tea', '$6.75'],
];

export function initDemo() {
  const btn = document.getElementById('tapBtn');
  const total = document.getElementById('demoTotal');
  const note = document.getElementById('demoNote');
  const merchEl = document.getElementById('dMerch');
  const itemEl = document.getElementById('dItem');
  if (!btn || !total || !note || !merchEl || !itemEl) return;

  let busy = false;

  btn.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    btn.disabled = true;
    btn.style.opacity = '.6';
    total.classList.remove('win');
    note.textContent = 'Tapping…';

    // Pick a fresh scenario each time.
    const [m, , price] = merchants[Math.floor(Math.random() * merchants.length)];
    merchEl.textContent = m;
    itemEl.textContent = price;
    const amount = parseFloat(price.replace('$', ''));
    total.textContent = price;

    // Suspense, then reveal a Zero (this is the demo of the win).
    setTimeout(() => {
      note.textContent = 'Rolling…';
    }, 350);

    setTimeout(() => {
      // Quick count-down to zero.
      const steps = 8;
      let i = 0;
      const tick = setInterval(() => {
        i++;
        const v = amount * (1 - i / steps);
        total.textContent = '$' + v.toFixed(2);
        if (i >= steps) {
          clearInterval(tick);
          total.textContent = '$0.00';
          total.classList.add('win');
          note.innerHTML =
            '🍀 <b style="color:var(--lime)">You got a Zero!</b> That one\'s on us. (Demo — real odds vary, no purchase necessary.)';
          burst();
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.textContent = '🪙 Tap again';
          busy = false;
        }
      }, 70);
    }, 900);
  });
}

initDemo();
