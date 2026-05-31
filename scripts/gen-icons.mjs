// Generates final-quality PWA icons from scripts/icon-source.svg using sharp.
// Renders four PNGs into public/app-icons/:
//   - icon-192.png            192x192 (full bleed)
//   - icon-512.png            512x512 (full bleed)
//   - icon-maskable-512.png   512x512 (coin scaled to 80% with ~10% safe-area)
//   - apple-touch-icon-180.png 180x180
//
// Run: node scripts/gen-icons.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const outDir = resolve(rootDir, 'public', 'app-icons');
mkdirSync(outDir, { recursive: true });

const sourceSvgPath = resolve(__dirname, 'icon-source.svg');
const sourceSvg = readFileSync(sourceSvgPath);

// Maskable variant: render the coin at 80% so Android's circular mask
// (which clips a ~10% safe-area on each side) won't crop the lime face.
// We do this by drawing the same 512×512 SVG but scaled to 80% and centered
// over a 512×512 ink background.
const maskableSvg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#0B0E0C"/>
  <g transform="translate(51.2 51.2) scale(0.8)">
    <circle cx="256" cy="256" r="204" fill="#A6E000"/>
    <circle cx="256" cy="256" r="200" fill="#C8FF3D"/>
    <ellipse cx="200" cy="200" rx="70" ry="48" fill="#E2FF8A" opacity="0.55"/>
  </g>
</svg>`);

const targets = [
  { name: 'icon-192.png', size: 192, svg: sourceSvg },
  { name: 'icon-512.png', size: 512, svg: sourceSvg },
  { name: 'icon-maskable-512.png', size: 512, svg: maskableSvg },
  { name: 'apple-touch-icon-180.png', size: 180, svg: sourceSvg },
];

for (const t of targets) {
  const dest = resolve(outDir, t.name);
  const buf = await sharp(t.svg, { density: 384 })
    .resize(t.size, t.size, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(dest, buf);
  console.log(`wrote ${dest} (${buf.length} bytes)`);
}
