// app/category/[slug]/CategoryToolsClient.tsx
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { ToolDefinition } from "@/lib/types/tool";
import ToolPreviewCard from "@/components/search/ToolPreviewCard";

interface CategoryToolsClientProps {
  tools: ToolDefinition[];
}

/**
 * Instant client-side filter layered ON TOP of server-side pagination
 * — satisfies the master spec's "server-side pagination AND instant
 * filtering" requirement without duplicating the full fuzzy-search
 * engine: this filters only the current page's already-SSR'd tools,
 * zero network requests, zero debounce needed (small dataset).
 */
export default function CategoryToolsClient({ tools }: CategoryToolsClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return tools;
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [tools, query]);

  return (
    <div>
      <div className="relative mb-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Quick filter on this page..."
          className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-500">
          No tools on this page match &quot;{query}&quot;. Try clearing the filter or browsing another page.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolPreviewCard key={tool.id} tool={tool} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
