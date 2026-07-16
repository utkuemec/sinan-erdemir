import { useEffect, useState, type FormEvent } from "react";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import type {
  AvailabilitySlot,
  PropertyType,
  SignTiming,
  SupporterIntent,
  VolunteerRole,
} from "@/config/types";
import {
  FIELD_LIMITS,
  isValidPostalCode,
  sanitize,
  submitForm,
  useSubmissionToken,
  type SubmitOutcome,
  type SupporterSubmission,
} from "@/lib/forms";
import { toast } from "sonner";

const t = getStrings(candidate.locale);
const s = t.supporterForm;

const ALL_INTENTS: SupporterIntent[] = ["volunteer", "lawn-sign", "pledge"];
const ROLES = Object.keys(s.roles) as VolunteerRole[];
const AVAILABILITY = Object.keys(s.availability) as AvailabilitySlot[];
const PROPERTY_TYPES = Object.keys(s.propertyTypes) as PropertyType[];
const TIMINGS = Object.keys(s.timings) as SignTiming[];

interface SupporterActionFormProps {
  id?: string;
  initialIntents?: SupporterIntent[];
  source?: string;
}

/**
 * Conditional supporter workflow (P0-04): volunteer, lawn-sign, and pledge
 * requests each collect what they actually need. Action cards / deep links
 * preselect intents; `required` attributes exist only in rendered sections.
 */
