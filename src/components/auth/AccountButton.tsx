"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { supabaseConfigured } from "@/lib/supabase/client";
import { useUser } from "./useUser";

/** Header icon: "Log in" when signed out, "My account" when signed in. */
export default function AccountButton({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { user } = useUser();
  if (!supabaseConfigured) return null;
  const label = user ? dict.auth.account : dict.auth.login;
  return (
    <a className={`ibtn${user ? " ibtn-on" : ""}`} href={`/${lang}/${user ? "account" : "login"}`} aria-label={label} title={label}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8.5" r="3.8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M4.5 20c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </a>
  );
}
