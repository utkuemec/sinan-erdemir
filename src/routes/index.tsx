import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import type { CSSProperties } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompactSignupForm } from "@/components/forms/CompactSignupForm";
import { FinalCta } from "@/components/FinalCta";
import { PhotoGallery } from "@/components/PhotoGallery";
import { openDonateModal } from "@/lib/donateModal";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { withBase } from "@/lib/paths";
import { srcSetFor } from "@/lib/images";
import { pageHead } from "@/lib/seo";
import { jsonLdScripts, personJsonLd } from "@/lib/jsonld";

const t = getStrings(candidate.locale);

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      path: "/",
      title: "Home",
      fullTitle: `${candidate.site.title} — ${candidate.hero.sloganLine}`,
      description: candidate.site.description,
      ogTitle: candidate.hero.sloganLine,
      ogDescription: candidate.site.shortDescription,
    }),
    scripts: jsonLdScripts(personJsonLd),
  }),
  component: HomePage,
});

function HomePage() {
  const { hero, pillars, priorities, endorsements, community, features } = candidate;

  // Split + photo mode renders a real <picture> inside .hero__media (audit
  // 8.1/20.1: responsive sources + high fetch priority). The CSS background
  // variables then carry `none` so the photo isn't downloaded twice. Overlay
  // mode and heroStyle "solid" keep the CSS-variable background path.
  const heroUsesImg = candidate.theme.hero === "split" && candidate.theme.heroStyle === "photo";
  const solidGradient = "linear-gradient(135deg, var(--c-mustard) 0%, var(--c-turquoise) 100%)";
  const backgroundFor = (image: string) =>
    heroUsesImg ? "none" : candidate.theme.heroStyle === "photo" ? `url(${withBase(image)})` : solidGradient;
  const heroStyle = {
    "--hero-image-portrait": backgroundFor(hero.imagePortrait),
    "--hero-image-landscape": backgroundFor(hero.imageLandscape),
  } as CSSProperties;

  return (
    <div className="page">
      <Header variant="overlay" />
      <main id="main" tabIndex={-1}>
        <section className="hero" style={heroStyle}>
          <div className="hero__scrim" aria-hidden="true" />
          <div className="hero__inner">
            <div className="hero__panel">
              <div className="hero__copy">
                <p className="t-eyebrow hero__eyebrow">{hero.eyebrow}</p>
                <h1 className="hero__headline">
                  <span className="hero__headline-text">
                    {(hero.headlineLines ?? [hero.headline]).map((line) => (
                      <span key={line} className="hero__headline-line">
                        {line}
                      </span>
                    ))}
                  </span>
                  <span className="hero__underline" aria-hidden="true" />
                </h1>
                <p className="hero__subtitle">{hero.subtitle}</p>
              </div>

              {/* Two strong CTAs at every width; the signup form lives in the
                  #join section immediately below the hero (audit 8.1 opt. B). */}
              <div className="hero__ctas">
                <a href="#join" className="btn btn--ink-on-red btn--lg">
                  {t.buttons.volunteer}
                </a>
                {features.donations && (
                  <button
                    type="button"
                    className="btn btn--paper-on-red btn--lg"
                    onClick={() => openDonateModal()}
                  >
                    {t.buttons.donate}
                  </button>
                )}
              </div>
            </div>
          </div>

          <a href="#pillars" className="hero__scroll" aria-label="Scroll to next section">
            <ChevronDown size={32} strokeWidth={2.5} />
          </a>

          {/* Photo panel for the split hero layout (data-hero="split"); hidden
              in overlay mode. Renders the portrait crop on desktop and the
              landscape crop in the mobile band — mirroring the previous CSS
              background swap at 767px. Decorative (identity is in the h1). */}
          <div className="hero__media" aria-hidden="true">
            {heroUsesImg && (
              <picture>
                <source
                  media="(max-width: 767px)"
                  type="image/avif"
                  srcSet={srcSetFor(hero.imageLandscape, [480, 768, 1080, 1440], "avif")}
                  sizes="100vw"
                />
                <source
                  media="(max-width: 767px)"
                  type="image/webp"
                  srcSet={srcSetFor(hero.imageLandscape, [480, 768, 1080, 1440], "webp")}
                  sizes="100vw"
                />
                <source
                  media="(max-width: 767px)"
                  srcSet={srcSetFor(hero.imageLandscape, [480, 768, 1080, 1440], "jpg")}
                  sizes="100vw"
                />
                <source
                  type="image/avif"
                  srcSet={srcSetFor(hero.imagePortrait, [480, 768, 1080], "avif")}
                  sizes="45vw"
                />
                <source
                  type="image/webp"
                  srcSet={srcSetFor(hero.imagePortrait, [480, 768, 1080], "webp")}
                  sizes="45vw"
                />
                <img
                  className="hero__media-img"
                  src={withBase(hero.imagePortrait)}
                  srcSet={srcSetFor(hero.imagePortrait, [480, 768, 1080], "jpg")}
                  sizes="45vw"
                  alt=""
                  width={1024}
                  height={1536}
                  fetchPriority="high"
                />
              </picture>
            )}
          </div>
        </section>

        <section id="join" className="join-section" aria-label={t.joinForm.title}>
          <CompactSignupForm id="home-join" source="homepage" />
        </section>

        <section id="pillars" className="pillars" aria-label="Campaign values">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.title} className={`pillar pillar--${p.variant}`}>
                <div className="pillar__icon">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="pillar__title t-pillar">{p.title}</h3>
                <p className="pillar__body">{p.body}</p>
                {p.cta &&
                  ("action" in p.cta ? (
                    <button
                      type="button"
                      className="btn btn--ink btn--sm pillar__cta"
                      onClick={() => openDonateModal()}
                    >
                      {p.cta.label}
                    </button>
                  ) : (
                    <Link to={p.cta.to} className="btn btn--ink btn--sm pillar__cta">
                      {p.cta.label}
                    </Link>
                  ))}
              </article>
            );
          })}
        </section>

        <section className="priorities--home" aria-label={priorities.eyebrow}>
          <div className="priorities__inner">
            <p className="t-eyebrow priorities__eyebrow">{priorities.eyebrow}</p>
            <h2 className="priorities__heading t-section">{priorities.heading}</h2>
            <p className="priorities__intro">{priorities.intro}</p>

            <div className="priorities__grid">
              {priorities.items.map((p, i) => {
                const Icon = p.icon;
                return (
                  <article key={p.title} className="priority-card">
                    <span className="priority-card__number">{i + 1}</span>
                    <div className="priority-card__icon">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="priority-card__title">{p.title}</h3>
                    <p className="priority-card__body">{p.body}</p>
                    {p.bullets && (
                      <ul className="priority-card__bullets">
                        {p.bullets.map((b) => (
                          <li key={b.label}>
                            <strong>{b.label}:</strong> {b.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="priorities__cta">
              <Link to="/priorities" className="btn btn--secondary btn--lg">
                {t.buttons.seeFullPlan}
              </Link>
            </div>

            <div className="why-matters">
              <h3 className="why-matters__title t-pillar">{priorities.whyThisMatters.heading}</h3>
              <p className="why-matters__intro">{priorities.whyThisMatters.intro}</p>
              <ul className="why-matters__list">
                {priorities.whyThisMatters.items.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}:</strong> {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Proof section: who is Sinan, in 100 words, with verifiable chips
            (audit 8.5 — copy assembled from client-approved form answers). */}
        <section className="home-meet" aria-label={t.buttons.meetCandidate(candidate.identity.firstName)}>
          <div className="container home-meet__inner">
            <img
              className="home-meet__photo"
              src={withBase(candidate.bio.portrait.src)}
              srcSet={srcSetFor(candidate.bio.portrait.src, [480, 800], "jpg")}
              sizes="(max-width: 1023px) 320px, 400px"
              alt={candidate.bio.portrait.alt}
              loading="lazy"
              width={880}
              height={1168}
            />
            <div className="home-meet__copy">
              <p className="t-eyebrow">{candidate.bio.eyebrow}</p>
              <h2 className="section-heading section-heading--sm">
                {t.buttons.meetCandidate(candidate.identity.firstName)}
              </h2>
              <p className="home-meet__excerpt">{candidate.bio.homeExcerpt}</p>
              <ul className="home-meet__facts">
                {candidate.bio.quickFacts.slice(0, 3).map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
              <Link to="/meet-the-candidate" className="btn btn--secondary">
                {t.buttons.meetCandidate(candidate.identity.firstName)}
              </Link>
            </div>
          </div>
        </section>

        {features.endorsements && (
          <section className="endorsements" aria-label={endorsements.eyebrow}>
            <div className="endorsements__inner">
              <p className="t-eyebrow endorsements__eyebrow">{endorsements.eyebrow}</p>
              <h2 className="endorsements__heading t-section">{endorsements.heading}</h2>
              <div className="endorsements__grid">
                {endorsements.items.map((e) => (
                  <article key={e.name} className="endorsement-card">
                    <img
                      className="endorsement-card__photo"
                      src={withBase(e.photo)}
                      alt={`Portrait of ${e.name}`}
                      loading="lazy"
                      width={96}
                      height={96}
                    />
                    <div className="endorsement-card__text">
                      <h3 className="endorsement-card__name">{e.name}</h3>
                      <p className="endorsement-card__role">{e.role}</p>
                      <p className="endorsement-card__riding">{e.region}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="photo-gallery-section">
          <div className="container">
            <p className="t-eyebrow photo-gallery-section__eyebrow">
              {community.carousel.eyebrow}
            </p>
            <h2 id="home-gallery-heading" className="photo-gallery-section__heading t-section">
              {community.carousel.heading}
            </h2>
            <PhotoGallery
              photos={community.carousel.photos}
              limit={3}
              headingId="home-gallery-heading"
            />
            <div className="photo-gallery-section__cta">
              <Link to="/community" className="btn btn--outline">
                {t.buttons.seeMoreCommunity}
              </Link>
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
