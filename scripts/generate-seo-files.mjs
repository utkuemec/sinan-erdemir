/**
 * Writes sitemap.xml and robots.txt into the built site (dist/client).
 * Runs as the package.json postbuild step. SITE_URL env overrides the
 * origin (deploy.yml sets it; the preview URL is the fallback).
 */
import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { PAGES, SITE_URL_FALLBACK } from "./pages.mjs";

const OUT = "dist/client";
if (!existsSync(OUT)) {
  console.log("generate-seo-files: no dist/client — skipping (dev build?)");
  process.exit(0);
}

const siteUrl = (process.env.SITE_URL ?? SITE_URL_FALLBACK).replace(/\/$/, "");
const lastmod = new Date().toISOString().slice(0, 10);

const urls = PAGES.map((page) => {
  const loc = page === "/" ? `${siteUrl}/` : `${siteUrl}${page}/`;
  return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
}).join("\n");

writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

writeFileSync(
  join(OUT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

console.log(`generate-seo-files: sitemap.xml (${PAGES.length} urls) + robots.txt for ${siteUrl}`);
