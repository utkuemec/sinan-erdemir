import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FinalCta } from "@/components/FinalCta";
import { PhotoGallery } from "@/components/PhotoGallery";
import { candidate } from "@/config/candidate";
import { withBase } from "@/lib/paths";

const { community, bio, site } = candidate;

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: `${community.pageTitle} — ${site.title}` },
      { name: "description", content: community.metaDescription },
      { property: "og:title", content: community.ogTitle },
      { property: "og:description", content: community.ogDescription },
    ],
  }),
  component: CommunityPage,
});

// Split-header photo: the widest approved group shot from the gallery.
const HEADER_PHOTO = community.carousel.photos[3] ?? community.carousel.photos[0];

function CommunityPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="community">
          <div className="community__inner">
            <div className="community__copy">
              <p className="t-eyebrow">{community.eyebrow}</p>
              <h1 className="section-heading">
                {community.headingLines.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
                <span className="accent-bar" aria-hidden="true" />
              </h1>
              <p>{community.intro}</p>

              <ul className="community__list">
                {community.work.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="community__item">
                      <span className="community__item-icon">
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                      <span className="community__item-label">{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="community__photo">
              <img
                src={withBase(HEADER_PHOTO.src)}
                alt={HEADER_PHOTO.alt}
                width={1200}
                height={900}
                style={{ objectPosition: HEADER_PHOTO.focal ?? "50% 30%" }}
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* Recognition strip — exact award names from the client's form. */}
        <section className="awards-strip" aria-label="Recognition">
          <div className="container awards-strip__inner">
            {bio.recognition.map((award) => (
              <div key={award} className="awards-strip__item">
                <Award size={20} strokeWidth={1.75} aria-hidden="true" />
                <span>{award}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="photo-gallery-section">
          <div className="container">
            <p className="t-eyebrow photo-gallery-section__eyebrow">
              {community.carousel.eyebrow}
            </p>
            <h2 id="community-gallery-heading" className="photo-gallery-section__heading t-section">
              {community.carousel.heading}
            </h2>
            <PhotoGallery photos={community.carousel.photos} headingId="community-gallery-heading" />
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
