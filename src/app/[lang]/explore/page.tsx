import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { TOOLS } from "@/content/tools";
import ExploreBrowser from "@/components/explore/ExploreBrowser";
import ToolCard from "@/components/home/ToolCard";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.explore.title} · ZHI TECH`, description: dict.explore.sub };
}

export default async function ExplorePage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="sec">
      <div className="wrap">
        <header className="ex-head">
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>{dict.explore.title}</h1>
          <p className="sub">{dict.explore.sub}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <a className="btn pri" href={`/${lang}/explore/compare`}>{dict.compare.button}</a>
            <a className="btn" href={`/${lang}/explore/categories`}>{dict.categories.all}</a>
          </div>
        </header>
        <p className="note" style={{ marginTop: 0, marginBottom: 20 }}>{dict.tools.note}</p>
        {/* Filters read the URL, so they render in the browser; the fallback lists everything. */}
        <Suspense
          fallback={
            <div className="tool-grid">
              {TOOLS.map((tool) => <ToolCard key={tool.slug} tool={tool} lang={lang} dict={dict} />)}
            </div>
          }
        >
          <ExploreBrowser lang={lang} dict={dict} />
        </Suspense>
      </div>
    </div>
  );
}
