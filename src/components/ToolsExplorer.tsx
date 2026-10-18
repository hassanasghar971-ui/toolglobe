"use client";

import { useMemo, useState } from "react";
import type { PdfTool, ToolCategoryId } from "@/lib/tools-registry";
import ToolCard from "@/components/ToolCard";

interface Category {
  id: ToolCategoryId;
  name: string;
  icon: string;
}

export default function ToolsExplorer({
  tools,
  categories,
}: {
  tools: PdfTool[];
  categories: readonly Category[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategoryId | "all">(
    "all"
  );

  const filteredTools = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory =
        activeCategory === "all" || tool.category === activeCategory;
      const matchesQuery =
        lowerQuery.length === 0 ||
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.shortDescription.toLowerCase().includes(lowerQuery) ||
        tool.keywords.some((k) => k.toLowerCase().includes(lowerQuery));
      return matchesCategory && matchesQuery;
    });
  }, [tools, query, activeCategory]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {filteredTools.length === 0 ? (
        <p className="py-16 text-center text-slate-500">
          No tools found matching your search. Try a different keyword.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
