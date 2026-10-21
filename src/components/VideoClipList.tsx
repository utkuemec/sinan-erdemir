import { EmbedClip } from "@/components/EmbedClip";
import { withBase } from "@/lib/paths";
import type { CampaignClip } from "@/config/types";

/** Grid of 9:16 clip tiles. preload="none" keeps every file off the wire until someone presses play. */
export function VideoClipList({ items }: { items: CampaignClip[] }) {
  return (
    <ul className="community-videos__grid">
      {items.map((clip) => {
        const embedSrc = clip.youtubeId
          ? `https://www.youtube-nocookie.com/embed/${clip.youtubeId}?rel=0`
          : clip.embedUrl;
        return (
          <li key={embedSrc ?? clip.src} className="community-videos__item">
            {embedSrc ? (
              <EmbedClip src={embedSrc} poster={clip.poster!} alt={clip.alt} />
            ) : (
              <video
                className="community-videos__player"
                controls
                preload="none"
                playsInline
                poster={withBase(clip.poster!)}
                width={720}
                height={1280}
                aria-label={clip.alt}
              >
                <source src={withBase(clip.src!)} type="video/mp4" />
              </video>
            )}
          </li>
        );
      })}
    </ul>
  );
}
