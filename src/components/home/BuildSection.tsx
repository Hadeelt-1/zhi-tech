"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import Reveal from "@/components/Reveal";
import { handleTabKeys } from "@/lib/text";

export default function BuildSection({ dict }: { dict: Dictionary }) {
  const [step, setStep] = useState(0);
  const b = dict.build;
  const last = b.steps.length - 1;

  return (
    <section className="sec" id="build">
      <Reveal className="wrap">
        <h2 className="sec-title">{b.title}</h2>
        <div className="steps" role="tablist" onKeyDown={(e) => handleTabKeys(e, b.steps.length, step, setStep)}>
          {b.steps.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              className="step"
              id={`st${i}`}
              aria-selected={i === step}
              aria-controls="spanel"
              tabIndex={i === step ? 0 : -1}
              onClick={() => setStep(i)}
            >
              <span aria-hidden="true">{i + 1}</span>
              {label}
            </button>
          ))}
        </div>
        <div className="panel" id="spanel" role="tabpanel" aria-labelledby={`st${step}`} key={step}>
          <h3 style={{ fontSize: "clamp(22px, 2.6vw, 30px)", marginBottom: 10 }}>{b.steps[step]}</h3>
          <p>{b.desc[step]}</p>
        </div>
        <div className="snav">
          <button type="button" className="btn" disabled={step === 0} onClick={() => setStep(step - 1)}>{b.back}</button>
          <button type="button" className="btn pri" disabled={step === last} onClick={() => setStep(step + 1)}>{b.next}</button>
        </div>
      </Reveal>
    </section>
  );
}
