// Tools and models catalogue (drafts).
//
// Rules (see 01-status-and-decisions.md):
// - Every fact comes from an official source listed in `sources`.
// - New entries start as "needs_review". Only Hadeel (editor) changes them to
//   "verified" after checking the sources. Unverified entries are always shown
//   with a "Needs review" label, never as confirmed facts.
// - Summaries in Arabic and Chinese are AI drafts and need review too.
// - Fields mirror the planned `tools` table so this moves to Supabase as is.

export type ToolStatus = "draft" | "needs_review" | "verified";
export type ToolType = "model" | "tool" | "app" | "project" | "framework";
export type Runtime = "local" | "api" | "cloud";
export type LicenseKind = "open_source" | "open_weight" | "proprietary";

export type Tool = {
  slug: string;
  name: string;
  type: ToolType;
  /** Company slug, matches the companies list. */
  company: string;
  companyName: string;
  license: { kind: LicenseKind; name: string };
  /** How people can run it, as stated by the official source. */
  runtime: Runtime[];
  /** Only what the source states; omitted when not stated. */
  specs: {
    parameters?: string;
    contextTokens?: string;
    modalities?: string[];
  };
  summary: { ar: string; en: string; zh: string };
  links: { label: string; url: string }[];
  /** Pages the facts above were taken from. */
  sources: string[];
  /** Date the sources were last read (YYYY-MM-DD). */
  lastChecked: string;
  status: ToolStatus;
  verifiedBy?: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "deepseek-v4-pro",
    name: "DeepSeek-V4-Pro",
    type: "model",
    company: "deepseek",
    companyName: "DeepSeek",
    license: { kind: "open_weight", name: "MIT" },
    runtime: ["local", "api"],
    specs: { parameters: "1.6T total, 49B active (MoE)", contextTokens: "1M" },
    summary: {
      en: "Large mixture-of-experts language model with three reasoning modes, aimed at coding, agent workflows and long documents.",
      ar: "نموذج لغوي كبير من نوع Mixture-of-Experts بثلاثة أوضاع للتفكير، موجّه للبرمجة ومهام الوكلاء والمستندات الطويلة.",
      zh: "大型混合专家（MoE）语言模型，提供三种推理模式，面向编程、智能体工作流与长文档。",
    },
    links: [
      { label: "Hugging Face", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro" },
      { label: "API change log", url: "https://api-docs.deepseek.com/updates" },
      { label: "deepseek.com", url: "https://www.deepseek.com/" },
    ],
    sources: [
      "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro",
      "https://api-docs.deepseek.com/updates",
    ],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "kimi-k3",
    name: "Kimi K3",
    type: "model",
    company: "moonshot-ai",
    companyName: "Moonshot AI",
    license: { kind: "open_weight", name: "Kimi K3 License" },
    runtime: ["local", "api"],
    specs: { parameters: "2.8T total, 104B active", contextTokens: "1M", modalities: ["text", "image", "video"] },
    summary: {
      en: "Open-weight model that handles text, images and video, built for long coding sessions, research and knowledge work. Large commercial services need a separate agreement under its license.",
      ar: "نموذج بأوزان مفتوحة يفهم النصوص والصور والفيديو، مصمم لجلسات البرمجة الطويلة والبحث والعمل المعرفي. الخدمات التجارية الكبيرة تحتاج اتفاقية منفصلة حسب ترخيصه.",
      zh: "开放权重模型，可理解文本、图像和视频，面向长时间编程、研究与知识工作。按其许可，大型商业服务需另行签署协议。",
    },
    links: [
      { label: "Hugging Face", url: "https://huggingface.co/moonshotai/Kimi-K3" },
      { label: "API platform", url: "https://platform.kimi.ai" },
      { label: "GitHub", url: "https://github.com/MoonshotAI/Kimi-K3" },
    ],
    sources: [
      "https://huggingface.co/moonshotai/Kimi-K3",
      "https://raw.githubusercontent.com/MoonshotAI/Kimi-K3/main/LICENSE",
    ],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "glm-5-1",
    name: "GLM-5.1",
    type: "model",
    company: "zhipu-ai",
    companyName: "Z.ai (Zhipu AI)",
    license: { kind: "open_weight", name: "MIT" },
    runtime: ["local", "api"],
    specs: { parameters: "754B total" },
    summary: {
      en: "Flagship model for agentic engineering, focused on long multi-step coding and terminal tasks. Can be served locally with common inference engines.",
      ar: "النموذج الرئيسي لهندسة الوكلاء، يركّز على مهام البرمجة الطويلة متعددة الخطوات والعمل في الطرفية، ويمكن تشغيله محليًا بمحركات الاستدلال الشائعة.",
      zh: "面向智能体工程的旗舰模型，专注长程、多步骤的编程与终端任务，可用常见推理引擎本地部署。",
    },
    links: [
      { label: "Hugging Face", url: "https://huggingface.co/zai-org/GLM-5.1" },
      { label: "API docs", url: "https://docs.z.ai/guides/llm/glm-5.1" },
      { label: "GitHub", url: "https://github.com/zai-org/GLM-5" },
    ],
    sources: ["https://huggingface.co/zai-org/GLM-5.1"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "qwen3-8-27b",
    name: "Qwen3.8-27B",
    type: "model",
    company: "alibaba",
    companyName: "Alibaba (Qwen)",
    license: { kind: "open_weight", name: "Apache 2.0" },
    runtime: ["local"],
    specs: { parameters: "27B (dense)", contextTokens: "262K (extendable to 1M)", modalities: ["text", "image", "video"] },
    summary: {
      en: "Mid-size multimodal model that understands images and video. Alibaba says it runs on consumer hardware and, quantized, on a laptop. Aimed at coding, research and agent tasks.",
      ar: "نموذج متوسط الحجم متعدد الوسائط يفهم الصور والفيديو. تقول Alibaba إنه يعمل على أجهزة المستخدمين العادية، وعلى اللابتوب بعد التكميم (quantization). موجّه للبرمجة والبحث ومهام الوكلاء.",
      zh: "中等规模的多模态模型，可理解图像和视频。阿里巴巴称其可在消费级硬件上运行，量化后可在笔记本电脑上运行。面向编程、研究与智能体任务。",
    },
    links: [
      { label: "Announcement", url: "https://www.alibabacloud.com/blog/alibaba-unveils-qwen3-8-27b-and-releases-weights-of-qwen3-8-flagship-model_603463" },
    ],
    sources: [
      "https://www.alibabacloud.com/blog/alibaba-unveils-qwen3-8-27b-and-releases-weights-of-qwen3-8-flagship-model_603463",
    ],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
];
