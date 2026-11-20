import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLesson, LESSONS, nextLesson } from "@/content/lessons";
import { getTerm } from "@/content/terms";
import LessonPlayer from "@/components/learn/LessonPlayer";
import { fmt } from "@/lib/text";

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson || !hasLocale(lang)) return {};
  return { title: `${lesson.title[lang]} · ZHI TECH`, description: lesson.intro[lang] };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const dict = await getDictionary(lang);
  const terms = lesson.terms.map(getTerm).filter((t) => t !== undefined);
  const next = nextLesson(slug);

  return (
    <div className="sec tp">
      <div className="wrap">
        <a className="tp-back" href={`/${lang}/learn/lessons`}>{lang === "ar" ? "→ " : "← "}{dict.lessons.allLessons}</a>
        <header className="tp-head" style={{ marginBottom: 32 }}>
          <p className="tool-co">{fmt(dict.lessons.lesson, { n: lesson.order })}</p>
          <h1>{lesson.title[lang]}</h1>
          <p className="sub">{lesson.intro[lang]}</p>
        </header>
        <LessonPlayer lesson={lesson} terms={terms} lang={lang} dict={dict} nextHref={next ? `/${lang}/learn/lessons/${next.slug}` : null} />
      </div>
    </div>
  );
}
