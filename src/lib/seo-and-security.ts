// ============================================================
// TOOLGLOBE — Dynamic SEO & Long-Tail Content Engine
// + Zod Input Sanitizer (Server-Safe, No DOMPurify SSR)
// ============================================================

import { z } from "zod";

// ─── INPUT SANITIZER ─────────────────────────────────────
export const ToolInputSchema = z.object({
  input: z
    .string()
    .max(50000, "Input too long — maximum 50,000 characters")
    .transform((val) =>
      val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
        .trim()
    ),
  secondInput: z
    .string()
    .max(50000)
    .optional()
    .transform((val) => val?.trim()),
});

export type ToolInput = z.infer<typeof ToolInputSchema>;

export function sanitizeInput(raw: string): string {
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "data-removed=")
    .slice(0, 50000)
    .trim();
}

// ─── SEEDED PSEUDO-RANDOM ────────────────────────────────
function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + String(index);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) / 2147483647;
}

function seededPick<T>(arr: T[], seed: string, idx: number): T {
  return arr[Math.floor(seededRandom(seed, idx) * arr.length)];
}

// ─── CONTENT TEMPLATES ──────────────────────────────────
const HOOK_STARTERS = [
  "Whether you're a seasoned professional or just starting out,",
  "In today's fast-paced digital world,",
  "Saving time on repetitive tasks has never been easier—",
  "Trusted by thousands of developers, designers and students worldwide,",
  "Efficiency is the cornerstone of modern productivity, and",
  "Stop wasting time on manual work.",
];

const BENEFIT_POOLS: Record<string, string[]> = {
  default: [
    "⚡ Instant results — no page reload, no waiting",
    "🔒 100% privacy — all processing happens in your browser",
    "📋 One-click copy to clipboard for instant use",
    "📤 Export results as TXT or PDF for offline access",
    "🔗 Share tool links directly with your team",
    "🌐 Works on all devices — desktop, tablet and mobile",
    "♾️ Unlimited usage — completely free, forever",
    "🚀 No signup or account required — use it right away",
    "🎯 Optimized for accuracy with edge-case handling",
    "💡 Built for professionals, students and everyday users",
  ],
  "text-tools": [
    "📝 Process unlimited text without word limits",
    "🔡 Handles Unicode, emoji and multi-language text",
    "⚡ Real-time processing as you type",
    "📊 Detailed analytics for word, character and sentence counts",
    "🔄 Supports batch processing of multiple text blocks",
    "💼 Perfect for writers, bloggers and content creators",
  ],
  "seo-tools": [
    "🔍 Aligned with Google's latest algorithm requirements",
    "📈 Actionable insights to improve search rankings",
    "🎯 Long-tail keyword targeting made easy",
    "📋 Copy-ready meta tags for immediate deployment",
    "🌐 Works for any website, blog or e-commerce store",
    "📊 Score your content against top-ranking pages",
  ],
  "developer-tools": [
    "💻 Syntax highlighting for easy readability",
    "🔐 Secure — sensitive data never leaves your browser",
    "⚡ Sub-millisecond processing for large datasets",
    "📋 Copy formatted code with one click",
    "🧩 Compatible with all major programming languages",
    "🔧 Built by developers, for developers",
  ],
  "finance-tools": [
    "💰 Accurate to 6 decimal places for financial precision",
    "📊 Complete breakdown with step-by-step calculations",
    "📅 Monthly and yearly amortization schedules",
    "🌍 Supports multiple currencies and regional tax rates",
    "🔒 No data stored — your finances stay private",
    "📄 Download PDF reports for record-keeping",
  ],
};

const HOW_TO_STEPS: Record<string, string[]> = {
  default: [
    "Enter or paste your input into the field above",
    "Configure any optional settings if needed",
    "Click the **Process** button to get instant results",
    "Review your output in the results panel below",
    "Copy, share, download TXT or export to PDF",
  ],
  "text-tools": [
    "Paste or type your text into the input area",
    "Select any text processing options from the panel",
    "Results update instantly as you type",
    "Use the copy button to grab the processed output",
    "Share the tool URL with colleagues for team use",
  ],
  "developer-tools": [
    "Paste your code or data into the input editor",
    "Select your desired output format or options",
    "Click Process to run the transformation",
    "Review syntax-highlighted output in the result panel",
    "Copy, download or share the formatted result",
  ],
};

