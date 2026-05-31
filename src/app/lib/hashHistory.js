/**
 * Hash-based history adapter for preact-router.
 *
 * Maps `window.location.hash` to a pseudo "pathname" so preact-router
 * can route by path while the actual browser navigation stays inside
 * `/app/` via the hash fragment. This keeps Netlify's SPA fallback
 * trivial (`/app/* → /app/index.html`) and works inside the iOS
 * standalone PWA shell, which doesn't always handle deep paths well.
 *
 * Mapping:
 *   /app/            ↔ pathname `/`
 *   /app/#/home      ↔ pathname `/home`
 *   /app/#/card      ↔ pathname `/card`
 *
 * preact-router calls `U.location`, `U.push(path)`, `U.replace(path)`,
 * and `U.listen(cb)` on us (see preact-router/dist/preact-router.mjs).
 * We feed it `{ pathname, search }` shapes and rely on the native
 * `hashchange` event for back/forward + manual address-bar edits.
 */

export function getHashPath() {
  if (typeof window === 'undefined') return '/';
  const raw = window.location.hash.slice(1); // strip leading '#'
  return raw || '/';
}

export const hashHistory = {
  // preact-router reads this once on render() via R(); always reflect
  // the live hash.
  get location() {
    return { pathname: getHashPath(), search: '' };
  },
  push(path) {
    if (typeof window === 'undefined') return;
    // Browser emits `hashchange` automatically when the hash actually
    // changes, which fires our listener below. If the hash is already
    // `path`, route() still calls routeTo() directly so we don't need
    // to force-fire here.
    window.location.hash = path;
  },
  replace(path) {
    if (typeof window === 'undefined') return;
    const url = `${window.location.pathname}${window.location.search}#${path}`;
    window.history.replaceState(null, '', url);
    // replaceState doesn't emit hashchange; tell our listeners
    // directly so any subscribers (e.g., the App shell tracking the
    // active tab) re-render.
    try {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch {
      window.dispatchEvent(new Event('hashchange'));
    }
  },
  listen(cb) {
    if (typeof window === 'undefined') return () => {};
    const handler = () => cb({ pathname: getHashPath(), search: '' });
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  },
};
