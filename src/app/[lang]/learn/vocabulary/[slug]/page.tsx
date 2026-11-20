import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getTerm, TERMS } from "@/content/terms";
import { TOOLS } from "@/content/tools";
import ToolCard from "@/components/home/ToolCard";
import ListenButton from "@/components/learn/ListenButton";
import AddToDictionaryButton from "@/components/learn/AddToDictionaryButton";

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  return TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const term = getTerm(slug);
  if (!term || !hasLocale(lang)) return {};
  return { title: `${term.zh} (${term.pinyin}) · ZHI TECH`, description: `${term.zh} · ${term.pinyin} · ${term.ar} · ${term.en}` };
}

export default async function TermPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const term = getTerm(slug);
  if (!term) notFound();
  const dict = await getDictionary(lang);
  const l = dict.learn;
  const related = term.related.map(getTerm).filter((t) => t !== undefined);
  const tools = term.tools.map((s) => TOOLS.find((t) => t.slug === s)).filter((t) => t !== undefined);

  return (
    <div className="sec tp">
      <div className="wrap">
        <a className="tp-back" href={`/${lang}/learn/vocabulary`}>{lang === "ar" ? "→ " : "← "}{l.back}</a>

        <header className="tp-head term-head">
          <p className="tool-co">{l.domains[term.domain]} · {l.suggestedLevel}: {l.levels[term.level]}</p>
          <h1 lang="zh-Hans" className="term-big">{term.zh}</h1>
          <p className="term-py-big" lang="zh-Latn-pinyin">{term.pinyin}</p>
          <p className="term-meaning-big">
            <span dir="rtl" lang="ar">{term.ar}</span>
            <span className="muted" lang="en" dir="ltr">{term.en}</span>
          </p>
          <div className="tp-actions">
            <ListenButton text={term.zh} label={l.listen} />
            <AddToDictionaryButton slug={term.slug} lang={lang} dict={dict} />
          </div>
        </header>

        {term.status !== "verified" && (
          <div className="detail tp-review" role="note">
            <b>{dict.toolPage.reviewTitle}</b>
            <span>{l.reviewText}</span>
          </div>
        )}

        <section className="tp-related" style={{ marginTop: 40 }}>
          <h2 className="sec-title">{l.examples}</h2>
          <ul className="ex-list">
            {term.examples.map((e) => (
              <li key={e.zh} className="tp-card">
                <div className="ex-zh-row">
                  <p className="ex-zh" lang="zh-Hans">{e.zh}</p>
                  <ListenButton text={e.zh} label={l.listenExample} small />
                </div>
                <p className="ex-py" lang="zh-Latn-pinyin">{e.pinyin}</p>
                <p dir="rtl" lang="ar">{e.ar}</p>
                <p className="muted" dir="ltr" lang="en">{e.en}</p>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="tp-related">
            <h2 className="sec-title">{l.related}</h2>
            <div className="chips" role="list">
              {related.map((r) => (
                <a key={r.slug} role="listitem" className="chip" href={`/${lang}/learn/vocabulary/${r.slug}`}>
                  <span lang="zh-Hans">{r.zh}</span>
                  <span className="muted" style={{ marginInlineStart: 8 }}>{lang === "ar" ? r.ar : lang === "zh" ? r.pinyin : r.en}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {tools.length > 0 && (
          <section className="tp-related">
            <h2 className="sec-title">{l.tools}</h2>
            <div className="tool-grid">
              {tools.map((t) => <ToolCard key={t.slug} tool={t} lang={lang} dict={dict} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
