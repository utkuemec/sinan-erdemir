import { candidate } from "@/config/candidate";

/**
 * Prefix a site-relative path (e.g. "/images/hero-portrait.jpg") with the
 * Vite base path so assets resolve correctly when the site is served from a
 * sub-path (GitHub Pages project sites). Router links already handle this
 * via the router `basepath`; this is for plain <img src>, CSS url() values,
 * and other raw asset references.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/**
 * Absolute URL for og:image / og:url metadata. `candidate.site.url` must be
 * the full public origin + base path with no trailing slash, so paths are
 * NOT additionally passed through withBase().
 */
export function absoluteUrl(path: string): string {
  return `${candidate.site.url}/${path.replace(/^\//, "")}`;
}

/** Host + base path shown as human-readable text (footer, privacy link). */
export function siteHost(): string {
  return candidate.site.url.replace(/^https?:\/\//, "");
}
