"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { supabaseConfigured } from "@/lib/supabase/client";
import { usePersonalDictionary } from "./usePersonalDictionary";

const BookIcon = ({ filled }: { filled: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 3h12v18l-6-4-6 4z" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

/** Save / remove a library term in the personal dictionary. Signed-out visitors get a login link. */
export default function AddToDictionaryButton({ slug, lang, dict }: { slug: string; lang: Locale; dict: Dictionary }) {
  const { user, ready, savedSlugs, saveFailed, toggleTerm } = usePersonalDictionary();
  const m = dict.mydict;
  if (!supabaseConfigured || !ready) return null;

  if (!user) {
    return (
      <a className="btn" href={`/${lang}/login`}>
        <BookIcon filled={false} />
        <span style={{ marginInlineStart: 8 }}>{m.loginToAdd}</span>
      </a>
    );
  }

  const saved = savedSlugs.has(slug);
  return (
    <>
      <button type="button" className={`btn${saved ? " pri" : ""}`} aria-pressed={saved} onClick={() => toggleTerm(slug)}>
        <BookIcon filled={saved} />
        <span style={{ marginInlineStart: 8 }}>{saved ? m.added : m.add}</span>
      </button>
      {saved && <a className="btn" href={`/${lang}/learn/dictionary`}>{m.open}</a>}
      {saveFailed && <p className="fb" role="alert">{m.errGeneric}</p>}
    </>
  );
}
