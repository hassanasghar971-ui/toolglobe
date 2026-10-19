// app/page.tsx
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getHighTierTools, getTotalToolCount } from "@/lib/tool-registry";
import type { ToolDefinition } from "@/lib/types/tool";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildHomepageJsonLdGraph, jsonLdScriptProps } from "@/lib/seo/json-ld";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedTools from "@/components/home/FeaturedTools";
import SearchModal from "@/components/search/SearchModal";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "ToolGlobe — 20,000+ Free Online Tools, No Signup Required",
  description:
    "Browse 20,000+ real, free, browser-based tools: converters, calculators, generators, text tools, developer utilities and more. Fast, secure, no installation.",
  pathSegments: [],
});

/**
 * Round-robins across categories so the homepage doesn't accidentally
 * showcase 12 tools from the same (currently largest) category — a
 * diversity concern distinct from indexTier selection itself.
 */
function getDiverseFeaturedTools(limit = 12): ToolDefinition[] {
  const byCategory = new Map<string, ToolDefinition[]>();
  for (const tool of getHighTierTools()) {
    const existing = byCategory.get(tool.categorySlug);
    if (existing) existing.push(tool);
    else byCategory.set(tool.categorySlug, [tool]);
  }

  const categorySlugs = Array.from(byCategory.keys());
  const result: ToolDefinition[] = [];
  let cursor = 0;

  while (result.length < limit && categorySlugs.length > 0) {
    const idx = cursor % categorySlugs.length;
    const slug = categorySlugs[idx];
    const bucket = byCategory.get(slug);
    if (bucket && bucket.length > 0) {
      result.push(bucket.shift()!);
      cursor++;
    } else {
      categorySlugs.splice(idx, 1);
    }
  }

  return result;
}

export default function HomePage() {
  const totalTools = getTotalToolCount();
  const featuredTools = getDiverseFeaturedTools(12);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(buildHomepageJsonLdGraph(featuredTools))}
      />
      <HeroSection totalTools={totalTools} totalCategories={CATEGORIES.length} />
      <CategoryGrid />
      <FeaturedTools tools={featuredTools} />
      {/*
        SearchModal is mounted here for full Phase 5 functionality on
        the homepage. Phase 6 will relocate this single mount point
        into the root layout composition (app/layout.tsx, additive
        diff) alongside Header/Footer, so Cmd/Ctrl+K and the compact
        header search trigger work identically on every route — not
        just this page. Documented now, actioned in Phase 6.
      */}
      <SearchModal />
    </main>
  );
}
