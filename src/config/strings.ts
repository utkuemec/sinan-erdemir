import type { BuiltinCardKind, Locale } from "./types";

/**
 * UI-chrome strings (labels, buttons, toasts, legal boilerplate) — everything
 * user-facing that is NOT candidate content. Candidate content lives in
 * `candidate.ts`.
 *
 * i18n: adding a language means adding one fully-typed object to `strings`
 * below and widening `Locale` in types.ts — the `UiStrings` type guarantees
 * completeness at compile time. Interpolation uses plain functions, so there
 * is no template syntax to learn and no runtime library.
 */

export interface UiStrings {
  nav: {
    community: string;
    getInvolved: string;
    contact: string;
    vote: string;
  };
  buttons: {
    volunteer: string;
    donate: string;
    goHome: string;
  };
  joinForm: {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    submit: (teamName: string) => string;
    submitting: string;
    successTitle: (teamName: string) => string;
    successBody: (email: string) => string;
    errorTitle: string;
    errorBody: string;
    /**
     * SMS-consent disclaimer required for campaign texting. Keep the
     * HELP/STOP language and the privacy-policy link intact.
     */
    smsDisclaimer: (campaignName: string) => string;
    privacyLinkLabel: (siteHost: string) => string;
  };
  donateModal: {
    title: string;
    subtitle: string;
    creditCardLabel: string;
    creditCardSub: (processorName: string) => string;
    etransferLabel: string;
    etransferSub: string;
    etransferFormTitle: string;
    etransferFormSubtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    address: string;
    addressPlaceholder: string;
    continue: string;
    submitting: string;
    instructionsTitle: string;
    instructionsSubtitle: string;
    copy: string;
    copied: string;
    copyAria: string;
    step1: string;
    step2Prefix: string;
    step3: string;
    step4: string;
    done: string;
    back: string;
    close: string;
    errorTitle: string;
    errorBody: (email: string) => string;
    copyError: string;
  };
  getInvolvedCards: Record<BuiltinCardKind, { title: string; body: string; cta: string }>;
  notFound: {
    eyebrow: string;
    title: string;
    body: string;
  };
  privacy: {
    pageTitle: string;
    metaDescription: (siteTitle: string) => string;
    ogDescription: string;
    eyebrow: string;
    heading: string;
    lede: string;
    sections: {
      collectHeading: string;
      collectBody: string;
      useHeading: string;
      useBody: string;
      choicesHeading: string;
      /** Rendered around a mailto link to `email`. */
      choicesBodyBeforeEmail: string;
      choicesBodyAfterEmail: string;
      sharingHeading: string;
      sharingBody: string;
      contactHeading: string;
      contactBodyBeforeEmail: string;
      contactBodyAfterEmail: string;
    };
  };
}

