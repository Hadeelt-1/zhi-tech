// Supported languages. The URL prefix decides the language: /ar, /en, /zh.
export const locales = ["ar", "en", "zh"] as const;
export type Locale = (typeof locales)[number];

// Used when neither a saved choice nor the browser language matches.
export const defaultLocale: Locale = "ar";

// Cookie that remembers the visitor's last chosen language (read by proxy.ts).
export const LOCALE_COOKIE = "zhi-lang";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

export const htmlLang = (locale: Locale) => (locale === "zh" ? "zh-Hans" : locale);

export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  zh: "中文",
};
