# Roll

> **Buy now. Pay maybe.**
> The digital-dollar card where every tap is a chance to pay nothing.

This repo contains the marketing site for Roll — a vanilla JS landing page built with [Vite](https://vitejs.dev/).

## Tech stack

- **Vite 6** — dev server, bundler, preview
- **Vanilla JS (ES modules)** — no framework
- **Pure CSS** — design tokens + split modules, no preprocessor
- Google Fonts (Bricolage Grotesque, Hanken Grotesk, Space Mono)

## Local development

Requires Node 18+ (tested on Node 24).

```bash
# install deps
npm install

# start dev server (default http://localhost:5173)
npm run dev

# production build → ./dist
npm run build

# preview the production build locally
npm run preview
```

## Project layout

```
.
├── index.html              # Vite entry, ported markup
├── public/
│   └── favicon.svg         # Lime coin favicon
├── src/
│   ├── main.js             # imports styles + initializes modules
│   ├── styles/             # split CSS modules (tokens, base, nav, hero, …)
│   └── modules/            # ticker, tilt, confetti, demo
├── vite.config.js
├── netlify.toml            # build + SPA fallback for Netlify
└── reference/              # source brand spec, PRD, and original prototype HTML
```

## Deploy

This site is configured for [Netlify](https://www.netlify.com/) out of the box (`netlify.toml`):

- Build command: `npm run build`
- Publish directory: `dist`
- SPA-style fallback: all routes serve `index.html`.

Drop the repo into Netlify (or run `netlify deploy`) and it'll just work. Any static host that serves `dist/` will do too.

## `reference/`

The `reference/` directory holds the source-of-truth design and product docs:

- `brand.md` — full brand and design-language spec
- `roll-prd.md` — product requirements
- `roll-landing.html` — the original single-file prototype this Vite app was refactored from

Treat `reference/` as read-only context. The shipping site lives at the repo root.

## The PWA at `/app`

A mobile-web **PWA** (Preact + Tailwind, all integrations mocked) lives at `/app/`. It is the investor walkthrough of the product loop — a fully clickable demo with no real wallet, card, or chain. Visit:

```
http://localhost:5173/app/?demo=fresh
```

`?demo=fresh` wipes the local Zustand store on load so the first tap (Card) and the first draw (Draw) are guaranteed to be the dopamine moments: a `$0.00` zero-charge and a winning draw, respectively. Drop the param to keep your accumulated state between reloads.

### Key commands

- `npm run dev` — Vite dev server at `:5173` with the landing at `/` and the PWA at `/app/`
- `npm run build` — production build of both entries → `dist/`
- `npm run preview` — preview the production build at `:4173`
- `npm run test -- --run` — Vitest unit + component tests
- `npm run test:e2e` — Playwright e2e tests on a mobile (390×844) viewport

### Installability

The PWA is installable from the browser address bar — "Add to Home Screen" on iOS Safari, the install icon on Chrome/Edge. iOS standalone meta tags and the lime-coin icon set live in `app/index.html` and `public/app-icons/`. Once installed the demo loop runs offline against its mocked data.
