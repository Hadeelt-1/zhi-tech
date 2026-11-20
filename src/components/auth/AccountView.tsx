"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { TOOLS } from "@/content/tools";
import ToolCard from "@/components/home/ToolCard";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";
import { useFavorites } from "./useFavorites";

export default function AccountView({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const a = dict.auth;
  const router = useRouter();
  const { user, ready, slugs, loaded, error } = useFavorites();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setName((data as { display_name: string | null } | null)?.display_name ?? null));
  }, [user]);

  if (!supabaseConfigured) return <p className="detail">{a.notConfigured}</p>;
  if (!ready) return <p role="status">{a.wait}</p>;
  if (!user) {
    return (
      <div className="detail">
        <b>{a.signedOutTitle}</b>
        <span>{a.signedOutText} <a href={`/${lang}/login`}>{a.signinTab}</a></span>
      </div>
    );
  }

  const signOut = async () => {
    await getSupabase()?.auth.signOut();
    router.replace(`/${lang}`);
  };

  const saved = slugs.map((s) => TOOLS.find((t) => t.slug === s)).filter((t) => t !== undefined);

  return (
    <>
      <header className="acc-head">
        <div>
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 48px)", marginBottom: 6 }}>
            {name ? `${a.hello} ${name}` : a.account}
          </h1>
          <p className="muted" dir="ltr" style={{ textAlign: "start" }}>{user.email}</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn pri" href={`/${lang}/dashboard`}>{dict.dash.open}</a>
          <a className="btn" href={`/${lang}/learn/dictionary`}>{dict.mydict.open}</a>
          <button type="button" className="btn" onClick={signOut}>{a.signout}</button>
        </div>
      </header>

      <section className="tp-related" style={{ marginTop: 32 }}>
        <h2 className="sec-title">{a.favorites}</h2>
        {error && <p className="fb" role="alert">{a.errGeneric}</p>}
        {!loaded ? (
          <p role="status">{a.wait}</p>
        ) : saved.length ? (
          <div className="tool-grid">
            {saved.map((t) => <ToolCard key={t.slug} tool={t} lang={lang} dict={dict} />)}
          </div>
        ) : (
          <div className="panel">
            <div className="empty">
              <h3>{a.noFavorites}</h3>
              <p>{a.noFavoritesText}</p>
              <a className="btn" href={`/${lang}/explore`}>{dict.explore.viewAll}</a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
