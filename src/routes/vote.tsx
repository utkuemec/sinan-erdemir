import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, IdCard, UserCheck, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { candidate } from "@/config/candidate";

const { site } = candidate;

const PAGE_TITLE = "Voting Info";
const META_DESCRIPTION =
  "How to vote in the 2026 Toronto municipal election: election day, advance voting dates, who can vote, and what ID to bring to the polls in Ward 16 — Don Valley East.";

export const Route = createFileRoute("/vote")({
  head: () => ({
    meta: [
      { title: `${PAGE_TITLE} — ${site.title}` },
      { name: "description", content: META_DESCRIPTION },
      { property: "og:title", content: "Voting in the 2026 Toronto Municipal Election" },
      {
        property: "og:description",
        content: "Key dates, eligibility, and ID requirements for voting in Toronto.",
      },
    ],
  }),
  component: VotePage,
});

const SECTIONS = [
  {
    icon: CalendarDays,
    heading: "Key Dates",
    items: [
      "Election day: Monday, October 26, 2026 — polls open 10 a.m. to 8 p.m.",
      "Advance voting: Tuesday, October 6 to Sunday, October 11, 2026 — 10 a.m. to 7 p.m.",
      "Check your voting place on MyVote before you go — locations can change between elections.",
    ],
  },
  {
    icon: UserCheck,
    heading: "Who Can Vote",
    items: [
      "You are a Canadian citizen, and",
      "You are at least 18 years old on election day, and",
      "You live in Toronto — or you (or your spouse) own or rent property in the city, and",
      "You are not otherwise prohibited from voting by law.",
    ],
  },
  {
    icon: IdCard,
    heading: "What to Bring",
    items: [
      "One piece of ID showing your name and qualifying Toronto address — a photo is not required.",
      "Examples: Ontario driver's licence, utility bill, bank statement, or government cheque stub.",
      "If you received a Voter Information Card in the mail, bring it along to speed things up.",
    ],
  },
] as const;

function VotePage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main>
        <section className="ward-map">
          <div className="container">
            <div className="ward-map__head">
              <p className="t-eyebrow">2026 Toronto Municipal Election</p>
              <h1 className="section-heading">
                Your Vote. Your Neighbourhood.
                <span
                  className="accent-bar"
                  aria-hidden="true"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              </h1>
              <p className="ward-map__lede">
                On Monday, October 26, 2026, Toronto elects its next City Council. Here is
                everything you need to cast your ballot in Ward 16 — Don Valley East.
              </p>
            </div>

            <div className="ward-map__schools">
              <div className="ward-map__school-grid">
                {SECTIONS.map((section) => {
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
                <a
                  href="https://www.toronto.ca/city-government/elections/"
                  target="_blank"
                  rel="noreferrer"
                >
                  toronto.ca/elections{" "}
                  <ExternalLink size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" />
                </a>{" "}
                and{" "}
                <a href="https://myvote.toronto.ca/" target="_blank" rel="noreferrer">
                  myvote.toronto.ca{" "}
                  <ExternalLink size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" />
                </a>
                . Information on this page is a summary — the City Clerk's official
                instructions govern.
              </p>

              <p style={{ marginTop: 16 }}>
                Ready to help before election day?{" "}
                <Link to="/get-involved">Join Team Sinan or pledge your vote →</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
