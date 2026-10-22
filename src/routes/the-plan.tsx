import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FinalCta } from "@/components/FinalCta";
import { withBase } from "@/lib/paths";
import { candidate } from "@/config/candidate";
import { pageHead } from "@/lib/seo";

const { plan } = candidate;

export const Route = createFileRoute("/the-plan")({
  head: () => ({
    ...pageHead({
      path: "/the-plan",
      title: plan.pageTitle,
      description: plan.metaDescription,
    }),
  }),
  component: PlanPage,
});

function PlanPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="priorities">
          <div className="container">
            <div className="priorities__head">
              {plan.eyebrow && <p className="t-eyebrow">{plan.eyebrow}</p>}
              <h1 className="section-heading">
                {plan.heading}
                <span
                  className="accent-bar"
                  aria-hidden="true"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              </h1>
            </div>
            <ol className="plan-list">
              {plan.items.map((item) => (
                <li key={item.src} className="plan-item">
                  <div className="plan-item__text">
                    <h2 className="plan-item__title">{item.title}</h2>
                    {item.body.map((p) => (
                      <p key={p.slice(0, 32)}>{p}</p>
                    ))}
                  </div>
                  <video
                    className="plan-item__video"
                    controls
                    preload="none"
                    playsInline
                    poster={withBase(item.poster!)}
                    width={720}
                    height={1280}
                    aria-label={item.alt}
                  >
                    <source src={withBase(item.src!)} type="video/mp4" />
                  </video>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
