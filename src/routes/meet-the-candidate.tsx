import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { candidate } from "@/config/candidate";
import { absoluteUrl, withBase } from "@/lib/paths";

const { bio, site } = candidate;

export const Route = createFileRoute("/meet-the-candidate")({
  head: () => ({
    meta: [
      { title: `${bio.pageTitle} — ${site.title}` },
      { name: "description", content: bio.metaDescription },
      { property: "og:title", content: bio.ogTitle },
      { property: "og:description", content: bio.ogDescription },
      { property: "og:image", content: absoluteUrl(bio.portrait.src) },
    ],
  }),
  component: MeetTheCandidatePage,
});

function MeetTheCandidatePage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main>
        <section className="meet">
          <div className="meet__inner">
            <div className="meet__photo">
              <img src={withBase(bio.portrait.src)} alt={bio.portrait.alt} />
            </div>

            <div className="meet__copy">
              <p className="t-eyebrow">{bio.eyebrow}</p>
              <h1 className="section-heading">
                {bio.headingLines.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
                <span className="accent-bar" aria-hidden="true" />
              </h1>

              {bio.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="why">
          <div className="why__inner">
            <p className="t-eyebrow why__eyebrow">{bio.whyRunning.eyebrow}</p>

            <blockquote className="why__quote">
              <span className="why__quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              {bio.whyRunning.quote}
              <footer className="why__attribution t-script">{bio.whyRunning.attribution}</footer>
            </blockquote>

            <div className="why__body">
              {bio.whyRunning.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
