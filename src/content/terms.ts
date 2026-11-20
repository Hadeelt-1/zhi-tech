// Technical vocabulary (drafts). Chinese is Simplified with full-width punctuation;
// pinyin uses tone marks; Arabic is formal Modern Standard Arabic.
// Translations, examples and levels are AI drafts: status "needs_review" until the editor checks them.
// Levels are suggested bands, not official HSK assignments (most technical words are not in the HSK lists).
// Fields mirror the planned terms / term_translations / term_examples / term_relations / term_tool_links tables.

import type { ToolStatus } from "./tools";

export type Domain = "programming" | "ai" | "networking" | "cybersecurity" | "software-engineering" | "developer-tools";
/** beginner ≈ HSK 1–3 · intermediate ≈ HSK 4–6 · advanced ≈ HSK 7–9 */
export type LevelBand = "beginner" | "intermediate" | "advanced";

export type Example = { zh: string; pinyin: string; ar: string; en: string };

export type Term = {
  slug: string;
  zh: string;
  pinyin: string;
  ar: string;
  en: string;
  domain: Domain;
  level: LevelBand;
  examples: Example[];
  /** Slugs of related terms. */
  related: string[];
  /** Tool slugs: the bridge from learning to exploring. */
  tools: string[];
  status: ToolStatus;
};

export const DOMAINS: Domain[] = ["programming", "ai", "networking", "cybersecurity", "software-engineering", "developer-tools"];
export const LEVELS: LevelBand[] = ["beginner", "intermediate", "advanced"];

