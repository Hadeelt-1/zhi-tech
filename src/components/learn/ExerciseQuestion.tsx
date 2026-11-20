"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Exercise } from "@/lib/exercises";
import { fmt } from "@/lib/text";

/**
 * One exercise question (any of the five types), shared by lessons and review tests.
 * Give it a new `key` for each question so its own state starts fresh.
 */
export default function ExerciseQuestion({
  ex, lang, dict, isLast, onAnswer, onNext,
}: { ex: Exercise; lang: Locale; dict: Dictionary; isLast: boolean; onAnswer: (ok: boolean) => void; onNext: () => void }) {
  const L = dict.lessons;
  const [picked, setPicked] = useState<string | null>(null);
  const [ordered, setOrdered] = useState<number[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);

  const check = (ok: boolean) => {
    setChecked(ok);
    onAnswer(ok);
    requestAnimationFrame(() => nextBtn.current?.focus());
  };
  const meaning = (lang === "ar" ? ex.term.ar : ex.term.en);

  return (
    <>
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
            {checked === false && fmt(L.wrong, { a: ex.kind === "zh2ar" ? (lang === "ar" ? ex.term.examples[0].ar : ex.term.examples[0].en) : ex.kind === "mc" ? meaning : ex.term.zh })}
          </div>
        </>
      )}

      {checked !== null && (
        <div style={{ marginTop: 12 }}>
          <button ref={nextBtn} type="button" className="btn pri" onClick={onNext}>
            {isLast ? L.finish : L.next}
          </button>
        </div>
      )}
    </>
  );
}
