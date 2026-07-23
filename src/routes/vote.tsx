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

              <div className="ward-map__notes">
                <p className="ward-map__notes-lead">
                  Official election details — and where to register to vote if you aren&apos;t
                  already registered:
                </p>
                <ul className="ward-map__official-links">
                  {voting.officialLinks.map((link) => (
                    <li key={link.url}>
                      <a
                        className="ward-map__official-link"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="ward-map__notes-fine">{voting.disclaimer}</p>
                <p className="voting__verified">
                  Last verified against the City Clerk's information: {voting.lastVerified}.
                </p>

                <div className="ward-map__notes-actions">
                  <Link
                    className="ward-map__action-link"
                    to="/get-involved"
                    search={{ action: "pledge" }}
                    hash="join"
                  >
                    <span className="ward-map__action-q">Ready to help before election day?</span>
                    <strong className="ward-map__action-cta">
                      Pledge your vote or join Team Sinan →
                    </strong>
                  </Link>

                  {candidate.features.rideRequests && (
                    <Link className="ward-map__action-link" to="/ride">
                      <span className="ward-map__action-q">
                        Need help getting to your assigned polling place?
                      </span>
                      <strong className="ward-map__action-cta">
                        Request a ride from Team Sinan →
                      </strong>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
