import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CATEGORIES } from "@/content/categories";
import CategoryCard from "@/components/explore/CategoryCard";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.categories.title} · ZHI TECH`, description: dict.categories.sub };
}

export default async function CategoriesPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="sec">
      <div className="wrap">
        <header className="ex-head">
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>{dict.categories.title}</h1>
          <p className="sub">{dict.categories.sub}</p>
        </header>
        <div className="tool-grid">
          {CATEGORIES.map((c) => <CategoryCard key={c.slug} slug={c.slug} index={c.index} lang={lang} dict={dict} />)}
        </div>
      </div>
    </div>
  );
}
