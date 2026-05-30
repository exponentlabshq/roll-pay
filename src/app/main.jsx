import './styles/app.css';

// Handle ?demo=fresh BEFORE any store/import runs.
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  if (params.get('demo') === 'fresh') {
    try {
      localStorage.removeItem('roll-pwa-store');
    } catch {
      // ignore storage errors
    }
    history.replaceState(null, '', '/app/');
  }
}

import { render } from 'preact';
import { Workbox } from 'workbox-window';
import App from './App.jsx';

const root = document.getElementById('root');
if (root) {
  render(<App />, root);
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
