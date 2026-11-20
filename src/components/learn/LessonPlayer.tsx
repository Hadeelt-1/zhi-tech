"use client";

import { useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Lesson } from "@/content/lessons";
import type { Term } from "@/content/terms";
import { buildExercises, type Exercise } from "@/lib/exercises";
import { supabaseConfigured } from "@/lib/supabase/client";
import { fmt } from "@/lib/text";
import ListenButton from "./ListenButton";
import { useLessonProgress } from "./useLessonProgress";

type Stage = "study" | "practice" | "result";

export default function LessonPlayer({
  lesson, terms, lang, dict, nextHref,
}: { lesson: Lesson; terms: Term[]; lang: Locale; dict: Dictionary; nextHref: string | null }) {
  const L = dict.lessons;
  const { user, rows, save } = useLessonProgress();
  const [stage, setStage] = useState<Stage>("study");
  const [round, setRound] = useState(0);
  const exercises = useMemo(() => buildExercises(terms, lang, `${lesson.slug}:${round}`), [terms, lang, lesson.slug, round]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [ordered, setOrdered] = useState<number[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "failed">("idle");
  const nextBtn = useRef<HTMLButtonElement>(null);
  const meaning = (t: Term) => (lang === "ar" ? t.ar : t.en);

  const begin = (r: number) => {
    setRound(r);
    setQi(0);
    setScore(0);
    setPicked(null);
    setOrdered([]);
    setChecked(null);
    setSaveState("idle");
    setStage("practice");
  };

  const ex: Exercise | undefined = exercises[qi];

  const check = (ok: boolean) => {
    setChecked(ok);
    if (ok) setScore((s) => s + 1);
    requestAnimationFrame(() => nextBtn.current?.focus());
  };

  const next = async () => {
    if (qi + 1 < exercises.length) {
      setQi(qi + 1);
      setPicked(null);
      setOrdered([]);
      setChecked(null);
      return;
    }
    setStage("result");
    if (user) {
      const pct = Math.round((score / exercises.length) * 100);
      setSaveState((await save(lesson.slug, pct)) ? "saved" : "failed");
    }
  };

  const best = rows[lesson.slug]?.best;

  if (stage === "study") {
    return (
      <section>
        <h2 className="sec-title">{L.studyTitle}</h2>
        <p style={{ marginTop: -16, marginBottom: 20 }}>{L.studyText}</p>
        <ul className="ex-list">
          {terms.map((t) => (
            <li key={t.slug} className="tp-card study-card">
              <div className="ex-zh-row">
                <div>
                  <p className="study-zh" lang="zh-Hans">{t.zh}</p>
                  <p className="ex-py" lang="zh-Latn-pinyin">{t.pinyin}</p>
                </div>
                <ListenButton text={t.zh} label={dict.learn.listen} small />
              </div>
              <p className="term-meaning"><span dir="rtl" lang="ar">{t.ar}</span><span className="muted" dir="ltr" lang="en">{t.en}</span></p>
              <div className="study-ex">
                <p lang="zh-Hans" className="ex-zh" style={{ fontSize: 20 }}>{t.examples[0].zh}</p>
                <p className="ex-py">{t.examples[0].pinyin}</p>
                <p className="muted">{lang === "ar" ? t.examples[0].ar : t.examples[0].en}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="tp-actions" style={{ marginTop: 24 }}>
          <button type="button" className="btn pri" onClick={() => begin(round)}>{L.practice}</button>
          {best !== undefined && <span className="pill" style={{ alignSelf: "center" }}>{fmt(L.best, { s: best })}</span>}
        </div>
      </section>
    );
  }

  if (stage === "result") {
    return (
      <section className="quiz">
        <div className="qres">
          <div className="big">{score} / {exercises.length}</div>
          <p>{fmt(L.result, { s: score, m: exercises.length })}</p>
          {supabaseConfigured && (
            <p className="note" style={{ marginTop: 0 }}>
              {!user ? <a href={`/${lang}/login`}>{L.loginToSave}</a> : saveState === "saved" ? L.saved : saveState === "failed" ? L.saveFailed : dict.auth.wait}
            </p>
          )}
          <div className="tp-actions" style={{ justifyContent: "center" }}>
            <button type="button" className="btn" onClick={() => begin(round + 1)}>{L.retry}</button>
            {nextHref ? <a className="btn pri" href={nextHref}>{L.nextLesson}</a> : <a className="btn pri" href={`/${lang}/learn/lessons`}>{L.allLessons}</a>}
          </div>
        </div>
      </section>
    );
  }

  if (!ex) return null;
  const progress = ((qi + (checked !== null ? 1 : 0)) / exercises.length) * 100;

  return (
    <section className="quiz">
      <div className="qmeta">
        <span>{fmt(L.question, { n: qi + 1, m: exercises.length })}</span>
        <span>{L.kinds[ex.kind]}</span>
      </div>
      <div className="bar"><i style={{ width: `${progress}%` }} /></div>

      {ex.kind === "order" ? (
        <>
          <p className="muted" style={{ marginBottom: 12 }}>{L.meaning}: <span>{ex.translation}</span></p>
          <div className="order-answer" lang="zh-Hans" aria-live="polite">
            {ordered.map((idx, pos) => (
              <button key={`${idx}-${pos}`} type="button" className="chip" disabled={checked !== null} onClick={() => setOrdered(ordered.filter((_, p) => p !== pos))}>
                {ex.chunks[idx]}
              </button>
            ))}
          </div>
          <p className="note" style={{ marginTop: 8 }}>{L.tapWords}</p>
          <div className="chips" lang="zh-Hans" style={{ marginTop: 12 }}>
            {ex.chunks.map((c, idx) =>
              ordered.includes(idx) ? null : (
                <button key={idx} type="button" className="chip order-chip" disabled={checked !== null} onClick={() => setOrdered([...ordered, idx])}>{c}</button>
              ),
            )}
          </div>
          {checked === null && (
            <div style={{ marginTop: 16 }}>
              <button type="button" className="btn pri" disabled={ordered.length !== ex.chunks.length} onClick={() => check(ordered.map((i) => ex.chunks[i]).join("") === ex.answer.join(""))}>
                {L.check}
              </button>
            </div>
          )}
          <div className="fb" role="status" aria-live="polite">
            {checked === true && L.correct}
            {checked === false && <>{fmt(L.wrong, { a: "" })}<span lang="zh-Hans">{ex.answer.join("")}</span></>}
          </div>
        </>
      ) : (
        <>
          <div className={ex.promptLang === "zh" ? "qterm" : "qterm qterm-ar"} lang={ex.promptLang === "zh" ? "zh-Hans" : "ar"} dir={ex.promptLang === "ar" ? "rtl" : undefined} style={ex.kind === "zh2ar" || ex.kind === "fill" ? { fontSize: "clamp(26px, 3.4vw, 36px)" } : undefined}>
            {ex.prompt}
          </div>
          {ex.hint && <div className="qpy">{ex.hint}</div>}
          <div className="opts" role="group" aria-label={L.kinds[ex.kind]} style={ex.promptLang === "ar" ? { marginTop: 20 } : undefined}>
            {ex.choices.map((c) => {
              const cls = checked !== null ? (c.id === ex.answer ? " ok" : c.id === picked ? " bad" : "") : "";
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`opt${cls}`}
                  disabled={checked !== null}
                  lang={c.lang === "zh" ? "zh-Hans" : c.lang}
                  dir={c.lang === "ar" ? "rtl" : undefined}
                  onClick={() => {
                    setPicked(c.id);
                    check(c.id === ex.answer);
                  }}
                >
                  <span className={c.lang === "zh" ? "opt-zh" : undefined}>{c.text}</span>
                  {c.zhLatin && checked !== null && <span className="muted" style={{ marginInlineStart: 10, fontWeight: 500 }}>{c.zhLatin}</span>}
                </button>
              );
            })}
          </div>
          <div className="fb" role="status" aria-live="polite">
            {checked === true && L.correct}
            {checked === false && fmt(L.wrong, { a: ex.kind === "zh2ar" ? (lang === "ar" ? ex.term.examples[0].ar : ex.term.examples[0].en) : ex.kind === "mc" ? meaning(ex.term) : ex.term.zh })}
          </div>
        </>
      )}

      {checked !== null && (
        <div style={{ marginTop: 12 }}>
          <button ref={nextBtn} type="button" className="btn pri" onClick={next}>
            {qi + 1 < exercises.length ? L.next : L.finish}
          </button>
        </div>
      )}
    </section>
  );
}
