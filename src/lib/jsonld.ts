import { candidate } from "@/config/candidate";
import { absoluteUrl } from "./paths";

/**
 * JSON-LD builders (audit §19). Only verifiable, client-approved facts:
 * no political-office schema claims, no credential assertions.
 */

const sameAs = candidate.contact.socials.map((social) => social.url);

export function organizationJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: candidate.identity.campaignName,
    url: `${candidate.site.url}/`,
    logo: absoluteUrl("/apple-touch-icon.png"),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "campaign office",
      email: candidate.contact.email,
      ...(candidate.contact.phone
        ? { telephone: `+1-${candidate.contact.phone.replace(/\D/g, "")}` }
        : {}),
    },
    sameAs,
  };
}

export function webSiteJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: candidate.site.title,
    url: `${candidate.site.url}/`,
  };
}

export function personJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidate.identity.fullName,
    jobTitle: `Candidate for ${candidate.identity.jurisdiction} ${candidate.identity.office}, ${candidate.identity.wardLabel}`,
    image: absoluteUrl(candidate.bio.portrait.src),
    url: `${candidate.site.url}/`,
    sameAs,
  };
}

/** Serialize builders into TanStack head() script entries. */
export function jsonLdScripts(...builders: (() => object)[]): {
  type: string;
  children: string;
}[] {
  return builders.map((build) => ({
    type: "application/ld+json",
    children: JSON.stringify(build()),
  }));
}
