import { createFileRoute } from "@tanstack/react-router";
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
import { JoinForm } from "@/components/JoinForm";
import { openDonateModal } from "@/lib/donateModal";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import type { BuiltinCardKind } from "@/config/types";

const { getInvolved, site } = candidate;
const t = getStrings(candidate.locale);

const KIND_ICONS: Record<BuiltinCardKind, LucideIcon> = {
  volunteer: Users,
  donate: Heart,
  endorse: MessageCircle,
  "lawn-sign": Signpost,
  "host-event": CalendarDays,
  pledge: Vote,
};

/** Colour slots cycle across cards in the same order as the original set. */
const VARIANTS = ["turquoise", "mustard", "taupe"] as const;

interface ResolvedCard {
  key: string;
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  action: { type: "donate" } | { type: "anchor"; href: string };
}

const CARDS: ResolvedCard[] = getInvolved.cards.map((card) => {
  if (card.kind === "custom") {
    return {
      key: card.title,
      icon: card.icon,
      title: card.title,
      body: card.body,
      cta: card.cta,
      action: { type: "anchor", href: card.href },
    };
  }
  const defaults = t.getInvolvedCards[card.kind];
  return {
    key: card.kind,
    icon: KIND_ICONS[card.kind],
    title: card.title ?? defaults.title,
    body: card.body ?? defaults.body,
    cta: card.cta ?? defaults.cta,
    action: card.kind === "donate" ? { type: "donate" } : { type: "anchor", href: "#join" },
  };
});

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: `${getInvolved.pageTitle} — ${site.title}` },
      { name: "description", content: getInvolved.metaDescription },
      { property: "og:title", content: getInvolved.ogTitle },
      { property: "og:description", content: getInvolved.ogDescription },
    ],
  }),
  component: GetInvolvedPage,
});

function GetInvolvedPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main>
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
              {CARDS.map((card, i) => {
                const Icon = card.icon;
                const variant = VARIANTS[i % VARIANTS.length];
                if (card.action.type === "donate") {
                  return (
                    <button
                      key={card.key}
                      type="button"
                      className={`action-card action-card--${variant}`}
                      onClick={() => openDonateModal()}
                    >
                      <span className="action-card__icon">
                        <Icon size={26} strokeWidth={1.75} />
                      </span>
                      <h3 className="action-card__title">{card.title}</h3>
                      <p className="action-card__body">{card.body}</p>
                      <span className="action-card__cta">{card.cta} →</span>
                    </button>
                  );
                }
                return (
                  <a
                    key={card.key}
                    href={card.action.href}
                    className={`action-card action-card--${variant}`}
                  >
                    <span className="action-card__icon">
                      <Icon size={26} strokeWidth={1.75} />
                    </span>
                    <h3 className="action-card__title">{card.title}</h3>
                    <p className="action-card__body">{card.body}</p>
                    <span className="action-card__cta">{card.cta} →</span>
                  </a>
                );
              })}
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

        <section id="join" className="mobile-join" style={{ display: "block" }}>
          <JoinForm id="involved-join" source="get-involved" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