const en: UiStrings = {
  nav: {
    community: "Community",
    getInvolved: "Get Involved",
    contact: "Contact",
    vote: "Voting Info",
  },
  buttons: {
    volunteer: "Volunteer",
    donate: "Donate",
    goHome: "Go Home",
  },
  joinForm: {
    title: "Join the Campaign",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    phone: "Phone number",
    firstNamePlaceholder: "First Name",
    lastNamePlaceholder: "Last Name",
    emailPlaceholder: "Your Email Address",
    phonePlaceholder: "Your Phone Number",
    submit: (teamName) => `Join ${teamName}`,
    submitting: "Joining…",
    successTitle: (teamName) => `Thanks for joining ${teamName}!`,
    successBody: (email) => `If you don't hear from us soon, email ${email}.`,
    errorTitle: "Something went wrong.",
    errorBody: "Please try again or email us directly.",
    smsDisclaimer: (campaignName) =>
      `By providing your phone number you consent to receive periodic campaign updates from ${campaignName}. Text HELP for help, STOP to end. Msg & data rates may apply.`,
    privacyLinkLabel: (siteHost) => `${siteHost}/privacy`,
  },
  donateModal: {
    title: "Support the Campaign",
    subtitle: "Choose how you'd like to donate:",
    creditCardLabel: "Donate by Credit Card",
    creditCardSub: (processorName) => `Secure payment via ${processorName}`,
    etransferLabel: "Donate by E-Transfer",
    etransferSub: "Interac e-Transfer instructions",
    etransferFormTitle: "E-Transfer Donation",
    etransferFormSubtitle:
      "Please provide your contact details to proceed with your e-transfer donation.",
    fullName: "Full name",
    fullNamePlaceholder: "Full Name",
    email: "Email address",
    emailPlaceholder: "Email Address",
    phone: "Phone number",
    phonePlaceholder: "Phone Number",
    address: "Full residential address",
    addressPlaceholder: "Full Residential Address",
    continue: "Continue to E-Transfer Instructions",
    submitting: "Submitting…",
    instructionsTitle: "E-Transfer Instructions",
    instructionsSubtitle: "Thanks! Here's how to complete your e-transfer.",
    copy: "Copy",
    copied: "Copied",
    copyAria: "Copy email address",
    step1: "Open your bank's Interac e-Transfer page.",
    step2Prefix: "Send your contribution to",
    step3: "In the message field, include the same full name you entered here so we can match your contribution.",
    step4: "We'll confirm receipt by email.",
    done: "Done",
    back: "Back",
    close: "Close",
    errorTitle: "Something went wrong.",
    errorBody: (email) => `Please try again or email us directly at ${email}.`,
    copyError: "Failed to copy. Please copy the email address manually.",
  },
  getInvolvedCards: {
    volunteer: {
      title: "Volunteer",
      body: "Help us reach more people.",
      cta: "Sign up to volunteer",
    },
    donate: {
      title: "Donate",
      body: "Every contribution makes an impact.",
      cta: "Contribute today",
    },
    endorse: {
      title: "Endorse",
      body: "Add your name to our growing list.",
      cta: "Add your endorsement",
    },
    "lawn-sign": {
      title: "Request a Lawn Sign",
      body: "Show your support from your front yard.",
      cta: "Request a sign",
    },
    "host-event": {
      title: "Host an Event",
      body: "Open your living room to your neighbours.",
      cta: "Host a gathering",
    },
    pledge: {
      title: "Pledge to Vote",
      body: "Commit to making your voice heard on election day.",
      cta: "Make your pledge",
    },
  },
  notFound: {
    eyebrow: "404",
    title: "Page Not Found",
    body: "The page you're looking for doesn't exist or has been moved.",
  },
  privacy: {
    pageTitle: "Privacy",
    metaDescription: (siteTitle) => `Privacy information for the ${siteTitle} campaign website.`,
    ogDescription: "How campaign contact information is collected, used, and protected.",
    eyebrow: "Privacy",
    heading: "Privacy Policy",
    lede: "This campaign only asks for the information needed to stay in touch with supporters and respond to community questions.",
    sections: {
      collectHeading: "Information We Collect",
      collectBody:
        "When you submit a form, the campaign may collect your name, email address, phone number, postal code, and any message you choose to send. We may also receive basic technical information from normal website logs, such as browser type and approximate visit time.",
      useHeading: "How We Use It",
      useBody:
        "We use this information to send campaign updates, respond to requests, organize volunteers, and understand community interest in the campaign.",
      choicesHeading: "Your Choices",
      choicesBodyBeforeEmail:
        "You can unsubscribe from campaign updates or ask to have your contact information removed by emailing ",
      choicesBodyAfterEmail: ". Text messages may also be stopped by replying STOP.",
      sharingHeading: "Sharing",
      sharingBody:
        "We do not sell personal information. Information may be shared only with campaign service providers or volunteers who need it to support campaign work.",
      contactHeading: "Contact",
      contactBodyBeforeEmail: "Questions about this policy can be sent to ",
      contactBodyAfterEmail: ".",
    },
  },
};

export const strings: Record<Locale, UiStrings> = { en };

export function getStrings(locale: Locale): UiStrings {
  return strings[locale];
}