const FAQ_POOLS: Record<string, Array<{ q: string; a: string }>> = {
  default: [
    {
      q: "Is this tool completely free to use?",
      a: "Yes, 100% free with no hidden fees, no trial period and no account required. ToolGlobe provides unlimited free access to all tools forever.",
    },
    {
      q: "Is my data safe and private?",
      a: "Absolutely. All processing happens directly in your browser using client-side JavaScript. No data is ever transmitted to our servers, logged or stored.",
    },
    {
      q: "Does this tool work on mobile devices?",
      a: "Yes, ToolGlobe is fully responsive and works perfectly on smartphones, tablets and desktop browsers including Chrome, Firefox, Safari and Edge.",
    },
    {
      q: "Are there any limits on input size?",
      a: "You can process up to 50,000 characters per input, which is more than enough for most professional use cases.",
    },
    {
      q: "Can I share my results with others?",
      a: "Yes! Use the Share button to copy a direct link to the tool. You can also download results as a TXT or PDF file.",
    },
    {
      q: "Do I need to install any software?",
      a: "No installation required. This tool runs entirely in your web browser — just visit the page and start using it immediately.",
    },
  ],
};

const USE_CASES: Record<string, string[]> = {
  "text-tools": [
    "Content writers checking word count for blog posts and articles",
    "Students formatting essays and academic assignments",
    "Developers processing and transforming text data",
    "SEO professionals optimizing content length and readability",
    "Social media managers formatting posts for different platforms",
  ],
  "seo-tools": [
    "Bloggers optimizing article titles and meta descriptions",
    "Digital marketers running keyword research campaigns",
    "Web developers implementing structured data markup",
    "E-commerce store owners improving product page SEO",
    "Content agencies delivering SEO reports to clients",
  ],
  "developer-tools": [
    "Frontend developers formatting JSON responses from APIs",
    "Backend engineers generating UUIDs and hashes",
    "Security researchers testing encoding and decoding",
    "DevOps engineers validating configuration files",
    "Students learning programming concepts interactively",
  ],
  default: [
    "Professionals needing quick calculations or conversions",
    "Students working on assignments and projects",
    "Developers building and testing applications",
    "Content creators optimizing digital content",
    "Small business owners managing operations efficiently",
  ],
};

// ─── RICH CONTENT GENERATOR ──────────────────────────────
export interface RichContent {
  intro: string;
  benefits: string[];
  howToSteps: string[];
  useCases: string[];
  proTips: string[];
  faqs: Array<{ q: string; a: string }>;
  conclusion: string;
}

