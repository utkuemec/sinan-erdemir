import { withBase } from "./paths";

/**
 * srcset helpers for the pre-generated variants written by
 * scripts/optimize-images.mjs (<name>-<width>.<avif|webp|jpg>).
 */

/** "/images/foo.jpg" -> "/images/foo" */
export function variantBase(src: string): string {
  return src.replace(/\.(jpe?g|png)$/i, "");
}

export function srcSetFor(src: string, widths: number[], ext: string): string {
  const base = variantBase(src);
  return widths.map((w) => `${withBase(`${base}-${w}.${ext}`)} ${w}w`).join(", ");
}

/** Standard widths for gallery/portrait photos. */
export const PHOTO_WIDTHS = [480, 800];
