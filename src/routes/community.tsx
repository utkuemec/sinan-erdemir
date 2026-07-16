import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FinalCta } from "@/components/FinalCta";
import { PhotoGallery } from "@/components/PhotoGallery";
import { candidate } from "@/config/candidate";
import { pageHead } from "@/lib/seo";
import { withBase } from "@/lib/paths";
import { PHOTO_WIDTHS, srcSetFor } from "@/lib/images";

const { community, bio, site } = candidate;

export const Route = createFileRoute("/community")({
  head: () => ({
    ...pageHead({
      path: "/community",
      title: community.pageTitle,
      description: community.metaDescription,
      ogTitle: community.ogTitle,
      ogDescription: community.ogDescription,
    }),
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
            </div>

            <div className="community__photo">
              <img
                src={withBase(HEADER_PHOTO.src)}
                srcSet={srcSetFor(HEADER_PHOTO.src, PHOTO_WIDTHS, "jpg")}
                sizes="(max-width: 767px) 100vw, 45vw"
                alt={HEADER_PHOTO.alt}
                width={1200}
                height={900}
                style={{ objectPosition: HEADER_PHOTO.focal ?? "50% 30%" }}
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Full-width card row below the copy/photo grid (feedback 1, item 5/6a). */}
          <div className="container">
            <ul className="community__list">
              {community.work.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className="community__item">
                    <span className="community__item-icon">
                      <Icon size={32} strokeWidth={1.75} />
                    </span>
                    <span className="community__item-label">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Recognition — exact award names from the client's form. */}
        <section className="awards-strip" aria-labelledby="recognition-heading">
          <div className="container">
            <p className="t-eyebrow awards-strip__eyebrow">Honours</p>
            <h2 id="recognition-heading" className="section-heading section-heading--sm awards-strip__heading">
              Recognition
            </h2>
            <div className="awards-strip__inner">
              {bio.recognition.map((award) => (
                <div key={award} className="awards-strip__item">
                  <Award size={28} strokeWidth={1.75} aria-hidden="true" />
                  <span>{award}</span>
                </div>
              ))}
            </div>
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
