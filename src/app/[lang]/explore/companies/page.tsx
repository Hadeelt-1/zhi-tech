import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { COMPANIES } from "@/content/companies";
import CompanyCard from "@/components/explore/CompanyCard";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.companies.title} · ZHI TECH`, description: dict.companies.sub };
}

export default async function CompaniesPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="sec">
      <div className="wrap">
        <header className="ex-head">
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>{dict.companies.title}</h1>
          <p className="sub">{dict.companies.sub}</p>
        </header>
        <p className="note" style={{ marginTop: 0, marginBottom: 20 }}>{dict.tools.note}</p>
        <div className="tool-grid">
          {COMPANIES.map((c) => <CompanyCard key={c.slug} company={c} lang={lang} dict={dict} />)}
        </div>
      </div>
    </div>
  );
}
