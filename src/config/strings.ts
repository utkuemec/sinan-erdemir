import type {
  AvailabilitySlot,
  BuiltinCardKind,
  ContactTopic,
  Locale,
  PreferredResponse,
  PropertyType,
  SignTiming,
  SupporterIntent,
  VolunteerRole,
} from "./types";

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
    privacy: string;
    skipToContent: string;
  };
  buttons: {
    volunteer: string;
    donate: string;
    goHome: string;
    requestLawnSign: string;
    contact: string;
    seeFullPlan: string;
    meetCandidate: (firstName: string) => string;
    seeMoreCommunity: string;
    viewFullMap: string;
  };
  finalCta: {
    /** e.g. heading("Ward 16") -> "Help bring everyday improvements to Ward 16." */
    heading: (wardShort: string) => string;
  };
  /** Shared bits for all purpose-built forms. */
  forms: {
    requiredHint: string;
    optionalSuffix: string;
    charCount: (used: number, max: number) => string;
    submitting: string;
    errorTitle: string;
    /** Rendered around a mailto link to the campaign email. */
    errorBodyBeforeEmail: string;
    errorBodyAfterEmail: string;
    timeoutError: string;
    configError: string;
    successRefLabel: (submissionId: string) => string;
  };
  contactForm: {
    title: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    postalCode: string;
    postalCodePlaceholder: string;
    postalCodeError: string;
    topicLabel: string;
    topics: Record<ContactTopic, string>;
    messageLabel: string;
    messagePlaceholder: string;
    preferredResponseLabel: string;
    preferredResponseOptions: Record<PreferredResponse, string>;
    phoneRequiredNote: string;
    privacyAckBeforeLink: string;
    privacyAckLinkLabel: string;
    privacyAckAfterLink: string;
    submit: string;
    successTitle: string;
    successBody: (email: string) => string;
  };
  supporterForm: {
    title: string;
    intentLegend: string;
    intents: Record<SupporterIntent, string>;
    intentRequired: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    postalCode: string;
    languageLabel: string;
    consentLabel: (campaignName: string) => string;
    volunteerLegend: string;
    roles: Record<VolunteerRole, string>;
    roleOtherLabel: string;
    roleOtherPlaceholder: string;
    availabilityLegend: string;
    availability: Record<AvailabilitySlot, string>;
    accessibilityLabel: string;
    accessibilityPlaceholder: string;
    signLegend: string;
    addressLabel: string;
    addressPlaceholder: string;
    propertyTypeLabel: string;
    propertyTypes: Record<PropertyType, string>;
    permissionLabel: string;
    timingLabel: string;
    timings: Record<SignTiming, string>;
    quantityLabel: string;
    retrievalLabel: string;
    pledgeLegend: string;
    pledgeLabel: string;
    reminderLabel: string;
    nonBindingNote: string;
    submit: string;
    successTitle: (teamName: string) => string;
    successBody: (email: string) => string;
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
    /**
     * Contribution-eligibility declaration (Ontario municipal elections).
     * DRAFT wording — the official agent must approve before launch.
     */
    eligibilityLegend: string;
    eligibilityItems: {
      eligible: string;
      ownFunds: string;
      notOnBehalf: string;
    };
    authorizedNote: (authorizedBy: string) => string;
    opensExternal: string;
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
    effectiveLabel: string;
    updatedLabel: string;
    noSaleStatement: string;
    sections: {
      collectHeading: string;
      collectIntro: string;
      /** Per-form collection descriptions — rendered only for enabled forms. */
      collectByForm: {
        signup: { heading: string; body: string };
        contact: { heading: string; body: string };
        supporter: { heading: string; body: string };
        donation: { heading: string; body: string; etransferExtra: string };
      };
      technicalBody: string;
      useHeading: string;
      useBody: string;
      providersHeading: string;
      providersIntro: string;
      retentionHeading: string;
      choicesHeading: string;
      /** Rendered around a mailto link to `email`. */
      choicesBodyBeforeEmail: string;
      choicesBodyAfterEmail: string;
      sharingHeading: string;
      sharingBody: string;
      contactHeading: string;
      /** contactBody(contactRole) rendered around a mailto link. */
      contactBodyBeforeEmail: (contactRole: string) => string;
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
    privacy: "Privacy",
    skipToContent: "Skip to content",
  },
  buttons: {
    volunteer: "Volunteer",
    donate: "Donate",
    goHome: "Go Home",
    requestLawnSign: "Request a Lawn Sign",
    contact: "Contact",
    seeFullPlan: "See the Full Plan",
    meetCandidate: (firstName) => `Meet ${firstName}`,
    seeMoreCommunity: "See more from the community",
    viewFullMap: "View full-size map",
  },
  finalCta: {
    heading: (wardShort) => `Help bring everyday improvements to ${wardShort}.`,
  },
  forms: {
    requiredHint: "Required fields are marked with *",
    optionalSuffix: "(optional)",
    charCount: (used, max) => `${used}/${max} characters`,
    submitting: "Sending…",
    errorTitle: "Something went wrong.",
    errorBodyBeforeEmail: "Your message was not sent. Please try again, or email us directly at ",
    errorBodyAfterEmail: ".",
    timeoutError: "The request timed out — your submission may not have been received. Please try again.",
    configError: "The form isn't connected yet. Please email us instead.",
    successRefLabel: (submissionId) => `Reference: ${submissionId}`,
  },
  contactForm: {
    title: "Send a Message",
    fullName: "Full name *",
    fullNamePlaceholder: "Your full name",
    email: "Email address *",
    emailPlaceholder: "you@example.com",
    phone: "Phone number",
    phonePlaceholder: "(416) 555-0100",
    postalCode: "Postal code",
    postalCodePlaceholder: "M3A 1A1",
    postalCodeError: "Please enter a valid postal code (e.g. M3A 1A1).",
    topicLabel: "What is this about? *",
    topics: {
      neighbourhood: "Neighbourhood issue",
      policy: "Policy question",
      media: "Media inquiry",
      volunteer: "Volunteer question",
      event: "Event invitation",
      other: "Other",
    },
    messageLabel: "Your message *",
    messagePlaceholder: "Tell us what's on your mind…",
    preferredResponseLabel: "How should we respond?",
    preferredResponseOptions: {
      email: "By email",
      phone: "By phone",
    },
    phoneRequiredNote: "A phone number is required for a phone response.",
    privacyAckBeforeLink: "I have read the ",
    privacyAckLinkLabel: "privacy policy",
    privacyAckAfterLink: " and consent to the campaign storing my message. *",
    submit: "Send Message",
    successTitle: "Message sent — thank you!",
    successBody: (email) =>
      `The campaign team reads every message. If it's urgent, you can also reach us at ${email}.`,
  },
  supporterForm: {
    title: "Get Involved",
    intentLegend: "How would you like to help? *",
    intents: {
      volunteer: "Volunteer",
      "lawn-sign": "Request a lawn sign",
      pledge: "Pledge to vote",
    },
    intentRequired: "Please choose at least one way to help.",
    firstName: "First name *",
    lastName: "Last name *",
    email: "Email address *",
    phone: "Phone number",
    postalCode: "Postal code",
    languageLabel: "Preferred language",
    consentLabel: (campaignName) =>
      `I consent to receive campaign emails from ${campaignName}. I can unsubscribe at any time. *`,
    volunteerLegend: "Volunteer roles",
    roles: {
      canvassing: "Canvassing",
      "phone-bank": "Phone bank",
      "sign-delivery": "Sign delivery",
      "event-support": "Event support",
      "data-entry": "Data entry",
      translation: "Translation",
      "social-media": "Social media",
      "host-event": "Host a gathering",
      other: "Other",
    },
    roleOtherLabel: "Other role",
    roleOtherPlaceholder: "Tell us how you'd like to help",
    availabilityLegend: "When are you generally available?",
    availability: {
      weekday: "Weekdays",
      weekend: "Weekends",
      daytime: "Daytime",
      evening: "Evenings",
    },
    accessibilityLabel: "Mobility or accessibility considerations",
    accessibilityPlaceholder: "Anything we should know so you can participate comfortably",
    signLegend: "Lawn sign details",
    addressLabel: "Installation address *",
    addressPlaceholder: "Street address for the sign",
    propertyTypeLabel: "Property type",
    propertyTypes: {
      house: "House",
      townhouse: "Townhouse",
      "condo-apartment": "Condo / apartment",
      business: "Business",
      other: "Other",
    },
    permissionLabel: "I confirm I have permission to place a sign at this address. *",
    timingLabel: "When should we install it?",
    timings: {
      asap: "As soon as possible",
      "campaign-start": "When the sign campaign starts",
      "no-preference": "No preference",
    },
    quantityLabel: "Number of signs",
    retrievalLabel: "The campaign may pick the sign up after election day.",
    pledgeLegend: "Pledge to vote",
    pledgeLabel: "I plan to vote in the 2026 Toronto municipal election. *",
    reminderLabel: "Send me a reminder before voting days.",
    nonBindingNote: "A pledge is a personal commitment, not a legal obligation.",
    submit: "Send",
    successTitle: (teamName) => `Welcome to ${teamName}!`,
    successBody: (email) =>
      `Thanks — the team will follow up soon. Questions in the meantime? Email ${email}.`,
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
    // DRAFT — Ontario municipal contribution rules. The official agent must
    // approve this wording before launch (audit P0-08).
    eligibilityLegend: "Contribution eligibility (required)",
    eligibilityItems: {
      eligible: "I am an individual normally resident in Ontario and eligible to contribute under the Municipal Elections Act.",
      ownFunds: "This contribution comes from my own funds.",
      notOnBehalf: "I am not contributing on behalf of a corporation, trade union, or another person.",
    },
    authorizedNote: (authorizedBy) => authorizedBy,
    opensExternal: "Opens in a new tab",
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
    lede: "This campaign only asks for the information needed to stay in touch with supporters, complete the requests you make, and meet Ontario campaign-finance record requirements.",
    effectiveLabel: "Effective date",
    updatedLabel: "Last updated",
    noSaleStatement: "We never sell personal information.",
    sections: {
      collectHeading: "Information We Collect",
      collectIntro:
        "What we collect depends on which form you use. Every form stores exactly the fields it shows — nothing more:",
      collectByForm: {
        signup: {
          heading: "Campaign signup",
          body: "First and last name, email address, and an optional phone number, along with which page you signed up from.",
        },
        contact: {
          heading: "Contact messages",
          body: "Your name, email address, message, topic, optional phone number and postal code, and how you prefer to be contacted.",
        },
        supporter: {
          heading: "Volunteer, lawn-sign, and pledge requests",
          body: "Your name and contact details plus only the extra information the request needs — volunteer roles and availability, a lawn-sign installation address, or a voting pledge and optional reminder consent.",
        },
        donation: {
          heading: "Donations",
          body: "Credit-card contributions happen entirely on our payment processor's secure site — this website never sees or stores card numbers.",
          etransferExtra:
            "If you start an Interac e-Transfer contribution, we collect your full name, email, phone number, and residential address, plus eligibility confirmations, because Ontario municipal campaign-finance rules require contributor records.",
        },
      },
      technicalBody:
        "Our website host also keeps standard, short-lived server access logs (browser type and approximate visit time). The site sets no analytics or advertising cookies.",
      useHeading: "How We Use It",
      useBody:
        "We use this information to send campaign updates you've consented to, respond to your messages, organize volunteers and lawn signs, keep legally required contribution records, and understand community interest in the campaign.",
      providersHeading: "Service Providers",
      providersIntro: "The campaign uses these services to operate the website and store submissions:",
      retentionHeading: "Retention",
      choicesHeading: "Your Choices",
      choicesBodyBeforeEmail:
        "You can unsubscribe from campaign updates or ask to have your information accessed, corrected, or removed by emailing ",
      choicesBodyAfterEmail:
        ". Text messages may also be stopped by replying STOP. Contribution records may need to be retained where Ontario election rules require it.",
      sharingHeading: "Sharing",
      sharingBody:
        "We do not sell personal information. Information is shared only with the service providers above and with campaign volunteers who need it to complete your request, and with election authorities where the law requires it.",
      contactHeading: "Contact",
      contactBodyBeforeEmail: (contactRole) =>
        `Privacy questions and access, correction, or deletion requests are handled by the campaign's ${contactRole}. Reach them at `,
      contactBodyAfterEmail: ".",
    },
  },
};

export const strings: Record<Locale, UiStrings> = { en };

export function getStrings(locale: Locale): UiStrings {
  return strings[locale];
}
