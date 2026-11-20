"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { TOOLS, type LocalizedList, type Tool } from "@/content/tools";
import { fmt } from "@/lib/text";

const MAX = 4;

/**
 * Side-by-side comparison focused on capabilities and use cases (per the brief).
 * The selection lives in the URL (?tools=a,b,c) so a comparison can be shared.
 */
export default function CompareView({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const c = dict.compare;
  const t = dict.tools;
  const p = dict.toolPage;

  const selected = (params.get("tools") ?? "")
    .split(",")
    .filter((slug, i, all) => slug && all.indexOf(slug) === i && TOOLS.some((x) => x.slug === slug))
    .slice(0, MAX);
  const tools = selected.map((slug) => TOOLS.find((x) => x.slug === slug)) as Tool[];

  const setSelected = (list: string[]) =>
    router.replace(list.length ? `${pathname}?tools=${list.join(",")}` : pathname, { scroll: false });
  const toggle = (slug: string) => {
    if (selected.includes(slug)) setSelected(selected.filter((s) => s !== slug));
    else if (selected.length < MAX) setSelected([...selected, slug]);
  };

  const list = (items: LocalizedList) =>
    items[lang].length ? (
      <ul className="cmp-list">{items[lang].map((x) => <li key={x}>{x}</li>)}</ul>
    ) : (
      <span className="muted">{p.notStated}</span>
    );

  // Capabilities and use cases first, then the practical facts.
  const rows: { label: string; cell: (tool: Tool) => ReactNode }[] = [
    { label: p.useCases, cell: (x) => list(x.useCases) },
    {
      label: p.modalities,
      cell: (x) =>
        x.specs.modalities ? (
          x.specs.modalities.map((m) => p.modalityNames[m as keyof typeof p.modalityNames] ?? m).join(" · ")
        ) : (
          <span className="muted">{p.notStated}</span>
        ),
    },
    { label: t.params, cell: (x) => (x.specs.parameters ? <span dir="ltr">{x.specs.parameters}</span> : <span className="muted">{p.notStated}</span>) },
    { label: t.context, cell: (x) => (x.specs.contextTokens ? <span dir="ltr">{x.specs.contextTokens}</span> : <span className="muted">{p.notStated}</span>) },
    { label: t.runtime, cell: (x) => x.runtime.map((r) => t.runtimes[r]).join(" · ") },
    {
      label: t.license,
      cell: (x) => (
        <>
          {t.licenseKinds[x.license.kind]}
          {x.license.kind !== "not_stated" && <> · <span dir="ltr">{x.license.name}</span></>}
        </>
      ),
    },
    { label: p.requirements, cell: (x) => list(x.requirements) },
    { label: p.limitations, cell: (x) => list(x.limitations) },
    {
      label: p.company,
      cell: (x) => <a href={`/${lang}/explore/companies/${x.company}`} dir="ltr">{x.companyName}</a>,
    },
    {
      label: c.status,
      cell: (x) => (x.status === "verified" ? c.verified : <span className="pill">{t.badge}</span>),
    },
  ];

  return (
    <>
      <fieldset className="ex-group" style={{ marginBottom: 8 }}>
        <legend>{c.pick}</legend>
        {TOOLS.map((x) => {
          const on = selected.includes(x.slug);
          return (
            <button
              key={x.slug}
              type="button"
              className="chip"
              aria-pressed={on}
              disabled={!on && selected.length >= MAX}
              onClick={() => toggle(x.slug)}
              dir="ltr"
            >
              {x.name}
            </button>
          );
        })}
      </fieldset>
      <div className="ex-bar" aria-live="polite">
        <span>{selected.length >= MAX ? c.max : selected.length < 2 ? c.need : ""}</span>
        {selected.length > 0 && <button type="button" className="ex-clear" onClick={() => setSelected([])}>{c.clear}</button>}
      </div>

      {tools.length >= 2 && (
        <div className="cmp-wrap" tabIndex={0} role="region" aria-label={c.title}>
          <table className="cmp">
            <thead>
              <tr>
                <th scope="col">{c.feature}</th>
                {tools.map((x) => (
                  <th scope="col" key={x.slug}>
                    <a className="cmp-name" href={`/${lang}/explore/tools/${x.slug}`} dir="ltr">{x.name}</a>
                    <button type="button" className="cmp-remove" onClick={() => toggle(x.slug)} aria-label={fmt(c.remove, { name: x.name })}>×</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {tools.map((x) => <td key={x.slug}>{row.cell(x)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
