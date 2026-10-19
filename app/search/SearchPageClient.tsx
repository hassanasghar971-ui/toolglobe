// app/search/SearchPageClient.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { searchTools, type SearchResult } from "@/lib/fuzzy-search";
import { getAllTools } from "@/lib/tool-registry";
import ToolPreviewCard from "@/components/search/ToolPreviewCard";

interface SearchPageClientProps {
  initialQuery: string;
}

export default function SearchPageClient({ initialQuery }: SearchPageClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const allTools = useMemo(() => getAllTools(), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(searchTools(query, { categorySlug: categoryFilter ?? undefined, limit: 48 }));
    }, 150);
    return () => clearTimeout(timer);
  }, [query, categoryFilter]);

  const resolvedTools = results
    .map((r) => allTools.find((t) => t.id === r.tool.id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          autoFocus
          className="w-full rounded-full border border-neutral-300 bg-white py-3 pl-12 pr-4 text-sm shadow-card outline-none focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            categoryFilter === null
              ? "bg-brand-500 text-white"
              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setCategoryFilter(cat.slug)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              categoryFilter === cat.slug
                ? "bg-brand-500 text-white"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {resolvedTools.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-500">
          {query.trim() ? `No tools found for "${query}".` : "Start typing to search."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {resolvedTools.map((tool) => (
            <ToolPreviewCard key={tool.id} tool={tool} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
