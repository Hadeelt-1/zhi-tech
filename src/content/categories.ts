import type { Locale } from "@/i18n/config";

// The seven categories from the brief. Labels and descriptions live in the
// dictionaries (cats.items / cats.desc) at the same index.
// A tool joins a category only when its sourced facts support it
// (e.g. "local-ai" = the official source says it can be run locally).

export type CategorySlug =
  | "ai-models"
  | "developer-tools"
  | "chinese-apps"
  | "local-ai"
  | "ai-agents"
  | "open-source"
  | "companies";

export const CATEGORIES: { slug: CategorySlug; index: number }[] = [
  { slug: "ai-models", index: 0 },
  { slug: "developer-tools", index: 1 },
  { slug: "chinese-apps", index: 2 },
  { slug: "local-ai", index: 3 },
  { slug: "ai-agents", index: 4 },
  { slug: "open-source", index: 5 },
  { slug: "companies", index: 6 },
];

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const categoryByIndex = (index: number) => CATEGORIES.find((c) => c.index === index);

/** The companies category is the companies page; the others have their own page. */
export const categoryHref = (lang: Locale, slug: CategorySlug) =>
  slug === "companies" ? `/${lang}/explore/companies` : `/${lang}/explore/categories/${slug}`;
