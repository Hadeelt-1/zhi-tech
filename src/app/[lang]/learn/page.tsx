import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { LESSONS } from "@/content/lessons";
import { TERMS } from "@/content/terms";
import { fmt } from "@/lib/text";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.learnHub.title} · ZHI TECH`, description: dict.learnHub.sub };
}

export default async function LearnHub({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const h = dict.learnHub;
  return (
    <div className="sec">
      <div className="wrap">
        <header className="ex-head">
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>{h.title}</h1>
          <p className="sub">{h.sub}</p>
        </header>
        <div className="tool-grid">
          <article className="tool">
            <h2 style={{ fontSize: 26 }}><a className="tool-name" href={`/${lang}/learn/lessons`}>{dict.lessons.title}</a></h2>
            <p>{h.lessonsDesc}</p>
            <footer className="tool-foot"><small>{LESSONS.length} · {dict.lessons.title}</small></footer>
          </article>
          <article className="tool">
            <h2 style={{ fontSize: 26 }}><a className="tool-name" href={`/${lang}/learn/vocabulary`}>{dict.learn.vocabTitle}</a></h2>
            <p>{h.vocabDesc}</p>
            <footer className="tool-foot"><small>{fmt(dict.lessons.terms, { n: TERMS.length })}</small></footer>
          </article>
        </div>
        <div className="detail" style={{ marginTop: 24 }}>
          <b>{h.nextTitle}</b>
          <span>{h.nextText}</span>
        </div>
      </div>
    </div>
  );
}
