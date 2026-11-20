import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Term } from "@/content/terms";

/** Vocabulary card; the whole card opens the term page (same pattern as tool cards). */
export default function TermCard({ term, lang, dict }: { term: Term; lang: Locale; dict: Dictionary }) {
  const l = dict.learn;
  return (
    <article className="tool term-card">
      <header className="tool-top">
        <div>
          <h3 lang="zh-Hans" className="term-zh">
            <a className="tool-name" href={`/${lang}/learn/vocabulary/${term.slug}`}>{term.zh}</a>
          </h3>
          <p className="term-py" lang="zh-Latn-pinyin">{term.pinyin}</p>
        </div>
        {term.status !== "verified" && <span className="pill">{dict.tools.badge}</span>}
      </header>
      <p className="term-meaning">
        <span dir="rtl" lang="ar">{term.ar}</span>
        <span className="muted" lang="en" dir="ltr">{term.en}</span>
      </p>
      <footer className="tool-foot">
        <small>{l.domains[term.domain]} · {l.levels[term.level]}</small>
      </footer>
    </article>
  );
}
