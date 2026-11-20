import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { TERMS } from "@/content/terms";
import VocabularyBrowser from "@/components/learn/VocabularyBrowser";
import TermCard from "@/components/learn/TermCard";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.learn.vocabTitle} · ZHI TECH`, description: dict.learn.vocabSub };
}

export default async function VocabularyPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <div className="sec">
      <div className="wrap">
        <header className="ex-head">
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>{dict.learn.vocabTitle}</h1>
          <p className="sub">{dict.learn.vocabSub}</p>
        </header>
        <p className="note" style={{ marginTop: 0, marginBottom: 20 }}>{dict.learn.reviewText}</p>
        {/* Filters read the URL, so they render in the browser; the fallback lists every term. */}
        <Suspense
          fallback={<div className="tool-grid">{TERMS.map((t) => <TermCard key={t.slug} term={t} lang={lang} dict={dict} />)}</div>}
        >
          <VocabularyBrowser lang={lang} dict={dict} />
        </Suspense>
      </div>
    </div>
  );
}
