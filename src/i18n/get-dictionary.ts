import type { Locale } from "./config";
import en from "./dictionaries/en.json";

// The English file defines the shape every language must follow.
export type Dictionary = typeof en;

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  zh: () => import("./dictionaries/zh.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => loaders[locale]();
