import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import type { ContactTopic, PreferredResponse } from "@/config/types";
import {
  FIELD_LIMITS,
  isValidPostalCode,
  sanitize,
  submitForm,
  useSubmissionToken,
  type ContactSubmission,
  type SubmitOutcome,
} from "@/lib/forms";

const t = getStrings(candidate.locale);
const c = t.contactForm;

const TOPICS = Object.keys(c.topics) as ContactTopic[];

interface ContactFormProps {
  id?: string;
}

/** Real contact form (P0-03): topic + message, honest success/error states. */
export function ContactForm({ id = "contact-form" }: ContactFormProps) {
  const [phase, setPhase] = useState<"idle" | "submitting" | "success">("idle");
  const [errorKind, setErrorKind] = useState<Exclude<SubmitOutcome, { status: "ok" }>["kind"] | null>(
    null,
  );
  const [preferredResponse, setPreferredResponse] = useState<PreferredResponse>("email");
  const [messageLength, setMessageLength] = useState(0);
  const [submissionId, setSubmissionId] = useState("");
  const token = useSubmissionToken();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === "submitting") return;

    const form = e.target as HTMLFormElement;
    const field = (name: string) =>
      (form.elements.namedItem(`${id}-${name}`) as HTMLInputElement | HTMLTextAreaElement).value;

    const postalCode = sanitize(field("postal"), FIELD_LIMITS.postalCode);
    if (!isValidPostalCode(postalCode)) {
      toast.error(c.postalCodeError);
      return;
    }

    setPhase("submitting");
    setErrorKind(null);

    const payload: ContactSubmission = {
      formType: "contact",
      version: 2,
      source: "contact",
      token: token.current(),
      website: "",
      fullName: sanitize(field("name"), FIELD_LIMITS.name),
      email: sanitize(field("email"), FIELD_LIMITS.email),
      phone: sanitize(field("phone"), FIELD_LIMITS.phone),
      postalCode,
      topic: field("topic") as ContactTopic,
      message: sanitize(field("message"), FIELD_LIMITS.message),
      preferredResponse,
    };

    const outcome = await submitForm(payload);

    if (outcome.status === "ok") {
      token.refresh();
      setSubmissionId(outcome.submissionId);
      setPhase("success");
    } else {
      setPhase("idle");
      setErrorKind(outcome.kind);
    }
  }

  if (phase === "success") {
    return (
      <div className="form-success" role="status">
        <h3 className="form-success__title">{c.successTitle}</h3>
        <p>{c.successBody(candidate.contact.email)}</p>
        {submissionId !== "ok" && (
          <p className="form-success__ref">{t.forms.successRefLabel(submissionId)}</p>
        )}
      </div>
    );
  }

  return (
    <form id={id} className="purpose-form" onSubmit={handleSubmit} noValidate={false}>
      <h2 className="purpose-form__title">{c.title}</h2>
      <p className="purpose-form__hint">{t.forms.requiredHint}</p>

      <div className="purpose-form__row">
        <div className="purpose-form__field">
          <label htmlFor={`${id}-name`}>{c.fullName}</label>
          <input
            id={`${id}-name`}
            name={`${id}-name`}
            type="text"
            autoComplete="name"
            maxLength={FIELD_LIMITS.name}
            placeholder={c.fullNamePlaceholder}
            required
          />
        </div>
        <div className="purpose-form__field">
          <label htmlFor={`${id}-email`}>{c.email}</label>
          <input
            id={`${id}-email`}
            name={`${id}-email`}
            type="email"
            autoComplete="email"
            maxLength={FIELD_LIMITS.email}
            placeholder={c.emailPlaceholder}
            required
          />
        </div>
      </div>

      <div className="purpose-form__row">
        <div className="purpose-form__field">
          <label htmlFor={`${id}-phone`}>
            {c.phone}{" "}
            {preferredResponse === "email" && (
              <span className="purpose-form__optional">{t.forms.optionalSuffix}</span>
            )}
          </label>
          <input
            id={`${id}-phone`}
            name={`${id}-phone`}
            type="tel"
            autoComplete="tel"
            maxLength={FIELD_LIMITS.phone}
            placeholder={c.phonePlaceholder}
            required={preferredResponse === "phone"}
            aria-describedby={preferredResponse === "phone" ? `${id}-phone-note` : undefined}
          />
          {preferredResponse === "phone" && (
            <p id={`${id}-phone-note`} className="purpose-form__note">
              {c.phoneRequiredNote}
            </p>
          )}
        </div>
        <div className="purpose-form__field">
          <label htmlFor={`${id}-postal`}>
            {c.postalCode} <span className="purpose-form__optional">{t.forms.optionalSuffix}</span>
          </label>
          <input
            id={`${id}-postal`}
            name={`${id}-postal`}
            type="text"
            autoComplete="postal-code"
            maxLength={FIELD_LIMITS.postalCode}
            placeholder={c.postalCodePlaceholder}
          />
        </div>
      </div>

      <div className="purpose-form__field">
        <label htmlFor={`${id}-topic`}>{c.topicLabel}</label>
        <select id={`${id}-topic`} name={`${id}-topic`} required defaultValue="neighbourhood">
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {c.topics[topic]}
            </option>
          ))}
        </select>
      </div>

      <div className="purpose-form__field">
        <label htmlFor={`${id}-message`}>{c.messageLabel}</label>
        <textarea
          id={`${id}-message`}
          name={`${id}-message`}
          rows={6}
          maxLength={FIELD_LIMITS.message}
          placeholder={c.messagePlaceholder}
          onChange={(e) => setMessageLength(e.target.value.length)}
          required
        />
        <p className="purpose-form__charcount" aria-live="polite">
          {t.forms.charCount(messageLength, FIELD_LIMITS.message)}
        </p>
      </div>

      <fieldset className="purpose-form__fieldset purpose-form__fieldset--inline">
        <legend>{c.preferredResponseLabel}</legend>
        {(Object.keys(c.preferredResponseOptions) as PreferredResponse[]).map((option) => (
          <label key={option} className="purpose-form__check">
            <input
              type="radio"
              name={`${id}-preferred`}
              value={option}
              checked={preferredResponse === option}
              onChange={() => setPreferredResponse(option)}
            />
            <span>{c.preferredResponseOptions[option]}</span>
          </label>
        ))}
      </fieldset>

      <label className="purpose-form__check purpose-form__check--consent">
        <input type="checkbox" name={`${id}-privacy`} required />
        <span>
          {c.privacyAckBeforeLink}
          <Link to="/privacy">{c.privacyAckLinkLabel}</Link>
          {c.privacyAckAfterLink}
        </span>
      </label>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="visually-hidden"
      />

      {errorKind && (
        <div className="form-error" role="alert">
          <strong>{t.forms.errorTitle}</strong>{" "}
          {errorKind === "timeout" ? (
            t.forms.timeoutError
          ) : errorKind === "config" ? (
            t.forms.configError
          ) : (
            <>
              {t.forms.errorBodyBeforeEmail}
              <a href={`mailto:${candidate.contact.email}`}>{candidate.contact.email}</a>
              {t.forms.errorBodyAfterEmail}
            </>
          )}
        </div>
      )}

      <button
        type="submit"
        className="btn btn--primary btn--lg"
        disabled={phase === "submitting"}
        aria-busy={phase === "submitting"}
      >
        {phase === "submitting" ? t.forms.submitting : c.submit}
      </button>
    </form>
  );
}
