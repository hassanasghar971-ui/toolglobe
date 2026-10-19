import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { AdsterraNativeBanner } from "@/components/ads/adsterra-native-banner";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildHomepageJsonLdGraph, jsonLdScriptProps } from "@/lib/seo/json-ld";
import { CATEGORIES } from "@/lib/categories";
import {
  getToolsByCategory,
  getTotalToolCount,
  type ToolDefinition,
} from "@/lib/tool-registry";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — Free Online Tools`,
  description: SITE_DESCRIPTION,
  path: "/",
});

const FEATURED_TOOLS_LIMIT = 24;

/**
 * Round-robins across every category so the homepage never looks dominated
 * by whichever category happens to have the most tools (e.g. unit
 * converters). Pulls only indexTier !== "low" tools so featured placements
 * always point at fully-indexed, high-confidence pages.
 */
function getDiverseFeaturedTools(): ToolDefinition[] {
  const perCategoryPools = CATEGORIES.map((category) =>
    getToolsByCategory(category.slug).filter(
      (tool) => tool.indexTier !== "low"
    )
  );

  const featured: ToolDefinition[] = [];
  let cursor = 0;

  while (featured.length < FEATURED_TOOLS_LIMIT) {
    let addedThisRound = false;

    for (const pool of perCategoryPools) {
      if (featured.length >= FEATURED_TOOLS_LIMIT) break;
      const candidate = pool[cursor];
      if (candidate) {
        featured.push(candidate);
        addedThisRound = true;
      }
    }

    cursor += 1;
    if (!addedThisRound) break;
  }

  return featured;
}

export default function HomePage() {
  const featuredTools = getDiverseFeaturedTools();
  const jsonLdGraph = buildHomepageJsonLdGraph({
    toolCount: getTotalToolCount(),
    categories: CATEGORIES,
  });

  return (
    <>
      <script {...jsonLdScriptProps(jsonLdGraph)} />
      <HeroSection />
      <CategoryGrid />
      <FeaturedTools tools={featuredTools} />
      <AdsterraNativeBanner className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8" />
    </>
  );
}
