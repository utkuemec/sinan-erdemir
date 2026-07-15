import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";

const { site, contact } = candidate;
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

function PrivacyPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main>
        <section className="page-hero">
          <div className="page-hero__inner">
            <p className="t-eyebrow">{p.eyebrow}</p>
            <h1 className="section-heading">
              {p.heading}
              <span className="accent-bar" aria-hidden="true" />
            </h1>
            <p className="page-hero__lede">{p.lede}</p>
          </div>
        </section>

        <section className="legal">
          <div className="legal__inner">
            <h2>{p.sections.collectHeading}</h2>
            <p>{p.sections.collectBody}</p>

            <h2>{p.sections.useHeading}</h2>
            <p>{p.sections.useBody}</p>

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
              {p.sections.contactBodyBeforeEmail}
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
