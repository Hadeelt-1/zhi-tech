"use client";

import { useEffect, useState } from "react";

export default function BackToTop({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("top")?.querySelector<HTMLElement>(".brand")?.focus({ preventScroll: true });
  };

  return (
    <button type="button" className={`totop${show ? " show" : ""}`} aria-label={label} tabIndex={show ? 0 : -1} onClick={toTop}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