export const TERMS: Term[] = [
  // Programming
  {
    slug: "biancheng", zh: "编程", pinyin: "biānchéng", ar: "البرمجة", en: "programming",
    domain: "programming", level: "intermediate",
    examples: [{ zh: "我每天花两个小时学习编程。", pinyin: "Wǒ měitiān huā liǎng gè xiǎoshí xuéxí biānchéng.", ar: "أقضي ساعتين يوميًا في تعلّم البرمجة.", en: "I spend two hours a day learning programming." }],
    related: ["daima", "suanfa", "tiaoshi"], tools: ["glm-5-1", "qwen3-8-27b"], status: "needs_review",
  },
  {
    slug: "daima", zh: "代码", pinyin: "dàimǎ", ar: "الشيفرة البرمجية", en: "code",
    domain: "programming", level: "intermediate",
    examples: [{ zh: "请先检查一下这段代码。", pinyin: "Qǐng xiān jiǎnchá yíxià zhè duàn dàimǎ.", ar: "يُرجى مراجعة هذا الجزء من الشيفرة أولًا.", en: "Please check this piece of code first." }],
    related: ["biancheng", "banben-kongzhi", "tiaoshi"], tools: [], status: "needs_review",
  },
  {
    slug: "bianliang", zh: "变量", pinyin: "biànliàng", ar: "المتغيّر", en: "variable",
    domain: "programming", level: "advanced",
    examples: [{ zh: "这个变量的值是零。", pinyin: "Zhège biànliàng de zhí shì líng.", ar: "قيمة هذا المتغيّر صفر.", en: "The value of this variable is zero." }],
    related: ["hanshu", "daima"], tools: [], status: "needs_review",
  },
  {
    slug: "hanshu", zh: "函数", pinyin: "hánshù", ar: "الدالّة", en: "function",
    domain: "programming", level: "advanced",
    examples: [{ zh: "这个函数返回一个列表。", pinyin: "Zhège hánshù fǎnhuí yí gè lièbiǎo.", ar: "تُعيد هذه الدالّة قائمة.", en: "This function returns a list." }],
    related: ["bianliang", "daima", "jiekou"], tools: [], status: "needs_review",
  },
  {
    slug: "suanfa", zh: "算法", pinyin: "suànfǎ", ar: "الخوارزمية", en: "algorithm",
    domain: "programming", level: "intermediate",
    examples: [{ zh: "这个算法的速度很快。", pinyin: "Zhège suànfǎ de sùdù hěn kuài.", ar: "هذه الخوارزمية سريعة جدًا.", en: "This algorithm is very fast." }],
    related: ["biancheng", "hanshu"], tools: [], status: "needs_review",
  },
  // Artificial intelligence
  {
    slug: "rengong-zhineng", zh: "人工智能", pinyin: "réngōng zhìnéng", ar: "الذكاء الاصطناعي", en: "artificial intelligence",
    domain: "ai", level: "intermediate",
    examples: [{ zh: "人工智能正在改变很多行业。", pinyin: "Réngōng zhìnéng zhèngzài gǎibiàn hěn duō hángyè.", ar: "يغيّر الذكاء الاصطناعي كثيرًا من القطاعات.", en: "Artificial intelligence is changing many industries." }],
    related: ["da-yuyan-moxing", "xunlian", "zhinengti"], tools: [], status: "needs_review",
  },
  {
    slug: "da-yuyan-moxing", zh: "大语言模型", pinyin: "dà yǔyán móxíng", ar: "النموذج اللغوي الكبير", en: "large language model",
    domain: "ai", level: "advanced",
    examples: [{ zh: "这个大语言模型可以在本地运行。", pinyin: "Zhège dà yǔyán móxíng kěyǐ zài běndì yùnxíng.", ar: "يمكن تشغيل هذا النموذج اللغوي الكبير محليًا.", en: "This large language model can run locally." }],
    related: ["rengong-zhineng", "xunlian", "kaiyuan"], tools: ["deepseek-v4-pro", "qwen3-8-27b", "kimi-k3"], status: "needs_review",
  },
  {
    slug: "xunlian", zh: "训练", pinyin: "xùnliàn", ar: "التدريب", en: "training",
    domain: "ai", level: "intermediate",
    examples: [{ zh: "训练这个模型需要大量数据。", pinyin: "Xùnliàn zhège móxíng xūyào dàliàng shùjù.", ar: "يتطلّب تدريب هذا النموذج كمية كبيرة من البيانات.", en: "Training this model requires a large amount of data." }],
    related: ["da-yuyan-moxing", "rengong-zhineng"], tools: ["hy3"], status: "needs_review",
  },
  {
    slug: "zhinengti", zh: "智能体", pinyin: "zhìnéngtǐ", ar: "الوكيل الذكي", en: "AI agent",
    domain: "ai", level: "advanced",
    examples: [{ zh: "这个智能体可以自动完成多步骤任务。", pinyin: "Zhège zhìnéngtǐ kěyǐ zìdòng wánchéng duō bùzhòu rènwù.", ar: "يستطيع هذا الوكيل الذكي إنجاز المهام متعددة الخطوات تلقائيًا.", en: "This agent can complete multi-step tasks automatically." }],
    related: ["rengong-zhineng", "da-yuyan-moxing"], tools: ["glm-5-1", "minimax-m3"], status: "needs_review",
  },
  // Networking
  {
    slug: "wangluo", zh: "网络", pinyin: "wǎngluò", ar: "الشبكة", en: "network",
    domain: "networking", level: "beginner",
    examples: [{ zh: "公司的网络今天有点慢。", pinyin: "Gōngsī de wǎngluò jīntiān yǒudiǎn màn.", ar: "شبكة الشركة بطيئة بعض الشيء اليوم.", en: "The company network is a bit slow today." }],
    related: ["fuwuqi", "daikuan", "wangluo-anquan"], tools: [], status: "needs_review",
  },
  {
    slug: "fuwuqi", zh: "服务器", pinyin: "fúwùqì", ar: "الخادم", en: "server",
    domain: "networking", level: "intermediate",
    examples: [{ zh: "我们的网站部署在三台服务器上。", pinyin: "Wǒmen de wǎngzhàn bùshǔ zài sān tái fúwùqì shàng.", ar: "موقعنا منشور على ثلاثة خوادم.", en: "Our website is deployed on three servers." }],
    related: ["wangluo", "yun-jisuan", "shujuku"], tools: [], status: "needs_review",
  },
  {
    slug: "daikuan", zh: "带宽", pinyin: "dàikuān", ar: "عرض النطاق", en: "bandwidth",
    domain: "networking", level: "advanced",
    examples: [{ zh: "视频会议需要足够的带宽。", pinyin: "Shìpín huìyì xūyào zúgòu de dàikuān.", ar: "تحتاج مؤتمرات الفيديو إلى عرض نطاق كافٍ.", en: "Video conferencing needs enough bandwidth." }],
    related: ["wangluo", "fuwuqi"], tools: [], status: "needs_review",
  },
  {
    slug: "yun-jisuan", zh: "云计算", pinyin: "yún jìsuàn", ar: "الحوسبة السحابية", en: "cloud computing",
    domain: "networking", level: "intermediate",
    examples: [{ zh: "越来越多的公司使用云计算。", pinyin: "Yuè lái yuè duō de gōngsī shǐyòng yún jìsuàn.", ar: "يتزايد عدد الشركات التي تستخدم الحوسبة السحابية.", en: "More and more companies use cloud computing." }],
    related: ["fuwuqi", "wangluo"], tools: ["seed-2-1"], status: "needs_review",
  },
  // Cybersecurity
  {
    slug: "wangluo-anquan", zh: "网络安全", pinyin: "wǎngluò ānquán", ar: "الأمن السيبراني", en: "cybersecurity",
    domain: "cybersecurity", level: "intermediate",
    examples: [{ zh: "网络安全是每家公司都要重视的问题。", pinyin: "Wǎngluò ānquán shì měi jiā gōngsī dōu yào zhòngshì de wèntí.", ar: "الأمن السيبراني قضية ينبغي لكل شركة أن تولِيها اهتمامًا.", en: "Cybersecurity is an issue every company must take seriously." }],
    related: ["jiami", "loudong", "mima"], tools: [], status: "needs_review",
  },
  {
    slug: "mima", zh: "密码", pinyin: "mìmǎ", ar: "كلمة المرور", en: "password",
    domain: "cybersecurity", level: "beginner",
    examples: [{ zh: "请设置一个更安全的密码。", pinyin: "Qǐng shèzhì yí gè gèng ānquán de mìmǎ.", ar: "يُرجى تعيين كلمة مرور أكثر أمانًا.", en: "Please set a more secure password." }],
    related: ["wangluo-anquan", "jiami"], tools: [], status: "needs_review",
  },
  {
    slug: "jiami", zh: "加密", pinyin: "jiāmì", ar: "التشفير", en: "encryption",
    domain: "cybersecurity", level: "intermediate",
    examples: [{ zh: "所有数据在传输时都会加密。", pinyin: "Suǒyǒu shùjù zài chuánshū shí dōu huì jiāmì.", ar: "تُشفَّر جميع البيانات أثناء نقلها.", en: "All data is encrypted in transit." }],
    related: ["wangluo-anquan", "mima"], tools: [], status: "needs_review",
  },
  {
    slug: "loudong", zh: "漏洞", pinyin: "lòudòng", ar: "الثغرة الأمنية", en: "vulnerability",
    domain: "cybersecurity", level: "advanced",
    examples: [{ zh: "工程师发现了一个严重的漏洞。", pinyin: "Gōngchéngshī fāxiàn le yí gè yánzhòng de lòudòng.", ar: "اكتشف المهندس ثغرة أمنية خطيرة.", en: "The engineer found a serious vulnerability." }],
    related: ["wangluo-anquan", "ceshi"], tools: [], status: "needs_review",
  },
  // Software engineering
  {
    slug: "ruanjian", zh: "软件", pinyin: "ruǎnjiàn", ar: "البرنامج", en: "software",
    domain: "software-engineering", level: "beginner",
    examples: [{ zh: "这个软件支持中文和阿拉伯语。", pinyin: "Zhège ruǎnjiàn zhīchí Zhōngwén hé Ālābóyǔ.", ar: "يدعم هذا البرنامج اللغتين الصينية والعربية.", en: "This software supports Chinese and Arabic." }],
    related: ["ceshi", "xuqiu", "kaiyuan"], tools: [], status: "needs_review",
  },
  {
    slug: "ceshi", zh: "测试", pinyin: "cèshì", ar: "الاختبار", en: "testing",
    domain: "software-engineering", level: "intermediate",
    examples: [{ zh: "上线之前必须完成测试。", pinyin: "Shàngxiàn zhīqián bìxū wánchéng cèshì.", ar: "يجب إكمال الاختبار قبل الإطلاق.", en: "Testing must be completed before going live." }],
    related: ["ruanjian", "tiaoshi", "loudong"], tools: [], status: "needs_review",
  },
  {
    slug: "xuqiu", zh: "需求", pinyin: "xūqiú", ar: "المتطلبات", en: "requirements",
    domain: "software-engineering", level: "intermediate",
    examples: [{ zh: "我们先和客户确认需求。", pinyin: "Wǒmen xiān hé kèhù quèrèn xūqiú.", ar: "نتحقّق من المتطلبات مع العميل أولًا.", en: "We first confirm the requirements with the client." }],
    related: ["ruanjian", "ceshi"], tools: [], status: "needs_review",
  },
  {
    slug: "kaiyuan", zh: "开源", pinyin: "kāiyuán", ar: "مفتوح المصدر", en: "open source",
    domain: "software-engineering", level: "intermediate",
    examples: [{ zh: "这个项目是开源的，任何人都可以参与。", pinyin: "Zhège xiàngmù shì kāiyuán de, rènhé rén dōu kěyǐ cānyù.", ar: "هذا المشروع مفتوح المصدر، ويمكن لأي شخص المشاركة فيه.", en: "This project is open source; anyone can contribute." }],
    related: ["ruanjian", "banben-kongzhi", "da-yuyan-moxing"], tools: ["deepseek-v4-pro", "hy3"], status: "needs_review",
  },
  // Developer tools
  {
    slug: "shujuku", zh: "数据库", pinyin: "shùjùkù", ar: "قاعدة البيانات", en: "database",
    domain: "developer-tools", level: "intermediate",
    examples: [{ zh: "用户信息保存在数据库里。", pinyin: "Yònghù xìnxī bǎocún zài shùjùkù lǐ.", ar: "تُحفظ معلومات المستخدمين في قاعدة البيانات.", en: "User information is stored in the database." }],
    related: ["fuwuqi", "jiekou"], tools: [], status: "needs_review",
  },
  {
    slug: "tiaoshi", zh: "调试", pinyin: "tiáoshì", ar: "تصحيح الأخطاء", en: "debugging",
    domain: "developer-tools", level: "advanced",
    examples: [{ zh: "我花了一个下午调试这个问题。", pinyin: "Wǒ huā le yí gè xiàwǔ tiáoshì zhège wèntí.", ar: "أمضيتُ فترة ما بعد الظهر في تتبّع هذه المشكلة وإصلاحها.", en: "I spent an afternoon debugging this issue." }],
    related: ["daima", "ceshi", "biancheng"], tools: [], status: "needs_review",
  },
  {
    slug: "jiekou", zh: "接口", pinyin: "jiēkǒu", ar: "الواجهة البرمجية", en: "interface (API)",
    domain: "developer-tools", level: "intermediate",
    examples: [{ zh: "这个模型提供接口，开发者可以直接调用。", pinyin: "Zhège móxíng tígōng jiēkǒu, kāifāzhě kěyǐ zhíjiē diàoyòng.", ar: "يوفّر هذا النموذج واجهة برمجية يستطيع المطوّرون استدعاءها مباشرة.", en: "This model provides an API that developers can call directly." }],
    related: ["hanshu", "shujuku"], tools: ["deepseek-v4-pro", "kimi-k3"], status: "needs_review",
  },
  {
    slug: "banben-kongzhi", zh: "版本控制", pinyin: "bǎnběn kòngzhì", ar: "التحكم في الإصدارات", en: "version control",
    domain: "developer-tools", level: "advanced",
    examples: [{ zh: "团队用版本控制管理所有代码。", pinyin: "Tuánduì yòng bǎnběn kòngzhì guǎnlǐ suǒyǒu dàimǎ.", ar: "يستخدم الفريق التحكم في الإصدارات لإدارة الشيفرة كلها.", en: "The team uses version control to manage all the code." }],
    related: ["daima", "kaiyuan"], tools: [], status: "needs_review",
  },
];

export const getTerm = (slug: string) => TERMS.find((t) => t.slug === slug);

/** Pinyin without tone marks, so "wangluo" finds "wǎngluò". */
export const plainPinyin = (p: string) =>
  p.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ü/g, "u").toLowerCase();
