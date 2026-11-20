"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { COMPANIES } from "@/content/companies";
import ar from "@/i18n/dictionaries/ar.json";
import en from "@/i18n/dictionaries/en.json";
import zh from "@/i18n/dictionaries/zh.json";
import Reveal from "@/components/Reveal";
import { categoryByIndex, categoryHref } from "@/content/categories";

// Search matches a category or company in any of the three languages.
const allNames = (pick: (d: Dictionary) => string[], i: number) =>
  [en, ar, zh].map((d) => pick(d)[i]).join(" ").toLowerCase();

/** "Explore by category" and "Explore by company", sharing one search box. */
export default function ExploreSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const cats = dict.cats.items.map((label, i) => ({ label, i })).filter(({ i }) => !q || allNames((d) => d.cats.items, i).includes(q));
  const comps = COMPANIES.filter((c) => !q || `${c.name} ${c.nameZh}`.toLowerCase().includes(q));

  return (
    <>
      <section className="sec" id="categories">
        <Reveal className="wrap">
          <h2 className="sec-title">{dict.cats.title}</h2>
          <label htmlFor="explore-search" className="note" style={{ display: "block", margin: "-8px 0 8px", fontWeight: 700 }}>
            {dict.cats.searchLabel}
          </label>
          <input
            id="explore-search"
            className="search"
            type="search"
            autoComplete="off"
            placeholder={dict.cats.searchLabel}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="chips" role="list" aria-label={dict.cats.title}>
            {cats.map(({ label, i }) => {
              const cat = categoryByIndex(i);
              return cat ? (
                <a key={label} role="listitem" className="chip" href={categoryHref(lang, cat.slug)}>{label}</a>
              ) : null;
            })}
          </div>
          <a className="btn" href={`/${lang}/explore/categories`} style={{ marginTop: 20 }}>{dict.categories.all}</a>
          {q && cats.length === 0 && comps.length === 0 && <p className="note">{dict.cats.noMatch}</p>}
        </Reveal>
      </section>

      <section className="sec" id="companies" style={{ paddingTop: 0 }}>
        <Reveal className="wrap">
          <h2 className="sec-title">{dict.comp.title}</h2>
          <div className="chips" role="list" aria-label={dict.comp.title}>
            {comps.map((c) => (
              <a key={c.slug} role="listitem" className="chip" href={`/${lang}/explore/companies/${c.slug}`} lang="en" dir="ltr">
                {c.name}
              </a>
            ))}
          </div>
          <a className="btn" href={`/${lang}/explore/companies`} style={{ marginTop: 20 }}>{dict.companies.all}</a>
        </Reveal>
      </section>
    </>
  );
}
