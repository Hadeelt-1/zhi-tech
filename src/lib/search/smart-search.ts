// Smart search, layer 1: understands common words for what people need,
// in Arabic, English and Chinese, and turns a question into requirements.
// Example: "نموذج صيني يعمل على جهازي ويساعدني في البرمجة" → runs locally + coding.
// Layer 2 (later): an AI model on the server for unusual phrasings.

import type { Runtime, Tool, UseTag } from "@/content/tools";
import type { Locale } from "@/i18n/config";

export type Modality = "image" | "video";

export type Intent = {
  runtimes: Runtime[];
  uses: UseTag[];
  modalities: Modality[];
  openLicense: boolean;
  companies: string[];
  /** Words left over after the concepts above, used to search names and descriptions. */
  words: string[];
};

/** Arabic: drop diacritics/tatweel and unify letter shapes so spelling variants match. */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^\p{L}\p{N}\s.+-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Synonyms = string[];

// Latin terms match whole words; Arabic and Chinese terms match inside words
// (Arabic attaches prefixes such as ال، و، ب; Chinese has no spaces).
const RUNTIME_WORDS: Record<Runtime, Synonyms> = {
  local: [
    "local", "locally", "offline", "on my device", "on my computer", "on my laptop", "on my pc", "my own machine", "self-host", "self host", "self-hosted", "run it myself", "on-device",
    "محلي", "جهازي", "جهازك", "على الجهاز", "حاسوبي", "حاسبي", "كمبيوتري", "لابتوب", "اللابتوب", "بدون انترنت", "اوفلاين", "تشغيل ذاتي",
    "本地", "离线", "自己的电脑", "我的电脑", "笔记本", "自行部署", "私有部署",
  ],
  api: ["api", "واجهه برمجه", "واجهة برمجة", "接口"],
  cloud: ["cloud", "online", "سحابي", "سحابه", "اونلاين", "云端", "云服务", "在线"],
};

const USE_WORDS: Record<UseTag, Synonyms> = {
  coding: [
    "code", "coding", "programming", "program", "programmer", "developer", "development", "software", "debug", "debugging",
    "برمج", "كود", "اكواد", "شيفره", "تطوير البرمجيات", "تطوير المواقع", "مطور",
    "编程", "代码", "编码", "开发", "程序",
  ],
  agents: [
    "agent", "agents", "agentic", "automate", "automation", "multi-step", "workflow", "workflows",
    "وكيل", "وكلاء", "اتمته", "تلقايي", "متعدد الخطوات",
    "智能体", "代理", "自动化", "工作流",
  ],
  longdocs: [
    "long document", "long documents", "documents", "document", "pdf", "long text", "long context", "book", "books",
    // Not "كتب": it is inside "مكتبيه" (office).
    "مستند", "مستندات", "ملفات طويله", "نصوص طويله", "كتاب",
    "长文档", "文档", "长文本", "长上下文",
  ],
  office: [
    "office", "spreadsheet", "spreadsheets", "excel", "planning", "business", "presentation", "presentations",
    "مكتب", "اعمال", "جداول", "تخطيط", "عروض تقديميه",
    "办公", "表格", "规划",
  ],
  // Not "بحث" alone: it is inside "ابحث" (I am looking for).
  research: ["research", "study", "analysis", "analyze", "science", "ابحاث", "بحوث", "البحث العلمي", "بحث علمي", "باحث", "دراسه", "تحليل", "علمي", "研究", "分析", "科研"],
  writing: ["writing", "write", "chat", "chatbot", "conversation", "essay", "translate", "كتابه", "اكتب", "محادثه", "دردشه", "مقال", "写作", "对话", "聊天"],
  reasoning: ["reasoning", "math", "maths", "logic", "problem solving", "think", "thinking", "استدلال", "رياضيات", "منطق", "حل المشكلات", "تفكير", "推理", "数学", "逻辑"],
  creative: [
    "design", "game", "games", "3d", "animation", "motion", "video editing", "creative",
    "تصميم", "العاب", "لعبه", "ثلاثي الابعاد", "رسوم متحركه", "مونتاج", "تحرير الفيديو", "ابداعي",
    "设计", "游戏", "动画", "剪辑", "创意",
  ],
};

const MODALITY_WORDS: Record<Modality, Synonyms> = {
  image: ["image", "images", "photo", "photos", "picture", "pictures", "vision", "screenshot", "صوره", "صور", "رويه", "لقطه شاشه", "图像", "图片", "照片", "视觉", "截图"],
  video: ["video", "videos", "فيديو", "مقطع", "视频"],
};

const OPEN_WORDS: Synonyms = [
  "open", "open source", "open-source", "opensource", "open weight", "open weights", "open-weight", "download", "downloadable",
  "مفتوح", "تنزيل", "تحميل", "اتحمله", "انزله",
  "开源", "开放权重", "下载",
];

/** Company names, Arabic spellings and model family names. */
const COMPANY_WORDS: Record<string, Synonyms> = {
  alibaba: ["alibaba", "qwen", "tongyi", "علي بابا", "على بابا", "عليبابا", "كوين", "阿里", "通义", "千问"],
  deepseek: ["deepseek", "deep seek", "ديب سيك", "ديبسيك", "深度求索"],
  "moonshot-ai": ["moonshot", "kimi", "مون شوت", "كيمي", "月之暗面"],
  "zhipu-ai": ["zhipu", "z.ai", "glm", "تشيبو", "智谱"],
  minimax: ["minimax", "ميني ماكس", "مينيماكس", "稀宇"],
  tencent: ["tencent", "hunyuan", "hy3", "تينسنت", "تنسنت", "腾讯", "混元"],
  bytedance: ["bytedance", "doubao", "seed", "بايت دانس", "بايتدانس", "دوباو", "字节", "豆包"],
  baidu: ["baidu", "ernie", "بايدو", "ارني", "百度", "文心"],
};