export function generateRichContent(
  toolName: string,
  toolDescription: string,
  category: string,
  slug: string,
  keywords: string[]
): RichContent {
  const seed = `${category}-${slug}`;
  const kw1 = keywords[0] ?? `${toolName.toLowerCase()} tool`;
  const kw2 = keywords[1] ?? `free ${toolName.toLowerCase()}`;
  const kw3 = keywords[2] ?? `online ${toolName.toLowerCase()}`;

  const benefitPool = BENEFIT_POOLS[category] ?? BENEFIT_POOLS.default;
  const allBenefits = [...benefitPool, ...BENEFIT_POOLS.default];
  const benefits = Array.from({ length: 8 }, (_, i) =>
    seededPick(allBenefits, seed + "benefit", i)
  ).filter((v, i, a) => a.indexOf(v) === i).slice(0, 7);

  const stepPool = HOW_TO_STEPS[category] ?? HOW_TO_STEPS.default;
  const howToSteps = stepPool;

  const ucPool = USE_CASES[category] ?? USE_CASES.default;
  const useCases = Array.from({ length: 5 }, (_, i) =>
    seededPick(ucPool, seed + "uc", i)
  ).filter((v, i, a) => a.indexOf(v) === i);

  const proTips = [
    `Use ${toolName} regularly to build faster workflows — bookmark this page for instant access.`,
    `Combine ${toolName} with other ${category.replace(/-/g, " ")} on ToolGlobe for a complete productivity stack.`,
    `For batch operations, split your data into chunks and process each separately for best results.`,
    `The Share button lets you send a direct link — great for team collaboration and remote work.`,
    `Download your results as PDF for professional documentation or client reports.`,
  ];

  const faqPool = FAQ_POOLS[category] ?? FAQ_POOLS.default;
  const baseFaqs = FAQ_POOLS.default;
  const toolFaqs: Array<{ q: string; a: string }> = [
    {
      q: `What is the best free ${kw1.split(" ").slice(0, 4).join(" ")}?`,
      a: `ToolGlobe's ${toolName} is widely regarded as one of the best free tools available. It's fast, accurate, requires no signup, and runs entirely in your browser for complete privacy.`,
    },
    {
      q: `How do I use the ${toolName} online?`,
      a: `Simply enter your input in the field above and click Process. Results appear instantly. You can then copy, share, download as TXT, or export as PDF with one click.`,
    },
    {
      q: `Can I use the ${kw2} for commercial projects?`,
      a: `Yes, you can use ${toolName} for both personal and commercial projects completely free. There are no usage restrictions or licensing fees.`,
    },
    ...faqPool.slice(0, 4),
    ...baseFaqs.slice(0, 3),
  ].filter((v, i, a) => a.findIndex(x => x.q === v.q) === i).slice(0, 8);

  const hookStarter = seededPick(HOOK_STARTERS, seed, 0);

  const intro = `${hookStarter} our **${toolName}** is the fastest, most reliable way to ${toolDescription.toLowerCase().replace(/\.$/, "")}. ${toolDescription} Designed for both beginners and experts, this ${kw3} delivers instant, accurate results without any downloads, installations or sign-ups. As part of ToolGlobe's suite of ${category.replace(/-/g, " ")}, this tool processes everything client-side — your data never leaves your browser, ensuring complete privacy and security.\n\nThis comprehensive guide explains everything you need to know about using our ${kw1}, including step-by-step instructions, key benefits, real-world use cases, pro tips, and frequently asked questions to help you get the most out of this powerful free tool.`;

  const conclusion = `Our free **${toolName}** is one of the most versatile and user-friendly ${category.replace(/-/g, " ")} available online today. Whether you're a ${seededPick(["developer", "student", "professional", "content creator", "marketer"], seed, 5)} looking to streamline your workflow, or simply need a quick one-time conversion, ToolGlobe has you covered. Bookmark this page and share it with your team — because great tools should be accessible to everyone, free of charge, always. Explore our full library of **20,000+ micro-tools** and supercharge your productivity today.`;

  return { intro, benefits, howToSteps, useCases, proTips, faqs: toolFaqs, conclusion };
}

// ─── JSON-LD SCHEMA GENERATOR ────────────────────────────
export function generateWebAppSchema(
  toolName: string,
  toolDescription: string,
  category: string,
  slug: string,
  baseUrl: string
): string {
  const url = `${baseUrl}/${category}/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${toolName} — ToolGlobe`,
    description: toolDescription,
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Hassan Asghar",
      email: "hassan.asghar7868686@gmail.com",
    },
    publisher: {
      "@type": "Organization",
      name: "ToolGlobe",
      url: baseUrl,
    },
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript",
  };
  return JSON.stringify(schema, null, 2);
}

export function generateFAQSchema(faqs: Array<{ q: string; a: string }>): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
  return JSON.stringify(schema, null, 2);
}

export function generateBreadcrumbSchema(
  category: string,
  categoryName: string,
  toolName: string,
  slug: string,
  baseUrl: string
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${baseUrl}/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: toolName,
        item: `${baseUrl}/${category}/${slug}`,
      },
    ],
  };
  return JSON.stringify(schema, null, 2);
}
