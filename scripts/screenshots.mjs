/**
 * Visual QA sweep: captures full-page screenshots of every route at the
 * audit's viewport widths into .screenshots/ (gitignored).
 *
 * Usage:
 *   1. Build the GitHub Pages bundle:
 *        DEPLOY_TARGET=github-pages BASE_PATH=/sinan-erdemir/ bun run build
 *   2. Serve it (any static server that handles the base path), e.g.:
 *        npx serve dist/client -l 4173     (then BASE_URL=http://localhost:4173/sinan-erdemir)
 *      or run the dev server and use BASE_URL=http://localhost:8080
 *   3. node scripts/screenshots.mjs [label]
 *      BASE_URL env overrides the target (default: dev server).
 *      [label] names the output subfolder (default: timestampless "current").
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";
import { PAGES } from "./pages.mjs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:8080";
const WIDTHS = [320, 375, 430, 768, 1024, 1280, 1440, 1920];
const LABEL = process.argv[2] ?? "current";
const OUT = join(".screenshots", LABEL);

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "no-preference",
    });
    for (const route of PAGES) {
      const url = BASE_URL.replace(/\/$/, "") + route;
      await page.goto(url, { waitUntil: "networkidle" });
      // Scroll through the page so loading="lazy" images fire before the
      // fullPage capture (otherwise below-fold photos screenshot blank).
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
      await page.screenshot({
        path: join(OUT, `${slug}-${width}.png`),
        fullPage: true,
      });
      process.stdout.write(`${slug}-${width}.png\n`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`\nDone -> ${OUT}`);
