// components/search/SearchModal.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { searchTools, type SearchResult } from "@/lib/fuzzy-search";

/**
 * Global event name used to open this modal from anywhere in the
 * component tree (hero search, header search, future entry points)
 * without prop-drilling or wrapping the app in a React Context
 * provider. This keeps SearchBar and SearchModal fully decoupled —
 * a documented, deliberate lightweight pub/sub pattern, not a hack.
 */
export const SEARCH_OPEN_EVENT = "toolglobe:open-search";

interface SearchOpenEventDetail {
  initialQuery?: string;
}

export default function SearchModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveCategory(null);
    setActiveIndex(0);
  }, []);

  const open = useCallback((initialQuery?: string) => {
    setIsOpen(true);
    if (initialQuery) setQuery(initialQuery);
  }, []);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        close();
      }
    }
    function handleOpenEvent(e: Event) {
      const detail = (e as CustomEvent<SearchOpenEventDetail>).detail;
      open(detail?.initialQuery);
    }

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener(SEARCH_OPEN_EVENT, handleOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener(SEARCH_OPEN_EVENT, handleOpenEvent);
    };
  }, [close, open]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setResults(searchTools(query, { categorySlug: activeCategory ?? undefined, limit: 20 }));
      setActiveIndex(0);
    }, 120);
    return () => clearTimeout(timer);
  }, [query, activeCategory, isOpen]);

  const handleResultNavigate = useCallback(
    (path: string) => {
      close();
      router.push(path);
    },
    [close, router]
  );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const active = results[activeIndex];
      if (active) handleResultNavigate(active.tool.path);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[10vh] backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-card border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <Search className="h-5 w-5 shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search 20,000+ tools... (e.g. BMI, password, JSON)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="shrink-0 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === null
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
              onClick={() => setActiveCategory(cat.slug)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-brand-500 text-white"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              {query.trim()
                ? `No tools found for "${query}".`
                : "Start typing to search across every ToolGlobe tool."}
            </p>
          ) : (
            results.map((result, i) => (
              <div key={result.tool.id} onMouseEnter={() => setActiveIndex(i)}>
                <ResultRow
                  result={result}
                  isActive={i === activeIndex}
                  onSelect={() => handleResultNavigate(result.tool.path)}
                />
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2 text-xs text-neutral-400 dark:border-neutral-800">
          <span>↑↓ Navigate · ↵ Select · Esc Close</span>
          <span>Powered by ToolGlobe Search</span>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  result,
  isActive,
  onSelect,
}: {
  result: SearchResult;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isActive ? "bg-brand-500 text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{result.tool.name}</p>
        <p className={`truncate text-xs ${isActive ? "text-brand-100" : "text-neutral-500"}`}>
          {result.tool.shortDescription}
        </p>
      </div>
      <span className={`shrink-0 text-xs ${isActive ? "text-brand-100" : "text-neutral-400"}`}>
        {result.tool.categoryName}
      </span>
    </button>
  );
}
