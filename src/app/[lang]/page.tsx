import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import Hero from "@/components/home/Hero";
import PathsSection from "@/components/home/PathsSection";
import QuizSection from "@/components/home/QuizSection";
import ToolsSection from "@/components/home/ToolsSection";
import ExploreSection from "@/components/home/ExploreSection";
import BuildSection from "@/components/home/BuildSection";
import CtaBand from "@/components/home/CtaBand";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <PathsSection lang={lang} dict={dict} />
      <QuizSection lang={lang} dict={dict} />
      <ToolsSection lang={lang} dict={dict} />
      <ExploreSection dict={dict} />
      <BuildSection dict={dict} />
      <CtaBand dict={dict} />
    </>
  );
}
