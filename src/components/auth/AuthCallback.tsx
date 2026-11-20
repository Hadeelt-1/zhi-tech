"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";

/**
 * Landing page for the email confirmation link. The Supabase client finishes
 * the sign-in from the link by itself while it starts; we wait, then go to the account.
 */
export default function AuthCallback({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(`/${lang}/account`);
      else setFailed(true);
    });
  }, [lang, router]);

  return failed || !supabaseConfigured ? (
    <div className="detail" role="alert">
      <b>{dict.auth.callbackFailTitle}</b>
      <span>{dict.auth.callbackFailText} <a href={`/${lang}/login`}>{dict.auth.signinTab}</a></span>
    </div>
  ) : (
    <p role="status">{dict.auth.wait}</p>
  );
}
