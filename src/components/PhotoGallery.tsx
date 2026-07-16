import type { GalleryPhoto } from "@/config/types";
import { withBase } from "@/lib/paths";

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
          <img
            src={withBase(photo.src)}
            alt={photo.alt}
            loading="lazy"
            width={1200}
            height={900}
            style={{ objectPosition: photo.focal ?? "50% 30%" }}
          />
          {photo.caption && <figcaption>{photo.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
