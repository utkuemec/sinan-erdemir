import type { LucideIcon } from "lucide-react";

/**
 * All shapes for the single-candidate config in `candidate.ts`.
 * Icons are direct lucide-react component imports so the bundle only
 * contains the icons a campaign actually uses.
 */

export type Locale = "en";

export type PaletteId =
  | "sunrise"
  | "civic-blue"
  | "grassroots-green"
  | "heritage-red"
  | "victory-red"
  | "midnight-violet";

export type FontPairingId = "bold-poster" | "civic-serif" | "friendly-rounded" | "archivo";

/** Hero silhouette: full-bleed photo with overlay copy, or a colour/photo split panel. */
export type HeroLayoutId = "overlay" | "split";

/** Headline/heading accent motif. */
export type AccentId = "underline" | "highlight" | "minimal";

/** Corner-radius / button shape scale. */
export type ShapeId = "sharp" | "soft" | "pill";

/** Home pillar section: full-bleed colour band or elevated cards. */
export type PillarStyleId = "band" | "cards";

/** Eyebrow label treatment: letterspaced caps or pill badges. */
export type LabelStyleId = "caps" | "badge";

export type SocialPlatform = "instagram" | "facebook" | "x" | "tiktok" | "youtube" | "linkedin";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface ImageRef {
  src: string;
  alt: string;
}

/* --- Form domain values (shared by strings.ts, lib/forms.ts, components) -- */
export type ContactTopic = "neighbourhood" | "policy" | "media" | "volunteer" | "event" | "other";
export type SupporterIntent = "volunteer" | "lawn-sign" | "pledge";
export type VolunteerRole =
  | "canvassing"
  | "phone-bank"
  | "sign-delivery"
  | "event-support"
  | "data-entry"
  | "translation"
  | "social-media"
  | "host-event"
  | "other";
export type AvailabilitySlot = "weekday" | "weekend" | "daytime" | "evening";
export type PropertyType = "house" | "townhouse" | "condo-apartment" | "business" | "other";
export type SignTiming = "asap" | "campaign-start" | "no-preference";
export type PreferredResponse = "email" | "phone";

/** Gallery photo: focal point steers object-position so faces never crop. */
export interface GalleryPhoto extends ImageRef {
  /** CSS object-position value, e.g. "50% 25%". Defaults to "50% 30%". */
  focal?: string;
  /** Optional visible caption (event / place label). */
  caption?: string;
}

/**
 * Feature switches. Sections and workflows check these so the campaign can
 * enable/disable functionality without deleting code.
 */
export interface FeatureFlags {
  donations: boolean;
  /** Hosted credit-card processor; disabled while a replacement is selected. */
  cardDonations: boolean;
  /** E-transfer flow inside the donate modal (official-agent sign-off). */
  eTransfer: boolean;
  endorsements: boolean;
  lawnSigns: boolean;
  pledge: boolean;
  votingInfo: boolean;
}

/** Election facts for the /vote page — config, not route code (audit 16.1). */
export interface VotingConfig {
  navLabel: string;
  pageTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  eyebrow: string;
  heading: string;
  lede: string;
  /** ISO date these facts were last checked against the City Clerk. */
  lastVerified: string;
  sections: { icon: LucideIcon; heading: string; items: string[] }[];
  officialLinks: { label: string; url: string }[];
  disclaimer: string;
}

/** Facts the privacy policy renders so it always matches real data flows. */
export interface PrivacyConfig {
  /** ISO dates shown at the top of the policy. */
  effectiveDate: string;
  lastUpdated: string;
  /** Service providers that touch supporter data. */
  providers: { name: string; purpose: string }[];
  /** Retention/deletion statement (official-agent approved wording). */
  retentionStatement: string;
  /** Role handling privacy requests, e.g. "Campaign Manager". */
  contactRole: string;
}

export interface PriorityItem {
  icon: LucideIcon;
  title: string;
  body: string;
  bullets?: { label: string; text: string }[];
}

/**
 * The three colour-blocked cards under the hero. `variant` names a colour
 * slot from the token system (see styles.css `--bg-pillar-*`), not a literal
 * colour — palette presets re-point what each slot renders as.
 */
export interface PillarCard {
  icon: LucideIcon;
  variant: "mustard" | "turquoise" | "taupe";
  title: string;
  body: string;
  cta?: { label: string; to: string } | { label: string; action: "donate" };
}

export interface Endorsement {
  name: string;
  role: string;
  region: string;
  photo: string;
}

/**
 * Get Involved action cards. Built-in kinds get their title/body/CTA copy
 * from the string layer (overridable per-card); presence in the array is
 * what enables a card. "donate" opens the donate modal; every other kind
 * anchors to the join form, whose `source` field attributes the signup.
 */
export type BuiltinCardKind =
  | "volunteer"
  | "donate"
  | "endorse"
  | "lawn-sign"
  | "host-event"
  | "pledge";

export type GetInvolvedCard =
  | { kind: BuiltinCardKind; title?: string; body?: string; cta?: string }
  | { kind: "custom"; icon: LucideIcon; title: string; body: string; cta: string; href: string };

export interface CandidateConfig {
  locale: Locale;

  theme: {
    /** Palette preset — values defined in styles.css (:root) + themes.css. */
    palette: PaletteId;
    /** Font-pairing preset — see themes.css. */
    fonts: FontPairingId;
    /** Hero silhouette — see the HERO — SPLIT section in styles.css. */
    hero: HeroLayoutId;
    /** "photo" uses hero.imagePortrait/imageLandscape; "solid" renders a palette gradient instead. */
    heroStyle: "photo" | "solid";
    /** Accent motif for the hero headline and section headings. */
    accent: AccentId;
    /** Corner-radius / button shape scale. */
    shape: ShapeId;
    /** Home pillar section style. */
    pillars: PillarStyleId;
    /** Eyebrow label treatment. */
    labels: LabelStyleId;
    /**
     * DEMO ONLY — shows the floating theme switcher so prospects can flip
     * design presets live. Set to false for real candidate builds.
     */
    showDemoThemeSwitcher: boolean;
  };

