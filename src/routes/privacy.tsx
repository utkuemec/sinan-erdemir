import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";

const { site, contact, features, privacy } = candidate;
const t = getStrings(candidate.locale);
const p = t.privacy;

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `${p.pageTitle} - ${site.title}` },
      { name: "description", content: p.metaDescription(site.title) },
      { property: "og:title", content: `${p.pageTitle} - ${site.title}` },
      { property: "og:description", content: p.ogDescription },
    ],
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
          body: p.sections.collectByForm.donation.body,
          extra: features.eTransfer ? p.sections.collectByForm.donation.etransferExtra : undefined,
        },
      ]
    : []),
];

function PrivacyPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="page-hero">
          <div className="page-hero__inner">
            <p className="t-eyebrow">{p.eyebrow}</p>
            <h1 className="section-heading">
              {p.heading}
              <span className="accent-bar" aria-hidden="true" />
            </h1>
            <p className="page-hero__lede">{p.lede}</p>
            <p className="legal__dates">
              {p.effectiveLabel}: {privacy.effectiveDate} · {p.updatedLabel}: {privacy.lastUpdated}
            </p>
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
              {privacy.providers.map((provider) => (
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
