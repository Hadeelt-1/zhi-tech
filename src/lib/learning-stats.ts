// Learning dashboard numbers, all calculated from the user's real results.
// The rules are shown on the dashboard, so nothing here is a hidden formula.

export const PASS_SCORE = 60;

export type LessonResult = { best: number; attempts: number };
export type LevelKey = "notStarted" | "beginner" | "intermediate" | "advanced";
export type BadgeKey = "firstLesson" | "perfect" | "halfway" | "allLessons" | "explorer" | "persistent" | "streak3";

export type Stats = {
  passed: number;
  total: number;
  progressPct: number;
  points: number;
  maxPoints: number;
  level: LevelKey;
  attempts: number;
  badges: Record<BadgeKey, boolean>;
};

/** Level follows the number of lessons passed (≥ PASS_SCORE). */
export function levelFor(passed: number, total: number): LevelKey {
  if (passed === 0) return "notStarted";
  if (passed <= Math.ceil(total / 3)) return "beginner";
  if (passed < total) return "intermediate";
  return "advanced";
}

/** Longest run of consecutive days with at least one attempt, counted in the browser's local time. */
export function longestStreak(days: string[]): number {
  const unique = Array.from(new Set(days)).sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of unique) {
    const t = Date.parse(`${d}T00:00:00Z`) / 86400000;
    run = prev !== null && t - prev === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  return best;
}

/** Local calendar day "YYYY-MM-DD" for a timestamp. */
export function localDay(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function computeStats(
  results: Record<string, LessonResult>,
  lessonSlugs: string[],
  favoritesCount: number,
  activityDays: string[],
): Stats {
  const total = lessonSlugs.length;
  const scores = lessonSlugs.map((s) => results[s]?.best ?? 0);
  const passed = scores.filter((s) => s >= PASS_SCORE).length;
  const attempts = lessonSlugs.reduce((n, s) => n + (results[s]?.attempts ?? 0), 0);
  const points = scores.reduce((a, b) => a + b, 0);
  return {
    passed,
    total,
    progressPct: total ? Math.round((passed / total) * 100) : 0,
    points,
    maxPoints: total * 100,
    level: levelFor(passed, total),
    attempts,
    badges: {
      firstLesson: passed >= 1,
      perfect: scores.some((s) => s === 100),
      halfway: passed >= Math.ceil(total / 2),
      allLessons: total > 0 && passed === total,
      explorer: favoritesCount >= 3,
      persistent: attempts >= 10,
      streak3: longestStreak(activityDays) >= 3,
    },
  };
}

/** The 7 days of the current week, starting Sunday (Arabic site) or Monday (others). */
export function currentWeek(today: Date, startsSunday: boolean): Date[] {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const offset = startsSunday ? start.getDay() : (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}
