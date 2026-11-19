"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import Reveal from "@/components/Reveal";
import { handleTabKeys } from "@/lib/text";

/** Latest / Featured / Most popular. Empty on purpose until verified tool data exists. */
export default function ToolsSection({ dict }: { dict: Dictionary }) {
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
          <div className="empty">
            <span className="pill">{t.badge}</span>
            <h3>{t.empty}</h3>
            <p>{t.emptyText[tab]}</p>
          </div>
        </div>
        <p className="note">{t.note}</p>
      </Reveal>
    </section>
  );
}
