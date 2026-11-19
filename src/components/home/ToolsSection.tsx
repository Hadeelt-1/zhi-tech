"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { TOOLS } from "@/content/tools";
import ToolCard from "./ToolCard";
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
              {TOOLS.map((tool) => <ToolCard key={tool.slug} tool={tool} lang={lang} dict={dict} />)}
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
