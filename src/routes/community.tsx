import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { candidate } from "@/config/candidate";

const { community, site } = candidate;

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
        </section>
      </main>
      <Footer />
    </div>
  );
}
