"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import Reveal from "@/components/Reveal";
import { forwardArrow, handleTabKeys } from "@/lib/text";

export default function PathsSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [tab, setTab] = useState(0);
  const p = dict.paths;
  const paths = [
    { title: p.tab1, desc: p.p1d, points: p.p1b, link: p.link1, href: "#try" },
    { title: p.tab2, desc: p.p2d, points: p.p2b, link: p.link2, href: "#categories" },
  ];
  const cur = paths[tab];

  return (
    <section className="sec" id="paths">
      <Reveal className="wrap">
        <h2 className="sec-title">{p.title}</h2>
        <div className="tabs" role="tablist" onKeyDown={(e) => handleTabKeys(e, paths.length, tab, setTab)}>
          {paths.map((x, i) => (
            <button
              key={x.title}
              type="button"
              role="tab"
              className="tab"
              id={`ptab${i}`}
              aria-selected={i === tab}
              aria-controls="ppanel"
              tabIndex={i === tab ? 0 : -1}
              onClick={() => setTab(i)}
            >
              {x.title}
            </button>
          ))}
        </div>
        <div className="panel" id="ppanel" role="tabpanel" aria-labelledby={`ptab${tab}`} key={tab}>
          <div className="pgrid">
            <div>
              <h3>{cur.title}</h3>
              <p>{cur.desc}</p>
              <a className="hintlink" href={cur.href}>{cur.link}{forwardArrow(lang)}</a>
            </div>
            <ul className="feat">
              {cur.points.map((pt, i) => (
                <li key={pt}><b aria-hidden="true">{i + 1}</b><span>{pt}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
