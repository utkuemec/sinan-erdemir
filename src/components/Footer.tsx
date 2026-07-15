import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { candidate } from "@/config/candidate";
import { FOOTER_LINKS } from "@/config/nav";
import { siteHost } from "@/lib/paths";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo />
          <p className="site-footer__url">{siteHost()}</p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__legal">
          <p>{candidate.legal.authorizedBy}</p>
          <p>{candidate.legal.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
