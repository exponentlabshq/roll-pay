import { useState, useCallback } from 'preact/hooks';
import { Router } from 'preact-router';
import { hashHistory, getHashPath } from './lib/hashHistory.js';
import BottomNav from './components/BottomNav.jsx';
import Home from './routes/Home.jsx';
import Card from './routes/Card.jsx';
import Draw from './routes/Draw.jsx';
import Opportunities from './routes/Opportunities.jsx';
import Splash from './routes/Splash.jsx';
import Onboarding from './routes/Onboarding.jsx';
import AddMoney from './routes/AddMoney.jsx';

/**
 * Roll PWA app shell.
 *
 * - Hash routing via the `hashHistory` adapter — see lib/hashHistory.js.
 * - Bottom tab nav is hidden on Splash and Onboarding (these are
 *   chrome-less, full-bleed flows per the PRD).
 * - The Router pulls its initial state from the live hash; the
 *   `onChange` callback keeps App.jsx in sync with the active route
 *   so BottomNav can highlight the right tab and so the shell can
 *   conditionally render itself.
 */
export default function App() {
  const [path, setPath] = useState(getHashPath());

  // preact-router's Router fires onChange after each route resolution
  // (initial render included). We mirror that into local state so the
  // shell + bottom-nav re-render with the new active path.
  const onRouteChange = useCallback((e) => {
    setPath(e.url || '/');
  }, []);

  const hideNav = path === '/splash' || path === '/onboarding';

  return (
    <main class="min-h-screen bg-ink text-cream pb-24">
      <Router history={hashHistory} onChange={onRouteChange}>
        <Home path="/" />
        <Home path="/home" />
        <Opportunities path="/opportunities" />
        <Draw path="/draw" />
        <Card path="/card" />
        <Splash path="/splash" />
        <Onboarding path="/onboarding" />
        <AddMoney path="/add" />
      </Router>
      {!hideNav && <BottomNav currentPath={path} />}
    </main>
  );
}
