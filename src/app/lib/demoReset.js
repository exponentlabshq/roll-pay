/**
 * `?demo=fresh` reset — runs as a SIDE EFFECT at module load time.
 *
 * This module is imported FIRST in src/app/main.jsx, before the store
 * module is imported. ES module evaluation is strictly source-ordered,
 * so by the time `zustand/middleware/persist` rehydrates from
 * localStorage, the storage key has already been wiped if the URL had
 * `?demo=fresh`. We also strip the param from the URL so a copy/paste
 * of the address bar doesn't loop the reset.
 */
const STORAGE_KEY = 'roll-pwa-store';

if (typeof window !== 'undefined') {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'fresh') {
      localStorage.removeItem(STORAGE_KEY);
      // Preserve hash routing if any (e.g., /app/?demo=fresh#/home → /app/#/home).
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, '', cleanUrl);
    }
  } catch {
    // localStorage may be unavailable (private mode etc.) — ignore.
  }
}
