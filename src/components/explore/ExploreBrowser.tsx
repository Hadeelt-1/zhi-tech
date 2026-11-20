"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { TOOLS, type LicenseKind, type Runtime } from "@/content/tools";
import { CATEGORIES, type CategorySlug } from "@/content/categories";
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

/** Search + filters. State lives in the URL (?q=&category=&runtime=&license=&company=) so results can be shared. */
export default function ExploreBrowser({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const e = dict.explore;
  const t = dict.tools;

  const q = params.get("q") ?? "";
  const [text, setText] = useState(q);
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

  const needle = text.trim().toLowerCase();
  const results = TOOLS.filter(
    (tool) =>
      (!needle || `${tool.name} ${tool.companyName}`.toLowerCase().includes(needle)) &&
      (!category || tool.categories.includes(category as CategorySlug)) &&
      (!runtime || tool.runtime.includes(runtime as Runtime)) &&
      (!license || tool.license.kind === license) &&
      (!company || tool.company === company),
  );
  const usedLicenses = LICENSES.filter((l) => TOOLS.some((tool) => tool.license.kind === l));
  const usedRuntimes = RUNTIMES.filter((r) => TOOLS.some((tool) => tool.runtime.includes(r)));
  const filtered = Boolean(text || category || runtime || license || company);

  return (
    <>
      <label htmlFor="ex-q" className="note" style={{ display: "block", margin: "0 0 8px", fontWeight: 700 }}>{e.search}</label>
      <input
        id="ex-q"
        className="search"
        type="search"
        autoComplete="off"
        placeholder={e.search}
        value={text}
        onChange={(ev) => {
          setText(ev.target.value);
          update("q", ev.target.value);
        }}
      />
      <div className="ex-filters">
        <FilterGroup legend={dict.categories.filter} allLabel={e.all} value={category} options={USED_CATEGORIES.map((c) => [c.slug, dict.cats.items[c.index]])} onChange={(v) => update("category", v)} />
        <FilterGroup legend={e.runtime} allLabel={e.all} value={runtime} options={usedRuntimes.map((r) => [r, t.runtimes[r]])} onChange={(v) => update("runtime", v)} />
        <FilterGroup legend={e.license} allLabel={e.all} value={license} options={usedLicenses.map((l) => [l, t.licenseKinds[l]])} onChange={(v) => update("license", v)} />
        <FilterGroup legend={e.company} allLabel={e.all} value={company} options={COMPANIES} onChange={(v) => update("company", v)} />
      </div>
      <div className="ex-bar" aria-live="polite">
        <span>{fmt(e.count, { n: results.length, m: TOOLS.length })}</span>
        {filtered && <button type="button" className="ex-clear" onClick={() => {
              setText("");
              router.replace(pathname, { scroll: false });
            }}>{e.clear}</button>}
      </div>
      {results.length ? (
        <div className="tool-grid">
          {results.map((tool) => <ToolCard key={tool.slug} tool={tool} lang={lang} dict={dict} />)}
        </div>
      ) : (
        <p className="detail">{e.none}</p>
      )}
    </>
  );
}
