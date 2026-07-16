// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
// eslint-disable-next-line import/no-relative-packages -- single source of truth for routes
import { PAGES } from "./scripts/pages.mjs";

// When DEPLOY_TARGET=github-pages is set (by .github/workflows/deploy.yml), we build a
// fully-static SPA suitable for GitHub Pages: the Cloudflare Worker plugin is disabled
// and TanStack Start runs in `spa` mode with prerender enabled so each route gets a
// real HTML file. In every other context (Lovable preview, local dev, default
// production build) behavior is unchanged.
const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";
// BASE_PATH defaults to "/" (custom domain / local dev). The deploy workflow
// sets it to "/<repo>/" when publishing to a GitHub Pages project page like
// https://<org>.github.io/<repo>/.
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  cloudflare: isGithubPages ? false : undefined,
  tanstackStart: isGithubPages
    ? {
        // SPA mode emits a `_shell.html` shell that we use as the GitHub Pages
        // 404 fallback so client-side routes still work on a hard refresh.
        spa: {
          enabled: true,
        },
        // Top-level prerender: this is where TanStack Start actually reads
        // `pages` from. Each listed route is rendered to its own HTML file
        // under `dist/client/<route>/index.html` for real per-page SEO.
        prerender: {
          enabled: true,
          crawlLinks: true,
          autoSubfolderIndex: true,
        },
        // Route list lives in scripts/pages.mjs (shared with sitemap + QA scripts).
        pages: PAGES.map((path: string) => ({ path })),
      }
    : undefined,
  vite: {
    base: basePath,
    // Local-only escape hatch: the prerender step starts an internal Vite
    // preview server that binds IPv6 (::) by default, which some sandboxes
    // don't support. Set PRERENDER_HOST=127.0.0.1 to force IPv4 when building
    // locally. Unset in CI / on GitHub Pages, so the pipeline is unchanged.
    ...(process.env.PRERENDER_HOST ? { preview: { host: process.env.PRERENDER_HOST } } : {}),
  },
});
