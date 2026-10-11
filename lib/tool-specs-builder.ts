// lib/tool-specs-builder.ts
// Deterministic JS Natural Language Generator — produces 200–400 words of
// unique SEO content + FAQPage/SoftwareApplication JSON-LD for EVERY tool,
// using seeded template selection instead of per-tool stored copy.

import { SITE_CONFIG } from "./site-config";
import { convertUnit } from "./engines";

export interface ToolMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  kind: "converter" | "quickvalue" | "text" | "math" | "seo";
  tier: 1 | 2 | 3;
  family?: string;
  fromUnit?: string;
  toUnit?: string;
  fromName?: string;
  toName?: string;
  fromSymbol?: string;
  toSymbol?: string;
  value?: number;
}

// --- Deterministic hashing / seeded pick -------------------------------------

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], seed: string): T {
  return arr[hashStr(seed) % arr.length];
}

// --- Template banks (small, combined combinatorially for uniqueness) --------

const INTROS = (t: ToolMeta) => [
  `The ${t.title} is a free, browser-based ${t.category} utility built for speed and precision. Whether you are a student double-checking homework, an engineer validating a design, or simply curious about a quick figure, this tool delivers instant, dependable results with zero sign-up and zero cost.`,
  `Searching for a trustworthy way to handle ${t.title.toLowerCase()}? This dedicated ${t.category} tool was engineered to remove the guesswork, replacing manual calculation with a clean, instant interface that works smoothly on both desktop and mobile.`,
  `${t.title} turns a task that normally requires a calculator, reference chart, or search engine into a single click. Built with accuracy-first logic, it is trusted by students, professionals, and everyday users across the globe.`,
  `Precision matters, especially when working with ${t.category.toLowerCase()}. That is why we built the ${t.title} — a lightweight, fast, and accurate utility that returns results the moment you type, without ads interrupting your workflow.`,
  `Welcome to the ${t.title}, a purpose-built utility inside our growing library of free online tools. It is designed from the ground up to be fast, accurate, mobile-friendly, and available around the clock with no installation required.`,
];

const HOW_IT_WORKS_CONVERTER = (t: ToolMeta, factor: number) => [
  `The underlying math is straightforward: to convert a value from ${t.fromName} to ${t.toName}, the tool multiplies your input by a fixed conversion factor of approximately ${factor}. This relationship is constant, meaning the same ratio applies whether you are converting a small decimal or a large whole number, so you can trust every output.`,
  `Behind the scenes, the converter applies the formula result = value × ${factor} to translate ${t.fromName} into ${t.toName}. Because this factor never changes, the engine returns results instantly without rounding errors creeping into everyday calculations.`,
  `Converting ${t.fromName} to ${t.toName} relies on a fixed multiplier of ${factor}. Enter any number, and the engine performs the multiplication internally, returning a precise decimal result formatted for readability in real time.`,
  `${t.fromName} and ${t.toName} are linked by a constant ratio of ${factor}. This converter applies that ratio automatically the instant you type, so there is never a need to memorize the formula yourself.`,
];

const HOW_IT_WORKS_GENERIC = (t: ToolMeta) => [
  `Simply paste or type your content into the input field, and the ${t.title} processes it instantly using optimized logic running entirely in your browser session. There is no file upload, no waiting, and nothing stored on a server.`,
  `The ${t.title} works by applying a deterministic algorithm to your input the moment you submit it, returning a clean, formatted result that you can copy or export immediately.`,
  `This tool processes your request client-side using lightweight, well-tested logic, meaning your data never leaves your device unless you choose to share the result yourself.`,
  `Using the ${t.title} is a three-step process: enter your data, review the instant output, and copy the result — all without refreshing the page or waiting for a server round-trip.`,
];

const USE_CASES = (t: ToolMeta) => [
  `This utility is commonly used in ${t.category.toLowerCase()}-related tasks such as academic assignments, professional reports, financial planning, scientific research, and quick everyday reference checks where both accuracy and speed matter.`,
  `Professionals in engineering, finance, education, and logistics regularly rely on tools like this one to avoid manual errors and save time during repetitive ${t.category.toLowerCase()} calculations.`,
  `Students, teachers, developers, and curious minds alike turn to this ${t.category.toLowerCase()} tool whenever they need a fast, verifiable answer without opening a spreadsheet or searching through textbooks.`,
  `From quick mobile lookups to detailed desktop workflows, this tool adapts to how you work, making it equally useful for one-off questions and repeated daily use.`,
];

