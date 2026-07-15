// Generates placeholder imagery for the template into public/images/.
// Run with: node scripts/make-placeholders.mjs (or bun scripts/make-placeholders.mjs)
//
// Real campaign photos are swapped in per candidate; these placeholders keep
// every image slot filled at the correct aspect ratio so the demo site renders.

import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

const PALETTE = {
  slate: "#8A93A5",
  sage: "#8FA58A",
  clay: "#A5928A",
  sand: "#B0A88F",
  mist: "#9AA5B0",
};

function svg({ width, height, fill, label, sublabel }) {
  const fs1 = Math.round(Math.min(width, height) / 14);
  const fs2 = Math.round(fs1 * 0.55);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${fill}"/>
  <rect x="${Math.round(width * 0.04)}" y="${Math.round(height * 0.04)}" width="${Math.round(width * 0.92)}" height="${Math.round(height * 0.92)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="50%" y="48%" font-family="Arial, sans-serif" font-size="${fs1}" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${label}</text>
  <text x="50%" y="48%" dy="${fs1}" font-family="Arial, sans-serif" font-size="${fs2}" fill="#FFFFFF" fill-opacity="0.85" text-anchor="middle" dominant-baseline="middle">${sublabel ?? `${width} × ${height}`}</text>
</svg>
`;
}

const FILES = [
  { path: "hero-portrait.svg", width: 1024, height: 1536, fill: PALETTE.slate, label: "Hero photo (portrait crop)" },
  { path: "hero-landscape.svg", width: 1536, height: 1024, fill: PALETTE.slate, label: "Hero photo (landscape crop)" },
  { path: "candidate-portrait.svg", width: 880, height: 1168, fill: PALETTE.clay, label: "Candidate portrait" },
  { path: "ward-map.svg", width: 1196, height: 1550, fill: PALETTE.mist, label: "Ward boundary map" },
  ...Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const landscape = n % 4 === 0; // mix of orientations like a real photo set
    return {
      path: `community/photo-${String(n).padStart(2, "0")}.svg`,
      width: landscape ? 1600 : 1200,
      height: landscape ? 1200 : 1600,
      fill: [PALETTE.sage, PALETTE.sand, PALETTE.clay][i % 3],
      label: `Community photo ${n}`,
    };
  }),
  { path: "endorsers/endorser-01.svg", width: 142, height: 230, fill: PALETTE.sage, label: "Endorser", sublabel: "headshot" },
  { path: "endorsers/endorser-02.svg", width: 142, height: 230, fill: PALETTE.sand, label: "Endorser", sublabel: "headshot" },
];

// --- Minimal PNG encoder (solid colour) so og:image can be a real PNG; many
// --- link scrapers ignore SVG og:images.
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function solidPng(width, height, [r, g, b]) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  const row = Buffer.alloc(1 + width * 3); // filter byte + RGB
  for (let x = 0; x < width; x++) {
    row[1 + x * 3] = r;
    row[2 + x * 3] = g;
    row[3 + x * 3] = b;
  }
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const f of FILES) {
  const full = join(OUT, f.path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, svg(f));
  console.log(`wrote ${f.path}`);
}

writeFileSync(join(OUT, "og-image.png"), solidPng(1200, 630, [0x8a, 0x93, 0xa5]));
console.log("wrote og-image.png");
