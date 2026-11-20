"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const a = dict.auth;
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!supabaseConfigured) return <p className="detail">{a.notConfigured}</p>;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${lang}/reset-password`,
    });
    setBusy(false);
    if (err && (err.code === "over_email_send_rate_limit" || err.code === "over_request_rate_limit")) {
      setError(a.errRate);
      return;
    }
    // Same answer whether or not the email has an account (no account guessing).
    setSent(true);
  };

  if (sent) {
    return (
      <div className="detail" role="status">
        <b>{a.resetSentTitle}</b>
        <span>{a.resetSentText}</span>
      </div>
    );
  }

  return (
    <form className="auth-box auth-form" onSubmit={submit}>
      <label className="field">
        <span>{a.email}</span>
        <input name="email" type="email" autoComplete="email" required dir="ltr" />
      </label>
      <p className="fb" role="alert">{error}</p>
      <button type="submit" className="btn pri" disabled={busy}>{busy ? a.wait : a.sendLink}</button>
      <a className="hintlink" href={`/${lang}/login`} style={{ marginTop: 0 }}>{a.backToLogin}</a>
    </form>
  );
}
