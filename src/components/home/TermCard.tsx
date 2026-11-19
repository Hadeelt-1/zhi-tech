"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { SAMPLE_TERMS } from "@/content/sample-terms";
import { fmt, forwardArrow } from "@/lib/text";

/** Event the categories section listens to, so a term can select its category. */
export const SELECT_CATEGORY_EVENT = "zhi:select-category";

export default function TermCard({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const term = SAMPLE_TERMS[index];
  const n = SAMPLE_TERMS.length;

  const go = (step: number) => {
    setIndex((index + step + n) % n);
    setOpen(false);
  };

  return (
    <div className="tcard">
      <div className="top">
        <span className="ct">{dict.hero.example}</span>
        <span>{fmt(dict.hero.count, { n: index + 1, m: n })}</span>
      </div>
      <button type="button" className="tflip" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="zh" lang="zh-Hans">{term.zh}</span>
        <span className="hint">{dict.hero.hint}</span>
        <span className="rev">
          <span className="py">{term.py}</span>
          <span className="arx" dir="rtl" lang="ar">{term.ar}</span>
          <span lang="en">{term.en}</span>
        </span>
      </button>
      {term.cat >= 0 && (
        <a
          className="tlink"
          href="#categories"
          onClick={() => window.dispatchEvent(new CustomEvent(SELECT_CATEGORY_EVENT, { detail: term.cat }))}
        >
          {dict.hero.exploreIn} {dict.cats.items[term.cat]}
          {forwardArrow(lang)}
        </a>
      )}
      <div className="tnav">
        <button type="button" className="sm" onClick={() => go(-1)}>{dict.hero.prev}</button>
        <div className="dots" aria-hidden="true">
          {SAMPLE_TERMS.map((t, i) => <i key={t.zh} className={i === index ? "on" : undefined} />)}
        </div>
        <button type="button" className="sm" onClick={() => go(1)}>{dict.hero.next}</button>
      </div>
    </div>
  );
}
