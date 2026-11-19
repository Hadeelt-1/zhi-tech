import type { Dictionary } from "@/i18n/get-dictionary";

export type NavGroup = keyof Dictionary["nav"]["groups"];
export type NavItemKey = keyof Dictionary["nav"]["items"];

/**
 * Main navigation. An item with `section` links to that homepage section;
 * an item without it is not built yet and shows "Coming soon" (not clickable).
 * When a page ships, give the item an `href` to its route instead.
 */
export type NavEntry = { item: NavItemKey; section?: string } | "divider";

export const NAV: Record<NavGroup, NavEntry[]> = {
  learn: [
    { item: "quiz", section: "try" },
    "divider",
    { item: "lessons" },
    { item: "vocab" },
    { item: "practice" },
    { item: "tutor" },
    { item: "dict" },
  ],
  explore: [
    { item: "cats", section: "categories" },
    { item: "comp", section: "companies" },
    { item: "tools", section: "tools" },
    "divider",
    { item: "search" },
    { item: "compare" },
    { item: "agents" },
    { item: "assist" },
  ],
  build: [
    { item: "steps", section: "build" },
    "divider",
    { item: "projects" },
    { item: "play" },
    { item: "dash" },
  ],
};

/** Which nav group is "current" while a homepage section is on screen. */
export const SECTION_GROUP: Record<string, NavGroup> = {
  try: "learn",
  tools: "explore",
  categories: "explore",
  companies: "explore",
  build: "build",
};

/** Homepage sections in page order (scroll spy and footer links). */
export const HOME_SECTIONS = [
  { id: "paths", label: "paths" },
  { id: "try", label: "try" },
  { id: "tools", label: "tools" },
  { id: "categories", label: "cats" },
  { id: "companies", label: "comp" },
  { id: "build", label: "build" },
] as const satisfies readonly { id: string; label: keyof Dictionary["sections"] }[];
