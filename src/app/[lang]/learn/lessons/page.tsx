import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { LESSONS } from "@/content/lessons";
import LessonStatus from "@/components/learn/LessonStatus";
import { fmt } from "@/lib/text";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.lessons.title} · ZHI TECH`, description: dict.lessons.sub };
}

export default async function LessonsPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const L = dict.lessons;
  return (
    <div className="sec">
      <div className="wrap">
        <header className="ex-head">
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>{L.title}</h1>
          <p className="sub">{L.sub}</p>
        </header>
        <p className="note" style={{ marginTop: 0, marginBottom: 20 }}>{L.reviewNote}</p>
        <ol className="lesson-list">
          {LESSONS.map((l) => (
            <li key={l.slug}>
              <article className="tool lesson-card">
                <span className="lesson-num" aria-hidden="true">{l.order}</span>
                <div className="lesson-body">
                  <p className="tool-co">{fmt(L.lesson, { n: l.order })}</p>
                  <h2><a className="tool-name" href={`/${lang}/learn/lessons/${l.slug}`}>{l.title[lang]}</a></h2>
                  <p>{l.intro[lang]}</p>
                  <div className="lesson-meta">
                    <small>{fmt(L.terms, { n: l.terms.length })}</small>
                    <LessonStatus slug={l.slug} dict={dict} />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
