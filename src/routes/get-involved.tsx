import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Heart,
  MessageCircle,
  Signpost,
  Users,
  Vote,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SupporterActionForm } from "@/components/forms/SupporterActionForm";
import { openDonateModal } from "@/lib/donateModal";
import { candidate } from "@/config/candidate";
import { pageHead } from "@/lib/seo";
import { getStrings } from "@/config/strings";
import type { BuiltinCardKind, SupporterIntent } from "@/config/types";

const { getInvolved, site, features } = candidate;
const t = getStrings(candidate.locale);

const KIND_ICONS: Record<BuiltinCardKind, LucideIcon> = {
  volunteer: Users,
  donate: Heart,
  endorse: MessageCircle,
  "lawn-sign": Signpost,
  "host-event": CalendarDays,
  pledge: Vote,
};

/** Card kinds that preselect a supporter-form intent. */
const KIND_TO_INTENT: Partial<Record<BuiltinCardKind, SupporterIntent>> = {
  volunteer: "volunteer",
  "lawn-sign": "lawn-sign",
  pledge: "pledge",
};

/** Colour slots cycle across cards in the same order as the original set. */
const VARIANTS = ["turquoise", "mustard", "taupe"] as const;

interface ResolvedCard {
  key: string;
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  action: { type: "donate" } | { type: "intent"; intent: SupporterIntent } | { type: "anchor"; href: string };
}

function cardEnabled(kind: BuiltinCardKind | "custom"): boolean {
  if (kind === "donate") return features.donations;
  if (kind === "lawn-sign") return features.lawnSigns;
  if (kind === "pledge") return features.pledge;
  return true;
}

const CARDS: ResolvedCard[] = getInvolved.cards
  .filter((card) => cardEnabled(card.kind))
  .map((card) => {
    if (card.kind === "custom") {
      return {
        key: card.title,
        icon: card.icon,
        title: card.title,
        body: card.body,
        cta: card.cta,
        action: { type: "anchor" as const, href: card.href },
      };
    }
    const defaults = t.getInvolvedCards[card.kind];
    const intent = KIND_TO_INTENT[card.kind];
    return {
      key: card.kind,
      icon: KIND_ICONS[card.kind],
      title: card.title ?? defaults.title,
      body: card.body ?? defaults.body,
      cta: card.cta ?? defaults.cta,
      action:
        card.kind === "donate"
          ? { type: "donate" as const }
          : intent
            ? { type: "intent" as const, intent }
            : { type: "anchor" as const, href: "#join" },
    };
  });

const VALID_ACTIONS: SupporterIntent[] = ["volunteer", "lawn-sign", "pledge"];

export const Route = createFileRoute("/get-involved")({
  validateSearch: (search: Record<string, unknown>): { action?: SupporterIntent } => {
    const action = search.action;
    return typeof action === "string" && VALID_ACTIONS.includes(action as SupporterIntent)
      ? { action: action as SupporterIntent }
      : {};
  },
  head: () => ({
    ...pageHead({
      path: "/get-involved",
      title: getInvolved.pageTitle,
      description: getInvolved.metaDescription,
      ogTitle: getInvolved.ogTitle,
      ogDescription: getInvolved.ogDescription,
    }),
  }),
  component: GetInvolvedPage,
});

function CardShell({
  card,
  variant,
  children,
}: {
  card: ResolvedCard;
  variant: (typeof VARIANTS)[number];
  children?: never;
}) {
  const Icon = card.icon;
  const inner = (
    <>
      <span className="action-card__icon">
        <Icon size={26} strokeWidth={1.75} />
      </span>
      <h3 className="action-card__title">{card.title}</h3>
      <p className="action-card__body">{card.body}</p>
      <span className="action-card__cta">{card.cta} →</span>
    </>
  );

  if (card.action.type === "donate") {
    return (
      <button
        type="button"
        className={`action-card action-card--${variant}`}
        onClick={() => openDonateModal()}
      >
        {inner}
      </button>
    );
  }
  if (card.action.type === "intent") {
    return (
      <Link
        to="/get-involved"
        search={{ action: card.action.intent }}
        hash="join"
        className={`action-card action-card--${variant}`}
      >
        {inner}
      </Link>
    );
  }
  return (
    <a href={card.action.href} className={`action-card action-card--${variant}`}>
      {inner}
    </a>
  );
}

function GetInvolvedPage() {
  const { action } = Route.useSearch();

  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="get-involved">
          <div className="container">
            <div className="get-involved__head">
              <p className="t-eyebrow">{getInvolved.eyebrow}</p>
              <h1 className="section-heading">
                {getInvolved.heading}
                <span
                  className="accent-bar"
                  aria-hidden="true"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              </h1>
              <p className="get-involved__lede">{getInvolved.lede}</p>
            </div>

            <div className="get-involved__grid">
              {CARDS.map((card, i) => (
                <CardShell key={card.key} card={card} variant={VARIANTS[i % VARIANTS.length]} />
              ))}
            </div>
          </div>
        </section>

        {getInvolved.volunteerRoles && (
          <section className="get-involved" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="get-involved__head">
                <h2 className="section-heading section-heading--sm">
                  {getInvolved.volunteerRoles.heading}
                </h2>
                <p className="get-involved__lede">{getInvolved.volunteerRoles.intro}</p>
              </div>
              <ul className="community__list" style={{ marginTop: 24 }}>
                {getInvolved.volunteerRoles.items.map((role) => {
                  const Icon = role.icon;
                  return (
                    <li key={role.label} className="community__item">
                      <span className="community__item-icon">
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                      <span className="community__item-label">{role.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        <section id="join" className="supporter-section">
          <div className="container supporter-section__inner">
            <div className="supporter-section__copy">
              <h2 className="section-heading section-heading--sm">{getInvolved.heading}</h2>
              <p>{getInvolved.lede}</p>
              <p className="supporter-section__privacy">
                {t.contactForm.privacyAckBeforeLink}
                <Link to="/privacy">{t.contactForm.privacyAckLinkLabel}</Link>
                {" — "}
                {t.privacy.noSaleStatement}
              </p>
            </div>
            <SupporterActionForm
              id="involved-supporter"
              initialIntents={action ? [action] : []}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
