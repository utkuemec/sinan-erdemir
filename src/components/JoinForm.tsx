import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { siteHost } from "@/lib/paths";

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

const t = getStrings(candidate.locale);

interface JoinFormProps {
  id?: string;
  source?: string;
}

export function JoinForm({ id = "join-form", source = "unknown" }: JoinFormProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const data = {
      firstName: (form.elements.namedItem(`${id}-first`) as HTMLInputElement).value,
      lastName: (form.elements.namedItem(`${id}-last`) as HTMLInputElement).value,
      email: (form.elements.namedItem(`${id}-email`) as HTMLInputElement).value,
      phone: (form.elements.namedItem(`${id}-phone`) as HTMLInputElement).value,
      source,
    };

    try {
      if (!FORM_ENDPOINT) {
        throw new Error("Form endpoint not configured");
      }

      await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data),
      });

      toast.success(t.joinForm.successTitle(candidate.identity.teamName), {
        description: t.joinForm.successBody(candidate.contact.email),
      });
      form.reset();
    } catch {
      toast.error(t.joinForm.errorTitle, {
        description: t.joinForm.errorBody,
      });
    } finally {
      setSubmitting(false);
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
        placeholder={t.joinForm.phonePlaceholder}
        className="join-form__input"
      />

      <button type="submit" className="btn btn--mustard btn--lg btn--full" disabled={submitting}>
        {submitting ? t.joinForm.submitting : t.joinForm.submit(candidate.identity.teamName)}
      </button>

      <p className="join-form__disclaimer">
        {t.joinForm.smsDisclaimer(candidate.identity.campaignName)}{" "}
        <Link to="/privacy">{t.joinForm.privacyLinkLabel(siteHost())}</Link>
      </p>
    </form>
  );
}