/** Words that carry no meaning for the search. */
const STOP = new Set(
  normalize(
    "a an the i im i'm me my for to of in on and or with that can which want need looking look find help helps me model models tool tools ai chinese china best good run use using work works please something smart powerful strong " +
      "وال بال كال فال لل ابحث ادور اريد ابي ابغى عن على في من الى و او مع يمكن يساعد يساعدني يساعدنا لي نموذج نماذج اداه ادوات صيني صينيه الصين افضل جيد قوي يعمل يشتغل تشغيله يمكن ذكاء ذكي ذكيه اصطناعي يفهم مناسب " +
      "我 想 要 找 一个 的 模型 工具 中国 帮 帮助 可以",
  ).split(" "),
);

const isLatin = (s: string) => /^[\x00-\x7F]+$/.test(s);

function hasTerm(text: string, term: string) {
  const t = normalize(term);
  if (!t) return false;
  if (isLatin(t)) {
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`).test(text);
  }
  return text.includes(t);
}

/** Removes every matched term from the text, so leftover words can be searched separately. */
function consume(text: string, terms: Synonyms) {
  let found = false;
  let rest = text;
  for (const term of [...terms].sort((a, b) => b.length - a.length)) {
    if (hasTerm(rest, term)) {
      found = true;
      rest = rest.split(normalize(term)).join(" ");
    }
  }
  return { found, rest };
}

export function parseQuery(query: string): Intent {
  let text = ` ${normalize(query)} `;
  const intent: Intent = { runtimes: [], uses: [], modalities: [], openLicense: false, companies: [], words: [] };

  const take = (terms: Synonyms) => {
    const r = consume(text, terms);
    text = r.rest;
    return r.found;
  };

  // "video editing" is a creative use, so check uses before the video modality.
  for (const [use, terms] of Object.entries(USE_WORDS) as [UseTag, Synonyms][]) if (take(terms)) intent.uses.push(use);
  for (const [m, terms] of Object.entries(MODALITY_WORDS) as [Modality, Synonyms][]) if (take(terms)) intent.modalities.push(m);
  for (const [r, terms] of Object.entries(RUNTIME_WORDS) as [Runtime, Synonyms][]) if (take(terms)) intent.runtimes.push(r);
  intent.openLicense = take(OPEN_WORDS);
  for (const [c, terms] of Object.entries(COMPANY_WORDS)) if (take(terms)) intent.companies.push(c);

  intent.words = text
    .split(" ")
    // Arabic: also try the word without a leading و, ال or لل.
    .map((w) => w.replace(/^و(?=\p{L}{3,})/u, "").replace(/^(ال|لل)(?=\p{L}{3,})/u, ""))
    .filter((w) => w.length >= 3 && !STOP.has(w));
  return intent;
}

export const hasIntent = (i: Intent) =>
  i.runtimes.length + i.uses.length + i.modalities.length + i.companies.length + i.words.length > 0 || i.openLicense;

export type Reason =
  | { kind: "runtime"; value: Runtime }
  | { kind: "use"; value: UseTag }
  | { kind: "modality"; value: Modality }
  | { kind: "open" }
  | { kind: "company" }
  | { kind: "text" };

export type Ranked = { tool: Tool; score: number; reasons: Reason[] };

/**
 * Requirements the user stated (where it runs, license, company) are strict:
 * a tool that fails one is left out. Uses, modalities and words raise the rank.
 */
export function rankTools(tools: Tool[], intent: Intent, lang: Locale): Ranked[] {
  const out: Ranked[] = [];
  for (const tool of tools) {
    const reasons: Reason[] = [];
    let score = 0;

    if (intent.runtimes.length) {
      const ok = intent.runtimes.filter((r) => tool.runtime.includes(r));
      if (!ok.length) continue;
      ok.forEach((r) => reasons.push({ kind: "runtime", value: r }));
      score += 3 * ok.length;
    }
    if (intent.openLicense) {
      if (tool.license.kind !== "open_source" && tool.license.kind !== "open_weight") continue;
      reasons.push({ kind: "open" });
      score += 3;
    }
    if (intent.companies.length) {
      if (!intent.companies.includes(tool.company)) continue;
      reasons.push({ kind: "company" });
      score += 3;
    }
    for (const use of intent.uses) {
      if (tool.useTags.includes(use)) {
        reasons.push({ kind: "use", value: use });
        score += 2;
      }
    }
    for (const m of intent.modalities) {
      if (tool.specs.modalities?.includes(m)) {
        reasons.push({ kind: "modality", value: m });
        score += 2;
      }
    }
    if (intent.words.length) {
      const hay = normalize([tool.name, tool.companyName, tool.summary[lang], ...tool.useCases[lang], tool.summary.en].join(" "));
      const hits = intent.words.filter((w) => hay.includes(w)).length;
      if (hits) {
        reasons.push({ kind: "text" });
        score += hits;
      }
    }

    // Uses and modalities, when asked, must match at least once; extra words only help the ranking,
    // unless the question had nothing else, then a word must match.
    const askedNeed = intent.uses.length + intent.modalities.length > 0;
    const askedStrict = intent.runtimes.length > 0 || intent.openLicense || intent.companies.length > 0;
    const metNeed = reasons.some((r) => r.kind === "use" || r.kind === "modality");
    const metText = reasons.some((r) => r.kind === "text");
    const keep = askedNeed ? metNeed : askedStrict || metText;
    if (keep) out.push({ tool, score, reasons });
  }
  return out.sort((a, b) => b.score - a.score);
}
