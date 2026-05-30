import { route } from 'preact-router';
import clsx from 'clsx';

/**
 * Bottom tab navigation (Home, Opportunities, Draw, Card).
 *
 * - Fixed at the viewport bottom with `h-20` to clear iOS safe-area
 *   plus give a comfortable target row. Routes wrap their main content
 *   in `pb-24` to avoid being hidden.
 * - Each button is at least 44×44 px (brand rule) via min-h / min-w.
 * - Active state = current hash route matches the tab; lime fg.
 * - Inactive tabs use the muted brand color.
 */

const TABS = [
  { path: '/home', label: 'Home', icon: '🏠' },
  { path: '/opportunities', label: 'Opportunities', icon: '✨' },
  { path: '/draw', label: 'Draw', icon: '🎰' },
  { path: '/card', label: 'Card', icon: '💳' },
];

function isActive(currentPath, tabPath) {
  // Treat '/' (and empty) as Home for the default landing case.
  if (tabPath === '/home') {
    return currentPath === '/home' || currentPath === '/' || currentPath === '';
  }
  return currentPath === tabPath;
}

export default function BottomNav({ currentPath = '/' }) {
  return (
    <nav
      aria-label="Primary"
      class="fixed bottom-0 inset-x-0 h-20 bg-ink-soft border-t border-ink-line z-50 flex"
    >
      {TABS.map((tab) => {
        const active = isActive(currentPath, tab.path);
        return (
          <button
            key={tab.path}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => route(tab.path)}
            class={clsx(
              'flex-1 min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1',
              // brand: body text is never lime — but the ACTIVE state
              // foreground colors the icon + label lime to signal the
              // primary location. Inactive tabs use the muted token.
              active ? 'text-lime' : 'text-text-muted'
            )}
          >
            <span aria-hidden="true" class="text-xl leading-none">
              {tab.icon}
            </span>
            <span class="font-body uppercase text-xs tracking-wider">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
