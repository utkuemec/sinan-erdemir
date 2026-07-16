import type { GalleryPhoto } from "@/config/types";
import { withBase } from "@/lib/paths";
import { PHOTO_WIDTHS, srcSetFor } from "@/lib/images";

const SIZES = "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw";

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  /** Show only the first N photos (home preview). */
  limit?: number;
  /** id of the heading that labels this gallery region. */
  headingId?: string;
}

/**
 * Static photo gallery (replaces the autoplaying carousel — audit P0-06/07):
 * plain CSS grid, 3/2/1 columns, 4:3 cover crops steered by per-photo focal
 * points so faces are never cut. No JS, no autoplay, nothing to pause.
 */
export function PhotoGallery({ photos, limit, headingId }: PhotoGalleryProps) {
  const visible = limit ? photos.slice(0, limit) : photos;

  return (
    <div className="photo-gallery" role="list" aria-labelledby={headingId}>
      {visible.map((photo) => (
        <figure key={photo.src} role="listitem" className="photo-gallery__item">
          <picture>
            <source type="image/avif" srcSet={srcSetFor(photo.src, PHOTO_WIDTHS, "avif")} sizes={SIZES} />
            <source type="image/webp" srcSet={srcSetFor(photo.src, PHOTO_WIDTHS, "webp")} sizes={SIZES} />
            <img
              src={withBase(photo.src)}
              srcSet={srcSetFor(photo.src, PHOTO_WIDTHS, "jpg")}
              sizes={SIZES}
              alt={photo.alt}
              loading="lazy"
              width={1200}
              height={900}
              style={{ objectPosition: photo.focal ?? "50% 30%" }}
            />
          </picture>
          {photo.caption && <figcaption>{photo.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
