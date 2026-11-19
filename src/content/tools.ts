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
/** "not_stated": the official source does not say; never guess. */
export type LicenseKind = "open_source" | "open_weight" | "proprietary" | "not_stated";

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
      ar: "نموذج لغوي ضخم يتيح ثلاثة مستويات من التفكير بحسب صعوبة المهمة، ويناسب البرمجة، والمهام متعددة الخطوات التي ينفذها الذكاء الاصطناعي تلقائيًا، والمستندات الطويلة.",
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
      ar: "نموذج متاح للتنزيل والتشغيل الذاتي، يفهم النصوص والصور والفيديو، وقد صُمّم لجلسات البرمجة الطويلة والبحث. ويشترط ترخيصه على الشركات الكبرى التي تقدّمه خدمةً تجارية إبرامَ اتفاقية خاصة مع Moonshot AI.",
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
      ar: "النموذج الأقوى لدى Z.ai، صُمّم للمهام البرمجية الطويلة متعددة الخطوات وللعمل في Terminal، ويمكن تشغيله على الأجهزة الخاصة باستخدام برامج تشغيل النماذج الشائعة.",
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
      ar: "نموذج متوسط الحجم يفهم النصوص والصور والفيديو. وتذكر Alibaba أنه يعمل على الأجهزة الشخصية المعتادة، بل وعلى الحاسوب المحمول بعد تقليص حجمه. ويناسب البرمجة والبحث.",
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
{
    slug: "minimax-m3",
    name: "MiniMax-M3",
    type: "model",
    company: "minimax",
    companyName: "MiniMax",
    license: { kind: "open_weight", name: "MiniMax Community License" },
    runtime: ["local", "api"],
    specs: { parameters: "428B total, 23B active", contextTokens: "1M", modalities: ["text", "image", "video"] },
    summary: {
      en: "Multimodal model for long agent work, especially coding. Free for non-commercial use; commercial products must credit MiniMax, and companies above $20M yearly revenue need written permission.",
      ar: "نموذج متعدد الوسائط مخصّص للمهام الطويلة التي ينفذها الذكاء الاصطناعي، ولا سيما البرمجة. استخدامه مجاني للأغراض غير التجارية، أما المنتجات التجارية فيلزمها ذكر MiniMax، وتحتاج الشركات التي تتجاوز إيراداتها السنوية 20 مليون دولار إلى إذن مكتوب.",
      zh: "面向长程智能体任务（尤其是编程）的多模态模型。非商业用途免费；商业产品须注明 MiniMax，年收入超过 2000 万美元的企业需事先获得书面授权。",
    },
    links: [
      { label: "Hugging Face", url: "https://huggingface.co/MiniMaxAI/MiniMax-M3" },
      { label: "API platform", url: "https://platform.minimax.io/" },
      { label: "GitHub", url: "https://github.com/MiniMax-AI/MiniMax-M3" },
    ],
    sources: [
      "https://huggingface.co/MiniMaxAI/MiniMax-M3/blob/main/README.md",
      "https://huggingface.co/MiniMaxAI/MiniMax-M3/raw/main/LICENSE",
    ],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "hy3",
    name: "Hy3",
    type: "model",
    company: "tencent",
    companyName: "Tencent (Hunyuan)",
    license: { kind: "open_weight", name: "Apache 2.0" },
    runtime: ["local"],
    specs: { parameters: "295B total, 21B active", contextTokens: "256K", modalities: ["text"] },
    summary: {
      en: "Text model from Tencent Hunyuan for agent tasks, coding, office work and long documents. Released under Apache 2.0 with no extra restrictions on commercial use.",
      ar: "نموذج نصي من فريق Hunyuan في Tencent، مخصّص للمهام التي ينفذها الذكاء الاصطناعي، والبرمجة، والأعمال المكتبية، والمستندات الطويلة. صدر بترخيص Apache 2.0 دون قيود إضافية على الاستخدام التجاري.",
      zh: "腾讯混元推出的文本模型，面向智能体任务、编程、办公与长文档。采用 Apache 2.0 许可，商业使用无额外限制。",
    },
    links: [
      { label: "Hugging Face", url: "https://huggingface.co/tencent/Hy3" },
      { label: "GitHub", url: "https://github.com/Tencent-Hunyuan/Hy3" },
    ],
    sources: [
      "https://huggingface.co/tencent/Hy3",
      "https://huggingface.co/tencent/Hy3/raw/main/LICENSE",
    ],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "seed-2-1",
    name: "Seed2.1 (Doubao Seed 2.1)",
    type: "model",
    company: "bytedance",
    companyName: "ByteDance (Seed)",
    license: { kind: "not_stated", name: "—" },
    runtime: ["cloud"],
    specs: {},
    summary: {
      en: "ByteDance's model family behind the Doubao assistant, for office tasks, software development, documents and charts, and operating apps on phones and computers. Available in the Doubao app and on Volcano Engine.",
      ar: "عائلة النماذج التي يعمل بها مساعد Doubao من ByteDance، وتُستخدم في المهام المكتبية، وتطوير البرمجيات، وفهم المستندات والرسوم البيانية، والتحكم بالتطبيقات على الهاتف والحاسوب. متاحة عبر تطبيق Doubao ومنصة Volcano Engine.",
      zh: "字节跳动豆包助手背后的模型家族，适用于办公任务、软件开发、文档与图表理解，以及在手机和电脑上操作应用。可通过豆包应用和火山引擎使用。",
    },
    links: [
      { label: "Seed blog", url: "https://seed.bytedance.com/blog/seed2-1-officially-released-advancing-ai-productivity" },
    ],
    sources: ["https://seed.bytedance.com/blog/seed2-1-officially-released-advancing-ai-productivity"],
    lastChecked: "2026-11-19",
    status: "needs_review",
  },
  {
    slug: "ernie-5-5-flash-preview",
    name: "ERNIE 5.5 Flash (Preview)",
    type: "model",
    company: "baidu",
    companyName: "Baidu",
    license: { kind: "not_stated", name: "—" },
    runtime: ["api"],
    specs: {},
    summary: {
      en: "Baidu's newest ERNIE release, still in preview. Baidu shows it writing code and using tools to build games, 3D models and videos. Available through Baidu Qianfan and OpenRouter.",
      ar: "أحدث إصدارات ERNIE من Baidu، وما زال في مرحلة تجريبية. تعرض Baidu قدرته على كتابة الشيفرة واستخدام الأدوات لبناء الألعاب والنماذج ثلاثية الأبعاد والفيديو. متاح عبر منصة Baidu Qianfan وOpenRouter.",
      zh: "百度最新的文心（ERNIE）版本，仍处于预览阶段。百度展示其可编写代码并调用工具来制作游戏、3D 模型和视频。可通过百度千帆和 OpenRouter 使用。",
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
