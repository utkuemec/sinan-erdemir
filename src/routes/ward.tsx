import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { candidate } from "@/config/candidate";
import { withBase } from "@/lib/paths";

const { ward, site } = candidate;

export const Route = createFileRoute("/ward")({
  head: () => ({
    meta: [
      { title: `${ward.pageTitle} — ${site.title}` },
      { name: "description", content: ward.metaDescription },
      { property: "og:title", content: ward.ogTitle },
      { property: "og:description", content: ward.ogDescription },
    ],
  }),
  component: WardPage,
});

function WardPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main>
        <section className="ward-map">
          <div className="container">
            <div className="ward-map__head">
              <p className="t-eyebrow">{ward.eyebrow}</p>
              <h1 className="section-heading">
                {ward.heading}
                <span
                  className="accent-bar"
                  aria-hidden="true"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              </h1>
              <p className="ward-map__lede">{ward.intro}</p>
            </div>

            <div className="ward-map__image-wrap">
              <img
                src={withBase(ward.map.src)}
                alt={ward.map.alt}
                className="ward-map__image"
                width={ward.map.width}
                height={ward.map.height}
                loading="lazy"
              />
            </div>

            <div className="ward-map__schools">
              <h2 className="section-heading section-heading--sm">{ward.landmarks.heading}</h2>
              <div className="ward-map__school-grid">
                {ward.landmarks.groups.map((group) => (
                  <div key={group.heading}>
                    <h3 className="ward-map__school-type">{group.heading}</h3>
                    <ul className="ward-map__school-list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
