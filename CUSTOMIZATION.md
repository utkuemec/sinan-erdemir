# Customization Reference

Everything candidate-specific lives in **`src/config/candidate.ts`** (typed by
`src/config/types.ts`). This file maps each config section to what it changes
on the site.

## `identity`

| Field                                                             | Where it appears                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `firstName` / `lastName`                                          | Stacked two-line logo text (header + footer)                                    |
| `logoTagline`                                                     | Small line under the logo name ("for City Council")                             |
| `fullName`, `office`, `jurisdiction`, `wardLabel`, `electionYear` | Available for copy; ward label also appears wherever your content references it |
| `campaignName`                                                    | SMS-consent disclaimer under the join form; logo aria-label                     |
| `teamName`                                                        | Join-form button ("Join Team Alex") and success toast                           |

## `site`

| Field                              | Where it appears                                                                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `url`                              | Base for all absolute URLs (og:image). **Must** match where the site is deployed: origin + base path, no trailing slash |
| `title`                            | Root `<title>`, og:title, and the "— {page}" suffix on every page title                                                 |
| `description` / `shortDescription` | Meta descriptions (root/home)                                                                                           |
| `author`                           | `<meta name="author">`                                                                                                  |
| `ogImage`                          | Default social-share image (site-relative path; PNG 1200×630 recommended — many scrapers ignore SVG)                    |

## `hero` (home page)

