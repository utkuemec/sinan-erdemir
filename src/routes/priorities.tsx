import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CampaignVideos } from "@/components/CampaignVideos";
import { candidate } from "@/config/candidate";
import { pageHead } from "@/lib/seo";

const { priorities, site } = candidate;

export const Route = createFileRoute("/priorities")({
  head: () => ({
    ...pageHead({
      path: "/priorities",
      title: priorities.pageTitle,
      description: priorities.metaDescription,
      ogTitle: priorities.ogTitle,
      ogDescription: priorities.ogDescription,
    }),
  }),
  component: PrioritiesPage,
});

function PrioritiesPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="priorities">
          <div className="container">
            <div className="priorities__head">
              <p className="t-eyebrow">{priorities.eyebrow}</p>
              <h1 className="section-heading">
                {priorities.heading}
                <span
                  className="accent-bar"
                  aria-hidden="true"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              </h1>
              <p className="priorities__lede">{priorities.intro}</p>
            </div>

            <ol
              className={`priorities__list${priorities.items.length >= 4 ? " priorities__list--four" : ""}`}
            >
              {priorities.items.map((p, i) => {
                const Icon = p.icon;
                return (
                  <li key={p.title} className="priority-card">
                    <div className="priority-card__top">
                      <span className="priority-card__num">{i + 1}</span>
                      <span className="priority-card__icon">
                        <Icon size={26} strokeWidth={1.75} />
                      </span>
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
                  </li>
                );
              })}
            </ol>

            <div className="priorities__why">
              <h2 className="section-heading section-heading--sm">
                {priorities.whyThisMatters.heading}
              </h2>
              <p className="priorities__why-lede">{priorities.whyThisMatters.intro}</p>
              <ul className="priorities__why-list">
                {priorities.whyThisMatters.items.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}:</strong> {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <CampaignVideos />
      </main>
      <Footer />
    </div>
  );
}
