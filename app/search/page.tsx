// app/search/page.tsx
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTotalIndexedToolCount } from "@/lib/fuzzy-search";
import SearchPageClient from "./SearchPageClient";

/**
 * Deliberately noindex: internal search results pages are standard
 * SEO practice to keep out of the index (Google's own guidance) to
 * avoid low-value query-combination pages diluting crawl budget. This
 * page still exists and works perfectly for users and for Google's
 * Sitelinks Search Box (wired via the WebSite JSON-LD SearchAction
 * built in Phase 4).
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Search Tools | ToolGlobe",
  description: "Search across every ToolGlobe tool by name, category, or keyword.",
  pathSegments: ["search"],
  indexable: false,
});

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const initialQuery = sp.q ?? "";
  const totalTools = getTotalIndexedToolCount();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-3xl">
        Search {totalTools.toLocaleString()}+ Tools
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Find exactly the tool you need by name, category, or keyword.
      </p>
      <div className="mt-6">
        <SearchPageClient initialQuery={initialQuery} />
      </div>
    </main>
  );
}
