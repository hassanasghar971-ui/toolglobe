import type { Metadata } from "next";
import Link from "next/link";
import {
  TOOLS,
  TOOL_CATEGORIES,
  TOTAL_TOOLS_COUNT,
} from "@/lib/tools-registry";
import ToolCard from "@/components/ToolCard";

const BASE_URL = "https://pdflovers.com";

export const metadata: Metadata = {
  title: "Free Online PDF Tools – Merge, Compress, Convert & Edit PDFs",
  description:
    "PDF Lovers Pro offers 42+ free online PDF tools including merge, split, compress, convert, sign and protect PDF. 100% client-side WebAssembly processing — your files never leave your browser.",
  alternates: { canonical: BASE_URL },
};

const POPULAR_SLUGS = [
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "pdf-to-word",
  "edit-pdf",
  "sign-pdf",
];

const CATEGORY_EMOJI: Record<string, string> = {
  organize: "🗂️",
  optimize: "⚡",
  "convert-to-pdf": "📥",
  "convert-from-pdf": "📤",
  edit: "✏️",
  security: "🔒",
  "ai-ocr": "🧠",
  advanced: "🛠️",
};

const FAQS = [
  {
    q: "Is PDF Lovers Pro really free to use?",
    a: "Yes. All 42+ tools on PDF Lovers Pro are completely free with no hidden fees, no sign-up requirements, and no watermarks added to your processed files.",
  },
  {
    q: "Are my files uploaded to a server?",
    a: "No. Every single tool runs 100% inside your own browser using WebAssembly. Your PDF content never leaves your device, which means total privacy for sensitive contracts, IDs, and financial documents.",
  },
  {
    q: "Is there a file size or daily usage limit?",
    a: "Since processing happens entirely on your own device's hardware rather than a shared server, there are no artificial file size caps or daily conversion limits imposed by our platform.",
  },
  {
    q: "Do I need to install any software?",
    a: "No installation is required. PDF Lovers Pro works directly in any modern desktop or mobile browser including Chrome, Edge, Safari, and Firefox.",
  },
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PDF Lovers Pro",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/tools?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HomePage() {
  const popularTools = POPULAR_SLUGS.map((slug) =>
    TOOLS.find((t) => t.slug === slug)
  ).filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-20 sm:py-28">
        <div className="container-page text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700">
            🔒 100% Client-Side · Zero Uploads · Zero Database
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Every PDF Tool You'll Ever Need.{" "}
            <span className="text-blue-600">Completely Free.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Merge, split, compress, convert, edit, sign and protect PDF files
            with {TOTAL_TOOLS_COUNT}+ professional tools — all processed
            instantly inside your browser using WebAssembly. Nothing is ever
            uploaded to a server.
          </p>

          <form
            action="/tools"
            method="GET"
            className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft"
          >
            <input
              type="text"
              name="q"
              placeholder="Search for a tool... e.g. 'merge' or 'compress'"
              className="w-full rounded-xl border-0 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <button type="submit" className="btn-primary shrink-0">
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <span>✅ No sign-up required</span>
            <span>✅ No watermarks</span>
            <span>✅ Works on mobile &amp; desktop</span>
            <span>✅ PWA Ready</span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Browse by Category
            </h2>
            <p className="mt-2 text-slate-600">
              {TOTAL_TOOLS_COUNT}+ tools organized across 8 powerful
              categories.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TOOL_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/tools?category=${cat.id}`}
                className="card flex flex-col items-center gap-2 text-center hover:border-blue-300"
              >
                <span className="text-3xl">{CATEGORY_EMOJI[cat.id]}</span>
                <span className="text-sm font-semibold text-slate-800">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900">
              Most Popular Tools
            </h2>
            <Link
              href="/tools"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All {TOTAL_TOOLS_COUNT}+ Tools →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose a Tool",
                desc: "Pick from 42+ tools covering merging, converting, editing, and securing PDF files.",
              },
              {
                step: "2",
                title: "Upload Your File",
                desc: "Drag and drop your document — it loads directly into your browser's memory, never a server.",
              },
              {
                step: "3",
                title: "Download Instantly",
                desc: "Processing happens locally in seconds. Download your result and your file is wiped from memory.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-white sm:py-20">
        <div className="container-page grid grid-cols-1 gap-8 sm:grid-cols-3 sm:text-left text-center">
          <div>
            <p className="text-4xl font-extrabold">{TOTAL_TOOLS_COUNT}+</p>
            <p className="mt-1 text-blue-100">Free PDF Tools</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold">100%</p>
            <p className="mt-1 text-blue-100">Client-Side Processing</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold">0</p>
            <p className="mt-1 text-blue-100">Files Ever Stored on Servers</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="card group cursor-pointer open:border-blue-300"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                  {item.q}
                  <span className="ml-4 text-blue-600 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
