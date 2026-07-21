import { useState, type FormEvent } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import {
  FIELD_LIMITS,
  sanitize,
  submitForm,
  useSubmissionToken,
  type EtransferSubmission,
} from "@/lib/forms";
import { formatCurrency } from "@/lib/rebate";

const t = getStrings(candidate.locale);
const ETRANSFER_EMAIL = candidate.integrations.etransferEmail;

interface EtransferFormProps {
  /** Contribution amount chosen on the page (null when none/invalid). */
  amount: number | null;
  /** When true (features.donationAmounts), an amount must be chosen first. */
  requireAmount: boolean;
  /** Called when the user submits without a required amount (parent scrolls to the picker). */
  onAmountMissing?: () => void;
}

/**
 * E-transfer contribution flow used by the /donate page: collects contact
 * details + the Ontario contribution-eligibility declaration, logs the intent
 * through the shared v2 endpoint (lib/forms.ts), then shows the transfer
 * instructions only after the backend confirms the record was written.
 * The contribution amount comes from the page's amount picker (single source).
 */
export function EtransferForm({ amount, requireAmount, onAmountMissing }: EtransferFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const token = useSubmissionToken();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    if (requireAmount && amount === null) {
      onAmountMissing?.();
      toast.error(t.donatePage.chooseAmountFirst);
      return;
    }

    setSubmitting(true);
    const form = e.target as HTMLFormElement;
    const field = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement).value;
    const checked = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.checked === true;

    const payload: EtransferSubmission = {
      formType: "donate-etransfer",
      version: 2,
      source: "donate-page",
      token: token.current(),
      website: "",
      fullName: sanitize(field("donate-name"), FIELD_LIMITS.name),
      email: sanitize(field("donate-email"), FIELD_LIMITS.email),
      phone: sanitize(field("donate-phone"), FIELD_LIMITS.phone),
      address: sanitize(field("donate-address"), FIELD_LIMITS.address),
      ...(amount === null ? {} : { amount }),
      eligibilityConfirmed: checked("donate-eligible"),
      ownFundsConfirmed: checked("donate-own-funds"),
      notOnBehalfConfirmed: checked("donate-not-behalf"),
    };

    const outcome = await submitForm(payload);
    setSubmitting(false);

    if (outcome.status === "ok") {
      token.refresh();
      setDone(true);
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

  if (done) {
    return (
      <div className="donate-instructions">
        <h3 className="donate-instructions__title">{t.donateModal.instructionsTitle}</h3>
        <p>{t.donateModal.instructionsSubtitle}</p>

        {amount !== null && (
          <p className="donate-instructions__amount">
            {t.donateModal.instructionsAmount(formatCurrency(amount))}
          </p>
        )}

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
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="donate-form">
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

      {/* Contribution-eligibility declaration — DRAFT wording, official-agent
          approval required before launch (P0-08). */}
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
        className="btn btn--primary btn--lg btn--full"
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? t.donateModal.submitting : t.donateModal.continue}
      </button>
    </form>
  );
}
