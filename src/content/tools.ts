// Tools and models catalogue (drafts).
//
// Rules (see 01-status-and-decisions.md):
// - Every fact comes from an official source listed in `sources`.
// - New entries start as "needs_review". Only Hadeel (editor) changes them to
//   "verified" after checking the sources. Unverified entries are always shown
//   with a "Needs review" label, never as confirmed facts.
// - Summaries in Arabic and Chinese are AI drafts and need review too.
// - Fields mirror the planned `tools` table so this moves to Supabase as is.

import type { CategorySlug } from "./categories";

export type ToolStatus = "draft" | "needs_review" | "verified";
export type ToolType = "model" | "tool" | "app" | "project" | "framework";
export type Runtime = "local" | "api" | "cloud";
/** "not_stated": the official source does not say; never guess. */
export type LicenseKind = "open_source" | "open_weight" | "proprietary" | "not_stated";

export type LocalizedList = { ar: string[]; en: string[]; zh: string[] };

export type Tool = {
  slug: string;
  name: string;
  type: ToolType;
  /** Mirrors the tool_categories table. */
  categories: CategorySlug[];
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
  /** Lists taken from the sources; empty when the source says nothing. */
  useCases: LocalizedList;
  requirements: LocalizedList;
  limitations: LocalizedList;
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
    categories: ["ai-models", "local-ai"],
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
    useCases: {
      en: ["Everyday chat and writing, with a fast mode for routine tasks", "Complex problem solving and planning with deeper reasoning modes", "Coding and multi-step agent workflows", "Working with very long documents"],
      ar: ["المحادثة والكتابة اليومية، مع وضع سريع للمهام المعتادة", "حل المشكلات المعقدة والتخطيط باستخدام أوضاع التفكير الأعمق", "البرمجة والمهام متعددة الخطوات التي ينفذها الذكاء الاصطناعي", "التعامل مع المستندات الطويلة جدًا"],
      zh: ["日常对话与写作，常规任务可用快速模式", "借助更深的推理模式解决复杂问题和进行规划", "编程与多步骤智能体工作流", "处理超长文档"],
    },
    requirements: {
      en: ["Self-hosting uses serving engines such as vLLM or SGLang", "The deepest reasoning mode needs a context of at least 384K tokens"],
      ar: ["يتطلب التشغيل الذاتي برامج تشغيل النماذج مثل vLLM أو SGLang", "يحتاج أعمق أوضاع التفكير إلى سعة نص لا تقل عن 384 ألف رمز"],
      zh: ["自行部署需使用 vLLM 或 SGLang 等推理引擎", "最深的推理模式需要至少 384K tokens 的上下文"],
    },
    limitations: {
      en: [],
      ar: [],
      zh: [],
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
    categories: ["ai-models", "local-ai"],
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
    useCases: {
      en: ["Long engineering sessions on large codebases, including Terminal tools", "Deep research with interactive charts and dashboards", "Motion design and video editing"],
      ar: ["جلسات برمجية طويلة على مشاريع كبيرة، بما في ذلك أدوات Terminal", "البحث المعمّق مع رسوم ولوحات بيانات تفاعلية", "تصميم الرسوم المتحركة وتحرير الفيديو"],
      zh: ["在大型代码库上进行长时间工程工作，包括终端工具", "带交互式图表和仪表板的深度研究", "动态设计与视频剪辑"],
    },
    requirements: {
      en: [],
      ar: [],
      zh: [],
    },
    limitations: {
      en: ["Businesses offering it as a service with more than $20M revenue in 12 months need a separate agreement with Moonshot AI", "Products with over 100M monthly users or over $20M monthly revenue must show “Kimi K3” in their interface"],
      ar: ["تحتاج الشركات التي تقدّمه خدمةً وتتجاوز إيراداتها 20 مليون دولار خلال 12 شهرًا إلى اتفاقية منفصلة مع Moonshot AI", "يجب على المنتجات التي يتجاوز مستخدموها 100 مليون شهريًا أو إيراداتها 20 مليون دولار شهريًا عرض اسم «Kimi K3» في واجهتها"],
      zh: ["以服务形式提供且 12 个月收入超过 2000 万美元的企业，需与 Moonshot AI 另签协议", "月活用户超过 1 亿或月收入超过 2000 万美元的产品，须在界面中显示“Kimi K3”"],
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
    categories: ["ai-models", "local-ai"],
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
    useCases: {
      en: ["Long, multi-step coding tasks", "Work inside the Terminal"],
      ar: ["المهام البرمجية الطويلة متعددة الخطوات", "العمل داخل Terminal"],
      zh: ["长程、多步骤的编程任务", "终端内的工作"],
    },
    requirements: {
      en: ["Self-hosting supports SGLang, vLLM, Transformers, xLLM and KTransformers"],
      ar: ["يدعم التشغيل الذاتي برامج SGLang وvLLM وTransformers وxLLM وKTransformers"],
      zh: ["自行部署支持 SGLang、vLLM、Transformers、xLLM 和 KTransformers"],
    },
    limitations: {
      en: ["The official model page does not state the context length"],
      ar: ["لا تذكر صفحة النموذج الرسمية سعة النص"],
      zh: ["官方模型页面未注明上下文长度"],
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
    categories: ["ai-models", "local-ai"],
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
    useCases: {
      en: ["Coding and professional work", "Research", "Long, multi-step agent tasks", "Understanding images and video"],
      ar: ["البرمجة والأعمال المهنية", "البحث", "المهام الطويلة متعددة الخطوات التي ينفذها الذكاء الاصطناعي", "فهم الصور والفيديو"],
      zh: ["编程与专业工作", "研究", "长程、多步骤的智能体任务", "理解图像与视频"],
    },
    requirements: {
      en: ["Runs on consumer hardware, and on a laptop after reducing its size (according to Alibaba)"],
      ar: ["يعمل على الأجهزة الشخصية المعتادة، وعلى الحاسوب المحمول بعد تقليص حجمه (بحسب Alibaba)"],
      zh: ["可在消费级硬件上运行，缩减体积后可在笔记本电脑上运行（据阿里巴巴）"],
    },
    limitations: {
      en: ["The announcement does not say whether it is available through an API"],
      ar: ["لا يذكر الإعلان ما إذا كان متاحًا عبر API"],
      zh: ["公告未说明是否提供 API"],
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
    categories: ["ai-models", "local-ai"],
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
    useCases: {
      en: ["Long agent work, especially coding", "Office and collaboration tasks", "Three reasoning modes: on, adaptive or off"],
      ar: ["المهام الطويلة التي ينفذها الذكاء الاصطناعي، ولا سيما البرمجة", "المهام المكتبية والتعاونية", "ثلاثة أوضاع للتفكير: مفعّل، أو تلقائي بحسب المهمة، أو متوقف"],
      zh: ["长程智能体工作，尤其是编程", "办公与协作任务", "三种推理模式：开启、自适应或关闭"],
    },
    requirements: {
      en: [],
      ar: [],
      zh: [],
    },
    limitations: {
      en: ["Free for non-commercial use only", "Commercial products must display “Built with MiniMax M3”", "Companies above $20M yearly revenue need written permission; smaller ones send a one-time notice"],
      ar: ["مجاني للاستخدام غير التجاري فقط", "يجب على المنتجات التجارية عرض عبارة «Built with MiniMax M3»", "تحتاج الشركات التي تتجاوز إيراداتها السنوية 20 مليون دولار إلى إذن مكتوب، ويكفي الشركات الأصغر إرسال إشعار لمرة واحدة"],
      zh: ["仅限非商业用途免费", "商业产品须显示“Built with MiniMax M3”", "年收入超过 2000 万美元的企业需书面授权，较小企业只需发送一次性通知"],
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
    categories: ["ai-models", "local-ai"],
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
    useCases: {
      en: ["Agent tasks and coding", "Office work and financial modeling", "Front-end design and game development", "Reasoning and long documents"],
      ar: ["المهام التي ينفذها الذكاء الاصطناعي والبرمجة", "الأعمال المكتبية والنمذجة المالية", "تصميم الواجهات وتطوير الألعاب", "الاستدلال المنطقي والمستندات الطويلة"],
      zh: ["智能体任务与编程", "办公与财务建模", "前端设计与游戏开发", "推理与长文档"],
    },
    requirements: {
      en: ["Can be further trained (fine-tuned) on your own data"],
      ar: ["يمكن تدريبه تدريبًا إضافيًا على بياناتك الخاصة"],
      zh: ["可在自有数据上进一步训练（微调）"],
    },
    limitations: {
      en: ["Text only: no image, audio or video input"],
      ar: ["يتعامل مع النصوص فقط، ولا يقبل الصور أو الصوت أو الفيديو"],
      zh: ["仅支持文本，不支持图像、音频或视频输入"],
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
    categories: ["ai-models"],
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
    useCases: {
      en: ["Multi-step office work: planning, documents and tool use", "Full software development, from requirements to bug fixing", "Understanding documents, charts and video", "Operating apps on phones and computers"],
      ar: ["المهام المكتبية متعددة الخطوات: التخطيط والمستندات واستخدام الأدوات", "تطوير البرمجيات كاملًا، من المتطلبات إلى إصلاح الأخطاء", "فهم المستندات والرسوم البيانية والفيديو", "التحكم بالتطبيقات على الهاتف والحاسوب"],
      zh: ["多步骤办公：规划、文档处理与工具使用", "完整的软件开发，从需求到修复缺陷", "理解文档、图表与视频", "在手机和电脑上操作应用"],
    },
    requirements: {
      en: [],
      ar: [],
      zh: [],
    },
    limitations: {
      en: ["The source does not state the license, whether it can be downloaded, or its context length"],
      ar: ["لا يذكر المصدر الترخيص، ولا إمكانية التنزيل، ولا سعة النص"],
      zh: ["来源未说明许可、是否可下载以及上下文长度"],
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
    categories: ["ai-models"],
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
    useCases: {
      en: ["Writing code and using tools to build games, 3D models and videos"],
      ar: ["كتابة الشيفرة واستخدام الأدوات لبناء الألعاب والنماذج ثلاثية الأبعاد والفيديو"],
      zh: ["编写代码并调用工具制作游戏、3D 模型和视频"],
    },
    requirements: {
      en: [],
      ar: [],
      zh: [],
    },
    limitations: {
      en: ["Still a preview release", "The source does not state the license or whether it can be downloaded"],
      ar: ["ما زال إصدارًا تجريبيًا", "لا يذكر المصدر الترخيص ولا إمكانية التنزيل"],
      zh: ["仍为预览版", "来源未说明许可及是否可下载"],
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


export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
