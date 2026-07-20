import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { candidate } from "@/config/candidate";
import { pageHead } from "@/lib/seo";

const { site, voting } = candidate;

export const Route = createFileRoute("/vote")({
  head: () => ({
    ...pageHead({
      path: "/vote",
      title: voting.pageTitle,
      description: voting.metaDescription,
      ogTitle: voting.ogTitle,
      ogDescription: voting.ogDescription,
    }),
  }),
  component: VotePage,
});

function VotePage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="ward-map">
          <div className="container">
            <div className="ward-map__head">
              <p className="t-eyebrow">{voting.eyebrow}</p>
              <h1 className="section-heading">
                {voting.heading}
                <span
                  className="accent-bar"
                  aria-hidden="true"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              </h1>
              <p className="ward-map__lede">{voting.lede}</p>
            </div>

            <div className="ward-map__schools">
              <div className="ward-map__school-grid">
                {voting.sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div key={section.heading}>
                      <h2 className="ward-map__school-type">
                        <Icon
                          size={18}
                          strokeWidth={2}
                          style={{ verticalAlign: "-3px", marginRight: 8 }}
                          aria-hidden="true"
                        />
                        {section.heading}
                      </h2>
                      <ul className="ward-map__school-list">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <p style={{ marginTop: 32 }}>
                Official details, accessible-voting options, and your exact voting place:{" "}
                {voting.officialLinks.map((link, i) => (
                  <span key={link.url}>
                    {i > 0 && " and "}
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label}{" "}
                      <ExternalLink
                        size={14}
                        style={{ verticalAlign: "-2px" }}
                        aria-hidden="true"
                      />
                    </a>
                  </span>
                ))}
                . {voting.disclaimer}
              </p>

              <p className="voting__verified">
                Last verified against the City Clerk's information: {voting.lastVerified}.
              </p>

              <p style={{ marginTop: 16 }}>
                Ready to help before election day?{" "}
                <Link to="/get-involved" search={{ action: "pledge" }} hash="join">
                  Pledge your vote or join Team Sinan →
                </Link>
              </p>

              {candidate.features.rideRequests && (
                <p style={{ marginTop: 16 }}>
                  Need help getting to your assigned polling place?{" "}
                  <Link to="/ride">Request a ride from Team Sinan →</Link>
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
