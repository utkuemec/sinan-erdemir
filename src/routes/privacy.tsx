import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { candidate } from "@/config/candidate";
import { pageHead } from "@/lib/seo";
import { getStrings } from "@/config/strings";
import { withBase } from "@/lib/paths";
import { srcSetFor } from "@/lib/images";

const { site, contact, features, privacy, hero } = candidate;
const t = getStrings(candidate.locale);
const p = t.privacy;

export const Route = createFileRoute("/privacy")({
  head: () => ({
    ...pageHead({
      path: "/privacy",
      title: p.pageTitle,
      description: p.metaDescription(site.title),
      ogDescription: p.ogDescription,
    }),
  }),
  component: PrivacyPage,
});

function EmailLink() {
  return <a href={`mailto:${contact.email}`}>{contact.email}</a>;
}

/** Per-form collection sections — rendered only for forms the site actually shows. */
const COLLECT_BLOCKS: { key: string; heading: string; body: string; extra?: string }[] = [
  { key: "signup", ...p.sections.collectByForm.signup },
  { key: "contact", ...p.sections.collectByForm.contact },
  { key: "supporter", ...p.sections.collectByForm.supporter },
  ...(features.donations
    ? [
        {
          key: "donation",
          heading: p.sections.collectByForm.donation.heading,
          body: features.cardDonations
            ? p.sections.collectByForm.donation.body
            : p.sections.collectByForm.donation.etransferExtra,
          extra:
            features.cardDonations && features.eTransfer
              ? p.sections.collectByForm.donation.etransferExtra
              : undefined,
        },
      ]
    : []),
  ...(features.rideRequests ? [{ key: "ride", ...p.sections.collectByForm.ride }] : []),
];

const visibleProviders = privacy.providers.filter(
  (provider) => provider.name !== "YouTube" || features.videos,
);

function PrivacyPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        {/* Compact split hero mirroring the home page's split layout: red
            brand copy panel + the same portrait as the home hero. The photo
            is decorative here (identity lives in the H1), so the media
            wrapper is aria-hidden and the img alt is empty. */}
        <section className="privacy-hero">
          <div className="privacy-hero__inner">
            <div className="privacy-hero__copy">
              <p className="t-eyebrow">{p.eyebrow}</p>
              <h1 className="section-heading">
                {p.heading}
                <span className="accent-bar" aria-hidden="true" />
              </h1>
              <p className="privacy-hero__lede">{p.lede}</p>
              <p className="legal__dates">
                {p.effectiveLabel}: {privacy.effectiveDate} · {p.updatedLabel}:{" "}
                {privacy.lastUpdated}
              </p>
            </div>
            <div className="privacy-hero__media" aria-hidden="true">
              <picture>
                <source
                  type="image/avif"
                  srcSet={srcSetFor(hero.imageLandscape, [480, 768, 1080, 1440], "avif")}
                  sizes="(max-width: 767px) 100vw, 40vw"
                />
                <source
                  type="image/webp"
                  srcSet={srcSetFor(hero.imageLandscape, [480, 768, 1080, 1440], "webp")}
                  sizes="(max-width: 767px) 100vw, 40vw"
                />
                <img
                  className="privacy-hero__img"
                  src={withBase(hero.imageLandscape)}
                  srcSet={srcSetFor(hero.imageLandscape, [480, 768, 1080, 1440], "jpg")}
                  sizes="(max-width: 767px) 100vw, 40vw"
                  alt=""
                  width={1536}
                  height={1152}
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
        </section>

        <section className="legal">
          <div className="legal__inner">
            <p>
              <strong>{p.noSaleStatement}</strong>
            </p>

            <h2>{p.sections.collectHeading}</h2>
            <p>{p.sections.collectIntro}</p>
            {COLLECT_BLOCKS.map((block) => (
              <p key={block.key}>
                <strong>{block.heading}.</strong> {block.body}
                {block.extra ? ` ${block.extra}` : null}
              </p>
            ))}
            <p>{p.sections.technicalBody}</p>

            <h2>{p.sections.useHeading}</h2>
            <p>{p.sections.useBody}</p>

            <h2>{p.sections.providersHeading}</h2>
            <p>{p.sections.providersIntro}</p>
            <ul className="legal__providers">
              {visibleProviders.map((provider) => (
                <li key={provider.name}>
                  <strong>{provider.name}</strong> — {provider.purpose}.
                </li>
              ))}
            </ul>

            <h2>{p.sections.retentionHeading}</h2>
            <p>{privacy.retentionStatement}</p>

            <h2>{p.sections.choicesHeading}</h2>
            <p>
              {p.sections.choicesBodyBeforeEmail}
              <EmailLink />
              {p.sections.choicesBodyAfterEmail}
            </p>

            <h2>{p.sections.sharingHeading}</h2>
            <p>{p.sections.sharingBody}</p>

            <h2>{p.sections.contactHeading}</h2>
            <p>
              {p.sections.contactBodyBeforeEmail(privacy.contactRole)}
              <EmailLink />
              {p.sections.contactBodyAfterEmail}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
