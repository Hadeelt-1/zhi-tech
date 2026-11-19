// Company profiles (drafts). Same rules as tools.ts: facts only from the
// official sources listed, status "needs_review" until the editor checks them.
// Overviews only describe what the sources show (models and official services).

import type { ToolStatus } from "./tools";

export type Company = {
  slug: string;
  name: string;
  /** Chinese name as commonly written; needs review. */
  nameZh: string;
  website: string;
  overview: { ar: string; en: string; zh: string };
  links: { label: string; url: string }[];
  sources: string[];
  lastChecked: string;
  status: ToolStatus;
};

export const COMPANIES: Company[] = [
  {
    slug: "alibaba",
    name: "Alibaba (Qwen)",
    nameZh: "阿里巴巴（通义千问）",
    website: "https://www.alibabacloud.com/",
    overview: {
      en: "Develops the Qwen family of models and releases many of them for download. Alibaba Cloud's Model Studio is its generative AI platform built on Qwen models.",
      ar: "تطوّر عائلة نماذج Qwen، وتتيح كثيرًا منها للتنزيل. وتُعدّ منصة Model Studio من Alibaba Cloud منصتها للذكاء الاصطناعي التوليدي المبنية على نماذج Qwen.",
      zh: "开发通义千问（Qwen）系列模型，并开放下载其中许多模型。阿里云百炼（Model Studio）是其基于 Qwen 模型的生成式 AI 平台。",
    },
    links: [
      { label: "Qwen3.8 announcement", url: "https://www.alibabacloud.com/blog/alibaba-unveils-qwen3-8-27b-and-releases-weights-of-qwen3-8-flagship-model_603463" },
    ],
    sources: ["https://www.alibabacloud.com/blog/alibaba-unveils-qwen3-8-27b-and-releases-weights-of-qwen3-8-flagship-model_603463"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    nameZh: "深度求索",
    website: "https://www.deepseek.com/",
    overview: {
      en: "Develops the DeepSeek models, publishes model files for download under the MIT license, and offers a chat service and a developer API.",
      ar: "تطوّر نماذج DeepSeek، وتنشر ملفات نماذجها للتنزيل بترخيص MIT، وتقدّم خدمة محادثة وواجهة API للمطورين.",
      zh: "开发 DeepSeek 系列模型，以 MIT 许可发布可下载的模型文件，并提供对话服务与开发者 API。",
    },
    links: [
      { label: "deepseek.com", url: "https://www.deepseek.com/" },
      { label: "Chat", url: "https://chat.deepseek.com/" },
      { label: "API change log", url: "https://api-docs.deepseek.com/updates" },
    ],
    sources: ["https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro", "https://api-docs.deepseek.com/updates"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "moonshot-ai",
    name: "Moonshot AI",
    nameZh: "月之暗面",
    website: "https://www.moonshot.ai",
    overview: {
      en: "Develops the Kimi models and the Kimi assistant, along with the Kimi Code command-line tool and a developer API platform.",
      ar: "تطوّر نماذج Kimi ومساعد Kimi، إضافةً إلى أداة Kimi Code التي تعمل من سطر الأوامر، ومنصة API للمطورين.",
      zh: "开发 Kimi 系列模型与 Kimi 助手，并提供 Kimi Code 命令行工具和开发者 API 平台。",
    },
    links: [
      { label: "moonshot.ai", url: "https://www.moonshot.ai" },
      { label: "Kimi", url: "https://www.kimi.com" },
      { label: "API platform", url: "https://platform.kimi.ai" },
    ],
    sources: ["https://huggingface.co/moonshotai/Kimi-K3"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "zhipu-ai",
    name: "Z.ai (Zhipu AI)",
    nameZh: "智谱",
    website: "https://z.ai",
    overview: {
      en: "Develops the GLM models, releases them for download under the MIT license, and offers a chat service and API documentation for developers.",
      ar: "تطوّر نماذج GLM، وتتيحها للتنزيل بترخيص MIT، وتقدّم خدمة محادثة ووثائق API للمطورين.",
      zh: "开发 GLM 系列模型，以 MIT 许可开放下载，并提供对话服务和开发者 API 文档。",
    },
    links: [
      { label: "Chat", url: "https://chat.z.ai" },
      { label: "API docs", url: "https://docs.z.ai/guides/llm/glm-5.1" },
      { label: "GitHub", url: "https://github.com/zai-org/GLM-5" },
    ],
    sources: ["https://huggingface.co/zai-org/GLM-5.1"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "minimax",
    name: "MiniMax",
    nameZh: "MiniMax（稀宇科技）",
    website: "https://www.minimax.io",
    overview: {
      en: "Develops the MiniMax models and offers a developer API platform and the MiniMax Code agent.",
      ar: "تطوّر نماذج MiniMax، وتقدّم منصة API للمطورين ووكيل MiniMax Code.",
      zh: "开发 MiniMax 系列模型，并提供开发者 API 平台和 MiniMax Code 智能体。",
    },
    links: [
      { label: "minimax.io", url: "https://www.minimax.io" },
      { label: "API platform", url: "https://platform.minimax.io/" },
      { label: "MiniMax Code", url: "https://agent.minimax.io/" },
    ],
    sources: ["https://huggingface.co/MiniMaxAI/MiniMax-M3/blob/main/README.md"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "tencent",
    name: "Tencent (Hunyuan)",
    nameZh: "腾讯（混元）",
    website: "https://aistudio.tencent.com/",
    overview: {
      en: "Tencent's Hunyuan team develops the Hy models and releases them for download under the Apache 2.0 license.",
      ar: "يطوّر فريق Hunyuan في Tencent نماذج Hy، ويتيحها للتنزيل بترخيص Apache 2.0.",
      zh: "腾讯混元团队开发 Hy 系列模型，并以 Apache 2.0 许可开放下载。",
    },
    links: [
      { label: "Tencent AI Studio", url: "https://aistudio.tencent.com/" },
      { label: "GitHub", url: "https://github.com/Tencent-Hunyuan/Hy3" },
    ],
    sources: ["https://huggingface.co/tencent/Hy3"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "bytedance",
    name: "ByteDance (Seed)",
    nameZh: "字节跳动（Seed）",
    website: "https://seed.bytedance.com/",
    overview: {
      en: "ByteDance's Seed team develops the Seed models used by the Doubao assistant, which are also available on the Volcano Engine platform.",
      ar: "يطوّر فريق Seed في ByteDance نماذج Seed التي يعمل بها مساعد Doubao، وهي متاحة كذلك عبر منصة Volcano Engine.",
      zh: "字节跳动 Seed 团队开发豆包助手所使用的 Seed 系列模型，这些模型也可通过火山引擎使用。",
    },
    links: [
      { label: "seed.bytedance.com", url: "https://seed.bytedance.com/" },
    ],
    sources: ["https://seed.bytedance.com/blog/seed2-1-officially-released-advancing-ai-productivity"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "baidu",
    name: "Baidu",
    nameZh: "百度",
    website: "https://ernie.baidu.com/",
    overview: {
      en: "Develops the ERNIE models, available to developers through the Baidu Qianfan platform.",
      ar: "تطوّر نماذج ERNIE، المتاحة للمطورين عبر منصة Baidu Qianfan.",
      zh: "开发文心（ERNIE）系列模型，开发者可通过百度千帆平台使用。",
    },
    links: [
      { label: "ernie.baidu.com", url: "https://ernie.baidu.com/" },
      { label: "Baidu Qianfan", url: "https://cloud.baidu.com/product/qianfan.html" },
    ],
    sources: ["https://ernie.baidu.com/"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
];

export const getCompany = (slug: string) => COMPANIES.find((c) => c.slug === slug);
