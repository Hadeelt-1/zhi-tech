import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CATEGORIES, categoryHref, getCategory } from "@/content/categories";
import { TOOLS } from "@/content/tools";
import ToolCard from "@/components/home/ToolCard";

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug !== "companies").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const cat = getCategory(slug);
  if (!cat || !hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.cats.items[cat.index]} · ZHI TECH`, description: dict.cats.desc[cat.index] };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const cat = getCategory(slug);
  if (!cat) notFound();
  // The companies category is the companies page.
  if (cat.slug === "companies") redirect(`/${lang}/explore/companies`);
  const dict = await getDictionary(lang);
  const c = dict.categories;
  const tools = TOOLS.filter((t) => t.categories.includes(cat.slug));

  return (
    <div className="sec tp">
      <div className="wrap">
        <a className="tp-back" href={`/${lang}/explore/categories`}>{lang === "ar" ? "→ " : "← "}{c.back}</a>
        <header className="tp-head" style={{ marginBottom: 28 }}>
          <h1>{dict.cats.items[cat.index]}</h1>
          <p className="sub">{dict.cats.desc[cat.index]}</p>
        </header>

        {tools.length ? (
          <>
            <p className="note" style={{ marginTop: 0, marginBottom: 20 }}>{dict.tools.note}</p>
            <div className="tool-grid">
              {tools.map((t) => <ToolCard key={t.slug} tool={t} lang={lang} dict={dict} />)}
            </div>
          </>
        ) : (
          <div className="panel">
            <div className="empty">
              <span className="pill">{dict.tools.badge}</span>
              <h2 style={{ fontSize: 24 }}>{c.empty}</h2>
              <p>{c.emptyText}</p>
            </div>
          </div>
        )}

        <section className="tp-related">
          <h2 className="sec-title">{c.others}</h2>
          <div className="chips" role="list">
            {CATEGORIES.filter((x) => x.slug !== cat.slug).map((x) => (
              <a key={x.slug} role="listitem" className="chip" href={categoryHref(lang, x.slug)}>{dict.cats.items[x.index]}</a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
