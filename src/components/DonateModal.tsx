import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, CreditCard, Mail, ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { subscribeDonateModal, closeDonateModal } from "@/lib/donateModal";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import {
  FIELD_LIMITS,
  sanitize,
  submitForm,
  useSubmissionToken,
  type EtransferSubmission,
} from "@/lib/forms";

/*
 * NOTE FOR THE CAMPAIGN:
 * The e-transfer flow now captures a contributor eligibility declaration
 * (see t.donateModal.eligibilityItems) — that wording is a DRAFT and must be
 * approved by the campaign's official agent before launch. If sign-off
 * stalls, set candidate.features.eTransfer to false to hide the flow while
 * keeping credit-card donations live.
 */

const DONATE_URL = candidate.integrations.donateUrl;
const ETRANSFER_EMAIL = candidate.integrations.etransferEmail;
// E-transfer intents go through the shared v2 endpoint (lib/forms.ts);
// the legacy VITE_DONATE_ENDPOINT secret is retired.

const t = getStrings(candidate.locale);

type View = "choose" | "etransfer-form" | "etransfer-instructions";

export function DonateModal() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("choose");
  const [submitting, setSubmitting] = useState(false);
  const token = useSubmissionToken();
  const showEtransfer = candidate.features.eTransfer;
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => subscribeDonateModal(setOpen), []);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      setView("choose");
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDonateModal();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);

    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  function handleCreditCard() {
    window.open(DONATE_URL, "_blank", "noopener,noreferrer");
    closeDonateModal();
  }

  async function handleEtransferSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const field = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement).value;
    const checked = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.checked === true;

    const payload: EtransferSubmission = {
      formType: "donate-etransfer",
      version: 2,
      source: "donate-etransfer",
      token: token.current(),
      website: "",
      fullName: sanitize(field("donate-name"), FIELD_LIMITS.name),
      email: sanitize(field("donate-email"), FIELD_LIMITS.email),
      phone: sanitize(field("donate-phone"), FIELD_LIMITS.phone),
      address: sanitize(field("donate-address"), FIELD_LIMITS.address),
      eligibilityConfirmed: checked("donate-eligible"),
      ownFundsConfirmed: checked("donate-own-funds"),
      notOnBehalfConfirmed: checked("donate-not-behalf"),
    };

    const outcome = await submitForm(payload);
    setSubmitting(false);

    // Only show the transfer instructions when the backend confirmed the
    // contributor record was written (P0-05 — no false-positive success).
    if (outcome.status === "ok") {
      token.refresh();
      setView("etransfer-instructions");
    } else {
      toast.error(t.donateModal.errorTitle, {
        description:
          outcome.kind === "timeout"
            ? t.forms.timeoutError
            : t.donateModal.errorBody(candidate.contact.email),
      });
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(ETRANSFER_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.donateModal.copyError);
    }
  }

  return (
    <div className="donate-overlay" onClick={() => closeDonateModal()}>
      <div
        ref={dialogRef}
        className="donate-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donate-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="donate-modal__close"
          onClick={() => closeDonateModal()}
          aria-label={t.donateModal.close}
        >
          <X size={22} />
        </button>

        {view === "choose" && (
          <>
            <h2 id="donate-modal-title" className="donate-modal__title">
              {t.donateModal.title}
            </h2>
            <p className="donate-modal__subtitle">{t.donateModal.subtitle}</p>

            <div className="donate-options">
              <button
                type="button"
                className="donate-option donate-option--credit"
                onClick={handleCreditCard}
              >
                <span className="donate-option__icon donate-option__icon--mustard">
                  <CreditCard size={24} />
                </span>
                <span className="donate-option__text">
                  <span className="donate-option__label">
                    {t.donateModal.creditCardLabel}{" "}
                    <ExternalLink size={14} aria-hidden="true" />
                  </span>
                  <span className="donate-option__sub">
                    {t.donateModal.creditCardSub(candidate.integrations.donateProcessorName)} —{" "}
                    {t.donateModal.opensExternal}
                  </span>
                </span>
              </button>

              {showEtransfer && (
                <button
                  type="button"
                  className="donate-option donate-option--etransfer"
                  onClick={() => setView("etransfer-form")}
                >
                  <span className="donate-option__icon donate-option__icon--turquoise">
                    <Mail size={24} />
                  </span>
                  <span className="donate-option__text">
                    <span className="donate-option__label">{t.donateModal.etransferLabel}</span>
                    <span className="donate-option__sub">{t.donateModal.etransferSub}</span>
                  </span>
                </button>
              )}
            </div>

            <p className="donate-modal__authorized">
              {t.donateModal.authorizedNote(candidate.legal.authorizedBy)}
            </p>
          </>
        )}

        {view === "etransfer-form" && (
          <>
            <button type="button" className="donate-back" onClick={() => setView("choose")}>
              <ArrowLeft size={16} /> {t.donateModal.back}
            </button>
            <h2 id="donate-modal-title" className="donate-modal__title">
              {t.donateModal.etransferFormTitle}
            </h2>
            <p className="donate-modal__subtitle">{t.donateModal.etransferFormSubtitle}</p>

            <form onSubmit={handleEtransferSubmit} className="donate-form">
              <label className="visually-hidden" htmlFor="donate-name">
                {t.donateModal.fullName}
              </label>
              <input
                id="donate-name"
                name="donate-name"
                type="text"
                placeholder={t.donateModal.fullNamePlaceholder}
                className="join-form__input"
                required
              />

              <label className="visually-hidden" htmlFor="donate-email">
                {t.donateModal.email}
              </label>
              <input
                id="donate-email"
                name="donate-email"
                type="email"
                placeholder={t.donateModal.emailPlaceholder}
                className="join-form__input"
                required
              />

              <label className="visually-hidden" htmlFor="donate-phone">
                {t.donateModal.phone}
              </label>
              <input
                id="donate-phone"
                name="donate-phone"
                type="tel"
                placeholder={t.donateModal.phonePlaceholder}
                className="join-form__input"
                required
              />

              <label className="visually-hidden" htmlFor="donate-address">
                {t.donateModal.address}
              </label>
              <textarea
                id="donate-address"
                name="donate-address"
                placeholder={t.donateModal.addressPlaceholder}
                className="join-form__input donate-form__address"
                rows={3}
                required
              />

              {/* Contribution-eligibility declaration — DRAFT wording,
                  official-agent approval required before launch (P0-08). */}
              <fieldset className="donate-form__eligibility">
                <legend>{t.donateModal.eligibilityLegend}</legend>
                <label className="donate-form__check">
                  <input type="checkbox" name="donate-eligible" required />
                  <span>{t.donateModal.eligibilityItems.eligible}</span>
                </label>
                <label className="donate-form__check">
                  <input type="checkbox" name="donate-own-funds" required />
                  <span>{t.donateModal.eligibilityItems.ownFunds}</span>
                </label>
                <label className="donate-form__check">
                  <input type="checkbox" name="donate-not-behalf" required />
                  <span>{t.donateModal.eligibilityItems.notOnBehalf}</span>
                </label>
              </fieldset>

              <button
                type="submit"
                className="btn btn--mustard btn--lg btn--full"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? t.donateModal.submitting : t.donateModal.continue}
              </button>
            </form>
          </>
        )}

        {view === "etransfer-instructions" && (
          <>
            <h2 id="donate-modal-title" className="donate-modal__title">
              {t.donateModal.instructionsTitle}
            </h2>
            <p className="donate-modal__subtitle">{t.donateModal.instructionsSubtitle}</p>

            <div className="donate-instructions__email-row">
              <span className="donate-instructions__email">{ETRANSFER_EMAIL}</span>
              <button
                type="button"
                className="donate-instructions__copy"
                onClick={handleCopy}
                aria-label={t.donateModal.copyAria}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? t.donateModal.copied : t.donateModal.copy}
              </button>
            </div>

            <ol className="donate-instructions__steps">
              <li>{t.donateModal.step1}</li>
              <li>
                {t.donateModal.step2Prefix} <strong>{ETRANSFER_EMAIL}</strong>.
              </li>
              <li>{t.donateModal.step3}</li>
              <li>{t.donateModal.step4}</li>
            </ol>

            <button
              type="button"
              className="btn btn--mustard btn--lg btn--full"
              onClick={() => closeDonateModal()}
            >
              {t.donateModal.done}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
