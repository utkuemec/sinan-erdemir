import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, Music2, Phone, Twitter, Youtube, type LucideIcon } from "lucide-react";
import { Logo } from "./Logo";
import { openDonateModal } from "@/lib/donateModal";
import { candidate } from "@/config/candidate";
import { FOOTER_LINKS } from "@/config/nav";
import { getStrings } from "@/config/strings";
import { siteHost } from "@/lib/paths";
import type { SocialPlatform } from "@/config/types";

const t = getStrings(candidate.locale);

const SOCIAL_ICONS: Record<SocialPlatform, { icon: LucideIcon; label: string }> = {
  instagram: { icon: Instagram, label: "Instagram" },
  facebook: { icon: Facebook, label: "Facebook" },
  x: { icon: Twitter, label: "X" },
  tiktok: { icon: Music2, label: "TikTok" },
  youtube: { icon: Youtube, label: "YouTube" },
  linkedin: { icon: Linkedin, label: "LinkedIn" },
};

export function Footer() {
  const { contact } = candidate;

  return (
    <footer className="site-footer">
      <div className="container site-footer__cta-row">
        <p className="site-footer__cta-heading">{t.joinForm.title}</p>
        <div className="site-footer__cta-buttons">
          <Link to="/get-involved" className="btn btn--secondary">
            {t.buttons.volunteer}
          </Link>
          {candidate.features.donations && (
            <button type="button" className="btn btn--primary" onClick={() => openDonateModal()}>
              {t.buttons.donate}
            </button>
          )}
        </div>
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo />
          <p className="site-footer__url">
            <Link to="/">{siteHost()}</Link>
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__contact">
          <a href={`mailto:${contact.email}`} className="site-footer__contact-line">
            <Mail size={16} aria-hidden="true" /> {contact.email}
          </a>
          {contact.phone && (
            <a
              href={`tel:+1${contact.phone.replace(/\D/g, "")}`}
              className="site-footer__contact-line"
            >
              <Phone size={16} aria-hidden="true" /> {contact.phone}
            </a>
          )}
          <div className="site-footer__socials">
            {contact.socials.map((social) => {
              const { icon: Icon, label } = SOCIAL_ICONS[social.platform];
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="site-footer__legal">
          <p>{candidate.legal.authorizedBy}</p>
          <p>{candidate.legal.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
