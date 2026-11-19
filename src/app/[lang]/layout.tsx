import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import "../globals.css";
import { dirOf, hasLocale, htmlLang, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";

const head = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--nf-head" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--nf-body" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--nf-ar" });
const chinese = Noto_Sans_SC({ weight: ["400", "500", "700"], variable: "--nf-zh", preload: false });

// Runs before first paint: applies the saved theme and turns on scroll reveals.
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('zhi-theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t)}catch(e){}})();`;

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEE5D4" },
    { media: "(prefers-color-scheme: dark)", color: "#1D4A35" },
  ],
  viewportFit: "cover",
};

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={htmlLang(lang)}
      dir={dirOf(lang)}
      data-lang={lang}
      className={`${head.variable} ${body.variable} ${arabic.variable} ${chinese.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">{dict.a11y.skip}</a>
        <Header lang={lang} dict={dict} />
        <main id="main">{children}</main>
        <Footer lang={lang} dict={dict} />
        <BackToTop label={dict.a11y.top} />
      </body>
    </html>
  );
}
