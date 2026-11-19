import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { COMPANIES, getCompany } from "@/content/companies";
import { TOOLS } from "@/content/tools";
import ToolCard from "@/components/home/ToolCard";
import { fmt } from "@/lib/text";

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const company = getCompany(slug);
  if (!company || !hasLocale(lang)) return {};
  return { title: `${company.name} · ZHI TECH`, description: company.overview[lang] };
}

export default async function CompanyPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const company = getCompany(slug);
  if (!company) notFound();
  const dict = await getDictionary(lang);
  const c = dict.companies;
  const tools = TOOLS.filter((t) => t.company === company.slug);

  return (
    <div className="sec tp">
      <div className="wrap">
        <a className="tp-back" href={`/${lang}/explore/companies`}>{lang === "ar" ? "→ " : "← "}{c.back}</a>

        <header className="tp-head">
          <p className="tool-co" lang="zh-Hans">{company.nameZh}</p>
          <h1 lang="en" dir="ltr">{company.name}</h1>
          <p className="sub">{company.overview[lang]}</p>
        </header>

        {company.status !== "verified" && (
          <div className="detail tp-review" role="note">
            <b>{dict.toolPage.reviewTitle}</b>
            <span>{c.review}</span>
          </div>
        )}

        <div className="tp-grid">
          <section className="tp-main">
            <h2 className="sec-title" style={{ marginBottom: 0 }}>{c.models}</h2>
            {tools.length ? (
              <div className="tool-grid">
                {tools.map((t) => <ToolCard key={t.slug} tool={t} lang={lang} dict={dict} />)}
              </div>
            ) : (
              <p>{c.none}</p>
            )}
          </section>

          <aside className="tp-side">
            <section className="tp-card">
              <h2>{c.links}</h2>
              <ul className="tp-links">
                {company.links.map((l) => (
                  <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" dir="ltr">{l.label} ↗</a></li>
                ))}
              </ul>
            </section>
            <section className="tp-card">
              <h2>{dict.toolPage.sources}</h2>
              <ul className="tp-links tp-sources">
                {company.sources.map((u) => (
                  <li key={u}><a href={u} target="_blank" rel="noopener noreferrer" dir="ltr">{new URL(u).hostname}/…</a></li>
                ))}
              </ul>
              <small className="muted">{fmt(dict.toolPage.checked, { d: company.lastChecked })}</small>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
