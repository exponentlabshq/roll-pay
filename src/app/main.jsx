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
import App from './App.jsx';

const root = document.getElementById('root');
if (root) {
  render(<App />, root);
}
