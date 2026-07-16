import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
  Youtube,
  Music2,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { candidate } from "@/config/candidate";
import { pageHead } from "@/lib/seo";
import type { SocialPlatform } from "@/config/types";

const { contact, site } = candidate;

const SOCIAL_ICONS: Record<SocialPlatform, { icon: LucideIcon; label: string }> = {
  instagram: { icon: Instagram, label: "Instagram" },
  facebook: { icon: Facebook, label: "Facebook" },
  x: { icon: Twitter, label: "X" },
  tiktok: { icon: Music2, label: "TikTok" },
  youtube: { icon: Youtube, label: "YouTube" },
  linkedin: { icon: Linkedin, label: "LinkedIn" },
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...pageHead({
      path: "/contact",
      title: contact.pageTitle,
      description: contact.metaDescription,
      ogTitle: contact.ogTitle,
      ogDescription: contact.ogDescription,
    }),
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="contact">
          <div className="contact__inner">
            <div className="contact__copy">
              <p className="t-eyebrow">{contact.eyebrow}</p>
              <h1 className="section-heading section-heading--light">
                {contact.headingLines.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
                <span className="accent-bar" aria-hidden="true" />
              </h1>
              <p>{contact.intro}</p>
              <ul className="contact__details">
                <li>
                  <Mail size={18} strokeWidth={2} />
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
                {contact.phone && (
                  <li>
                    <Phone size={18} strokeWidth={2} />
                    <a href={`tel:+1${contact.phone.replace(/\D/g, "")}`}>{contact.phone}</a>
                  </li>
                )}
                {contact.socials.length > 0 && (
                  <li className="contact__socials">
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
                          <Icon size={20} />
                        </a>
                      );
                    })}
                  </li>
                )}
              </ul>
            </div>

            <div className="contact__form">
              <ContactForm id="contact-form" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
