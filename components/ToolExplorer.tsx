// components/ToolExplorer.tsx
// Debounced real-time search + category filter across 20,000+ tools via
// server-side /api/tools/search (keeps the client bundle free of the full registry).

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  slug: string;
  title: string;
  category: string;
}

export default function ToolExplorer({ categories }: { categories: string[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (activeCategory !== "All") params.set("category", activeCategory);

      fetch(`/api/tools/search?${params.toString()}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data.results || []);
          setTotal(data.total || 0);
        })
        .catch(() => {
          setResults([]);
          setTotal(0);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, activeCategory]);

  const allCategories = ["All", ...categories];

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card p-4 flex flex-col gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. 'kilometer to miles', 'BMI', 'slugify'..."
          className="w-full bg-transparent text-white text-lg px-2 py-2 outline-none placeholder:text-white/30"
        />
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {allCategories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === c ? "bg-indigo-500/80 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-white/40 px-1">
        {loading ? "Searching…" : `${total.toLocaleString()} tool${total === 1 ? "" : "s"} found`}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((r) => (
          <Link key={r.slug} href={`/${r.slug}`} className="glass-card p-4 flex flex-col gap-1 hover:shadow-glow transition-shadow">
            <span className="text-[10px] uppercase tracking-wide text-white/30">{r.category}</span>
            <span className="text-sm font-semibold text-white">{r.title}</span>
          </Link>
        ))}
        {!loading && results.length === 0 && (
          <div className="col-span-full text-center text-white/30 text-sm py-10">No tools matched your search.</div>
        )}
      </div>
    </div>
  );
}