const TIPS = () => [
  `Tip: bookmark this page for instant access whenever you need fast, reliable results — no app download required.`,
  `Pro tip: double-check edge-case values (very large or very small numbers) to see how the tool handles scientific notation gracefully.`,
  `Tip: this tool works fully offline once the page has loaded, making it reliable even on unstable connections.`,
  `Pro tip: share the direct link with teammates so everyone gets the exact same consistent result every time.`,
];

const CLOSINGS = (t: ToolMeta) => [
  `Explore our full catalogue of free calculators, converters, and SEO tools inside the ${t.category} collection to streamline more of your daily workflow in seconds.`,
  `Need something else? ${SITE_CONFIG.name} hosts thousands of similar free utilities designed with the same speed-first, privacy-respecting philosophy.`,
  `This tool is part of a growing library built to make everyday ${t.category.toLowerCase()} tasks effortless — explore related tools from the navigation above.`,
];

// --- Builder -----------------------------------------------------------------

export function buildToolSEO(tool: ToolMeta): {
  content: string;
  wordCount: number;
  faq: { q: string; a: string }[];
  jsonLd: Record<string, unknown>[];
  robots: string;
} {
  const seed = tool.slug;
  const intro = pick(INTROS(tool), seed + "i");

  let howItWorks: string;
  let sampleLine = "";

  if ((tool.kind === "converter" || tool.kind === "quickvalue") && tool.family && tool.fromUnit && tool.toUnit) {
    let factor = 1;
    try {
      factor = +convertUnit(tool.family, tool.fromUnit, tool.toUnit, 1).toPrecision(6);
    } catch {
      factor = 1;
    }
    howItWorks = pick(HOW_IT_WORKS_CONVERTER(tool, factor), seed + "h");
    if (tool.kind === "quickvalue" && tool.value !== undefined) {
      try {
        const res = convertUnit(tool.family, tool.fromUnit, tool.toUnit, tool.value);
        sampleLine = ` For example, ${tool.value} ${tool.fromSymbol ?? tool.fromName} equals approximately ${+res.toFixed(6)} ${tool.toSymbol ?? tool.toName}.`;
      } catch {
        sampleLine = "";
      }
    }
  } else {
    howItWorks = pick(HOW_IT_WORKS_GENERIC(tool), seed + "h");
  }

  const useCase = pick(USE_CASES(tool), seed + "u");
  const tip = pick(TIPS(), seed + "t");
  const closing = pick(CLOSINGS(tool), seed + "c");

  const content = [intro, howItWorks + sampleLine, useCase, tip, closing].join(" ");
  const wordCount = content.trim().split(/\s+/).length;

  const faq = buildFaq(tool);
  const jsonLd = buildJsonLd(tool, content, faq);
  const robots = getRobotsDirective(tool.tier);

  return { content, wordCount, faq, jsonLd, robots };
}

function buildFaq(tool: ToolMeta): { q: string; a: string }[] {
  const faq: { q: string; a: string }[] = [
    { q: `Is the ${tool.title} free to use?`, a: `Yes. The ${tool.title} is completely free, with no signup, subscription, or hidden charges required.` },
    { q: `How accurate are the results from this ${tool.category.toLowerCase()} tool?`, a: `This tool uses precise mathematical formulas and standard reference constants, ensuring high accuracy for everyday, academic, and professional use cases.` },
  ];

  if (tool.kind === "converter" && tool.family && tool.fromUnit && tool.toUnit) {
    try {
      const example = convertUnit(tool.family, tool.fromUnit, tool.toUnit, 1);
      faq.push({
        q: `What is 1 ${tool.fromName} in ${tool.toName}?`,
        a: `1 ${tool.fromName} is approximately equal to ${+example.toFixed(6)} ${tool.toName}, based on the standard conversion factor used by this tool.`,
      });
    } catch {
      /* skip */
    }
  }

  faq.push({ q: `Can I use this tool on mobile devices?`, a: `Yes, the ${tool.title} is fully responsive and works seamlessly on phones, tablets, and desktops.` });
  return faq;
}

function buildJsonLd(tool: ToolMeta, content: string, faq: { q: string; a: string }[]): Record<string, unknown>[] {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: content.slice(0, 160),
    url: `${SITE_CONFIG.url}/${tool.slug}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return [softwareApp, faqPage];
}

// --- Tiered indexing -----------------------------------------------------

export function getRobotsDirective(tier: 1 | 2 | 3): string {
  return tier === 3 ? "noindex, follow" : "index, follow";
}
