import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Company } from "@/content/companies";
import { TOOLS } from "@/content/tools";
import { fmt } from "@/lib/text";

export default function CompanyCard({ company, lang, dict }: { company: Company; lang: Locale; dict: Dictionary }) {
  const count = TOOLS.filter((t) => t.company === company.slug).length;
  return (
    <article className="tool">
      <header className="tool-top">
        <div>
          <h3 lang="en" dir="ltr">
            <a className="tool-name" href={`/${lang}/explore/companies/${company.slug}`}>{company.name}</a>
          </h3>
          <p className="tool-co" lang="zh-Hans">{company.nameZh}</p>
        </div>
        {company.status !== "verified" && <span className="pill">{dict.tools.badge}</span>}
      </header>
      <p>{company.overview[lang]}</p>
      <footer className="tool-foot">
        <small>{fmt(dict.companies.count, { n: count })}</small>
      </footer>
    </article>
  );
}
