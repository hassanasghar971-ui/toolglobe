// components/search/SearchBar.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SEARCH_OPEN_EVENT } from "./SearchModal";

interface SearchBarProps {
  variant?: "hero" | "compact";
  placeholder?: string;
}

/**
 * This component is a TRIGGER, not an independent search UI — the
 * instant it receives focus it hands off to the real SearchModal
 * (which carries the full search index + keyboard nav) and blurs
 * itself, preventing two disconnected search states from existing
 * simultaneously. This same component is designed to be dropped into
 * both the homepage hero (variant="hero") and, in Phase 6, the site
 * header (variant="compact") — each instance independently dispatches
 * the shared SEARCH_OPEN_EVENT, so there is exactly one modal instance
 * reacting regardless of how many triggers exist on a page.
 */
export default function SearchBar({ variant = "hero", placeholder }: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState("");

  const dispatchOpen = (initialQuery?: string) => {
    window.dispatchEvent(new CustomEvent(SEARCH_OPEN_EVENT, { detail: { initialQuery } }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    dispatchOpen(localQuery || undefined);
    setLocalQuery("");
    e.target.blur();
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => dispatchOpen()}
        className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:border-brand-400 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search tools...</span>
        <kbd className="ml-2 hidden rounded border border-neutral-300 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium dark:border-neutral-700 dark:bg-neutral-800 sm:inline">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={localQuery}
        onFocus={handleFocus}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder={placeholder ?? "Search 20,000+ free tools — converters, calculators, generators..."}
        className="w-full rounded-full border border-neutral-300 bg-white py-3.5 pl-12 pr-20 text-sm shadow-card outline-none transition-shadow focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-900"
      />
      <kbd className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 sm:inline">
        ⌘K
      </kbd>
    </div>
  );
}
