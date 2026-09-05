"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { executeTool, type ToolResult } from "@/lib/tool-engine";
import { sanitizeInput } from "@/lib/seo-and-security";
import UniversalActionSuite from "@/components/UniversalActionSuite";
import type { ToolMeta } from "@/lib/tools-data";
import type { RichContent } from "@/lib/seo-and-security";

interface ToolPageClientProps {
  tool: ToolMeta;
  category: string;
  catName: string;
  catColor: string;
  catIcon: string;
  richContent: RichContent;
  baseUrl: string;
}

// ─── OUTPUT RENDERER ─────────────────────────────────────────
function OutputRenderer({ result }: { result: ToolResult }) {
  if (result.type === "error") {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        <span className="text-xl shrink-0">⚠️</span>
        <div>
          <p className="font-semibold text-sm">Processing Error</p>
          <p className="text-sm mt-0.5">{String(result.value)}</p>
        </div>
      </div>
    );
  }

  if (result.type === "table" && Array.isArray(result.value)) {
    const rows = result.value as string[][];
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-3 ${j === 0 ? "font-semibold text-slate-700 w-1/3" : "text-slate-600"} border-b border-slate-100`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (result.type === "list" && Array.isArray(result.value)) {
    return (
      <ul className="space-y-1.5 max-h-96 overflow-y-auto">
        {(result.value as string[]).map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
            <span className="text-blue-400 shrink-0 mt-0.5 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (result.type === "code") {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 bg-slate-800 rounded-t-xl px-4 py-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-slate-400 text-xs ml-2">Output</span>
        </div>
        <pre className="bg-slate-900 rounded-b-xl p-4 text-green-400 text-sm overflow-x-auto max-h-80 leading-relaxed font-mono">
          <code>{String(result.value)}</code>
        </pre>
      </div>
    );
  }

  if (result.type === "number") {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
        <div className="text-4xl font-black text-blue-700 mb-1">
          {typeof result.value === "number" ? result.value.toLocaleString() : String(result.value)}
        </div>
        <div className="text-slate-500 text-sm">Result</div>
      </div>
    );
  }

  if (result.type === "color") {
    let data: { hex?: string; rgb?: string; hsl?: string; r?: number; g?: number; b?: number; palette?: string[]; base?: string } = {};
    try {
      data = JSON.parse(String(result.value));
    } catch {
      return <div className="text-sm text-slate-700 whitespace-pre-wrap">{String(result.value)}</div>;
    }

    if (data.palette) {
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 font-medium">Generated Palette ({data.palette.length} colors)</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {data.palette.map((color, i) => (
              <div key={i} className="group cursor-pointer" onClick={() => navigator.clipboard.writeText(color)}>
                <div className="w-full aspect-square rounded-xl shadow-sm group-hover:scale-105 transition-transform border border-black/10" style={{ backgroundColor: color }} />
                <p className="text-xs text-center mt-1 text-slate-600 font-mono group-hover:text-blue-600">{color}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">Click any color to copy HEX code</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div
          className="w-24 h-24 rounded-2xl shadow-lg border border-black/10 shrink-0"
          style={{ backgroundColor: data.hex || "#000000" }}
        />
        <div className="grid grid-cols-1 gap-2 flex-1">
          {data.hex && (
            <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-500 font-medium">HEX</span>
              <span className="font-mono text-sm text-slate-800">{data.hex.toUpperCase()}</span>
            </div>
          )}
          {data.rgb && (
            <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-500 font-medium">RGB</span>
              <span className="font-mono text-sm text-slate-800">{data.rgb}</span>
            </div>
          )}
          {data.hsl && (
            <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-500 font-medium">HSL</span>
              <span className="font-mono text-sm text-slate-800">{data.hsl}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: text
  const text = String(result.value);
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
      <pre className="text-sm text-slate-800 whitespace-pre-wrap break-words leading-relaxed font-sans max-h-80 overflow-y-auto">
        {text}
      </pre>
    </div>
  );
}

// ─── RICH CONTENT SECTION ────────────────────────────────────
function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <p className="text-slate-600 leading-relaxed text-sm">
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="text-slate-800 font-semibold">{part}</strong> : part
      )}
    </p>
  );
}

// ─── MAIN CLIENT COMPONENT ───────────────────────────────────
export default function ToolPageClient({
  tool,
  category,
  catName,
  catColor,
  catIcon,
  richContent,
  baseUrl,
}: ToolPageClientProps) {
  const [input, setInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [result, setResult] = useState<ToolResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processTime, setProcessTime] = useState<number | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleProcess = useCallback(() => {
    const sanitized = sanitizeInput(input);
    const sanitized2 = secondInput ? sanitizeInput(secondInput) : undefined;

    setIsProcessing(true);
    const start = performance.now();

    // Use requestAnimationFrame for smooth UI
    requestAnimationFrame(() => {
      try {
        const res = executeTool(category, tool.slug, sanitized, sanitized2);
        const elapsed = performance.now() - start;
        setResult(res);
        setProcessTime(Math.round(elapsed * 10) / 10);
        setIsProcessing(false);

        // Scroll to output
        setTimeout(() => {
          outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      } catch (err) {
        setResult({ type: "error", value: String(err) });
        setIsProcessing(false);
      }
    });
  }, [input, secondInput, category, tool.slug]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleProcess();
      }
    },
    [handleProcess]
  );

  const handleClear = useCallback(() => {
    setInput("");
    setSecondInput("");
    setResult(null);
    setProcessTime(null);
  }, []);

  // Get output as plain text for action suite
  const getOutputText = useCallback((): string => {
    if (!result) return "";
    if (result.type === "table" && Array.isArray(result.value)) {
      return (result.value as string[][]).map((row) => row.join("\t")).join("\n");
    }
    if (result.type === "list" && Array.isArray(result.value)) {
      return (result.value as string[]).join("\n");
    }
    return String(result.value);
  }, [result]);

  const toolUrl = `${baseUrl}/${category}/${tool.slug}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ══ TOP AD SLOT (pre-reserved 90px) ══════════════════ */}
      <div
        className="w-full bg-white border-b border-slate-100 flex items-center justify-center"
        style={{ minHeight: "90px" }}
        aria-label="Advertisement"
      >
        {/* TOP_TOOL_PAGE_AD_728x90
            Insert your AdSense or Adsterra 728×90 banner code here.
            This container is pre-sized to prevent CLS.
        */}
      </div>

      {/* ══ HERO HEADER ══════════════════════════════════════ */}
      <section className={`bg-gradient-to-br ${catColor} text-white py-10`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/70 mb-4 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${category}`} className="hover:text-white transition-colors capitalize">
              {catName}
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{tool.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{catIcon}</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {tool.name}
            </h1>
          </div>
          <p className="text-white/85 max-w-2xl text-sm sm:text-base leading-relaxed">
            {tool.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1 bg-white/15 border border-white/20 text-white text-xs px-2.5 py-1 rounded-full">
              ⚡ Instant
            </span>
            <span className="inline-flex items-center gap-1 bg-white/15 border border-white/20 text-white text-xs px-2.5 py-1 rounded-full">
              🔒 100% Private
            </span>
            <span className="inline-flex items-center gap-1 bg-white/15 border border-white/20 text-white text-xs px-2.5 py-1 rounded-full">
              ♾️ Unlimited Free Use
            </span>
          </div>
        </div>
      </section>

      {/* ══ MAIN TOOL INTERFACE ═══════════════════════════════ */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── INPUT PANEL ────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900 text-sm">
                    {tool.inputLabel}
                  </h2>
                  <span className="text-xs text-slate-400">Ctrl+Enter to process</span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Main Input */}
                  {tool.inputType === "select" && tool.selectOptions ? (
                    <select
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select an option…</option>
                      {tool.selectOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : tool.inputType === "number" ? (
                    <input
                      type="number"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={tool.inputPlaceholder}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : tool.inputType === "text" ? (
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={tool.inputPlaceholder}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={tool.inputPlaceholder}
                      rows={tool.inputType === "dual" ? 5 : 8}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y leading-relaxed"
                    />
                  )}

                  {/* Dual Input */}
                  {tool.inputType === "dual" && tool.dualLabels && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        {tool.dualLabels[1]}
                      </label>
                      <textarea
                        value={secondInput}
                        onChange={(e) => setSecondInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Enter ${tool.dualLabels[1]}…`}
                        rows={5}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      />
                    </div>
                  )}

                  {/* Character Count */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{input.length.toLocaleString()} / 50,000 chars</span>
                    {input.length > 0 && (
                      <button
                        onClick={handleClear}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        Clear ✕
                      </button>
                    )}
                  </div>

                  {/* Process Button */}
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      isProcessing
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : `bg-gradient-to-r ${catColor} text-white hover:opacity-90 hover:shadow-md active:scale-98`
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing…
                      </span>
                    ) : (
                      `⚡ Process with ${tool.name}`
                    )}
                  </button>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-bold text-slate-900 text-sm mb-3">✨ Key Benefits</h3>
                <ul className="space-y-1.5">
                  {richContent.benefits.slice(0, 6).map((benefit, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="shrink-0">{benefit.split(" ")[0]}</span>
                      <span>{benefit.split(" ").slice(1).join(" ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── OUTPUT PANEL ───────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4" ref={outputRef}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900 text-sm">Result</h2>
                  {processTime !== null && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ {processTime}ms
                    </span>
                  )}
                </div>

                <div className="p-4">
                  {result ? (
                    <div className="space-y-4">
                      <OutputRenderer result={result} />
                      {result.type !== "error" && (
                        <div className="border-t border-slate-100 pt-3">
                          <p className="text-xs text-slate-500 mb-2 font-medium">Actions:</p>
                          <UniversalActionSuite
                            content={getOutputText()}
                            toolName={tool.name}
                            toolUrl={toolUrl}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      <div className="text-4xl mb-3">⚡</div>
                      <p className="text-sm font-medium">Ready to process</p>
                      <p className="text-xs mt-1">Enter input and click Process</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── MIDDLE AD SLOT (pre-reserved 250px) ──────── */}
              <div
                className="bg-white rounded-2xl border border-dashed border-slate-200 flex items-center justify-center"
                style={{ minHeight: "250px" }}
                aria-label="Advertisement"
              >
                {/* MIDDLE_ADSTERRA_250x250_NATIVE
                    Insert Adsterra Native or Smart Link code here.
                    Container is pre-sized (250px) to prevent CLS.
                */}
                <span className="text-slate-300 text-xs">Advertisement</span>
              </div>

              {/* Pro Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <h3 className="font-bold text-amber-800 text-sm mb-2">💡 Pro Tips</h3>
                <ul className="space-y-1.5">
                  {richContent.proTips.slice(0, 3).map((tip, i) => (
                    <li key={i} className="text-xs text-amber-700 leading-relaxed">• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ RICH CONTENT GUIDE (500-800 words) ═══════════════ */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <article className="prose-sm max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">
                Complete Guide to {tool.name}
              </h2>
              <MarkdownText text={richContent.intro} />
            </div>

            {/* How to Use */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                📋 How to Use {tool.name} — Step by Step
              </h2>
              <ol className="space-y-3">
                {richContent.howToSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 pt-0.5">
                      <MarkdownText text={step} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Use Cases */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  🎯 Who Uses This Tool
                </h2>
                <ul className="space-y-2">
                  {richContent.useCases.map((useCase, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  🏆 Key Benefits
                </h2>
                <ul className="space-y-2">
                  {richContent.benefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-1.5">
                      <span className="shrink-0">{benefit.split(" ")[0]}</span>
                      <span>{benefit.split(" ").slice(1).join(" ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                🚀 Start Using {tool.name} Now
              </h2>
              <MarkdownText text={richContent.conclusion} />
            </div>
          </article>
        </div>
      </section>

      {/* ══ BOTTOM AD SLOT (pre-reserved 90px) ═══════════════ */}
      <div
        className="w-full bg-slate-100 border-t border-slate-200 flex items-center justify-center"
        style={{ minHeight: "90px" }}
        aria-label="Advertisement"
      >
        {/* BOTTOM_TOOL_PAGE_AD_728x90
            Insert your AdSense 728×90 leaderboard or Adsterra banner here.
        */}
        <span className="text-slate-400 text-xs">Advertisement</span>
      </div>

      {/* ══ FAQ SECTION ══════════════════════════════════════ */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            ❓ Frequently Asked Questions About {tool.name}
          </h2>
          <div className="space-y-4">
            {richContent.faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ RELATED TOOLS ═════════════════════════════════════ */}
      <section className="py-10 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            🔗 More {catName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { slug: "word-counter", name: "Word Counter" },
              { slug: "text-reverser", name: "Text Reverser" },
              { slug: "json-formatter", name: "JSON Formatter" },
              { slug: "password-generator", name: "Password Generator" },
              { slug: "base64-encoder", name: "Base64 Encoder" },
              { slug: "uuid-generator", name: "UUID Generator" },
              { slug: "hex-to-rgb", name: "HEX to RGB" },
              { slug: "percentage-calculator", name: "% Calculator" },
            ].map((rt) => (
              <Link
                key={rt.slug}
                href={`/${category}/${rt.slug}`}
                className="text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 px-3 py-2.5 rounded-xl transition-all text-center font-medium"
              >
                {rt.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href={`/${category}`}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              View All {catName} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── FAQ ACCORDION ITEM ─────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-900 text-sm pr-4">{question}</span>
        <span className={`text-slate-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}
