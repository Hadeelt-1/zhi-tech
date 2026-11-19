import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Tool } from "@/content/tools";
import ToolFacts from "@/components/explore/ToolFacts";
import { fmt } from "@/lib/text";

export default function ToolCard({ tool, lang, dict }: { tool: Tool; lang: Locale; dict: Dictionary }) {
  const unverified = tool.status !== "verified";
  return (
    <article className="tool">
      <header className="tool-top">
        <div>
          <h3 lang="en" dir="ltr">
            <a className="tool-name" href={`/${lang}/explore/tools/${tool.slug}`}>{tool.name}</a>
          </h3>
          <p className="tool-co" lang="en" dir="ltr">{tool.companyName}</p>
        </div>
        {unverified && <span className="pill">{dict.tools.badge}</span>}
      </header>
      <p>{tool.summary[lang]}</p>
      <ToolFacts tool={tool} dict={dict} />
      <footer className="tool-foot">
        <small>{fmt(dict.tools.checked, { d: tool.lastChecked })}</small>
      </footer>
    </article>
  );
}
