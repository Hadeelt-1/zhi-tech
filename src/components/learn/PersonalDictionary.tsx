"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { supabaseConfigured } from "@/lib/supabase/client";
import { getTerm } from "@/content/terms";
import { fmt } from "@/lib/text";
import { buildCsv, hasArabic, hasHan, type CsvRow } from "@/lib/dictionary-csv";
import { usePersonalDictionary, type DictEntry } from "./usePersonalDictionary";
import ListenButton from "./ListenButton";

type View = { id: number; slug: string | null; zh: string; pinyin: string; ar: string; en: string; note: string; own: boolean };

/** Library entries take their text from the term library; own words keep what the user typed. */
function toView(e: DictEntry): View | null {
  if (e.term_slug) {
    const t = getTerm(e.term_slug);
    if (!t) return null; // a term that was removed from the library
    return { id: e.id, slug: t.slug, zh: t.zh, pinyin: t.pinyin, ar: t.ar, en: t.en, note: e.note ?? "", own: false };
  }
  const meaning = e.meaning ?? "";
  const ar = hasArabic(meaning) ? meaning : "";
  return { id: e.id, slug: null, zh: e.zh ?? "", pinyin: e.pinyin ?? "", ar, en: ar ? "" : meaning, note: e.note ?? "", own: true };
}

function download(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PersonalDictionary({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { user, loaded, entries, loadFailed, saveFailed, addOwn, remove } = usePersonalDictionary();
  const m = dict.mydict;
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (!supabaseConfigured) return <p className="detail">{dict.auth.notConfigured}</p>;
  if (!loaded) return <p className="muted" role="status">{m.loading}</p>;
  if (!user) {
    return (
      <div className="detail">
        <span>{m.signedOut}</span>
        <a className="btn pri" href={`/${lang}/login`} style={{ justifySelf: "start", marginTop: 12 }}>{m.login}</a>
      </div>
    );
  }

  const views = entries.map(toView).filter((v) => v !== null);
  const meaningOf = (v: View) => (lang === "ar" ? v.ar || v.en : v.en || v.ar);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const word = { zh: get("zh"), pinyin: get("pinyin"), meaning: get("meaning"), note: get("note") };
    if (!word.zh || !word.meaning) return setMsg(m.errRequired);
    if (!hasHan(word.zh)) return setMsg(m.errNotChinese);
    setBusy(true);
    const ok = await addOwn(word);
    setBusy(false);
    if (ok) {
      form.reset();
      setMsg(m.addedMsg);
    } else setMsg(m.errGeneric);
  }

  function exportCsv() {
    const rows: CsvRow[] = views.map((v) => ({
      zh: v.zh,
      pinyin: v.pinyin,
      ar: v.ar,
      en: v.en,
      note: v.note,
      source: v.own ? m.own : m.fromLibrary,
    }));
    const day = new Date().toISOString().slice(0, 10);
    download(buildCsv(m.csv, rows), `zhi-tech-dictionary-${day}.csv`);
  }

  return (
    <>
      {loadFailed && <p className="fb" role="alert">{m.loadFailed}</p>}

      <div className="md-bar">
        <p className="dash-label" role="status">{fmt(m.count, { n: views.length })}</p>
        <div className="tp-actions" style={{ marginTop: 0 }}>
          {!adding && (
            <button type="button" className="btn pri" onClick={() => { setAdding(true); setMsg(""); }}>{m.newTitle}</button>
          )}
          <button type="button" className="btn" onClick={exportCsv} disabled={views.length === 0}>{m.export}</button>
        </div>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>{m.exportNote}</p>

      {adding && (
        <form className="auth-box auth-form" style={{ marginTop: 16, maxWidth: 560 }} onSubmit={submit} noValidate>
          <h2 style={{ fontSize: 22, margin: 0 }}>{m.newTitle}</h2>
          <label className="field"><span>{m.zh}</span><input name="zh" required maxLength={50} lang="zh-Hans" dir="ltr" autoComplete="off" /></label>
          <label className="field"><span>{m.pinyin}</span><input name="pinyin" maxLength={100} lang="zh-Latn-pinyin" dir="ltr" autoComplete="off" /></label>
          <label className="field"><span>{m.meaning}</span><input name="meaning" required maxLength={200} autoComplete="off" /></label>
          <label className="field"><span>{m.note}</span><textarea name="note" maxLength={500} rows={3} /></label>
          <p className="fb" role="alert">{msg}</p>
          <div className="tp-actions" style={{ marginTop: 0 }}>
            <button type="submit" className="btn pri" disabled={busy}>{m.submit}</button>
            <button type="button" className="btn" onClick={() => { setAdding(false); setMsg(""); }}>{m.cancel}</button>
          </div>
        </form>
      )}
      {!adding && msg && <p className="fb" role="status">{msg}</p>}
      {saveFailed && !adding && <p className="fb" role="alert">{m.errGeneric}</p>}

      {views.length === 0 ? (
        <div className="detail" style={{ marginTop: 24 }}>
          <span>{m.empty}</span>
          <a className="btn" href={`/${lang}/learn/vocabulary`} style={{ justifySelf: "start", marginTop: 12 }}>{m.browse}</a>
        </div>
      ) : (
        <ul className="md-list">
          {views.map((v) => (
            <li key={v.id} className="tp-card md-item">
              <div className="md-main">
                <p className="md-zh" lang="zh-Hans">
                  {v.slug ? <a href={`/${lang}/learn/vocabulary/${v.slug}`}>{v.zh}</a> : v.zh}
                </p>
                {v.pinyin && <p className="ex-py" lang="zh-Latn-pinyin">{v.pinyin}</p>}
                <p dir="auto">{meaningOf(v)}</p>
                {v.note && <p className="muted" dir="auto">{v.note}</p>}
                <span className={`pill${v.own ? "" : " pill-done"}`} style={{ justifySelf: "start" }}>{v.own ? m.own : m.fromLibrary}</span>
              </div>
              <div className="md-side">
                <ListenButton text={v.zh} label={dict.learn.listen} small />
                <button type="button" className="btn md-remove" onClick={() => remove(v.id)} aria-label={fmt(m.removeLabel, { w: v.zh })}>
                  {m.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
