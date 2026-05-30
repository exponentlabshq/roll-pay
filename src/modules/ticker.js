// Ticker — render a marquee of fake "Zeros" (free purchases).
// Self-initializes when imported. CSS handles the scroll animation
// and the `prefers-reduced-motion` pause.

const items = [
  ['maya', 'ramen', '$0.00'],
  ['dev', 'Uber', '$0.00'],
  ['sof', 'Sephora', '$0.00'],
  ['leo', 'groceries', '$0.00'],
  ['ava', 'Spotify', '$0.00'],
  ['kai', 'tacos', '$0.00'],
  ['mia', 'coffee', '$0.00'],
  ['noah', 'movie tix', '$0.00'],
  ['zoe', 'boba', '$0.00'],
  ['eli', 'gas', '$0.00'],
  ['ivy', 'lunch', '$0.00'],
  ['max', 'sneakers', '$0.00'],
];

function build() {
  return items
    .map(
      ([w, m, z]) =>
        `<span class="ticker-item"><span class="z">${z}</span> <span>${m}</span> <span class="who">· ${w} just got a Zero</span> <span class="dotsep">✦</span></span>`
    )
    .join('');
}

export function initTicker() {
  const el = document.getElementById('ticker');
  if (!el) return;
  // Double the contents so the -50% translateX loop is seamless.
  el.innerHTML = build() + build();
}

initTicker();
