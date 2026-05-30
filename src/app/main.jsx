import './styles/app.css';
// MUST be imported BEFORE the store module so the localStorage wipe
// runs before zustand/persist rehydrates. ES module evaluation order
// gives us that guarantee.
import './lib/demoReset.js';
import { useRollStore } from './store/index.js';

import { render } from 'preact';
import { Workbox } from 'workbox-window';
import App from './App.jsx';

const root = document.getElementById('root');
if (root) {
  render(<App />, root);
}

// Mock yield ticker (M2-F02 step 2).
// Drives the visible "balance ticks up" demo signal (M2-A02). The store
// action adds 1–4 cents on each call; running every 2s keeps the drift
// gentle (≤ $0.04 / 2s, ≤ $1.20 / minute — well below anything alarming
// but enough to see the number change inside the M2-A02 10s window).
// Runs for the life of the SPA; nothing unmounts the shell.
if (typeof window !== 'undefined') {
  setInterval(() => {
    useRollStore.getState().tickYield();
  }, 2000);
}

// Register the PWA service worker scoped to /app/ AFTER mount so the
// initial render is never blocked on the SW lifecycle.
//
// vite-plugin-pwa emits the SW at /sw.js in production (dist/sw.js) and
// serves the dev SW at /app/dev-sw.js?dev-sw in development. In both
// cases we restrict the registration scope to /app/ — that's narrower
// than the SW file's default max-scope ('/' for prod, '/app/' for dev),
// so no Service-Worker-Allowed header is needed.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const swUrl = import.meta.env.DEV ? '/app/dev-sw.js?dev-sw' : '/sw.js';
  const swType = import.meta.env.DEV ? 'module' : 'classic';
  const wb = new Workbox(swUrl, { scope: '/app/', type: swType });
  wb.register().catch((err) => {
    // eslint-disable-next-line no-console
    console.warn('SW registration failed', err);
  });
}
