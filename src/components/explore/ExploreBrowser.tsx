"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { TOOLS, type LicenseKind, type Runtime } from "@/content/tools";
import { CATEGORIES, type CategorySlug } from "@/content/categories";
import { COMPANIES as COMPANY_PROFILES } from "@/content/companies";
import { hasIntent, parseQuery, rankTools, type Reason } from "@/lib/search/smart-search";
import ToolCard from "@/components/home/ToolCard";
import { fmt } from "@/lib/text";

const RUNTIMES: Runtime[] = ["local", "api", "cloud"];
const LICENSES: LicenseKind[] = ["open_source", "open_weight", "proprietary", "not_stated"];
const USED_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "companies" && TOOLS.some((t) => t.categories.includes(c.slug)));
const COMPANIES = Array.from(new Map(TOOLS.map((t) => [t.company, t.companyName])).entries());

type GroupProps = {
  legend: string;
  allLabel: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
};

function FilterGroup({ legend, allLabel, value, options, onChange }: GroupProps) {
  return (
    <fieldset className="ex-group">
      <legend>{legend}</legend>
      <button type="button" className="chip" aria-pressed={!value} onClick={() => onChange("")}>{allLabel}</button>
      {options.map(([id, label]) => (
        <button key={id} type="button" className="chip" aria-pressed={value === id} onClick={() => onChange(value === id ? "" : id)}>
          {label}
        </button>
      ))}
    </fieldset>
  );
}

/**
 * Smart search + filters. State lives in the URL (?q=&category=&runtime=&license=&company=)
 * so results can be shared. The question is read by lib/search/smart-search.
 */
export default function ExploreBrowser({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const e = dict.explore;
  const t = dict.tools;
  const s = dict.search;

  const [text, setText] = useState(params.get("q") ?? "");
  const category = params.get("category") ?? "";
  const runtime = params.get("runtime") ?? "";
  const license = params.get("license") ?? "";
  const company = params.get("company") ?? "";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const ask = (q: string) => {
    setText(q);
    update("q", q);
  };

  const reasonLabel = (r: Reason) => {
    switch (r.kind) {
      case "runtime":
        return t.runtimes[r.value];
      case "use":
        return s.uses[r.value];
      case "modality":
        return s.modalities[r.value];
      case "open":
        return s.open;
      case "company":
        return s.company;
      case "text":
        return s.text;
    }
  };

  // Filter chips first, then the question ranks what is left.
  const filtered = TOOLS.filter(
    (tool) =>
      (!category || tool.categories.includes(category as CategorySlug)) &&
      (!runtime || tool.runtime.includes(runtime as Runtime)) &&
      (!license || tool.license.kind === license) &&
      (!company || tool.company === company),
  );
  const intent = useMemo(() => parseQuery(text), [text]);
  const searching = text.trim() !== "" && hasIntent(intent);
  const results = searching
    ? rankTools(filtered, intent, lang).map((r) => ({ tool: r.tool, reasons: r.reasons.map(reasonLabel) }))
    : filtered.map((tool) => ({ tool, reasons: [] as string[] }));

  const understood = [
    ...intent.runtimes.map((r) => t.runtimes[r]),
    ...intent.uses.map((u) => s.uses[u]),
    ...intent.modalities.map((m) => s.modalities[m]),
    ...(intent.openLicense ? [s.open] : []),
    ...intent.companies.map((c) => COMPANY_PROFILES.find((p) => p.slug === c)?.name ?? c),
  ];
  const usedLicenses = LICENSES.filter((l) => TOOLS.some((tool) => tool.license.kind === l));
  const usedRuntimes = RUNTIMES.filter((r) => TOOLS.some((tool) => tool.runtime.includes(r)));
  const anyFilter = Boolean(text || category || runtime || license || company);

  return (
    <>
      <label htmlFor="ex-q" className="note" style={{ display: "block", margin: "0 0 8px", fontWeight: 700 }}>{s.label}</label>
      <input
        id="ex-q"
        className="search search-wide"
        type="search"
        autoComplete="off"
        placeholder={s.placeholder}
        value={text}
        onChange={(ev) => ask(ev.target.value)}
      />

      {!text && (
        <div className="ex-examples">
          <span className="note" style={{ margin: 0, fontWeight: 700 }}>{s.examplesTitle}</span>
          <div className="chips">
            {s.examples.map((q) => (
              <button key={q} type="button" className="chip" onClick={() => ask(q)}>{q}</button>
            ))}
          </div>
        </div>
      )}

      {searching && (
        <div className="detail ex-understood" aria-live="polite">
          {understood.length ? (
            <>
              <b>{s.understood}</b>
              <ul className="why">{understood.map((u) => <li key={u}>{u}</li>)}</ul>
            </>
          ) : (
            <span>{s.onlyWords}</span>
          )}
        </div>
      )}

      <div className="ex-filters">
        <FilterGroup legend={dict.categories.filter} allLabel={e.all} value={category} options={USED_CATEGORIES.map((c) => [c.slug, dict.cats.items[c.index]])} onChange={(v) => update("category", v)} />
        <FilterGroup legend={e.runtime} allLabel={e.all} value={runtime} options={usedRuntimes.map((r) => [r, t.runtimes[r]])} onChange={(v) => update("runtime", v)} />
        <FilterGroup legend={e.license} allLabel={e.all} value={license} options={usedLicenses.map((l) => [l, t.licenseKinds[l]])} onChange={(v) => update("license", v)} />
        <FilterGroup legend={e.company} allLabel={e.all} value={company} options={COMPANIES} onChange={(v) => update("company", v)} />
      </div>

      <div className="ex-bar" aria-live="polite">
        <span>{fmt(e.count, { n: results.length, m: TOOLS.length })}</span>
        {anyFilter && (
          <button
            type="button"
            className="ex-clear"
            onClick={() => {
              setText("");
              router.replace(pathname, { scroll: false });
            }}
          >
            {e.clear}
          </button>
        )}
      </div>

      {results.length ? (
        <div className="tool-grid">
          {results.map(({ tool, reasons }) => (
            <ToolCard key={tool.slug} tool={tool} lang={lang} dict={dict} reasons={reasons} />
          ))}
        </div>
      ) : (
        <p className="detail">{e.none}</p>
      )}
      <p className="note">{s.note}</p>
    </>
  );
}
