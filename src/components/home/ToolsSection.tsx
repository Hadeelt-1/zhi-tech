"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { TOOLS } from "@/content/tools";
import ToolCard from "./ToolCard";

/** How many tools the homepage shows; the rest live on the Explore page. */
const HOME_LIMIT = 3;
import Reveal from "@/components/Reveal";
import { handleTabKeys } from "@/lib/text";

/**
 * Latest shows the catalogue (drafts are labeled "Needs review").
 * Featured and Most popular stay empty until there are editor picks and real usage data.
 */
export default function ToolsSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [tab, setTab] = useState(0);
  const t = dict.tools;

  return (
    <section className="sec" id="tools">
      <Reveal className="wrap">
        <h2 className="sec-title">{t.title}</h2>
        <form className="home-search" action={`/${lang}/explore`} role="search">
          <label htmlFor="home-q" className="note" style={{ display: "block", margin: "-8px 0 8px", fontWeight: 700 }}>{dict.search.homeTitle}</label>
          <div className="home-search-row">
            <input id="home-q" name="q" className="search search-wide" type="search" placeholder={dict.search.placeholder} autoComplete="off" />
            <button type="submit" className="btn pri">{dict.search.homeButton}</button>
          </div>
        </form>
        <div className="tabs" role="tablist" onKeyDown={(e) => handleTabKeys(e, t.tabs.length, tab, setTab)}>
          {t.tabs.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              className="tab"
              id={`ttab${i}`}
              aria-selected={i === tab}
              aria-controls="tpanel"
              tabIndex={i === tab ? 0 : -1}
              onClick={() => setTab(i)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="panel" id="tpanel" role="tabpanel" aria-labelledby={`ttab${tab}`} key={tab}>
          {tab === 0 && TOOLS.length > 0 ? (
            <div className="tool-grid">
              {TOOLS.slice(0, HOME_LIMIT).map((tool) => <ToolCard key={tool.slug} tool={tool} lang={lang} dict={dict} />)}
            </div>
          ) : (
            <div className="empty">
              <span className="pill">{t.badge}</span>
              <h3>{t.empty}</h3>
              <p>{t.emptyText[tab]}</p>
            </div>
          )}
        </div>
        <p className="note">{t.note}</p>
        <a className="btn" href={`/${lang}/explore`} style={{ marginTop: 16 }}>{dict.explore.viewAll}</a>
      </Reveal>
    </section>
  );
}
