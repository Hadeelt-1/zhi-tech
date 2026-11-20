"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LESSONS } from "@/content/lessons";
import { getTerm, type Term } from "@/content/terms";
import { buildReview, pickRandom, type Exercise } from "@/lib/exercises";
import { localDay } from "@/lib/learning-stats";
import { BOX_DAYS, ROUND_SIZE, dueTerms, nextDueDate } from "@/lib/review";
import { supabaseConfigured } from "@/lib/supabase/client";
import { fmt } from "@/lib/text";
import ExerciseQuestion from "./ExerciseQuestion";
import { useLessonProgress } from "./useLessonProgress";
import { usePersonalDictionary } from "./usePersonalDictionary";
import { useReviewSchedule } from "./useReviewSchedule";

type Round = { exercises: Exercise[]; scheduled: boolean; seed: string };

export default function ReviewPlayer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const R = dict.review;
  const L = dict.lessons;
  const progress = useLessonProgress();
  const mydict = usePersonalDictionary();
  const review = useReviewSchedule();

  const [round, setRound] = useState<Round | null>(null);
  const [count, setCount] = useState(0);
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<{ slug: string; ok: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "failed">("idle");

  if (!supabaseConfigured) return <p className="detail">{dict.auth.notConfigured}</p>;
  if (!review.ready) return <p className="muted" role="status">{dict.auth.wait}</p>;
  if (!review.user) {
    return (
      <div className="detail">
        <span>{R.signedOut}</span>
        <a className="btn pri" href={`/${lang}/login`} style={{ justifySelf: "start", marginTop: 12 }}>{dict.mydict.login}</a>
      </div>
    );
  }
  if (!review.loaded || !progress.loaded || !mydict.loaded) return <p className="muted" role="status">{R.loading}</p>;

  // Everything below runs in the browser after sign-in, so reading today's date here is safe.
  const today = localDay(new Date());
  // Terms you have met: from lessons you attempted (in lesson order), plus terms saved in your dictionary.
  const fromLessons = LESSONS.filter((l) => progress.rows[l.slug]).flatMap((l) => l.terms);
  const eligible = [...new Set([...fromLessons, ...mydict.savedSlugs])].filter((s) => getTerm(s));
  const due = dueTerms(eligible, review.rows, today);
  const upcoming = nextDueDate(eligible, review.rows, today);
  const fmtDate = (d: string) =>
    new Date(`${d}T12:00:00`).toLocaleDateString(lang === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : lang === "zh" ? "zh-CN" : "en-GB", { weekday: "long", day: "numeric", month: "long" });

  const start = (scheduled: boolean) => {
    const seed = `${today}:${count}`;
    const slugs = scheduled ? due.slice(0, ROUND_SIZE) : pickRandom(eligible, ROUND_SIZE, seed);
    const terms = slugs.map(getTerm).filter((t): t is Term => t !== undefined);
    setCount((c) => c + 1);
    setRound({ exercises: buildReview(terms, lang, seed), scheduled, seed });
    setQi(0);
    setAnswered(false);
    setResults([]);
    setDone(false);
    setSaveState("idle");
  };

  // ---- Overview ----
  if (!round) {
    return (
      <>
        {(review.loadFailed || mydict.loadFailed) && <p className="fb" role="alert">{R.loadFailed}</p>}
        {eligible.length === 0 ? (
          <div className="detail">
            <span>{R.nothingYet}</span>
            <a className="btn pri" href={`/${lang}/learn/lessons`} style={{ justifySelf: "start", marginTop: 12 }}>{R.toLessons}</a>
          </div>
        ) : (
          <>
            <div className="dash-stats">
              <div className="tp-card">
                <span className="dash-label">{R.dueToday}</span>
                <b className="dash-big">{due.length}</b>
              </div>
              <div className="tp-card">
                <span className="dash-label">{R.inReview}</span>
                <b className="dash-big">{eligible.length}</b>
              </div>
              <div className="tp-card">
                <span className="dash-label">{R.nextDate}</span>
                <b className="dash-big" style={{ fontSize: 22 }}>{due.length > 0 ? R.now : upcoming ? fmtDate(upcoming) : "—"}</b>
              </div>
            </div>
            <div className="tp-actions" style={{ marginTop: 24 }}>
              {due.length > 0 ? (
                <button type="button" className="btn pri" onClick={() => start(true)}>
                  {fmt(R.start, { n: Math.min(due.length, ROUND_SIZE) })}
                </button>
              ) : (
                <p className="detail" style={{ margin: 0 }}>{R.allDone}</p>
              )}
              {due.length === 0 && (
                <button type="button" className="btn" onClick={() => start(false)}>{R.extra}</button>
              )}
            </div>
          </>
        )}
        <section className="tp-related">
          <h2 className="sec-title">{R.rulesTitle}</h2>
          <ul className="tp-list">
            {R.rules.map((r) => <li key={r}>{fmt(r, { a: BOX_DAYS.join(" · "), n: ROUND_SIZE })}</li>)}
          </ul>
        </section>
      </>
    );
  }

  const total = round.exercises.length;
  const score = results.filter((r) => r.ok).length;

  // ---- Result ----
  if (done) {
    const missed = results.filter((r) => !r.ok).map((r) => getTerm(r.slug)).filter((t): t is Term => t !== undefined);
    return (
      <section className="quiz">
        <div className="qres">
          <div className="big">{score} / {total}</div>
          <p>{fmt(L.result, { s: score, m: total })}</p>
          <p className="note" style={{ marginTop: 0 }}>
            {!round.scheduled ? R.extraNote : saveState === "saved" ? R.saved : saveState === "failed" ? R.saveFailed : dict.auth.wait}
          </p>
          {missed.length > 0 && (
            <div style={{ textAlign: "start", marginTop: 12 }}>
              <b>{R.missed}</b>
              <div className="chips" role="list" style={{ marginTop: 8 }}>
                {missed.map((t) => (
                  <a key={t.slug} role="listitem" className="chip" href={`/${lang}/learn/vocabulary/${t.slug}`}>
                    <span lang="zh-Hans">{t.zh}</span>
                    <span className="muted" style={{ marginInlineStart: 8 }}>{lang === "ar" ? t.ar : t.en}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="tp-actions" style={{ justifyContent: "center" }}>
            <button type="button" className="btn pri" onClick={() => setRound(null)}>{R.back}</button>
            <a className="btn" href={`/${lang}/dashboard`}>{dict.dash.open}</a>
          </div>
        </div>
      </section>
    );
  }

  // ---- Question ----
  const ex = round.exercises[qi];
  if (!ex) return null;
  const pct = ((qi + (answered ? 1 : 0)) / total) * 100;

  const onAnswer = (ok: boolean) => {
    setAnswered(true);
    setResults((r) => [...r, { slug: ex.term.slug, ok }]);
  };
  const onNext = async () => {
    if (qi + 1 < total) {
      setQi(qi + 1);
      setAnswered(false);
      return;
    }
    setDone(true);
    // Extra practice does not move the schedule, so reviewing early never pushes a term too far ahead.
    if (round.scheduled) setSaveState((await review.saveRound(results, today)) ? "saved" : "failed");
  };

  return (
    <section className="quiz">
      <div className="qmeta">
        <span>{fmt(L.question, { n: qi + 1, m: total })}</span>
        <span>{L.kinds[ex.kind]}</span>
      </div>
      <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      <ExerciseQuestion key={`${round.seed}-${qi}`} ex={ex} lang={lang} dict={dict} isLast={qi + 1 >= total} onAnswer={onAnswer} onNext={onNext} />
    </section>
  );
}
