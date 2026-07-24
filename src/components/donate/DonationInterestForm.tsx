import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import type { HelpKind } from "@/config/types";
import {
  FIELD_LIMITS,
  sanitize,
  submitForm,
  useSubmissionToken,
  type DonationInterestSubmission,
} from "@/lib/forms";
import { parseDonationAmount } from "@/lib/rebate";

const t = getStrings(candidate.locale);
const d = t.donatePage;

const HELP_KINDS: HelpKind[] = ["etransfer", "cheque", "other"];

interface DonationInterestFormProps {
  /** Amount chosen in the page's picker, used to prefill the optional field. */
  amount: number | null;
}

/**
 * "Ask the campaign for help" request — NOT a contribution. It sits below the
 * e-transfer instructions so a donor who is happy to self-serve never has to
 * touch it. Only a name and email are required: no residential address and no
 * eligibility declaration, because no money moves here (the campaign collects
 * those when the contribution is actually processed).
 */
export function DonationInterestForm({ amount }: DonationInterestFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const token = useSubmissionToken();
  const successRef = useRef<HTMLDivElement>(null);

  // Move focus to the confirmation so screen readers and keyboard users land
  // on the result rather than where the submit button used to be.
  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const field = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "";

    // Amount is optional here; only send it when it parses cleanly.
    const rawAmount = field("interest-amount").trim();
    const parsedAmount = rawAmount
      ? parseDonationAmount(
          rawAmount,
          candidate.donations.minimumAmount,
          candidate.donations.contributionLimit,
        )
      : null;
    const amountValue = parsedAmount?.ok ? parsedAmount.amount : undefined;

    const helpKindRaw = field("interest-help-kind");
    const helpKind = HELP_KINDS.find((kind) => kind === helpKindRaw);

    const payload: DonationInterestSubmission = {
      formType: "donate-interest",
      version: 2,
      source: "donate-page",
      token: token.current(),
      website: "",
      fullName: sanitize(field("interest-name"), FIELD_LIMITS.name),
      email: sanitize(field("interest-email"), FIELD_LIMITS.email),
      phone: sanitize(field("interest-phone"), FIELD_LIMITS.phone),
      ...(amountValue === undefined ? {} : { amount: amountValue }),
      ...(helpKind ? { helpKind } : {}),
      notes: sanitize(field("interest-notes"), FIELD_LIMITS.notes),
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

  if (done) {
    return (
      <div
        className="donate-interest-done"
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
      >
        <p className="donate-interest-done__title">{d.helpSuccessTitle}</p>
        <p>{d.helpSuccessBody(candidate.contact.email)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="donate-form">
      <label className="visually-hidden" htmlFor="interest-name">
        {t.donateModal.fullName}
      </label>
      <input
        id="interest-name"
        name="interest-name"
        type="text"
        autoComplete="name"
        placeholder={t.donateModal.fullNamePlaceholder}
        className="join-form__input"
        required
      />

      <label className="visually-hidden" htmlFor="interest-email">
        {t.donateModal.email}
      </label>
      <input
        id="interest-email"
        name="interest-email"
        type="email"
        autoComplete="email"
        placeholder={t.donateModal.emailPlaceholder}
        className="join-form__input"
        required
      />

      <label className="visually-hidden" htmlFor="interest-phone">
        {t.donateModal.phone}
      </label>
      <input
        id="interest-phone"
        name="interest-phone"
        type="tel"
        autoComplete="tel"
        placeholder={t.donateModal.phonePlaceholder}
        className="join-form__input"
      />

      <label className="donate-field" htmlFor="interest-amount">
        <span>{d.amountConsideringLabel}</span>
        <span className="donate-amount__input-wrap">
          <span aria-hidden="true">$</span>
          <input
            id="interest-amount"
            name="interest-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={d.amountConsideringPlaceholder}
            defaultValue={amount === null ? "" : String(amount)}
          />
        </span>
      </label>

      <fieldset className="donate-form__eligibility">
        <legend>{d.helpKindLegend}</legend>
        {HELP_KINDS.map((kind, i) => (
          <label key={kind} className="donate-form__check">
            <input
              type="radio"
              name="interest-help-kind"
              value={kind}
              defaultChecked={i === 0}
            />
            <span>{d.helpKindOptions[kind]}</span>
          </label>
        ))}
      </fieldset>

      <label className="donate-field" htmlFor="interest-notes">
        <span>{d.notesLabel}</span>
        <textarea
          id="interest-notes"
          name="interest-notes"
          className="join-form__input donate-form__address"
          rows={3}
          placeholder={d.notesPlaceholder}
        />
      </label>

      <button
        type="submit"
        className="btn btn--primary btn--lg btn--full"
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? t.donateModal.submitting : d.helpSubmit}
      </button>
    </form>
  );
}
