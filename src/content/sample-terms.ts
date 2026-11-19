// Sample technical terms for the homepage term card and quick exercise.
// Status: needs Hadeel's review (Chinese, pinyin and Arabic). Moves to the
// `terms` table in the database later.
export type SampleTerm = {
  zh: string;
  py: string;
  ar: string;
  en: string;
  /** Index into dictionary.cats.items, or -1 when no category fits. */
  cat: number;
};

export const SAMPLE_TERMS: SampleTerm[] = [
  { zh: "大语言模型", py: "dà yǔ yán mó xíng", ar: "نموذج لغوي كبير", en: "Large language model", cat: 0 },
  { zh: "开源", py: "kāi yuán", ar: "مفتوح المصدر", en: "Open source", cat: 5 },
  { zh: "编程", py: "biān chéng", ar: "البرمجة", en: "Programming", cat: 1 },
  { zh: "算法", py: "suàn fǎ", ar: "خوارزمية", en: "Algorithm", cat: -1 },
  { zh: "智能体", py: "zhì néng tǐ", ar: "وكيل ذكي", en: "AI agent", cat: 4 },
  { zh: "数据库", py: "shù jù kù", ar: "قاعدة بيانات", en: "Database", cat: -1 },
  { zh: "网络安全", py: "wǎng luò ān quán", ar: "الأمن السيبراني", en: "Cybersecurity", cat: -1 },
];
