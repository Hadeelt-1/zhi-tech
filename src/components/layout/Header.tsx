"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/remember-locale";
import type { Dictionary } from "@/i18n/get-dictionary";
import { currentLink, HOME_SECTIONS, TOP_LINKS } from "@/lib/nav";
import Logo from "./Logo";
import AccountButton from "@/components/auth/AccountButton";

type Mode = "light" | "dark";

function readMode(): Mode {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const pathname = usePathname() ?? `/${lang}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Theme: follow the saved choice, otherwise the system setting.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const m = readMode();
      document.documentElement.setAttribute("data-mode", m);
      setMode(m);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const toggleTheme = () => {
    const next: Mode = readMode() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.setAttribute("data-theme", next);
    root.setAttribute("data-mode", next);
    try {
      localStorage.setItem("zhi-theme", next);
    } catch {
      /* storage blocked: the choice lasts for this visit only */
    }
    setMode(next);
  };

  // Scroll spy (homepage): which section is on screen.
  useEffect(() => {
    let ticking = false;
    const spy = () => {
      ticking = false;
      const y = window.scrollY + 140;
      let cur: string | null = null;
      HOME_SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      });
      setSection(cur);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(spy);
      }
    };
    spy();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Close the small-screen menu on Escape, outside clicks, and when the layout gets wide.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".hdr")) setMenuOpen(false);
    };
    const wide = window.matchMedia("(min-width: 1101px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  const current = currentLink(pathname, section);
  // Same page in another language: /ar/explore -> /en/explore
  const rest = pathname.replace(/^\/(ar|en|zh)(?=\/|$)/, "");

  return (
    <header className="hdr" id="top">
      <div className="wrap">
        <a className="brand" href={`/${lang}`} aria-label={dict.a11y.home}>
          <Logo />
          <div className="nm" aria-hidden="true">
            ZHI TECH<span>志科技</span>
          </div>
        </a>

        <nav className={`main${menuOpen ? " open" : ""}`} id="main-nav" aria-label={dict.a11y.navLabel}>
          {TOP_LINKS.map(({ key, href }) => (
            <a
              key={key}
              className="nlink"
              href={href.startsWith("#") ? `/${lang}${href}` : `/${lang}${href}`}
              aria-current={current === key ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {dict.nav.top[key]}
            </a>
          ))}
        </nav>

        <div className="ctl">
          <div className="seg" role="group" aria-label={dict.a11y.langLabel}>
            {locales.map((l) => (
              <a
                key={l}
                href={`/${l}${rest}`}
                lang={l === "zh" ? "zh-Hans" : l}
                hrefLang={l}
                aria-current={l === lang ? "true" : undefined}
                onClick={() => rememberLocale(l)}
              >
                {localeNames[l]}
              </a>
            ))}
          </div>
          <button
            type="button"
            className="ibtn"
            onClick={toggleTheme}
            aria-label={mode === "dark" ? dict.a11y.toLight : dict.a11y.toDark}
          >
            {mode === "dark" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            )}
          </button>
          <AccountButton lang={lang} dict={dict} />
          <button
            ref={menuBtn}
            type="button"
            className="ibtn menu-btn"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={dict.a11y.menu}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
