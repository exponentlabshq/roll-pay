/**
 * Confetti — a tiny canvas-based confetti burst that paints lime,
 * cyan, and coral particles, then fades out.
 *
 * Gated by `useReducedMotion()`: if the user prefers reduced motion,
 * this component renders nothing (no canvas in the DOM at all).
 * That's the explicit pass criteria for validation M2-A13.
 *
 * The burst runs for ~3 seconds, after which we unmount via
 * `setVisible(false)`. The owning overlay (CelebrationOverlay) usually
 * auto-dismisses earlier, but the self-unmount keeps the canvas
 * harmless even if the overlay sticks around.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { useReducedMotion } from '../lib/reduceMotion.js';

const COLORS = ['#C8FF3D', '#5BE8FF', '#FF5A36'];
const PARTICLE_COUNT = 80;
const GRAVITY = 0.5;
const LIFETIME_MS = 3000;

function spawnParticles(width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 10, // ±5 px/frame
      vy: -10 + Math.random() * 4, // upward burst with jitter
      size: 4 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.3,
    });
  }
  return particles;
}

export default function Confetti() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reduced || !visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Match the canvas's internal pixel buffer to its CSS box so
    // we draw at native resolution (no blurry scaling).
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const particles = spawnParticles(rect.width, rect.height);
    const start = performance.now();
    let rafId = 0;

    const draw = (now) => {
      const elapsed = now - start;
      const lifeT = Math.min(1, elapsed / LIFETIME_MS);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.globalAlpha = 1 - lifeT;
      for (const p of particles) {
        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      if (elapsed < LIFETIME_MS) {
        rafId = requestAnimationFrame(draw);
      } else {
        setVisible(false);
      }
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [reduced, visible]);

  if (reduced || !visible) return null;

  return (
    <canvas
      ref={canvasRef}
      data-testid="confetti-canvas"
      class="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
