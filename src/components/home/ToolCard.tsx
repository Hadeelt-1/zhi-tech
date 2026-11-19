import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Tool } from "@/content/tools";
import { fmt } from "@/lib/text";

export default function ToolCard({ tool, lang, dict }: { tool: Tool; lang: Locale; dict: Dictionary }) {
  const t = dict.tools;
  const unverified = tool.status !== "verified";
  return (
    <article className="tool">
      <header className="tool-top">
        <div>
          <h3 lang="en" dir="ltr">{tool.name}</h3>
          <p className="tool-co" lang="en" dir="ltr">{tool.companyName}</p>
        </div>
        {unverified && <span className="pill">{t.badge}</span>}
      </header>
      <p>{tool.summary[lang]}</p>
      <dl className="tool-facts">
        <div><dt>{t.license}</dt><dd>{t.licenseKinds[tool.license.kind]}{tool.license.kind !== "not_stated" && <> · <span dir="ltr">{tool.license.name}</span></>}</dd></div>
        <div><dt>{t.runtime}</dt><dd>{tool.runtime.map((r) => t.runtimes[r]).join(" · ")}</dd></div>
        {tool.specs.parameters && <div><dt>{t.params}</dt><dd dir="ltr">{tool.specs.parameters}</dd></div>}
        {tool.specs.contextTokens && <div><dt>{t.context}</dt><dd dir="ltr">{tool.specs.contextTokens}</dd></div>}
      </dl>
      <footer className="tool-foot">
        <div className="tool-links">
          {tool.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" dir="ltr">{l.label} ↗</a>
          ))}
        </div>
        <small>{fmt(t.checked, { d: tool.lastChecked })}</small>
      </footer>
    </article>
  );
}
