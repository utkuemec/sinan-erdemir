import { Link } from "@tanstack/react-router";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";

const t = getStrings(candidate.locale);

export function NotFoundPage() {
  return (
    <div className="page">
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p className="t-eyebrow">{t.notFound.eyebrow}</p>
          <h1 className="section-heading" style={{ margin: "16px 0" }}>
            {t.notFound.title}
            <span
              className="accent-bar"
              aria-hidden="true"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            />
          </h1>
          <p style={{ marginBottom: 24 }}>{t.notFound.body}</p>
          <Link to="/" className="btn btn--mustard btn--lg">
            {t.buttons.goHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
