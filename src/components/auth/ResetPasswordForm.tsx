"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";

type Stage = "checking" | "ready" | "invalid" | "done";

/**
 * Opened from the reset email. The Supabase client signs the user in from the
 * link while it starts; then they can set a new password.
 */
export default function ResetPasswordForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const a = dict.auth;
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setStage(data.session ? "ready" : "invalid");
    });
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (active && event === "PASSWORD_RECOVERY") setStage("ready");
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (!supabaseConfigured) return <p className="detail">{a.notConfigured}</p>;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirm") ?? "")) {
      setError(a.errMismatch);
      return;
    }
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) {
      setError(err.code === "same_password" ? a.errSame : err.code === "weak_password" ? a.errWeak : a.errGeneric);
      return;
    }
    setStage("done");
    setTimeout(() => router.replace(`/${lang}/account`), 1500);
  };

  if (stage === "checking") return <p role="status">{a.wait}</p>;
  if (stage === "invalid") {
    return (
      <div className="detail" role="alert">
        <b>{a.callbackFailTitle}</b>
        <span>{a.callbackFailText} <a href={`/${lang}/forgot-password`}>{a.forgot}</a></span>
      </div>
    );
  }
  if (stage === "done") return <p className="detail" role="status">{a.passwordSaved}</p>;

  return (
    <form className="auth-box auth-form" onSubmit={submit}>
      <label className="field">
        <span>{a.newPassword}</span>
        <input name="password" type="password" autoComplete="new-password" minLength={8} required dir="ltr" />
        <small className="muted">{a.passwordHint}</small>
      </label>
      <label className="field">
        <span>{a.confirmPassword}</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={8} required dir="ltr" />
      </label>
      <p className="fb" role="alert">{error}</p>
      <button type="submit" className="btn pri" disabled={busy}>{busy ? a.wait : a.savePassword}</button>
    </form>
  );
}
