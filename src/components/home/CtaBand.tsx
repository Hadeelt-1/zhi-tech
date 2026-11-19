import type { Dictionary } from "@/i18n/get-dictionary";

export default function CtaBand({ dict }: { dict: Dictionary }) {
  return (
    <section className="cta">
      <div className="wrap">
        <h2>{dict.cta.title}</h2>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a className="btn pri" href="#try">{dict.hero.cta1}</a>
          <a className="btn" href="#categories">{dict.hero.cta2}</a>
        </div>
      </div>
    </section>
  );
}
