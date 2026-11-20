import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.auth.newTitle} · ZHI TECH`, robots: { index: false } };
}

export default async function Page({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <div className="sec">
      <div className="wrap auth-wrap">
        <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 48px)" }}>{dict.auth.newTitle}</h1>
        
        <ResetPasswordForm lang={lang} dict={dict} />
      </div>
    </div>
  );
}
