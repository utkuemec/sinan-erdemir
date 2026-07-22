/**
 * Single source of truth for the site's routes. Imported by:
 *  - vite.config.ts (prerender pages list)
 *  - scripts/generate-seo-files.mjs (sitemap.xml)
 *  - scripts/screenshots.mjs (visual QA sweep)
 */
export const PAGES = [
  "/",
  "/meet-the-candidate",
  "/priorities",
  "/ward",
  "/community",
  "/get-involved",
  "/vote",
  "/donate",
  "/contact",
  "/privacy",
  ...(process.env.ENABLE_RIDE_REQUESTS === "true" ? ["/ride"] : []),
];

/** Used when SITE_URL is not provided by the environment (preview builds). */
export const SITE_URL_FALLBACK = "https://votesinan.com";
