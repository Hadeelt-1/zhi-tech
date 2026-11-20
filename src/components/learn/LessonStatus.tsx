"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { fmt } from "@/lib/text";
import { useLessonProgress } from "./useLessonProgress";

/** "Completed · best score" badge for signed-in users; nothing for visitors. */
export default function LessonStatus({ slug, dict }: { slug: string; dict: Dictionary }) {
  const { rows } = useLessonProgress();
  const p = rows[slug];
  if (!p) return null;
  return <span className="pill pill-done">{dict.lessons.done} · {fmt(dict.lessons.best, { s: p.best })}</span>;
}
