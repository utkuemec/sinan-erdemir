import { useCallback, useRef } from "react";
import type {
  AvailabilitySlot,
  ContactTopic,
  PreferredResponse,
  PropertyType,
  SignTiming,
  SupporterIntent,
  VolunteerRole,
} from "@/config/types";

/**
 * Shared form-submission layer for the Google Apps Script v2 backend
 * (google-apps-script/CodeV2.js).
 *
 * Transport notes (do not "fix" these — they are load-bearing):
 * - Content-Type stays text/plain so the POST is a CORS "simple request".
 *   Apps Script cannot answer OPTIONS preflights, but its "Anyone" web-app
 *   responses carry Access-Control-Allow-Origin: *, so a simple request's
 *   response IS readable — unlike the old mode:"no-cors" flow that faked
 *   success.
 * - Never add custom headers (that would trigger a preflight and fail).
 * - Apps Script returns HTTP 200 even for errors/misconfigurations, so a
 *   response only counts as success when it parses as JSON with
 *   success === true and a string submissionId.
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

export type FormType = "signup" | "contact" | "supporter" | "donate-etransfer";

/** Field caps — mirrored in the Apps Script SCHEMAS; keep both in sync. */
export const FIELD_LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  postalCode: 10,
  message: 2000,
  address: 300,
  notes: 500,
  other: 200,
} as const;

interface BaseSubmission {
  formType: FormType;
  version: 2;
  source: string;
  /** Idempotency token — server dedupes retries of the same attempt. */
  token: string;
  /** Honeypot — real users never fill this. */
  website: "";
}

export interface SignupSubmission extends BaseSubmission {
  formType: "signup";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ContactSubmission extends BaseSubmission {
  formType: "contact";
  fullName: string;
  email: string;
  phone: string;
  postalCode: string;
  topic: ContactTopic;
  message: string;
  preferredResponse: PreferredResponse;
}

export interface SupporterSubmission extends BaseSubmission {
  formType: "supporter";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  language: string;
  intents: SupporterIntent[];
  volunteerRoles?: VolunteerRole[];
  volunteerOther?: string;
  availability?: AvailabilitySlot[];
  accessibilityNotes?: string;
  signAddress?: string;
  propertyType?: PropertyType;
  permissionConfirmed?: boolean;
  signTiming?: SignTiming;
  quantity?: number;
  retrievalOk?: boolean;
  pledged?: boolean;
  reminderOk?: boolean;
  emailConsent: boolean;
}

export interface EtransferSubmission extends BaseSubmission {
  formType: "donate-etransfer";
  fullName: string;
  email: string;
  phone: string;
  address: string;
  eligibilityConfirmed: boolean;
  ownFundsConfirmed: boolean;
  notOnBehalfConfirmed: boolean;
}

export type AnySubmission =
  | SignupSubmission
  | ContactSubmission
  | SupporterSubmission
  | EtransferSubmission;

export type SubmitOutcome =
  | { status: "ok"; submissionId: string }
  | { status: "error"; kind: "config" | "timeout" | "network" | "server" | "validation" };

export async function submitForm(
  payload: AnySubmission,
  timeoutMs = 15_000, // Apps Script cold starts can take 5-10s
): Promise<SubmitOutcome> {
  if (!ENDPOINT) {
    return { status: "error", kind: "config" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    return {
      status: "error",
      kind: err instanceof DOMException && err.name === "AbortError" ? "timeout" : "network",
    };
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    return { status: "error", kind: "server" };
  }

  try {
    const json: unknown = await response.json();
    if (
      typeof json === "object" &&
      json !== null &&
      (json as { success?: unknown }).success === true &&
      typeof (json as { submissionId?: unknown }).submissionId === "string"
    ) {
      return { status: "ok", submissionId: (json as { submissionId: string }).submissionId };
    }
    if (
      typeof json === "object" &&
      json !== null &&
      (json as { success?: unknown }).success === false
    ) {
      return { status: "error", kind: "validation" };
    }
  } catch {
    // HTML login wall / crash page — misconfigured deployment.
  }
  return { status: "error", kind: "server" };
}

function randomToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Idempotency token, stable across retries of the same attempt (the server
 * dedupes), refreshed only after a confirmed success so an intentional
 * second submission gets its own token.
 */
export function useSubmissionToken(): { current: () => string; refresh: () => void } {
  const ref = useRef<string>(randomToken());
  const current = useCallback(() => ref.current, []);
  const refresh = useCallback(() => {
    ref.current = randomToken();
  }, []);
  return { current, refresh };
}

/** Trim, strip control characters, cap length. */
export function sanitize(value: string, max: number): string {
  let out = "";
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code >= 32 && code !== 127) out += ch; // drop control characters
  }
  return out.trim().slice(0, max);
}

/** Canadian postal code (empty passes — use `required` for mandatory). */
export function isValidPostalCode(value: string): boolean {
  return value === "" || /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value.trim());
}
