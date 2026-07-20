import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { candidate } from "@/config/candidate";
import {
  FIELD_LIMITS,
  sanitize,
  submitForm,
  useSubmissionToken,
  type RideRequestSubmission,
} from "@/lib/forms";

const allowedDates = new Set(candidate.ride.eligibleDates.map((date) => date.value));

export function RideRequestForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const token = useSubmissionToken();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const field = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
        .value;
    const requestedDate = field("ride-date");

    // Honeypot: silently ignore automated submissions.
    if (field("website")) return;

    if (!allowedDates.has(requestedDate)) {
      toast.error("Please choose an available voting day.");
      return;
    }

    const payload: RideRequestSubmission = {
      formType: "ride-request",
      version: 2,
      source: "ride-page",
      token: token.current(),
      website: "",
      fullName: sanitize(field("ride-name"), FIELD_LIMITS.name),
      email: sanitize(field("ride-email"), FIELD_LIMITS.email),
      phone: sanitize(field("ride-phone"), FIELD_LIMITS.phone),
      pickupAddress: sanitize(field("ride-address"), FIELD_LIMITS.address),
      requestedDate,
      notes: sanitize(field("ride-notes"), FIELD_LIMITS.notes),
    };

    setSubmitting(true);
    const outcome = await submitForm(payload);
    setSubmitting(false);

    if (outcome.status === "ok") {
      token.refresh();
      setSubmissionId(outcome.submissionId);
      form.reset();
      return;
    }

    toast.error("We couldn't send your ride request.", {
      description:
        outcome.kind === "timeout"
          ? "The request took too long. Please try again."
          : `Please try again or email ${candidate.contact.email}.`,
    });
  }

  if (submissionId) {
    return (
      <div className="form-success" role="status" tabIndex={-1}>
        <h2 className="form-success__title">{candidate.ride.confirmationTitle}</h2>
        <p>{candidate.ride.confirmationBody}</p>
        <p className="form-success__ref">Reference: {submissionId}</p>
      </div>
    );
  }

  return (
    <form className="purpose-form ride-form" onSubmit={handleSubmit}>
      <h2 className="purpose-form__title">Ride request details</h2>
      <p className="purpose-form__hint">
        Required fields are marked with an asterisk. {candidate.ride.responseTime}
      </p>

      <div className="purpose-form__field">
        <label htmlFor="ride-name">Full name *</label>
        <input
          id="ride-name"
          name="ride-name"
          type="text"
          autoComplete="name"
          maxLength={FIELD_LIMITS.name}
          required
        />
      </div>

      <div className="purpose-form__row">
        <div className="purpose-form__field">
          <label htmlFor="ride-email">Email address *</label>
          <input
            id="ride-email"
            name="ride-email"
            type="email"
            autoComplete="email"
            maxLength={FIELD_LIMITS.email}
            required
          />
        </div>
        <div className="purpose-form__field">
          <label htmlFor="ride-phone">Phone number *</label>
          <input
            id="ride-phone"
            name="ride-phone"
            type="tel"
            autoComplete="tel"
            maxLength={FIELD_LIMITS.phone}
            required
          />
        </div>
      </div>

      <div className="purpose-form__field">
        <label htmlFor="ride-address">Pickup address *</label>
        <input
          id="ride-address"
          name="ride-address"
          type="text"
          autoComplete="street-address"
          maxLength={FIELD_LIMITS.address}
          required
        />
      </div>

      <div className="purpose-form__field">
        <label htmlFor="ride-date">Requested voting day *</label>
        <select id="ride-date" name="ride-date" defaultValue="" required>
          <option value="" disabled>
            Choose a voting day
          </option>
          {candidate.ride.eligibleDates.map((date) => (
            <option key={date.value} value={date.value}>
              {date.label}
            </option>
          ))}
        </select>
      </div>

      <div className="purpose-form__field">
        <label htmlFor="ride-notes">
          Notes <span className="purpose-form__optional">(optional)</span>
        </label>
        <textarea
          id="ride-notes"
          name="ride-notes"
          rows={4}
          maxLength={FIELD_LIMITS.notes}
          aria-describedby="ride-notes-help"
        />
        <p id="ride-notes-help" className="purpose-form__note">
          {candidate.ride.availabilityNote}
        </p>
      </div>

      <label className="purpose-form__honeypot" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <button
        type="submit"
        className="btn btn--mustard btn--lg btn--full"
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? "Sending…" : "Request a Ride"}
      </button>

      <p className="purpose-form__note">
        By submitting this form, you agree to our <Link to="/privacy">privacy policy</Link>.
      </p>
    </form>
  );
}
