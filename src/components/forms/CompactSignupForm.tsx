import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { siteHost } from "@/lib/paths";
import {
  FIELD_LIMITS,
  sanitize,
  submitForm,
  useSubmissionToken,
  type SignupSubmission,
} from "@/lib/forms";

const t = getStrings(candidate.locale);

interface CompactSignupFormProps {
  id?: string;
  source?: "homepage" | "homepage-mobile" | "get-involved";
}

/**
 * The quick "Join the Campaign" signup (name / email / phone). Field names
 * match the v1 sheet columns so existing data stays contiguous.
 */
export function CompactSignupForm({ id = "join-form", source = "homepage" }: CompactSignupFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const token = useSubmissionToken();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const field = (name: string) =>
      (form.elements.namedItem(`${id}-${name}`) as HTMLInputElement).value;

    const payload: SignupSubmission = {
      formType: "signup",
      version: 2,
      source,
      token: token.current(),
      website: "",
      firstName: sanitize(field("first"), FIELD_LIMITS.name),
      lastName: sanitize(field("last"), FIELD_LIMITS.name),
      email: sanitize(field("email"), FIELD_LIMITS.email),
      phone: sanitize(field("phone"), FIELD_LIMITS.phone),
    };

    const outcome = await submitForm(payload);
    setSubmitting(false);

    if (outcome.status === "ok") {
      token.refresh();
      toast.success(t.joinForm.successTitle(candidate.identity.teamName), {
        description: t.joinForm.successBody(candidate.contact.email),
      });
      form.reset();
    } else {
      toast.error(t.forms.errorTitle, {
        description:
          outcome.kind === "timeout"
            ? t.forms.timeoutError
            : outcome.kind === "config"
              ? t.forms.configError
              : t.joinForm.errorBody,
      });
    }
  }

  return (
    <form id={id} className="join-form" onSubmit={handleSubmit}>
      <h3 className="join-form__title t-eyebrow">{t.joinForm.title}</h3>

      <div className="join-form__row">
        <div>
          <label className="visually-hidden" htmlFor={`${id}-first`}>
            {t.joinForm.firstName}
          </label>
          <input
            id={`${id}-first`}
            name={`${id}-first`}
            type="text"
            autoComplete="given-name"
            maxLength={FIELD_LIMITS.name}
            placeholder={t.joinForm.firstNamePlaceholder}
            className="join-form__input"
            required
          />
        </div>
        <div>
          <label className="visually-hidden" htmlFor={`${id}-last`}>
            {t.joinForm.lastName}
          </label>
          <input
            id={`${id}-last`}
            name={`${id}-last`}
            type="text"
            autoComplete="family-name"
            maxLength={FIELD_LIMITS.name}
            placeholder={t.joinForm.lastNamePlaceholder}
            className="join-form__input"
            required
          />
        </div>
      </div>

      <label className="visually-hidden" htmlFor={`${id}-email`}>
        {t.joinForm.email}
      </label>
      <input
        id={`${id}-email`}
        name={`${id}-email`}
        type="email"
        autoComplete="email"
        maxLength={FIELD_LIMITS.email}
        placeholder={t.joinForm.emailPlaceholder}
        className="join-form__input"
        required
      />

      <label className="visually-hidden" htmlFor={`${id}-phone`}>
        {t.joinForm.phone}
      </label>
      <input
        id={`${id}-phone`}
        name={`${id}-phone`}
        type="tel"
        autoComplete="tel"
        maxLength={FIELD_LIMITS.phone}
        placeholder={t.joinForm.phonePlaceholder}
        className="join-form__input"
      />

      {/* Honeypot — hidden from real users; bots that fill it are dropped. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="visually-hidden"
      />

      <button
        type="submit"
        className="btn btn--primary btn--lg btn--full"
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? t.joinForm.submitting : t.joinForm.submit(candidate.identity.teamName)}
      </button>

      <p className="join-form__disclaimer">
        {t.joinForm.smsDisclaimer(candidate.identity.campaignName)}{" "}
        <Link to="/privacy">{t.joinForm.privacyLinkLabel(siteHost())}</Link>
      </p>
    </form>
  );
}
