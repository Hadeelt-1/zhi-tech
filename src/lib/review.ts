// Periodic review: a simple spaced-review schedule (Leitner boxes).
// Pure functions, so the rules can be tested and printed on the page.

/** Days until the next review for each box (box 1 … box 5). */
export const BOX_DAYS = [1, 3, 7, 14, 30] as const;
/** Questions in one review round. */
export const ROUND_SIZE = 10;

export type ReviewRow = { term_slug: string; box: number; due_on: string; correct_count: number; wrong_count: number };

/** Adds days to a YYYY-MM-DD date (calendar arithmetic in UTC, so no time-zone drift). */
export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Correct → one box up (max 5); wrong → back to box 1. A term never reviewed counts as box 0. */
export function nextReview(prev: ReviewRow | undefined, slug: string, ok: boolean, today: string): ReviewRow {
  const box = ok ? Math.min(5, (prev?.box ?? 0) + 1) : 1;
  return {
    term_slug: slug,
    box,
    due_on: addDays(today, BOX_DAYS[box - 1]),
    correct_count: (prev?.correct_count ?? 0) + (ok ? 1 : 0),
    wrong_count: (prev?.wrong_count ?? 0) + (ok ? 0 : 1),
  };
}

/**
 * Terms due today: never reviewed, or their date has come. Most overdue first, then terms never
 * reviewed (in the order given, i.e. lesson order), so older material is not forgotten.
 */
export function dueTerms(eligible: string[], rows: Record<string, ReviewRow>, today: string): string[] {
  const overdue = eligible.filter((s) => rows[s] && rows[s].due_on <= today).sort((a, b) => rows[a].due_on.localeCompare(rows[b].due_on));
  const fresh = eligible.filter((s) => !rows[s]);
  return [...overdue, ...fresh];
}

/** The earliest upcoming review date among eligible terms, or null. */
export function nextDueDate(eligible: string[], rows: Record<string, ReviewRow>, today: string): string | null {
  const dates = eligible.flatMap((s) => (rows[s] && rows[s].due_on > today ? [rows[s].due_on] : [])).sort();
  return dates[0] ?? null;
}
