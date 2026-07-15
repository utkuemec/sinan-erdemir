# Candidate Website Template

A config-driven campaign website template for municipal candidates. One typed
config file holds every candidate-specific string, image, and CTA — spinning up
a new candidate site is an edit-config, swap-images, set-secrets exercise.

Live demo content: a fictional candidate, **Alex Rivera for City Council**
(Ward 5, in the invented city of Lakeview), with a floating demo-only theme
switcher for flipping palette and font presets.

## Stack

| Layer | Choice |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + React 19, file-based routing |
| Styling | Tailwind CSS v4 + a single design-token stylesheet (`src/styles.css`) |
| Build | Vite 7 + Bun |
| Hosting | GitHub Pages (static pre-render, SPA fallback) |
| Forms | Google Apps Script → Google Sheet + email notification (per-candidate) |
| Donations | Hosted donation form (Zeffy by default) + Interac e-Transfer flow |

Zero monthly hosting cost: static Pages + Apps Script + Zeffy.

## Quickstart: new candidate site

1. **Create the repo** — use this repo as a template (or fork/clone it).
2. **Edit `src/config/candidate.ts`** — every page reads from this one file.
   See [CUSTOMIZATION.md](CUSTOMIZATION.md) for a field-by-field map.
   - Set `theme.showDemoThemeSwitcher: false` for a real campaign.
   - Set `site.url` to the site's final public URL (origin + base path, no
     trailing slash) — og:image and other absolute URLs are built from it.
3. **Swap the images** in `public/images/` (same filenames, or update the
   paths in the config). Placeholder SVGs mark every slot with its purpose
   and dimensions; regenerate them anytime with
   `node scripts/make-placeholders.mjs`.
4. **Set up the form backends** (one Google Sheet each per candidate):
   - Follow the setup comments in `google-apps-script/Code.js` (signups) and
     `google-apps-script/DonateCode.js` (e-transfer donation intents).
   - Put the two web-app URLs in the repo's **Actions secrets** as
     `VITE_FORM_ENDPOINT` and `VITE_DONATE_ENDPOINT` (and in a local `.env`
     for testing — see `.env.example`).
5. **Enable GitHub Pages** — repo **Settings → Pages → Build and deployment →
   Source: GitHub Actions**.
6. **Push to `main`** — `.github/workflows/deploy.yml` builds and deploys
   automatically.

## Local development

```sh
bun install
bun run dev     # http://localhost:8080
```

No Bun? `npm install` / `npm run dev` also work (`package-lock.json` is kept
in sync); CI uses Bun.

Copy `.env.example` to `.env` to point the join/donate forms at real (or
test) Apps Script endpoints during development. Without endpoints the forms
render normally and show a friendly error toast on submit.

### Verifying a production build locally

```powershell
# PowerShell (on Windows, don't use Git Bash for this — it mangles BASE_PATH)
$env:DEPLOY_TARGET = "github-pages"
$env:BASE_PATH = "/candidate-website-template/"
$env:PRERENDER_HOST = "127.0.0.1"   # local-only IPv4 escape hatch
bun run build
```

Output lands in `dist/client/` with every route prerendered to static HTML.

## Deployment model

- `deploy.yml` builds with `DEPLOY_TARGET=github-pages` and
  `BASE_PATH=/candidate-website-template/`, prerenders every route, creates
  the `404.html` SPA fallback, and publishes `dist/client` to Pages.
- **Renamed the repo?** Update `BASE_PATH` in `deploy.yml` and `site.url` in
  `candidate.ts`.
- **Custom domain?** Set `BASE_PATH: /` in `deploy.yml`, set `site.url` to
  the domain, write a CNAME in the "Prepare GitHub Pages output" step
  (`echo "yourdomain.com" > "$OUT/CNAME"`), and configure the domain in the
  repo's Pages settings.

## Theming & design levers

The look is controlled entirely from `candidate.theme` — palettes, font
pairings, and **structural design levers** that change the site's layout
motifs, not just its colors:

| Field | Options |
|---|---|
| `palette` | `heritage-red`, `civic-blue`, `grassroots-green`, `midnight-violet` (+ `sunrise`, the `:root` fallback — kept out of the demo switcher) |
| `fonts` | `bold-poster`, `civic-serif`, `friendly-rounded` |
| `hero` | `overlay` (full-bleed photo) \| `split` (colour panel + photo panel) |
| `accent` | `underline` \| `highlight` (marker sweep) \| `minimal` |
| `shape` | `sharp` \| `soft` \| `pill` |
| `pillars` | `band` (full-bleed colour strip) \| `cards` |
| `labels` | `caps` \| `badge` |

Each value renders as a `data-*` attribute on `<html>`; the CSS lives in
`src/styles/themes.css` and the THEME LEVERS section of `src/styles.css`.
Adding a preset = one CSS override block, one metadata entry in
`src/config/themes.ts`, and widening the union type in
`src/config/types.ts`. Details in [CUSTOMIZATION.md](CUSTOMIZATION.md).

The demo's default combination intentionally diverges from the campaign
site this template was extracted from, so no client's live site doubles as
"the template look" — mix levers per candidate to keep every build
distinct.

For production, trim the Google Fonts `<link>` in `src/routes/__root.tsx` to
just your chosen pairing's families.

## Adding a language (i18n)

All UI chrome (nav, buttons, form labels, toasts, the SMS-consent
disclaimer, the privacy page) lives in `src/config/strings.ts` as a typed
`UiStrings` object per locale. To add a locale: widen `Locale` in
`src/config/types.ts`, add the fully-typed strings object, and set
`candidate.locale`. Candidate *content* (bio, priorities, …) stays in
`candidate.ts`; a bilingual campaign would convert those fields to
per-locale records — the string layer doesn't block it.

## Renaming a route

Routes are file-based. Rename the file in `src/routes/`, update the path in
`createFileRoute("...")`, `src/config/nav.ts`, and the `pages` list in
`vite.config.ts`, then run a dev server or build once to regenerate
`src/routeTree.gen.ts` (never edit it by hand).

## Compliance notes (Ontario defaults, adapt per jurisdiction)

- The footer's "Authorized by the Official Agent for …" line
  (`legal.authorizedBy`) is legally required for Ontario municipal
  campaigns.
- The join form ships with an SMS-consent disclaimer (HELP/STOP language)
  linked to the privacy page — keep it if you text supporters.
- Political contributions have jurisdiction-specific rules and receipting
  requirements; see the note at the top of `src/components/DonateModal.tsx`
  and confirm requirements with the campaign's official agent before launch.

## Project structure

```
src/
  config/
    candidate.ts    ← THE per-candidate config (edit this)
    types.ts        ← CandidateConfig type definitions
    strings.ts      ← UI-chrome strings, per locale
    nav.ts          ← nav links (labels from config)
    themes.ts       ← theme-switcher metadata
  routes/           ← file-based routes (index, meet-the-candidate, priorities,
                      ward, community, get-involved, contact, privacy)
  components/       ← Header, Footer, Logo, JoinForm, DonateModal,
                      PhotoCarousel, Toaster, DemoThemeSwitcher (demo-only)
  styles.css        ← design tokens + all component styles
  styles/themes.css ← palette + font-pairing presets
  lib/paths.ts      ← base-path/absolute-URL helpers
google-apps-script/ ← form + donation backends (deploy per candidate)
scripts/            ← placeholder-image generator
```
