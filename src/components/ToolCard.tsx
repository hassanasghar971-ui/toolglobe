import Link from "next/link";
import type { PdfTool } from "@/lib/tools-registry";

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

export default function ToolCard({ tool }: { tool: PdfTool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card group flex flex-col gap-3 hover:border-blue-300"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
        {CATEGORY_EMOJI[tool.category] ?? "📄"}
      </div>
      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600">
        {tool.name}
      </h3>
      <p className="line-clamp-3 text-sm text-slate-600">
        {tool.shortDescription}
      </p>
      <span className="mt-auto text-sm font-semibold text-blue-600">
        Use Tool →
      </span>
    </Link>
  );
}
