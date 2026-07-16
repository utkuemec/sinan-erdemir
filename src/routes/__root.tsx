import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/Toaster";
import { DonateModal } from "@/components/DonateModal";
import { DemoThemeSwitcher } from "@/components/DemoThemeSwitcher";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { withBase } from "@/lib/paths";
import { jsonLdScripts, organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";

import appCss from "../styles.css?url";
import themesCss from "../styles/themes.css?url";

const t = getStrings(candidate.locale);

function NotFoundComponent() {
  return (
    <div className="page">
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p className="t-eyebrow">{t.notFound.eyebrow}</p>
          <h1 className="section-heading" style={{ margin: "16px 0" }}>
            {t.notFound.title}
            <span
              className="accent-bar"
              aria-hidden="true"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            />
          </h1>
          <p style={{ marginBottom: 24 }}>{t.notFound.body}</p>
          <Link to="/" className="btn btn--mustard btn--lg">
            {t.buttons.goHome}
          </Link>
        </div>
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    // Titles, descriptions, canonical and og/twitter tags come from each
    // route's pageHead() (src/lib/seo.ts) — only page-agnostic chrome here.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: candidate.site.title },
      { name: "author", content: candidate.site.author },
    ],
    scripts: jsonLdScripts(webSiteJsonLd, organizationJsonLd),
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: themesCss },
      { rel: "icon", href: withBase("/favicon.png"), type: "image/png" },
      { rel: "apple-touch-icon", href: withBase("/apple-touch-icon.png") },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        // Trimmed to the campaign's "archivo" pairing (Archivo Black display,
        // Archivo body) plus Caveat for the script-font accents.
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;700&family=Caveat:wght@500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    // The data-* attributes select the palette, font pairing, and structural
    // design levers (see src/styles/themes.css and the THEME LEVERS section
    // of styles.css). Prerendered into the HTML, so there is no flash of the
    // default look.
    <html
      lang={candidate.locale}
      data-theme={candidate.theme.palette}
      data-fonts={candidate.theme.fonts}
      data-hero={candidate.theme.hero}
      data-accent={candidate.theme.accent}
      data-shape={candidate.theme.shape}
      data-pillars={candidate.theme.pillars}
      data-labels={candidate.theme.labels}
    >
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <DonateModal />
        <Toaster />
        {candidate.theme.showDemoThemeSwitcher && <DemoThemeSwitcher />}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
