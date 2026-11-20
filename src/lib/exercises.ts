// Builds a lesson's exercises: one of each of the five types from the brief.
// Uses a seeded shuffle so the first round is identical on the server and in the browser;
// "Try again" passes a new seed for a different order.

import type { Locale } from "@/i18n/config";
import { TERMS, type Term } from "@/content/terms";

export type ExerciseKind = "mc" | "zh2ar" | "ar2zh" | "fill" | "order";
export const KINDS: ExerciseKind[] = ["mc", "zh2ar", "ar2zh", "fill", "order"];

export type Choice = { id: string; text: string; lang: "zh" | "ar" | "en"; zhLatin?: string };

export type Exercise =
  | { kind: "mc" | "zh2ar" | "ar2zh" | "fill"; term: Term; prompt: string; promptLang: "zh" | "ar"; hint?: string; choices: Choice[]; answer: string }
  | { kind: "order"; term: Term; chunks: string[]; answer: string[]; translation: string };

function rng(seedText: string) {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function shuffle<T>(list: T[], rand: () => number): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Two wrong options: prefer terms from the same field, so the choice is not trivial. */
function distractors(term: Term, rand: () => number) {
  const same = shuffle(TERMS.filter((t) => t.slug !== term.slug && t.domain === term.domain), rand);
  const other = shuffle(TERMS.filter((t) => t.slug !== term.slug && t.domain !== term.domain), rand);
  return [...same, ...other].slice(0, 2);
}

/** The meaning shown to the learner: Arabic for the Arabic site, English otherwise. */
const meaning = (t: Term, lang: Locale) => (lang === "ar" ? t.ar : t.en);
const sentenceMeaning = (t: Term, lang: Locale) => (lang === "ar" ? t.examples[0].ar : t.examples[0].en);

/** One exercise of the given kind for one term. */
function makeExercise(kind: ExerciseKind, term: Term, lang: Locale, rand: () => number): Exercise {
  const meaningLang = lang === "ar" ? "ar" : "en";
  const wrong = distractors(term, rand);
  const ex = term.examples[0];

  if (kind === "order") {
    let chunks = shuffle(ex.order, rand);
    // Never show the sentence already in order.
    if (chunks.join("") === ex.order.join("")) chunks = [...chunks.slice(1), chunks[0]];
    return { kind, term, chunks, answer: ex.order, translation: sentenceMeaning(term, lang) };
  }

  const options = shuffle([term, ...wrong], rand);
  switch (kind) {
    case "mc":
      return {
        kind, term, prompt: term.zh, promptLang: "zh" as const, hint: term.pinyin, answer: term.slug,
        choices: options.map((t) => ({ id: t.slug, text: meaning(t, lang), lang: meaningLang })),
      };
    case "zh2ar":
      return {
        kind, term, prompt: ex.zh, promptLang: "zh" as const, hint: ex.pinyin, answer: term.slug,
        choices: options.map((t) => ({ id: t.slug, text: sentenceMeaning(t, lang), lang: meaningLang })),
      };
    case "ar2zh":
      return {
        kind, term, prompt: term.ar, promptLang: "ar" as const, answer: term.slug,
        choices: options.map((t) => ({ id: t.slug, text: t.zh, lang: "zh" as const, zhLatin: t.pinyin })),
      };
    default:
      return {
        kind, term, prompt: ex.zh.replace(term.zh, "＿＿＿"), promptLang: "zh" as const, hint: sentenceMeaning(term, lang), answer: term.slug,
        choices: options.map((t) => ({ id: t.slug, text: t.zh, lang: "zh" as const, zhLatin: t.pinyin })),
      };
  }
}

export function buildExercises(terms: Term[], lang: Locale, seed: string): Exercise[] {
  const rand = rng(seed);
  const pool = shuffle(terms, rand);
  return KINDS.map((kind, i) => makeExercise(kind, pool[i % pool.length], lang, rand));
}

/**
 * Review round: one question per term, in random order, cycling through the five exercise types
 * from a random starting type (so a term is not always tested the same way).
 */
export function buildReview(terms: Term[], lang: Locale, seed: string): Exercise[] {
  const rand = rng(seed);
  const pool = shuffle(terms, rand);
  const start = Math.floor(rand() * KINDS.length);
  return pool.map((term, i) => makeExercise(KINDS[(start + i) % KINDS.length], term, lang, rand));
}

/** `n` items picked at random (repeatable for the same seed). */
export function pickRandom<T>(list: T[], n: number, seed: string): T[] {
  return shuffle(list, rng(seed)).slice(0, n);
}
