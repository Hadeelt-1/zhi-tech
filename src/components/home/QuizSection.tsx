"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import Reveal from "@/components/Reveal";
import { SAMPLE_TERMS, type SampleTerm } from "@/content/sample-terms";
import { fmt } from "@/lib/text";

type Question = { term: SampleTerm; options: SampleTerm[] };
const LENGTH = 5;

// First round is fixed so the server and browser render the same thing;
// "Try again" shuffles in the browser.
function firstRound(): Question[] {
  return SAMPLE_TERMS.slice(0, LENGTH).map((term, i) => {
    const others = SAMPLE_TERMS.filter((t) => t !== term);
    const wrong = [others[i % others.length], others[(i + 3) % others.length]];
    const options = [...wrong];
    options.splice(i % 3, 0, term);
    return { term, options };
  });
}

function shuffle<T>(list: T[]): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomRound(): Question[] {
  return shuffle(SAMPLE_TERMS).slice(0, LENGTH).map((term) => ({
    term,
    options: shuffle([term, ...shuffle(SAMPLE_TERMS.filter((t) => t !== term)).slice(0, 2)]),
  }));
}

export default function QuizSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const q = dict.quiz;
  const [round, setRound] = useState<Question[]>(firstRound);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<SampleTerm | null>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const meaning = (t: SampleTerm) => (lang === "ar" ? t.ar : t.en);

  const restart = () => {
    setRound(randomRound());
    setQi(0);
    setScore(0);
    setPicked(null);
  };

  const choose = (opt: SampleTerm) => {
    if (picked) return;
    setPicked(opt);
    if (opt === round[qi].term) setScore(score + 1);
    requestAnimationFrame(() => nextBtn.current?.focus());
  };

  const next = () => {
    setQi(qi + 1);
    setPicked(null);
  };

  const done = qi >= round.length;
  const cur = round[qi];
  const answered = picked !== null;
  const progress = ((qi + (answered ? 1 : 0)) / round.length) * 100;

  return (
    <section className="sec" id="try">
      <Reveal className="wrap">
        <h2 className="sec-title">{q.title}</h2>
        <p style={{ margin: "-12px 0 24px", maxWidth: "36em" }}>{q.sub}</p>
        <div className="quiz">
          {done ? (
            <div className="qres">
              <div className="big">{score} / {round.length}</div>
              <p>{fmt(q.score, { s: score, m: round.length })}</p>
              <button type="button" className="btn pri" onClick={restart}>{q.again}</button>
            </div>
          ) : (
            <>
              <div className="qmeta">
                <span>{fmt(q.of, { n: qi + 1, m: round.length })}</span>
                <span>{q.pick}</span>
              </div>
              <div className="bar"><i style={{ width: `${progress}%` }} /></div>
              <div className="qterm" lang="zh-Hans">{cur.term.zh}</div>
              <div className="qpy">{cur.term.py}</div>
              <div className="opts" role="group" aria-label={q.pick}>
                {cur.options.map((o) => {
                  const isRight = o === cur.term;
                  const cls = answered ? (isRight ? " ok" : o === picked ? " bad" : "") : "";
                  return (
                    <button key={o.zh} type="button" className={`opt${cls}`} disabled={answered} onClick={() => choose(o)}>
                      {meaning(o)}
                    </button>
                  );
                })}
              </div>
              <div className="fb" role="status" aria-live="polite">
                {answered && (picked === cur.term ? q.right : fmt(q.wrong, { a: meaning(cur.term) }))}
              </div>
              {answered && (
                <div style={{ marginTop: 12 }}>
                  <button ref={nextBtn} type="button" className="btn pri" onClick={next}>
                    {qi === round.length - 1 ? q.see : q.next}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}
