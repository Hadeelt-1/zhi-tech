"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import ar from "@/i18n/dictionaries/ar.json";
import en from "@/i18n/dictionaries/en.json";
import zh from "@/i18n/dictionaries/zh.json";
import Reveal from "@/components/Reveal";
import { fmt } from "@/lib/text";
import { SELECT_CATEGORY_EVENT } from "./TermCard";

// Search matches a category or company in any of the three languages.
const allNames = (pick: (d: Dictionary) => string[], i: number) =>
  [en, ar, zh].map((d) => pick(d)[i]).join(" ").toLowerCase();

/** "Explore by category" and "Explore by company", sharing one search box. */
export default function ExploreSection({ dict }: { dict: Dictionary }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(-1);
  const [comp, setComp] = useState(-1);
  const q = query.trim().toLowerCase();

  // A term card link ("Explore in …") selects its category here.
  useEffect(() => {
    const onSelect = (e: Event) => {
      setQuery("");
      setCat((e as CustomEvent<number>).detail);
    };
    window.addEventListener(SELECT_CATEGORY_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_CATEGORY_EVENT, onSelect);
  }, []);

  const cats = dict.cats.items.map((label, i) => ({ label, i })).filter(({ i }) => !q || allNames((d) => d.cats.items, i).includes(q));
  const comps = dict.comp.items.map((label, i) => ({ label, i })).filter(({ i }) => !q || allNames((d) => d.comp.items, i).includes(q));

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
          <div className="chips" role="group" aria-label={dict.cats.title}>
            {cats.map(({ label, i }) => (
              <button key={label} type="button" className="chip" aria-pressed={i === cat} onClick={() => setCat(i === cat ? -1 : i)}>
                {label}
              </button>
            ))}
          </div>
          <div className="detail" aria-live="polite">
            {cat >= 0 ? (
              <>
                <b>{dict.cats.items[cat]}</b>
                <span>{dict.cats.desc[cat]} {dict.cats.note}</span>
              </>
            ) : (
              <span className="muted">{dict.cats.note}</span>
            )}
          </div>
          {q && cats.length === 0 && comps.length === 0 && <p className="note">{dict.cats.noMatch}</p>}
        </Reveal>
      </section>

      <section className="sec" id="companies" style={{ paddingTop: 0 }}>
        <Reveal className="wrap">
          <h2 className="sec-title">{dict.comp.title}</h2>
          <div className="chips" role="group" aria-label={dict.comp.title}>
            {comps.map(({ label, i }) => (
              <button key={label} type="button" className="chip" aria-pressed={i === comp} onClick={() => setComp(i === comp ? -1 : i)}>
                {label}
              </button>
            ))}
          </div>
          <div className="detail" aria-live="polite">
            {comp >= 0 ? (
              <span>{fmt(dict.comp.detail, { c: dict.comp.items[comp] })}</span>
            ) : (
              <span className="muted">{dict.cats.note}</span>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
