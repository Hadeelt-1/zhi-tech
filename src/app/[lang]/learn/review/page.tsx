import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import ReviewPlayer from "@/components/learn/ReviewPlayer";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.review.title} · ZHI TECH`, robots: { index: false } };
}

export default async function ReviewPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <div className="sec">
      <div className="wrap">
        <header className="ex-head">
          <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>{dict.review.title}</h1>
          <p className="sub">{dict.review.sub}</p>
        </header>
        <ReviewPlayer lang={lang} dict={dict} />
      </div>
    </div>
  );
}
