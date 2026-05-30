// Confetti burst inside the #confetti canvas (lives in the demo section).
// Exposed as `burst()` so the demo module can fire it on a winning roll.
// No-op when reduced motion is on.

import { reduce } from './reduce-motion.js';

export function burst() {
  if (reduce) return;
  const canvas = document.getElementById('confetti');
  if (!canvas) return;
  const demo = canvas.closest('.demo');
  if (!demo) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = (canvas.width = demo.offsetWidth);
  const h = (canvas.height = demo.offsetHeight);
  const colors = ['#C8FF3D', '#FF5A36', '#5BE8FF', '#FFF7E6', '#A6E000'];
  const N = 130;
  const parts = Array.from({ length: N }, () => ({
    x: w / 2,
    y: h * 0.42,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 4,
    g: 0.35 + Math.random() * 0.2,
    s: 5 + Math.random() * 7,
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.4,
    c: colors[Math.floor(Math.random() * colors.length)],
    life: 0,
  }));

  let frame = 0;
  (function loop() {
    ctx.clearRect(0, 0, w, h);
    let alive = false;
    parts.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      if (p.y < h + 20) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.life / 90);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    });
    frame++;
    if (alive && frame < 120) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, w, h);
  })();
}
