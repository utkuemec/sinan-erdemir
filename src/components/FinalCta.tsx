import { Link } from "@tanstack/react-router";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";

const t = getStrings(candidate.locale);
const wardShort = candidate.identity.wardLabel.split("—")[0]?.trim() ?? "our ward";

/** Final conversion band before the footer (audit 8.7). */
export function FinalCta() {
  return (
    <section className="final-cta" aria-label={t.finalCta.heading(wardShort)}>
      <div className="container final-cta__inner">
        <h2 className="final-cta__heading">{t.finalCta.heading(wardShort)}</h2>
        <div className="final-cta__buttons">
          <Link
            to="/get-involved"
            search={{ action: "volunteer" }}
            hash="join"
            className="btn btn--ink-on-red"
          >
            {t.buttons.volunteer}
          </Link>
          {candidate.features.lawnSigns && (
            <Link
              to="/get-involved"
              search={{ action: "lawn-sign" }}
              hash="join"
              className="btn btn--ink-on-red"
            >
              {t.buttons.requestLawnSign}
            </Link>
          )}
          {candidate.features.donations && (
            <Link to="/donate" className="btn btn--paper-on-red">
              {t.buttons.donate}
            </Link>
          )}
          {candidate.features.rideRequests && (
            <Link to="/ride" className="btn btn--paper-on-red">
              {candidate.ride.navLabel}
            </Link>
          )}
          <Link to="/contact" className="btn btn--ink-on-red">
            {t.buttons.contact}
          </Link>
        </div>
      </div>
    </section>
  );
}
