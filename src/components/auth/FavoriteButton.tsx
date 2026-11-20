"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { supabaseConfigured } from "@/lib/supabase/client";
import { useFavorites } from "./useFavorites";

const Heart = ({ filled }: { filled: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/** Save / remove a tool. Signed-out visitors get a link to log in instead. */
export default function FavoriteButton({ slug, lang, dict }: { slug: string; lang: Locale; dict: Dictionary }) {
  const { user, ready, slugs, error, toggle } = useFavorites();
  const a = dict.auth;
  if (!supabaseConfigured || !ready) return null;

  if (!user) {
    return (
      <a className="btn" href={`/${lang}/login`}>
        <Heart filled={false} />
        <span style={{ marginInlineStart: 8 }}>{a.loginToSave}</span>
      </a>
    );
  }

  const saved = slugs.includes(slug);
  return (
    <>
      <button type="button" className={`btn${saved ? " pri" : ""}`} aria-pressed={saved} onClick={() => toggle(slug)}>
        <Heart filled={saved} />
        <span style={{ marginInlineStart: 8 }}>{saved ? a.saved : a.save}</span>
      </button>
      {error && <p className="fb" role="alert">{a.errGeneric}</p>}
    </>
  );
}
