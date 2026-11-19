import type { KeyboardEvent } from "react";
import type { Locale } from "@/i18n/config";

/** Fills {placeholders} in a translated string. */
export function fmt(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

/** Arrow that points "forward" in the reading direction. */
export const forwardArrow = (lang: Locale) => (lang === "ar" ? " ←" : " →");

/** Arrow-key / Home / End handling for a tab list, aware of RTL. */
export function handleTabKeys(
  e: KeyboardEvent<HTMLElement>,
  count: number,
  current: number,
  select: (index: number) => void,
) {
  const rtl = document.documentElement.dir === "rtl";
  let next: number | null = null;
  if (e.key === "ArrowRight") next = rtl ? current - 1 : current + 1;
  else if (e.key === "ArrowLeft") next = rtl ? current + 1 : current - 1;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = count - 1;
  if (next === null) return;
  e.preventDefault();
  const index = (next + count) % count;
  select(index);
  const tabs = e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
  tabs[index]?.focus();
}
