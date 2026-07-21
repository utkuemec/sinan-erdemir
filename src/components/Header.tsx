import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { trapFocus } from "@/lib/focusTrap";
import { candidate } from "@/config/candidate";
import { NAV_LINKS } from "@/config/nav";
import { getStrings } from "@/config/strings";

const t = getStrings(candidate.locale);

interface HeaderProps {
  variant?: "overlay" | "solid";
}

export function Header({ variant = "overlay" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Focus management: move focus into the menu, trap it, close on Escape,
  // restore focus to the toggle on close.
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const firstLink = menuRef.current.querySelector<HTMLElement>("a, button");
    firstLink?.focus();
    const release = trapFocus(menuRef.current, () => setMenuOpen(false));
    return () => {
      release();
      toggleRef.current?.focus();
    };
  }, [menuOpen]);

  // Compact sticky bar with a shadow once the page scrolls.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header ${variant === "solid" ? "site-header--solid" : ""} ${
        stuck ? "site-header--stuck" : ""
      }`}
    >
      <a href="#main" className="skip-link">
        {t.nav.skipToContent}
      </a>
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
            {candidate.features.donations && (
              <Link to="/donate" className="btn btn--primary">
                {t.buttons.donate}
              </Link>
            )}
          </div>
        </nav>

        <button
          ref={toggleRef}
          className="site-header__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
        // Closed menu leaves the tab order entirely.
        {...(menuOpen ? {} : { inert: true })}
      >
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              {t.nav.contact}
            </Link>
          </li>
        </ul>
        <div className="mobile-menu__ctas">
          <Link
            to="/get-involved"
            className="btn btn--secondary btn--lg"
            onClick={() => setMenuOpen(false)}
          >
            {t.buttons.volunteer}
          </Link>
          {candidate.features.donations && (
            <Link
              to="/donate"
              className="btn btn--primary btn--lg"
              onClick={() => setMenuOpen(false)}
            >
              {t.buttons.donate}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
