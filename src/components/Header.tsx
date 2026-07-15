import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { openDonateModal } from "@/lib/donateModal";
import { candidate } from "@/config/candidate";
import { NAV_LINKS } from "@/config/nav";
import { getStrings } from "@/config/strings";

const t = getStrings(candidate.locale);

interface HeaderProps {
  variant?: "overlay" | "solid";
}

export function Header({ variant = "overlay" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={`site-header ${variant === "solid" ? "site-header--solid" : ""}`}>
      <div className="site-header__inner">
        <Logo />

        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="site-nav__link"
                  activeProps={{ className: "site-nav__link site-nav__link--active" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="site-nav__ctas">
            <Link to="/get-involved" className="btn btn--turquoise">
              {t.buttons.volunteer}
            </Link>
            <button
              type="button"
              className="btn btn--mustard"
              onClick={() => {
                openDonateModal();
              }}
            >
              {t.buttons.donate}
            </button>
          </div>
        </nav>

        <button
          className="site-header__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-menu__ctas">
          <Link
            to="/get-involved"
            className="btn btn--turquoise btn--lg"
            onClick={() => setMenuOpen(false)}
          >
            {t.buttons.volunteer}
          </Link>
          <button
            type="button"
            className="btn btn--mustard btn--lg"
            onClick={() => {
              setMenuOpen(false);
              openDonateModal();
            }}
          >
            {t.buttons.donate}
          </button>
        </div>
      </div>
    </header>
  );
}
