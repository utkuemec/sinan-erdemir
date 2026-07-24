import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Mail, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DonateAmountPicker } from "@/components/donate/DonateAmountPicker";
import { EtransferInstructions } from "@/components/donate/EtransferInstructions";
import { DonationInterestForm } from "@/components/donate/DonationInterestForm";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { pageHead } from "@/lib/seo";
import { withBase } from "@/lib/paths";
import { srcSetFor, PHOTO_WIDTHS } from "@/lib/images";
import { calculateContributionRebate, formatCurrency, parseDonationAmount } from "@/lib/rebate";

const t = getStrings(candidate.locale);
const d = t.donatePage;
const { donations, features, integrations } = candidate;

/** Illustrative rows for the rebate chart (distinct from the amount chips). */
const CHART_AMOUNTS = [100, 200, 300, 500, 700, 1000, 1200];

/** Hero photo — a candid Batch-2 conversation shot. */
const HERO_PHOTO = "/images/community/photo-08.jpg";

export const Route = createFileRoute("/donate")({
  head: () => ({
    ...pageHead({
      path: "/donate",
      title: d.pageTitle,
      description: d.metaDescription,
      ogTitle: d.heading,
      ogDescription: d.ogDescription,
    }),
  }),
  component: DonatePage,
});

function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [etransferOpen, setEtransferOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const showAmounts = features.donationAmounts;
  const showCreditCard = features.cardDonations && Boolean(integrations.donateUrl);
  const showEtransfer = features.eTransfer;
  const showRebate = features.rebateCalculator;

  const amountInput = customAmount || (selectedAmount === null ? "" : String(selectedAmount));
  const parsed = showAmounts
    ? parseDonationAmount(amountInput, donations.minimumAmount, donations.contributionLimit)
    : null;
  const activeAmount = parsed?.ok ? parsed.amount : null;

  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        {/* Appeal + photo (Curran-style). */}
        <section className="donate-hero">
          <div className="container donate-hero__inner">
            <div className="donate-hero__copy">
              <p className="t-eyebrow">{d.eyebrow}</p>
              <h1 className="section-heading">
                {d.heading}
                <span className="accent-bar" aria-hidden="true" />
              </h1>
              {d.appeal.map((para) => (
                <p key={para.slice(0, 24)} className="donate-hero__appeal">
                  {para}
                </p>
              ))}
            </div>
            <div className="donate-hero__media" aria-hidden="true">
              <picture>
                <source
                  type="image/avif"
                  srcSet={srcSetFor(HERO_PHOTO, PHOTO_WIDTHS, "avif")}
                  sizes="(max-width: 899px) 100vw, 460px"
                />
                <source
                  type="image/webp"
                  srcSet={srcSetFor(HERO_PHOTO, PHOTO_WIDTHS, "webp")}
                  sizes="(max-width: 899px) 100vw, 460px"
                />
                <img
                  className="donate-hero__img"
                  src={withBase(HERO_PHOTO)}
                  srcSet={srcSetFor(HERO_PHOTO, PHOTO_WIDTHS, "jpg")}
                  sizes="(max-width: 899px) 100vw, 460px"
                  alt=""
                  width={1600}
                  height={1200}
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
        </section>

        <section className="donate-body">
          <div className="container donate-body__inner">
            {/* Contribution limit + eligibility. */}
            <div className="donate-limit">
              <h2 className="donate-section-heading">{d.limitHeading}</h2>
              <p>{d.limitBody}</p>
            </div>

            {/* Rebate explainer (Alaa Adib-style blush box). */}
            {showRebate && (
              <div className="donate-rebate-box">
                <h2 className="donate-section-heading">{d.rebateHeading}</h2>
                <p>{d.rebateIntro}</p>
                <ul className="donate-rebate-box__rules">
                  {d.rebateRules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
                <p className="donate-rebate-box__notes">{d.rebateNotes}</p>
              </div>
            )}

            {/* Rebate chart (Curran-style) — rows generated from the calculator. */}
            {showRebate && (
              <div className="donate-chart-wrap">
                <h2 className="donate-section-heading">{d.chartHeading}</h2>
                <p>{d.chartIntro}</p>
                <div className="donate-chart-scroll">
                  <table className="donate-chart">
                    <thead>
                      <tr>
                        <th scope="col">{d.chartColDonation}</th>
                        <th scope="col">{d.chartColRebate}</th>
                        <th scope="col">{d.chartColCost}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CHART_AMOUNTS.map((amount) => {
                        const rebate = calculateContributionRebate(amount, donations.rebateMaximum);
                        return (
                          <tr key={amount}>
                            <td>{formatCurrency(amount)}</td>
                            <td>{formatCurrency(rebate)}</td>
                            <td>{formatCurrency(amount - rebate)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="donate-chart__footnote">{d.chartFootnote}</p>
              </div>
            )}

            {/* Amount selection + live estimate (Diana Chan McNally-style). */}
            {showAmounts && (
              <div className="donate-choose">
                <h2 className="donate-section-heading">{d.amountHeading}</h2>
                <p>{d.amountIntro}</p>
                <DonateAmountPicker
                  selectedAmount={selectedAmount}
                  customAmount={customAmount}
                  amountError={amountError}
                  onSelectPreset={(amount) => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                    setAmountError("");
                  }}
                  onCustomChange={(value) => {
                    setCustomAmount(value);
                    setSelectedAmount(null);
                    setAmountError("");
                  }}
                />
              </div>
            )}

            {/* Payment options. */}
            <div className="donate-pay">
              <h2 className="donate-section-heading">{d.paymentHeading}</h2>
              <p>{d.paymentIntro}</p>

              <div className="donate-options">
                {showCreditCard && (
                  <a
                    className="donate-option donate-option--credit"
                    href={integrations.donateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="donate-option__icon donate-option__icon--mustard">
                      <CreditCard size={24} />
                    </span>
                    <span className="donate-option__text">
                      <span className="donate-option__label">
                        {d.creditCardCta} <ExternalLink size={14} aria-hidden="true" />
                      </span>
                      <span className="donate-option__sub">
                        {t.donateModal.creditCardSub(integrations.donateProcessorName)} —{" "}
                        {t.donateModal.opensExternal}
                      </span>
                    </span>
                  </a>
                )}

                {showEtransfer && (
                  <button
                    type="button"
                    className="donate-option donate-option--etransfer"
                    onClick={() => setEtransferOpen((open) => !open)}
                    aria-expanded={etransferOpen}
                    aria-controls="donate-etransfer-panel"
                  >
                    <span className="donate-option__icon donate-option__icon--turquoise">
                      <Mail size={24} />
                    </span>
                    <span className="donate-option__text">
                      <span className="donate-option__label">{d.etransferCta}</span>
                      <span className="donate-option__sub">{t.donateModal.etransferSub}</span>
                    </span>
                  </button>
                )}
              </div>

              {/* Instructions FIRST (client feedback): a donor who can send an
                  e-transfer themselves never has to fill in a form. The help
                  request below is optional and is not a contribution. */}
              {showEtransfer && etransferOpen && (
                <div className="donate-etransfer-panel" id="donate-etransfer-panel">
                  <EtransferInstructions amount={activeAmount} />

                  <div className="donate-help">
                    <h3 className="donate-section-heading donate-section-heading--sm">
                      {d.helpHeading}
                    </h3>
                    <p>{d.helpBody}</p>
                    <p className="donate-help__note">{d.helpNotADonation}</p>

                    {helpOpen ? (
                      <div id="donate-help-panel">
                        <DonationInterestForm amount={activeAmount} />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--outline donate-help__toggle"
                        onClick={() => setHelpOpen(true)}
                        aria-expanded={false}
                        aria-controls="donate-help-panel"
                      >
                        {d.helpToggle}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <p className="donate-pay__authorized">
                {t.donateModal.authorizedNote(candidate.legal.authorizedBy)}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
