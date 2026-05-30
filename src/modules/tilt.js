// 3D pointer-tilt on the hero holo-card. No-op when reduced motion is on.

import { reduce } from './reduce-motion.js';

export function initTilt() {
  if (reduce) return;
  const card = document.getElementById('tiltCard');
  if (!card) return;
  const phone = card.closest('.phone');
  if (!phone) return;

  phone.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 12}deg)`;
  });

  phone.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0) rotateX(0)';
  });
}

initTilt();
