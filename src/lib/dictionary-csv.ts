/** CSV export for the personal dictionary. Pure functions, so they can be tested without a browser. */

export type CsvRow = { zh: string; pinyin: string; ar: string; en: string; note: string; source: string };
export type CsvHeaders = CsvRow;

const COLUMNS: (keyof CsvRow)[] = ["zh", "pinyin", "ar", "en", "note", "source"];

/**
 * One cell: always quoted, inner quotes doubled.
 * A cell that starts with = + - @ (or a tab / carriage return) is prefixed with ' so
 * Excel and Google Sheets show it as text instead of running it as a formula.
 */
export function csvCell(value: string): string {
  let v = value.replace(/\r\n?/g, "\n");
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

/** Whole file: UTF-8 BOM (so Excel reads Arabic and Chinese correctly) and CRLF line endings. */
export function buildCsv(headers: CsvHeaders, rows: CsvRow[]): string {
  const lines = [headers, ...rows].map((r) => COLUMNS.map((c) => csvCell(r[c] ?? "")).join(","));
  return `﻿${lines.join("\r\n")}\r\n`;
}

/** True when the text contains Arabic letters (used to put a user's own meaning in the right column). */
export const hasArabic = (s: string) => /[؀-ۿݐ-ݿ]/.test(s);

/** True when the text contains at least one Chinese character. */
export const hasHan = (s: string) => /\p{Script=Han}/u.test(s);
