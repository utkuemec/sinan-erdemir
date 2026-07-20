import { ExternalLink } from "lucide-react";
import { candidate } from "@/config/candidate";

export function CampaignVideos() {
  if (!candidate.features.videos) return null;

  const { youtube } = candidate.media;
  const embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(youtube.playlistId)}&rel=0`;

  return (
    <section className="campaign-videos" aria-labelledby="campaign-videos-heading">
      <div className="container campaign-videos__inner">
        <div className="campaign-videos__head">
          <p className="t-eyebrow">{youtube.eyebrow}</p>
          <h2 id="campaign-videos-heading" className="section-heading section-heading--sm">
            {youtube.heading}
          </h2>
          <p>{youtube.intro}</p>
        </div>

        <div className="campaign-videos__frame">
          <iframe
            src={embedUrl}
            title={`${candidate.identity.fullName} campaign videos`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <a
          href={youtube.channelUrl}
          className="btn btn--outline campaign-videos__channel"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the campaign YouTube channel
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
