"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { DOMAINS, LEVELS, TERMS, plainPinyin, type Domain, type LevelBand } from "@/content/terms";
import { normalize } from "@/lib/search/smart-search";
import { fmt } from "@/lib/text";
import TermCard from "./TermCard";

/** Searchable reference library. Filters live in the URL (?q=&domain=&level=) so a view can be shared. */
export default function VocabularyBrowser({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const l = dict.learn;
  const [text, setText] = useState(params.get("q") ?? "");
  const domain = params.get("domain") ?? "";
  const level = params.get("level") ?? "";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const q = normalize(text);
  const qPinyin = plainPinyin(text).replace(/\s+/g, "");
  const results = TERMS.filter((t) => {
    if (domain && t.domain !== domain) return false;
    if (level && t.level !== level) return false;
    if (!q) return true;
    return (
      t.zh.includes(text.trim()) ||
      plainPinyin(t.pinyin).replace(/\s+/g, "").includes(qPinyin) ||
      normalize(t.ar).includes(q) ||
      t.en.toLowerCase().includes(q)
    );
  });

  const Group = ({ legend, value, name, options }: { legend: string; value: string; name: string; options: [string, string][] }) => (
    <fieldset className="ex-group">
      <legend>{legend}</legend>
      <button type="button" className="chip" aria-pressed={!value} onClick={() => update(name, "")}>{l.all}</button>
      {options.map(([id, label]) => (
        <button key={id} type="button" className="chip" aria-pressed={value === id} onClick={() => update(name, value === id ? "" : id)}>{label}</button>
      ))}
    </fieldset>
  );

  return (
    <>
      <label htmlFor="vocab-q" className="note" style={{ display: "block", margin: "0 0 8px", fontWeight: 700 }}>{l.search}</label>
      <input
        id="vocab-q"
        className="search search-wide"
        type="search"
        autoComplete="off"
        placeholder={l.search}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          update("q", e.target.value);
        }}
      />
      <div className="ex-filters">
        {Group({ legend: l.domain, value: domain, name: "domain", options: DOMAINS.map((d: Domain) => [d, l.domains[d]]) })}
        {Group({ legend: l.level, value: level, name: "level", options: LEVELS.map((v: LevelBand) => [v, l.levels[v]]) })}
      </div>
      <div className="ex-bar" aria-live="polite">
        <span>{fmt(l.count, { n: results.length, m: TERMS.length })}</span>
      </div>
      {results.length ? (
        <div className="tool-grid">
          {results.map((t) => <TermCard key={t.slug} term={t} lang={lang} dict={dict} />)}
        </div>
      ) : (
        <p className="detail">{l.none}</p>
      )}
      <p className="note">{l.levelNote}</p>
    </>
  );
}
