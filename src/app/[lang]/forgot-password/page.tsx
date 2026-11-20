import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.auth.forgotTitle} · ZHI TECH`, robots: { index: false } };
}

export default async function Page({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <div className="sec">
      <div className="wrap auth-wrap">
        <h1 className="sec-title" style={{ fontSize: "clamp(32px, 4.4vw, 48px)" }}>{dict.auth.forgotTitle}</h1>
        <p className="sub" style={{ marginBottom: 24 }}>{dict.auth.forgotSub}</p>
        <ForgotPasswordForm lang={lang} dict={dict} />
      </div>
    </div>
  );
}