export function SupporterActionForm({
  id = "supporter-form",
  initialIntents = [],
  source = "get-involved",
}: SupporterActionFormProps) {
  const enabledIntents = ALL_INTENTS.filter(
    (intent) =>
      (intent !== "lawn-sign" || candidate.features.lawnSigns) &&
      (intent !== "pledge" || candidate.features.pledge),
  );

  const [intents, setIntents] = useState<ReadonlySet<SupporterIntent>>(
    () => new Set(initialIntents.filter((i) => enabledIntents.includes(i))),
  );
  const [phase, setPhase] = useState<"idle" | "submitting" | "success">("idle");
  const [errorKind, setErrorKind] = useState<Exclude<SubmitOutcome, { status: "ok" }>["kind"] | null>(
    null,
  );
  const [intentError, setIntentError] = useState(false);
  const [volunteerRoles, setVolunteerRoles] = useState<ReadonlySet<VolunteerRole>>(new Set());
  const [submissionId, setSubmissionId] = useState("");
  const token = useSubmissionToken();

  // Deep-link navigation while mounted (e.g. FinalCta lawn-sign click).
  useEffect(() => {
    if (initialIntents.length > 0) {
      setIntents(new Set(initialIntents.filter((i) => enabledIntents.includes(i))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIntents.join(",")]);

  function toggleIntent(intent: SupporterIntent) {
    setIntentError(false);
    setIntents((prev) => {
      const next = new Set(prev);
      if (next.has(intent)) next.delete(intent);
      else next.add(intent);
      return next;
    });
  }

  function toggleRole(role: VolunteerRole) {
    setVolunteerRoles((prev) => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === "submitting") return;

    if (intents.size === 0) {
      setIntentError(true);
      return;
    }

    const form = e.target as HTMLFormElement;
    const field = (name: string) => {
      const el = form.elements.namedItem(`${id}-${name}`);
      return el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
        ? el.value
        : "";
    };
    const checked = (name: string) => {
      const el = form.elements.namedItem(`${id}-${name}`);
      return el instanceof HTMLInputElement ? el.checked : false;
    };

    const postalCode = sanitize(field("postal"), FIELD_LIMITS.postalCode);
    if (!isValidPostalCode(postalCode)) {
      toast.error(t.contactForm.postalCodeError);
      return;
    }

    const activeIntents = [...intents].sort();
    setPhase("submitting");
    setErrorKind(null);

    const payload: SupporterSubmission = {
      formType: "supporter",
      version: 2,
      source: `${source}:${activeIntents.join("+")}`,
      token: token.current(),
      website: "",
      firstName: sanitize(field("first"), FIELD_LIMITS.name),
      lastName: sanitize(field("last"), FIELD_LIMITS.name),
      email: sanitize(field("email"), FIELD_LIMITS.email),
      phone: sanitize(field("phone"), FIELD_LIMITS.phone),
      postalCode,
      language: field("language"),
      intents: activeIntents,
      emailConsent: checked("consent"),
      ...(intents.has("volunteer")
        ? {
            volunteerRoles: [...volunteerRoles].sort(),
            volunteerOther: volunteerRoles.has("other")
              ? sanitize(field("role-other"), FIELD_LIMITS.other)
              : "",
            availability: AVAILABILITY.filter((slot) => checked(`avail-${slot}`)),
            accessibilityNotes: sanitize(field("accessibility"), FIELD_LIMITS.notes),
          }
        : {}),
      ...(intents.has("lawn-sign")
        ? {
            signAddress: sanitize(field("address"), FIELD_LIMITS.address),
            propertyType: field("property") as PropertyType,
            permissionConfirmed: checked("permission"),
            signTiming: field("timing") as SignTiming,
            quantity: Math.max(1, Math.min(3, Number(field("quantity")) || 1)),
            retrievalOk: checked("retrieval"),
          }
        : {}),
      ...(intents.has("pledge")
        ? {
            pledged: checked("pledge"),
            reminderOk: checked("reminder"),
          }
        : {}),
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
        <h3 className="form-success__title">{s.successTitle(candidate.identity.teamName)}</h3>
        <p>{s.successBody(candidate.contact.email)}</p>
        {submissionId !== "ok" && (
          <p className="form-success__ref">{t.forms.successRefLabel(submissionId)}</p>
        )}
      </div>
    );
  }

  return (
    <form id={id} className="purpose-form" onSubmit={handleSubmit}>
      <h2 className="purpose-form__title">{s.title}</h2>
      <p className="purpose-form__hint">{t.forms.requiredHint}</p>

      <fieldset className="purpose-form__fieldset">
        <legend>{s.intentLegend}</legend>
        <div className="intent-pills">
          {enabledIntents.map((intent) => (
            <label
              key={intent}
              className={`intent-pill${intents.has(intent) ? " intent-pill--active" : ""}`}
            >
              <input
                type="checkbox"
                checked={intents.has(intent)}
                onChange={() => toggleIntent(intent)}
              />
              <span>{s.intents[intent]}</span>
            </label>
          ))}
        </div>
        {intentError && (
          <p className="form-error" role="alert">
            {s.intentRequired}
          </p>
        )}
      </fieldset>

      <div className="purpose-form__row">
        <div className="purpose-form__field">
          <label htmlFor={`${id}-first`}>{s.firstName}</label>
          <input
            id={`${id}-first`}
            name={`${id}-first`}
            type="text"
            autoComplete="given-name"
            maxLength={FIELD_LIMITS.name}
            required
          />
        </div>
        <div className="purpose-form__field">
          <label htmlFor={`${id}-last`}>{s.lastName}</label>
          <input
            id={`${id}-last`}
            name={`${id}-last`}
            type="text"
            autoComplete="family-name"
            maxLength={FIELD_LIMITS.name}
            required
          />
        </div>
      </div>

      <div className="purpose-form__row">
        <div className="purpose-form__field">
          <label htmlFor={`${id}-email`}>{s.email}</label>
          <input
            id={`${id}-email`}
            name={`${id}-email`}
            type="email"
            autoComplete="email"
            maxLength={FIELD_LIMITS.email}
            required
          />
        </div>
        <div className="purpose-form__field">
          <label htmlFor={`${id}-phone`}>
            {s.phone} <span className="purpose-form__optional">{t.forms.optionalSuffix}</span>
          </label>
          <input
            id={`${id}-phone`}
            name={`${id}-phone`}
            type="tel"
            autoComplete="tel"
            maxLength={FIELD_LIMITS.phone}
          />
        </div>
      </div>

      <div className="purpose-form__row">
        <div className="purpose-form__field">
          <label htmlFor={`${id}-postal`}>
            {s.postalCode} <span className="purpose-form__optional">{t.forms.optionalSuffix}</span>
          </label>
          <input
            id={`${id}-postal`}
            name={`${id}-postal`}
            type="text"
            autoComplete="postal-code"
            maxLength={FIELD_LIMITS.postalCode}
          />
        </div>
        <div className="purpose-form__field">
          <label htmlFor={`${id}-language`}>{s.languageLabel}</label>
          <select id={`${id}-language`} name={`${id}-language`} defaultValue="en">
            {candidate.forms.supporter.languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {intents.has("volunteer") && (
        <fieldset className="purpose-form__fieldset">
          <legend>{s.volunteerLegend}</legend>
          <div className="purpose-form__checks">
            {ROLES.map((role) => (
              <label key={role} className="purpose-form__check">
                <input
                  type="checkbox"
                  checked={volunteerRoles.has(role)}
                  onChange={() => toggleRole(role)}
                />
                <span>{s.roles[role]}</span>
              </label>
            ))}
          </div>
          {volunteerRoles.has("other") && (
            <div className="purpose-form__field">
              <label htmlFor={`${id}-role-other`}>{s.roleOtherLabel}</label>
              <input
                id={`${id}-role-other`}
                name={`${id}-role-other`}
                type="text"
                maxLength={FIELD_LIMITS.other}
                placeholder={s.roleOtherPlaceholder}
              />
            </div>
          )}
          <p className="purpose-form__legend-sm">{s.availabilityLegend}</p>
          <div className="purpose-form__checks purpose-form__checks--inline">
            {AVAILABILITY.map((slot) => (
              <label key={slot} className="purpose-form__check">
                <input type="checkbox" id={`${id}-avail-${slot}`} name={`${id}-avail-${slot}`} />
                <span>{s.availability[slot]}</span>
              </label>
            ))}
          </div>
          <div className="purpose-form__field">
            <label htmlFor={`${id}-accessibility`}>
              {s.accessibilityLabel}{" "}
              <span className="purpose-form__optional">{t.forms.optionalSuffix}</span>
            </label>
            <textarea
              id={`${id}-accessibility`}
              name={`${id}-accessibility`}
              rows={2}
              maxLength={FIELD_LIMITS.notes}
              placeholder={s.accessibilityPlaceholder}
            />
          </div>
        </fieldset>
      )}

      {intents.has("lawn-sign") && (
        <fieldset className="purpose-form__fieldset">
          <legend>{s.signLegend}</legend>
          <div className="purpose-form__field">
            <label htmlFor={`${id}-address`}>{s.addressLabel}</label>
            <input
              id={`${id}-address`}
              name={`${id}-address`}
              type="text"
              autoComplete="street-address"
              maxLength={FIELD_LIMITS.address}
              placeholder={s.addressPlaceholder}
              required
            />
          </div>
          <div className="purpose-form__row">
            <div className="purpose-form__field">
              <label htmlFor={`${id}-property`}>{s.propertyTypeLabel}</label>
              <select id={`${id}-property`} name={`${id}-property`} defaultValue="house">
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {s.propertyTypes[type]}
                  </option>
                ))}
              </select>
            </div>
            <div className="purpose-form__field">
              <label htmlFor={`${id}-timing`}>{s.timingLabel}</label>
              <select id={`${id}-timing`} name={`${id}-timing`} defaultValue="campaign-start">
                {TIMINGS.map((timing) => (
                  <option key={timing} value={timing}>
                    {s.timings[timing]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="purpose-form__field purpose-form__field--narrow">
            <label htmlFor={`${id}-quantity`}>{s.quantityLabel}</label>
            <select id={`${id}-quantity`} name={`${id}-quantity`} defaultValue="1">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <label className="purpose-form__check">
            <input type="checkbox" id={`${id}-permission`} name={`${id}-permission`} required />
            <span>{s.permissionLabel}</span>
          </label>
          <label className="purpose-form__check">
            <input type="checkbox" id={`${id}-retrieval`} name={`${id}-retrieval`} defaultChecked />
            <span>{s.retrievalLabel}</span>
          </label>
        </fieldset>
      )}

      {intents.has("pledge") && (
        <fieldset className="purpose-form__fieldset">
          <legend>{s.pledgeLegend}</legend>
          <label className="purpose-form__check">
            <input type="checkbox" id={`${id}-pledge`} name={`${id}-pledge`} required />
            <span>{s.pledgeLabel}</span>
          </label>
          <label className="purpose-form__check">
            <input type="checkbox" id={`${id}-reminder`} name={`${id}-reminder`} />
            <span>{s.reminderLabel}</span>
          </label>
          <p className="purpose-form__note">{s.nonBindingNote}</p>
        </fieldset>
      )}

      <label className="purpose-form__check purpose-form__check--consent">
        <input type="checkbox" id={`${id}-consent`} name={`${id}-consent`} required />
        <span>{s.consentLabel(candidate.identity.campaignName)}</span>
      </label>
      {(intents.has("volunteer") || intents.size > 0) && (
        <p className="join-form__disclaimer purpose-form__sms">
          {t.joinForm.smsDisclaimer(candidate.identity.campaignName)}
        </p>
      )}

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
        {phase === "submitting" ? t.forms.submitting : s.submit}
      </button>
    </form>
  );
}