  identity: {
    /** Logo line 1 / informal references ("Ask <firstName>"). */
    firstName: string;
    /** Logo line 2. */
    lastName: string;
    fullName: string;
    /** Small tagline under the logo name, e.g. "for City Council". */
    logoTagline: string;
    /** Office sought, e.g. "City Council" / "School Board Trustee". */
    office: string;
    /** Municipality / region the campaign is in. */
    jurisdiction: string;
    /** Ward or electoral-area label, e.g. "Ward 5". */
    wardLabel: string;
    electionYear: number;
    /** Name used in the SMS-consent disclaimer, e.g. "Sinan Erdemir for City Council". */
    campaignName: string;
    /** "Team <x>" name used on join buttons and toasts, e.g. "Team Sinan". */
    teamName: string;
  };

  site: {
    /**
     * Full public origin + base path, no trailing slash, e.g.
     * "https://example.github.io/candidate-website-template".
     * Used to build absolute og:image / og:url values; must match the
     * BASE_PATH the site is deployed under.
     */
    url: string;
    /** Root <title> and default og:title, e.g. "Sinan Erdemir for City Council 2026". */
    title: string;
    description: string;
    /** Shorter og:description variant used on the home page. */
    shortDescription: string;
    /** meta author, e.g. "Sinan Erdemir Campaign". */
    author: string;
    /** Site-relative path to the default social-share image (PNG, 1200x630). */
    ogImage: string;
  };

  features: FeatureFlags;

  voting: VotingConfig;

  privacy: PrivacyConfig;

  forms: {
    supporter: {
      /** Languages the campaign can actually respond in. */
      languages: { value: string; label: string }[];
    };
  };

  hero: {
    eyebrow: string;
    headline: string;
    /** Deliberate headline line breaks (falls back to `headline`). */
    headlineLines?: string[];
    subtitle: string;
    /** One-line slogan used in the home page <title> / og:title. */
    sloganLine: string;
    /**
     * Provide one portrait (tall, ~2:3) and one landscape (wide, ~3:2) crop
     * of the hero photo; each hero layout picks the orientation that fits:
     * split uses portrait for the desktop panel and landscape for the mobile
     * band, overlay uses landscape on desktop and portrait on mobile.
     */
    imagePortrait: string;
    imageLandscape: string;
  };

  bio: {
    /** Nav label, e.g. "Meet Sinan". */
    navLabel: string;
    /** Page <title> fragment, e.g. "Meet Sinan". */
    pageTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    eyebrow: string;
    /** Heading lines (rendered with line breaks between them). */
    headingLines: string[];
    portrait: ImageRef;
    paragraphs: string[];
    /** 80-120 word home-page introduction (proof section). */
    homeExcerpt: string;
    /** Short scannable proof chips ("Resident since 2009", …). */
    quickFacts: string[];
    /** Leadership roles, exact titles (client-approved wording). */
    leadership: string[];
    /** Awards / recognitions, exact names (client-approved wording). */
    recognition: string[];
    whyRunning: {
      eyebrow: string;
      quote: string;
      attribution: string;
      paragraphs: string[];
    };
  };

  priorities: {
    navLabel: string;
    pageTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    eyebrow: string;
    heading: string;
    intro: string;
    /** 3-6 platform priorities. */
    items: PriorityItem[];
    whyThisMatters: {
      heading: string;
      intro: string;
      items: { label: string; text: string }[];
    };
  };

  pillars: PillarCard[];

  endorsements: {
    /** Visibility is controlled by `features.endorsements`. */
    eyebrow: string;
    heading: string;
    items: Endorsement[];
  };

  community: {
    pageTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    eyebrow: string;
    headingLines: string[];
    intro: string;
    work: { icon: LucideIcon; label: string }[];
    /** Photo gallery (home preview + community page). */
    carousel: {
      eyebrow: string;
      heading: string;
      photos: GalleryPhoto[];
    };
  };

  ward: {
    navLabel: string;
    pageTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    eyebrow: string;
    heading: string;
    intro: string;
    map: ImageRef & { width: number; height: number };
    /** Columned lists of schools / parks / landmarks in the ward. */
    landmarks: {
      heading: string;
      groups: { heading: string; items: string[] }[];
    };
  };

  getInvolved: {
    pageTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    eyebrow: string;
    heading: string;
    lede: string;
    cards: GetInvolvedCard[];
    /** Optional icon list of concrete volunteer roles, shown under the cards. */
    volunteerRoles?: {
      heading: string;
      intro: string;
      items: { icon: LucideIcon; label: string }[];
    };
  };

  contact: {
    pageTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    eyebrow: string;
    headingLines: string[];
    intro: string;
    email: string;
    /** Public campaign phone number, rendered as a tel: link when present. */
    phone?: string;
    socials: SocialLink[];
  };

  legal: {
    /** Required in Ontario: "Authorized by the Official Agent for …". */
    authorizedBy: string;
    copyright: string;
  };

  integrations: {
    /**
     * Hosted credit-card donation URL. Leave blank while cardDonations is
     * false; processor secrets never belong in client-side configuration.
     */
    donateUrl: string;
    /** Label shown under the credit-card option when enabled. */
    donateProcessorName: string;
    etransferEmail: string;
  };
}
