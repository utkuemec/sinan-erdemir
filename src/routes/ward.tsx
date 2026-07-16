import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FinalCta } from "@/components/FinalCta";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { withBase } from "@/lib/paths";

const { ward, site } = candidate;
const t = getStrings(candidate.locale);

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
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

            {/* Preview constrained to ~805px tall (audit 11.1); the full-size
                map opens in a native <dialog> (Escape + backdrop close). */}
            <div className="ward-map__image-wrap">
              <img
                src={withBase(ward.map.src)}
                alt={ward.map.alt}
                className="ward-map__image"
                width={ward.map.width}
                height={ward.map.height}
                loading="lazy"
              />
              <div className="ward-map__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => dialogRef.current?.showModal()}
                >
                  {t.buttons.viewFullMap}
                </button>
              </div>
              {/* CLIENT-GATED: confirm the map source/date wording. */}
              <p className="ward-map__caption">
                Map source:{" "}
                <a
                  href="https://www.toronto.ca/city-government/data-research-maps/neighbourhoods-communities/ward-profiles/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  City of Toronto ward profiles
                </a>{" "}
                — 25-ward model.
              </p>
            </div>

            <dialog
              ref={dialogRef}
              className="ward-map__dialog"
              aria-label={ward.map.alt}
              onClick={(e) => {
                if (e.target === dialogRef.current) dialogRef.current?.close();
              }}
            >
              <button
                type="button"
                className="ward-map__dialog-close"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close full-size map"
              >
                <X size={22} />
              </button>
              <img src={withBase(ward.map.src)} alt={ward.map.alt} />
            </dialog>

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

        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
