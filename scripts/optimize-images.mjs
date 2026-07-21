/**
 * Generates responsive AVIF/WebP/JPEG variants for the site's photographs.
 * Variants are committed (static host — no build-time image service).
 *
 * Naming: public/images/<name>-<width>.<avif|webp|jpg>
 * Run after replacing any source image:  node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { existsSync, statSync } from "fs";
import { join } from "path";

const IMAGES = "public/images";

const MANIFEST = [
  { src: "hero-portrait.jpg", widths: [480, 768, 1024] },
  { src: "hero-landscape.jpg", widths: [480, 768, 1080, 1440] },
  { src: "candidate-portrait.jpg", widths: [480, 800] },
  { src: "community/photo-01.jpg", widths: [480, 800] },
  { src: "community/photo-02.jpg", widths: [480, 800] },
  { src: "community/photo-03.jpg", widths: [480, 800] },
  { src: "community/photo-04.jpg", widths: [480, 800] },
  { src: "community/photo-05.jpg", widths: [480, 800] },
  { src: "community/photo-06.jpg", widths: [480, 800] },
  { src: "community/photo-07.jpg", widths: [480, 800] },
  { src: "community/photo-08.jpg", widths: [480, 800] },
  { src: "community/photo-09.jpg", widths: [480, 800] },
  { src: "community/photo-10.jpg", widths: [480, 800] },
  { src: "community/photo-11.jpg", widths: [480, 800] },
  { src: "community/photo-12.jpg", widths: [480, 800] },
  { src: "community/photo-13.jpg", widths: [480, 800] },
  { src: "community/photo-14.jpg", widths: [480, 800] },
  { src: "community/photo-15.jpg", widths: [480, 800] },
  { src: "ward-map.png", widths: [620], formats: ["webp", "png"] },
];

for (const entry of MANIFEST) {
  const srcPath = join(IMAGES, entry.src);
  if (!existsSync(srcPath)) {
    console.warn(`skip (missing): ${entry.src}`);
    continue;
  }
  const base = srcPath.replace(/\.(jpe?g|png)$/i, "");
  const formats = entry.formats ?? ["avif", "webp", "jpg"];
  const meta = await sharp(srcPath).metadata();

  for (const width of entry.widths) {
    if (width > (meta.width ?? Infinity)) continue; // never upscale
    for (const format of formats) {
      const out = `${base}-${width}.${format}`;
      const pipeline = sharp(srcPath).resize({ width });
      if (format === "avif") await pipeline.avif({ quality: 55 }).toFile(out);
      else if (format === "webp") await pipeline.webp({ quality: 78 }).toFile(out);
      else if (format === "png") await pipeline.png({ palette: true, quality: 90 }).toFile(out);
      else await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(out);
      console.log(`${out} ${Math.round(statSync(out).size / 1024)}KB`);
    }
  }
}
console.log("done");
