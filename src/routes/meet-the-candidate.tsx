import { Fragment } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FinalCta } from "@/components/FinalCta";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { withBase } from "@/lib/paths";
import { PHOTO_WIDTHS, srcSetFor } from "@/lib/images";
import { pageHead } from "@/lib/seo";
import { jsonLdScripts, personJsonLd } from "@/lib/jsonld";

const { bio, site } = candidate;
const t = getStrings(candidate.locale);

export const Route = createFileRoute("/meet-the-candidate")({
  head: () => ({
    ...pageHead({
      path: "/meet-the-candidate",
      title: bio.pageTitle,
      description: bio.metaDescription,
      ogTitle: bio.ogTitle,
      ogDescription: bio.ogDescription,
      image: bio.portrait.src,
    }),
    scripts: jsonLdScripts(personJsonLd),
  }),
  component: MeetTheCandidatePage,
});

function MeetTheCandidatePage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="meet">
          <div className="meet__inner">
            <div className="meet__photo">
              <picture>
                <source
                  type="image/avif"
                  srcSet={srcSetFor(bio.portrait.src, PHOTO_WIDTHS, "avif")}
                  sizes="(max-width: 767px) 90vw, 40vw"
                />
                <source
                  type="image/webp"
                  srcSet={srcSetFor(bio.portrait.src, PHOTO_WIDTHS, "webp")}
                  sizes="(max-width: 767px) 90vw, 40vw"
                />
                <img
                  src={withBase(bio.portrait.src)}
                  srcSet={srcSetFor(bio.portrait.src, PHOTO_WIDTHS, "jpg")}
                  sizes="(max-width: 767px) 90vw, 40vw"
                  alt={bio.portrait.alt}
                  width={880}
                  height={1168}
                  fetchPriority="high"
                />
              </picture>
            </div>

            <div className="meet__copy">
              <p className="t-eyebrow">{bio.eyebrow}</p>
              <h1 className="section-heading">
                {bio.headingLines.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
                <span className="accent-bar" aria-hidden="true" />
              </h1>

              <ul className="meet__facts" aria-label="Quick facts">
                {bio.quickFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>

              {bio.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership record + recognition — exact titles from the client's
            form; expand with dates once the client confirms them. */}
        <section className="meet-record" aria-label="Leadership and recognition">
          <div className="container meet-record__grid">
            <div>
              <h2 className="ward-map__school-type">
                <Users size={18} strokeWidth={2} style={{ verticalAlign: "-3px", marginRight: 8 }} aria-hidden="true" />
                Community Leadership
              </h2>
              <ul className="ward-map__school-list">
                {bio.leadership.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="ward-map__school-type">
                <Award size={18} strokeWidth={2} style={{ verticalAlign: "-3px", marginRight: 8 }} aria-hidden="true" />
                Recognition
              </h2>
              <ul className="ward-map__school-list">
                {bio.recognition.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="why">
          <div className="why__inner">
            <p className="t-eyebrow why__eyebrow">{bio.whyRunning.eyebrow}</p>

            <blockquote className="why__quote">
              <span className="why__quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              {bio.whyRunning.quote}
              <footer className="why__attribution t-script">{bio.whyRunning.attribution}</footer>
            </blockquote>

            <div className="why__body">
              {bio.whyRunning.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              <div className="why__ctas">
                <Link to="/priorities" className="btn btn--secondary">
                  {t.buttons.seeFullPlan}
                </Link>
                <Link to="/get-involved" className="btn btn--outline">
                  {t.buttons.volunteer}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
