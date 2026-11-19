import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import Reveal from "@/components/Reveal";
import TermCard from "./TermCard";

export default function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section className="hero" id="hero">
      <div className="wrap">
        <Reveal>
          <h1>{dict.hero.h1}</h1>
          <p className="sub">{dict.hero.sub}</p>
          <div className="acts">
            <a className="btn pri" href="#try">{dict.hero.cta1}</a>
            <a className="btn" href="#categories">{dict.hero.cta2}</a>
          </div>
        </Reveal>
        <Reveal>
          <TermCard lang={lang} dict={dict} />
        </Reveal>
      </div>
    </section>
  );
}
