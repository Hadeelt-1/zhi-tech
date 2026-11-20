"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Lesson } from "@/content/lessons";
import type { Term } from "@/content/terms";
import { buildExercises, type Exercise } from "@/lib/exercises";
import { supabaseConfigured } from "@/lib/supabase/client";
import { fmt } from "@/lib/text";
import ListenButton from "./ListenButton";
import ExerciseQuestion from "./ExerciseQuestion";
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
  const [answered, setAnswered] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "failed">("idle");

  const begin = (r: number) => {
    setRound(r);
    setQi(0);
    setScore(0);
    setAnswered(false);
    setSaveState("idle");
    setStage("practice");
  };

  const ex: Exercise | undefined = exercises[qi];

  const answer = (ok: boolean) => {
    setAnswered(true);
    if (ok) setScore((s) => s + 1);
  };

  const next = async () => {
    if (qi + 1 < exercises.length) {
      setQi(qi + 1);
      setAnswered(false);
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
              {!user ? <a href={`/${lang}/login`}>{L.loginToSave}</a> : saveState === "saved" ? <>{L.saved} <a href={`/${lang}/dashboard`}>{dict.dash.open}</a></> : saveState === "failed" ? L.saveFailed : dict.auth.wait}
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
  const progress = ((qi + (answered ? 1 : 0)) / exercises.length) * 100;

  return (
    <section className="quiz">
      <div className="qmeta">
        <span>{fmt(L.question, { n: qi + 1, m: exercises.length })}</span>
        <span>{L.kinds[ex.kind]}</span>
      </div>
      <div className="bar"><i style={{ width: `${progress}%` }} /></div>
      <ExerciseQuestion key={`${round}-${qi}`} ex={ex} lang={lang} dict={dict} isLast={qi + 1 >= exercises.length} onAnswer={answer} onNext={next} />
    </section>
  );
}
