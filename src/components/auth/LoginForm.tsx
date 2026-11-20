"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

/** Maps Supabase error codes to our own wording (never shows raw English errors). */
function errorText(code: string | undefined, a: Dictionary["auth"]) {
  switch (code) {
    case "invalid_credentials":
      return a.errInvalid;
    case "email_not_confirmed":
      return a.errNotConfirmed;
    case "weak_password":
      return a.errWeak;
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return a.errRate;
    default:
      return a.errGeneric;
  }
}

export default function LoginForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const a = dict.auth;
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!supabaseConfigured) return <p className="detail">{a.notConfigured}</p>;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    setError("");

    if (mode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (err) return setError(errorText(err.code, a));
      router.replace(`/${lang}/account`);
      return;
    }

    const name = String(form.get("name") ?? "").trim().slice(0, 80);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/${lang}/auth/callback`,
        data: { display_name: name || null },
      },
    });
    setBusy(false);
    if (err) return setError(errorText(err.code, a));
    // Same message whether or not the email already had an account (no account guessing).
    setSent(true);
  };

  if (sent) {
    return (
      <div className="detail" role="status">
        <b>{a.checkTitle}</b>
        <span>{a.checkText}</span>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <div className="tabs" role="tablist">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            className="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setError("");
            }}
          >
            {m === "signin" ? a.signinTab : a.signupTab}
          </button>
        ))}
      </div>
      <form className="auth-form" onSubmit={submit} noValidate={false}>
        {mode === "signup" && (
          <label className="field">
            <span>{a.name}</span>
            <input name="name" type="text" autoComplete="name" maxLength={80} />
          </label>
        )}
        <label className="field">
          <span>{a.email}</span>
          <input name="email" type="email" autoComplete="email" required dir="ltr" />
        </label>
        <label className="field">
          <span>{a.password}</span>
          <input
            name="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            minLength={8}
            required
            dir="ltr"
          />
          {mode === "signup" && <small className="muted">{a.passwordHint}</small>}
        </label>
        <p className="fb" role="alert">{error}</p>
        <button type="submit" className="btn pri" disabled={busy}>
          {busy ? a.wait : mode === "signin" ? a.signinBtn : a.signupBtn}
        </button>
        {mode === "signin" && (
          <a className="hintlink" href={`/${lang}/forgot-password`} style={{ marginTop: 0 }}>{a.forgot}</a>
        )}
      </form>
    </div>
  );
}
