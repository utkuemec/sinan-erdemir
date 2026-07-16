import { candidate } from "@/config/candidate";
import { absoluteUrl } from "./paths";

/**
 * Shared per-route head builder (audit §19): canonical URL, Open Graph and
 * Twitter cards for every page, with the audit's title pattern
 * "[Topic] | Sinan Erdemir for Ward 16". The home page passes `fullTitle`
 * to keep its brand string. URLs flip to votesinan.com automatically at
 * launch via candidate.site.url.
 */

const wardShort = candidate.identity.wardLabel.split("—")[0]?.trim() ?? "";
const TITLE_SUFFIX = `${candidate.identity.fullName} for ${wardShort}`;

/** Canonical URLs use the trailing-slash form GitHub Pages actually serves. */
function canonicalUrl(path: string): string {
  const url = absoluteUrl(path);
  return url.endsWith("/") ? url : `${url}/`;
}

export interface PageHeadInput {
  /** Route path, e.g. "/priorities". */
  path: string;
  /** Page topic, e.g. "Priorities". */
  title: string;
  /** Escape hatch for the home page's full brand title. */
  fullTitle?: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Site-relative share image; defaults to the campaign og-image. */
  image?: string;
}

interface HeadMeta {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}

export function pageHead(input: PageHeadInput): {
  meta: HeadMeta[];
  links: { rel: string; href: string }[];
} {
  const title = input.fullTitle ?? `${input.title} | ${TITLE_SUFFIX}`;
  const url = canonicalUrl(input.path);
  const image = absoluteUrl(input.image ?? candidate.site.ogImage);
  const ogTitle = input.ogTitle ?? title;
  const ogDescription = input.ogDescription ?? input.description;

  return {
    meta: [
      { title },
      { name: "description", content: input.description },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: candidate.site.title },
      { property: "og:locale", content: "en_CA" },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