| Field                              | Where it appears                                                                                                                                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eyebrow`                          | Small all-caps line above the mega headline                                                                                                                                                                                                                 |
| `headline`                         | Mega headline with the hand-drawn underline accent                                                                                                                                                                                                          |
| `subtitle`                         | Slogan line under the headline                                                                                                                                                                                                                              |
| `sloganLine`                       | Home page `<title>` / og:title                                                                                                                                                                                                                              |
| `imagePortrait` / `imageLandscape` | Hero photos as one tall (~2:3) and one wide (~3:2) crop; each hero layout uses the orientation that fits (split: portrait desktop panel + landscape mobile band; overlay: landscape desktop + portrait mobile). Ignored when `theme.heroStyle` is `"solid"` |

## `bio` (/meet-the-candidate)

`navLabel` is the header/footer nav text ("Meet Alex"). `headingLines` render
with line breaks. `paragraphs` follows the proven 3-paragraph formula:
personal → professional credibility → community roots + humanizing detail.
`whyRunning` renders the script-font pull quote (`quote`, `attribution`) and
its supporting paragraphs (a budget figure adds credibility). `portrait`
fills the left column (roughly 880×1168).

## `priorities` (/priorities + home preview)

3–6 `items`, each `{ icon, title, body, bullets? }` — icons are lucide-react
component imports. The same items render numbered on the home page and the
priorities page. `whyThisMatters` is the value-reframing list shown under
both. `navLabel` sets the nav text.

## `pillars` (home page color band)

Exactly three cards. `variant` names a colour **slot** (`"mustard"` |
`"turquoise"` | `"taupe"`) — palettes re-point what each slot renders as.
`cta` is optional: `{ label, to }` links to a route; `{ label, action:
"donate" }` opens the donate modal. `theme.pillars` chooses between the
full-bleed colour band and the elevated-cards presentation.

## `endorsements` (home page)

Set `enabled: false` to hide the section entirely (e.g. early campaign).
Each item: `name`, `role`, `region`, `photo` (small headshot).

## `community` (/community + home carousel)

`work` is the icon list of volunteer causes. `carousel` holds the eyebrow,
heading, and the 12-photo strip shown on the home page (write real,
descriptive `alt` text — the template treats alt discipline as
non-negotiable).

## `ward` (/ward)

`heading`/`intro` introduce the electoral area; `map` is the boundary-map
image (with explicit width/height to prevent layout shift). `landmarks` is a
set of columned lists with per-group headings — schools, neighbourhoods,
parks, whatever fits the campaign.

## `getInvolved` (/get-involved)

`cards` is the action-card set. Built-in kinds — `volunteer`, `donate`,
`endorse`, `lawn-sign`, `host-event`, `pledge` — come with default
title/body/CTA copy (override any of them per card) and default icons.
Presence in the array is what enables a card; order controls the colour
cycling. `donate` opens the donate modal; every other kind anchors to the
join form. Fully custom cards:
`{ kind: "custom", icon, title, body, cta, href }`.

The join form on this page submits with `source: "get-involved"` — every
JoinForm instance carries a `source` tag (homepage, homepage-mobile,
get-involved, contact) so the Google Sheet shows where each signup came from.

## `contact` (/contact)

Email link, heading lines, intro, and social links
(`instagram | facebook | x | tiktok | youtube | linkedin` — icon and
aria-label are automatic). The contact email also appears in form error
toasts and on the privacy page.

## `legal` (footer)

`authorizedBy` — the "Authorized by the Official Agent for …" line required
in Ontario. `copyright` — the © line.

## `integrations`

`features.cardDonations` controls whether the hosted credit-card option is
shown. Keep it `false` and leave the processor fields blank until a campaign-
approved processor is configured; e-transfer can remain available separately.

| Field                 | Where it appears                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `donateUrl`           | "Donate by Credit Card" target when `features.cardDonations` is enabled; any approved hosted donation form works |
| `donateProcessorName` | The "Secure payment via …" label in the donate modal                                                             |
| `etransferEmail`      | The e-transfer instructions screen (with copy-to-clipboard)                                                      |

The **submission endpoints** are not in the config: `VITE_FORM_ENDPOINT` and
`VITE_DONATE_ENDPOINT` are env vars / repo secrets (see README step 4).

## `theme`

| Field                   | Effect                                                                                                                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `palette`               | `"heritage-red"`, `"civic-blue"`, `"grassroots-green"`, `"midnight-violet"`, or `"sunrise"` (mustard/turquoise — the `:root` fallback, deliberately excluded from the demo switcher) — rendered as `data-theme` on `<html>` |
| `fonts`                 | `"bold-poster"` (Anton/Montserrat), `"civic-serif"` (Libre Franklin/Source Serif 4), `"friendly-rounded"` (Nunito) — rendered as `data-fonts`. Non-poster pairings also switch buttons to sentence case                     |
| `hero`                  | `"overlay"` — full-bleed photo with copy + form floating over it; `"split"` — solid primary-colour panel (copy + form) beside a photo panel. See "Hero layouts" below                                                       |
| `heroStyle`             | `"photo"` uses the hero images; `"solid"` renders a palette gradient (useful before photography exists). Composes with either `hero` layout                                                                                 |
| `accent`                | `"underline"` — hand-drawn-style underline + accent bars; `"highlight"` — marker sweep behind the hero headline + skewed marker strokes under headings; `"minimal"` — no motifs                                             |
| `shape`                 | `"sharp"` (squared, small radii), `"soft"` (rounded), `"pill"` (fully rounded buttons) — drives the `--radius-*`/`--btn-radius` tokens                                                                                      |
| `pillars`               | `"band"` — full-bleed three-colour strip; `"cards"` — elevated paper cards with coloured icon chips                                                                                                                         |
| `labels`                | `"caps"` — letterspaced uppercase eyebrows; `"badge"` — pill badge chips                                                                                                                                                    |
| `showDemoThemeSwitcher` | **Demo only.** Shows the floating style switcher. Set `false` for client builds                                                                                                                                             |

**Differentiation note:** the demo defaults (civic-blue / civic-serif /
split / highlight / soft / cards / badge) are deliberately the _opposite_ of
the source campaign's look (sunrise / bold-poster / overlay / underline /
sharp / band / caps). When spinning up a new candidate, vary at least the
palette, hero layout, and accent so no two client sites read as the same
template.

### Hero layouts

- **`overlay`** — the hero photo fills the viewport; copy and the join form
  float over it with a scrim. Needs strong photography with clear space on
  the right (desktop) / bottom (mobile).
- **`split`** — copy and the join form sit on a solid primary-colour panel,
  with the photo in its own panel beside it (below it on mobile). Works with
  any photo — no clear-space requirements — and pairs well with
  `heroStyle: "solid"` when no photography exists yet. The header renders as
  an in-flow ink bar in this mode.

### Adding a palette

1. Add an override block in `src/styles/themes.css`:
   `html[data-theme="harbour-navy"] { --c-mustard: …; }` — re-point the slot
   tokens (`--c-mustard*` = primary, `--c-turquoise*` = secondary,
   `--c-taupe*` = tertiary, `--c-cream*` = page background). If the primary
   or secondary is dark, also flip `--fg-on-mustard` / `--fg-on-turquoise`
   to a light colour. The `heritage-red` and `midnight-violet` blocks are
   good copy-paste starting points.
2. Widen `PaletteId` in `src/config/types.ts`.
3. Add a `PALETTES` entry in `src/config/themes.ts` (label + two swatches).

### Adding a font pairing

Same pattern with `html[data-fonts="…"]` (override `--font-display`,
`--font-body`, optionally `--font-script` and `--fw-display`), plus the
Google Fonts `<link>` in `src/routes/__root.tsx`.

## `locale` and UI strings

`locale` selects the `UiStrings` object from `src/config/strings.ts` —
all non-candidate UI text (nav labels, buttons, form labels/placeholders,
toasts, SMS disclaimer, donate-modal copy, 404, the whole privacy page).
Edit that file to reword UI chrome; add a locale per the README.

## Image slots

| Path                                     | Purpose                                                      | Reference size                              |
| ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| `public/images/hero-portrait.*`          | Hero photo, tall crop (split desktop panel; overlay ≤767 px) | ~1024×1536 (~2:3)                           |
| `public/images/hero-landscape.*`         | Hero photo, wide crop (overlay desktop; split mobile band)   | ~1536×1024 (~3:2)                           |
| `public/images/candidate-portrait.*`     | Bio page portrait                                            | ~880×1168                                   |
| `public/images/ward-map.*`               | Ward boundary map                                            | ~1196×1550 (update `ward.map.width/height`) |
| `public/images/community/photo-01..12.*` | Home carousel                                                | ~1200×1600 / 1600×1200 mix                  |
| `public/images/endorsers/endorser-*.*`   | Endorser headshots                                           | small (rendered 96×96)                      |
| `public/images/og-image.png`             | Social share card                                            | 1200×630 PNG                                |

Use any format (`.jpg`/`.png`/`.webp`/`.svg`) — just keep the config paths in
sync. All paths are resolved through the base-path helper, so they work on
project pages and custom domains alike.
