// Sequential lessons. Each lesson teaches a group of related terms, then checks them with
// the five exercise types from the brief. Ordered from everyday words to AI.
// Titles and intros are drafts (needs review), like the terms.

import type { Locale } from "@/i18n/config";

export type Lesson = {
  slug: string;
  order: number;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  /** Term slugs, in teaching order. */
  terms: string[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "tech-basics",
    order: 1,
    title: { ar: "أساسيات التقنية", en: "Tech basics", zh: "技术基础" },
    intro: {
      ar: "كلمات يومية ستصادفها في أي عمل تقني: الشبكات وكلمات المرور والبرامج والشيفرة.",
      en: "Everyday words you will meet in any tech job: networks, passwords, software and code.",
      zh: "任何技术工作中都会遇到的常用词：网络、密码、软件和代码。",
    },
    terms: ["wangluo", "mima", "ruanjian", "daima", "biancheng"],
  },
  {
    slug: "servers-and-data",
    order: 2,
    title: { ar: "الخوادم والبيانات", en: "Servers and data", zh: "服务器与数据" },
    intro: {
      ar: "أين تعمل التطبيقات وأين تُحفظ بياناتها.",
      en: "Where applications run and where their data is kept.",
      zh: "应用在哪里运行，数据保存在哪里。",
    },
    terms: ["fuwuqi", "shujuku", "yun-jisuan", "jiekou"],
  },
  {
    slug: "inside-the-code",
    order: 3,
    title: { ar: "داخل الشيفرة", en: "Inside the code", zh: "代码内部" },
    intro: {
      ar: "اللبنات الأساسية التي يتعامل معها المبرمجون يوميًا.",
      en: "The building blocks programmers work with every day.",
      zh: "程序员每天使用的基本概念。",
    },
    terms: ["suanfa", "bianliang", "hanshu", "tiaoshi"],
  },
  {
    slug: "how-software-is-built",
    order: 4,
    title: { ar: "كيف تُبنى البرمجيات", en: "How software is built", zh: "软件是如何构建的" },
    intro: {
      ar: "من متطلبات العميل إلى الاختبار والتحكم في الإصدارات والمصادر المفتوحة.",
      en: "From the client's requirements to testing, version control and open source.",
      zh: "从客户需求到测试、版本控制和开源。",
    },
    terms: ["xuqiu", "ceshi", "banben-kongzhi", "kaiyuan"],
  },
  {
    slug: "security-and-networks",
    order: 5,
    title: { ar: "الأمن والشبكات", en: "Security and networks", zh: "安全与网络" },
    intro: {
      ar: "حماية الأنظمة والبيانات التي تنتقل بينها.",
      en: "Protecting systems and the data that travels between them.",
      zh: "保护系统以及在系统之间传输的数据。",
    },
    terms: ["wangluo-anquan", "jiami", "loudong", "daikuan"],
  },
  {
    slug: "artificial-intelligence",
    order: 6,
    title: { ar: "الذكاء الاصطناعي", en: "Artificial intelligence", zh: "人工智能" },
    intro: {
      ar: "المصطلحات التي تقف وراء نماذج الذكاء الاصطناعي اليوم، من التدريب إلى الوكلاء.",
      en: "The words behind today's AI models, from training to agents.",
      zh: "当今 AI 模型背后的术语，从训练到智能体。",
    },
    terms: ["rengong-zhineng", "da-yuyan-moxing", "xunlian", "zhinengti"],
  },
];

export const getLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const nextLesson = (slug: string) => {
  const cur = getLesson(slug);
  return cur ? LESSONS.find((l) => l.order === cur.order + 1) : undefined;
};
