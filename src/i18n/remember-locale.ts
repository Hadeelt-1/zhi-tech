import { LOCALE_COOKIE, type Locale } from "./config";

/** Saves the visitor's language choice so "/" opens it next time (see proxy.ts). */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
