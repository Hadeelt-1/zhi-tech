import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { categoryHref, type CategorySlug } from "@/content/categories";
import { TOOLS } from "@/content/tools";
import { COMPANIES } from "@/content/companies";
import { fmt } from "@/lib/text";

export const countIn = (slug: CategorySlug) =>
  slug === "companies" ? COMPANIES.length : TOOLS.filter((t) => t.categories.includes(slug)).length;

export default function CategoryCard({ slug, index, lang, dict }: { slug: CategorySlug; index: number; lang: Locale; dict: Dictionary }) {
  return (
    <article className="tool">
      <h3>
        <a className="tool-name" href={categoryHref(lang, slug)}>{dict.cats.items[index]}</a>
      </h3>
      <p>{dict.cats.desc[index]}</p>
      <footer className="tool-foot">
        <small>{fmt(dict.categories.count, { n: countIn(slug) })}</small>
      </footer>
    </article>
  );
}
