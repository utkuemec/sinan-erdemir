import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FinalCta } from "@/components/FinalCta";
import { VideoClipList } from "@/components/VideoClipList";
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
            <VideoClipList items={plan.items} />
          </div>
        </section>
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
