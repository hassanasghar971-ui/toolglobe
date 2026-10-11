// app/tools/page.tsx
// Fully crawlable, server-rendered directory of all 20,000+ tools — paginated
// via searchParams (SSR, no client JS required for indexing), category-filterable.

import Link from "next/link";
import type { Metadata } from "next";
import { getAllTools, getAllCategories } from "@/lib/tools-registry";
import { SITE_CONFIG } from "@/lib/site-config";

export const revalidate = 86400;

const PAGE_SIZE = 200;

export const metadata: Metadata = {
  title: "Full Tool Directory",
  description: `Browse the complete directory of 20,000+ free converters, calculators, text, and SEO tools on ${SITE_CONFIG.name}.`,
  alternates: { canonical: `${SITE_CONFIG.url}/tools` },
};

interface SearchParams {
  page?: string;
  category?: string;
}

export default async function ToolsDirectoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const requestedPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const category = (sp.category || "").trim();

  const all = getAllTools();
  const filtered = category ? all.filter((t) => t.category === category) : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const categories = getAllCategories();

  function buildHref(p: number, cat: string) {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/tools${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Full Tool Directory</h1>
        <p className="text-white/50 text-sm">
          {filtered.length.toLocaleString()} tools {category ? `in “${category}”` : "across all categories"} — page {page} of {totalPages.toLocaleString()}.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        <Link
          href="/tools"
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !category ? "bg-indigo-500/80 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={buildHref(1, c)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === c ? "bg-indigo-500/80 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pageItems.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`} className="glass-card p-4 flex flex-col gap-1 hover:shadow-glow transition-shadow">
            <span className="text-[10px] uppercase tracking-wide text-white/30">{t.category}</span>
            <span className="text-sm font-semibold text-white">{t.title}</span>
          </Link>
        ))}
        {pageItems.length === 0 && (
          <div className="col-span-full text-center text-white/30 text-sm py-10">No tools found for this filter.</div>
        )}
      </div>

      <div className="flex justify-center items-center gap-3 pt-4">
        {page > 1 && (
          <Link href={buildHref(page - 1, category)} className="glass-card px-4 py-2 text-sm text-white hover:shadow-glow">
            ← Previous
          </Link>
        )}
        <span className="text-xs text-white/40">
          Page {page} / {totalPages.toLocaleString()}
        </span>
        {page < totalPages && (
          <Link href={buildHref(page + 1, category)} className="glass-card px-4 py-2 text-sm text-white hover:shadow-glow">
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
