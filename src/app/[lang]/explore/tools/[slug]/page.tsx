import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getTool, TOOLS, type LocalizedList, type Tool } from "@/content/tools";
import { getCompany } from "@/content/companies";
import ToolFacts from "@/components/explore/ToolFacts";
import ToolCard from "@/components/home/ToolCard";
import { fmt } from "@/lib/text";

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const tool = getTool(slug);
  if (!tool || !hasLocale(lang)) return {};
  return { title: `${tool.name} · ZHI TECH`, description: tool.summary[lang] };
}

function ListSection({ title, items, lang }: { title: string; items: LocalizedList; lang: Locale }) {
  const list = items[lang];
  if (list.length === 0) return null;
  return (
    <section className="tp-sec">
      <h2>{title}</h2>
      <ul className="tp-list">{list.map((x) => <li key={x}>{x}</li>)}</ul>
    </section>
  );
}

function related(tool: Tool) {
  const same = TOOLS.filter((t) => t.slug !== tool.slug && t.company === tool.company);
  if (same.length) return { sameCompany: true, list: same };
  // No other tools from this company yet: suggest others with a matching way to run them.
  const other = TOOLS.filter((t) => t.slug !== tool.slug && t.runtime.some((r) => tool.runtime.includes(r))).slice(0, 3);
  return { sameCompany: false, list: other };
}

export default async function ToolPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const tool = getTool(slug);
  if (!tool) notFound();
  const dict = await getDictionary(lang);
  const p = dict.toolPage;
  const rel = related(tool);

  return (
    <div className="sec tp">
      <div className="wrap">
        <a className="tp-back" href={`/${lang}/explore`}>{lang === "ar" ? "→ " : "← "}{p.back}</a>

        <header className="tp-head">
          <p className="tool-co" lang="en" dir="ltr">{tool.companyName}</p>
          <h1 lang="en" dir="ltr">{tool.name}</h1>
          <p className="sub">{tool.summary[lang]}</p>
          <a className="btn" href={`/${lang}/explore/compare?tools=${tool.slug}`} style={{ marginTop: 20 }}>{dict.compare.compareThis}</a>
        </header>

        {tool.status !== "verified" && (
          <div className="detail tp-review" role="note">
            <b>{p.reviewTitle}</b>
            <span>{p.reviewText}</span>
          </div>
        )}

        <div className="tp-grid">
          <div className="tp-main">
            <ListSection title={p.useCases} items={tool.useCases} lang={lang} />
            <ListSection title={p.requirements} items={tool.requirements} lang={lang} />
            <ListSection title={p.limitations} items={tool.limitations} lang={lang} />
            <section className="tp-sec">
              <h2>{p.playground}</h2>
              <p>{p.playgroundText}</p>
            </section>
          </div>

          <aside className="tp-side">
            <section className="tp-card">
              <h2>{p.facts}</h2>
              <ToolFacts tool={tool} dict={dict} full />
            </section>
            <section className="tp-card">
              <h2>{p.access}</h2>
              <ul className="tp-links">
                {tool.links.map((l) => (
                  <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" dir="ltr">{l.label} ↗</a></li>
                ))}
              </ul>
            </section>
            <section className="tp-card">
              <h2>{p.company}</h2>
              {getCompany(tool.company) ? (
                <>
                  <p>{getCompany(tool.company)!.overview[lang]}</p>
                  <a className="tp-company" href={`/${lang}/explore/companies/${tool.company}`} dir="ltr">{tool.companyName} {lang === "ar" ? "←" : "→"}</a>
                </>
              ) : (
                <>
                  <p lang="en" dir="ltr"><b>{tool.companyName}</b></p>
                  <p className="muted">{p.companyNote}</p>
                </>
              )}
            </section>
            <section className="tp-card">
              <h2>{p.sources}</h2>
              <ul className="tp-links tp-sources">
                {tool.sources.map((u) => (
                  <li key={u}><a href={u} target="_blank" rel="noopener noreferrer" dir="ltr">{new URL(u).hostname}{new URL(u).pathname.length > 1 ? "/…" : ""}</a></li>
                ))}
              </ul>
              <small className="muted">{fmt(p.checked, { d: tool.lastChecked })}</small>
            </section>
          </aside>
        </div>

        {rel.list.length > 0 && (
          <section className="tp-related">
            <h2 className="sec-title">{rel.sameCompany ? p.related : p.relatedOther}</h2>
            <div className="tool-grid">
              {rel.list.map((t) => <ToolCard key={t.slug} tool={t} lang={lang} dict={dict} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
