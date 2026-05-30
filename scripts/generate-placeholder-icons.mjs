// One-off script — generates placeholder PWA icons in public/app-icons/.
// Final-quality icons arrive in M4. These stubs are tiny PNGs of a lime
// circle (#C8FF3D) on ink background (#0B0E0C), authored with no
// dependencies via Node's built-in zlib for DEFLATE + manual CRC32 for
// the PNG chunks. Run: node scripts/generate-placeholder-icons.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'app-icons');
mkdirSync(outDir, { recursive: true });

// CRC32 (PNG spec table)
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function buildPng(size, { circle = true, maskable = false } = {}) {
  // ink background, lime circle
  const ink = [0x0b, 0x0e, 0x0c];
  const lime = [0xc8, 0xff, 0x3d];
  // Maskable safe zone = inner 80% per W3C spec; shrink the lime circle.
  const radius = (size / 2) * (maskable ? 0.4 : 0.45);
  const cx = size / 2 - 0.5;
  const cy = size / 2 - 0.5;

  // Raw pixel rows: filter byte (0) + RGB triples
  const rowLen = 1 + size * 3;
  const raw = Buffer.alloc(rowLen * size);
  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const inside = circle && dx * dx + dy * dy <= radius * radius;
      const [r, g, b] = inside ? lime : ink;
      const off = y * rowLen + 1 + x * 3;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const idat = deflateSync(raw);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const targets = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
];

for (const t of targets) {
  const png = buildPng(t.size, { maskable: t.maskable });
  const dest = resolve(outDir, t.name);
  writeFileSync(dest, png);
  console.log(`wrote ${dest} (${png.length} bytes)`);
}
