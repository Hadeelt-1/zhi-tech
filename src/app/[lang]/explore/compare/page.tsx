import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import CompareView from "@/components/explore/CompareView";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.compare.title} · ZHI TECH`, description: dict.compare.sub };
}

export default async function ComparePage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="sec">
      <div className="wrap">
        <header className="ex-head">
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>{dict.compare.title}</h1>
          <p className="sub">{dict.compare.sub}</p>
        </header>
        <p className="note" style={{ marginTop: 0, marginBottom: 20 }}>{dict.tools.note}</p>
        {/* The selection is read from the URL, so it renders in the browser. */}
        <Suspense fallback={null}>
          <CompareView lang={lang} dict={dict} />
        </Suspense>
      </div>
    </div>
  );
}
