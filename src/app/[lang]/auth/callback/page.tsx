import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import AuthCallback from "@/components/auth/AuthCallback";

type Params = Promise<{ lang: string }>;

export const metadata: Metadata = { robots: { index: false } };

export default async function CallbackPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <div className="sec">
      <div className="wrap auth-wrap">
        <AuthCallback lang={lang} dict={dict} />
      </div>
    </div>
  );
}
