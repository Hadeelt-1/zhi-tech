import type { Dictionary } from "@/i18n/get-dictionary";

export type TopLinkKey = keyof Dictionary["nav"]["top"];

/**
 * Main navigation: direct links shown in the header (no dropdowns).
 * `href` is the path after the language prefix ("" = home); "#id" links to a homepage section.
 * Add a link here only when its page or section actually exists.
 */
export const TOP_LINKS: { key: TopLinkKey; href: string }[] = [
  { key: "home", href: "" },
  { key: "tools", href: "/explore" },
  { key: "companies", href: "/explore/companies" },
  { key: "learn", href: "/learn" },
  { key: "build", href: "#build" },
];

/** Homepage sections in page order (scroll spy and footer links). */
export const HOME_SECTIONS = [
  { id: "paths", label: "paths" },
  { id: "try", label: "try" },
  { id: "tools", label: "tools" },
  { id: "categories", label: "cats" },
  { id: "companies", label: "comp" },
  { id: "build", label: "build" },
] as const satisfies readonly { id: string; label: keyof Dictionary["sections"] }[];

/** Which header link is current, from the path and (on the homepage) the section in view. */
export function currentLink(pathname: string, sectionInView: string | null): TopLinkKey | null {
  const rest = pathname.replace(/^\/(ar|en|zh)(?=\/|$)/, "");
  if (rest.startsWith("/learn")) return "learn";
  if (rest.startsWith("/explore/companies")) return "companies";
  if (rest.startsWith("/explore")) return "tools";
  if (rest === "" || rest === "/") {
    if (sectionInView === "try") return "learn";
    if (sectionInView === "build") return "build";
    if (sectionInView === "tools") return "tools";
    if (sectionInView === "companies") return "companies";
    return "home";
  }
  return null;
}
