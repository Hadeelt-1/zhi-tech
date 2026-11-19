import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { HOME_SECTIONS } from "@/lib/nav";
import Reveal from "@/components/Reveal";

const LINKEDIN = "https://www.linkedin.com/in/hadeel-almutairi-1b5a58290/";

export default function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <Reveal className="sig">
          <div className="crow" dir="ltr">
            <svg className="sun" viewBox="0 0 150 60" aria-hidden="true" focusable="false">
              <g className="rays" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                <path d="M105.8 41.6L116.7 36.6" /><path d="M94.5 28.1L101.4 18.3" /><path d="M75 22L75 10" /><path d="M55.5 28.1L48.6 18.3" /><path d="M44.2 41.6L33.3 36.6" />
              </g>
              <clipPath id="sun-horizon"><rect x="0" y="0" width="150" height="56" /></clipPath>
              <g clipPath="url(#sun-horizon)"><g className="rise"><path d="M45 56A30 30 0 0 1 105 56Z" fill="#F2462E" /></g></g>
              <path d="M8 56H142" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
            <span className="txt" lang="en">Created by <b>Hadeel Almutairi</b></span>
            <a className="lnk" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label={dict.a11y.linkedin}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>
          </div>
          <nav className="fnav" aria-label={dict.a11y.footerNav}>
            {HOME_SECTIONS.map((s) => (
              <a key={s.id} href={`/${lang}#${s.id}`}>{dict.sections[s.label]}</a>
            ))}
          </nav>
        </Reveal>
      </div>
    </footer>
  );
}
