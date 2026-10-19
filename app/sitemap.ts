// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tool-registry";
import { getAllCategorySlugs } from "@/lib/categories";
import { buildCanonicalUrl, buildToolPathSegments } from "@/lib/slug-utils";
import { SITE_URL, SITEMAP_CHUNK_SIZE } from "@/lib/site-config";

/**
 * Revalidate daily — tool content/copy changes infrequently, and this
 * value is also what the next.config.ts header patch (below) mirrors
 * via `s-maxage=86400` for CDN-level cache correctness.
 */
export const revalidate = 86400;

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

interface SitemapEntryData {
  url: string;
  lastModified: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

function buildStaticRouteEntries(): SitemapEntryData[] {
  const now = new Date().toISOString();

  const staticPaths: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
  ];

  const categoryPaths = getAllCategorySlugs().map((slug) => ({
    path: `/${slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as ChangeFrequency,
  }));

  return [...staticPaths, ...categoryPaths].map((entry) => ({
    url: `${SITE_URL}${entry.path === "/" ? "" : entry.path}/`.replace(/\/+$/, "/"),
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}

function buildToolRouteEntries(): SitemapEntryData[] {
  return getAllTools()
    // Low-tier (noindex) tools are deliberately EXCLUDED from the
    // sitemap. Submitting a noindex URL in a sitemap is a documented
    // cause of "Submitted URL marked 'noindex'" warnings in GSC — this
    // filter structurally prevents that error from ever occurring.
    .filter((tool) => tool.seo.indexTier !== "low")
    .map((tool) => ({
      url: buildCanonicalUrl(buildToolPathSegments(tool.categorySlug, tool.slug)),
      lastModified: tool.updatedAt,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: tool.seo.indexTier === "high" ? 0.9 : 0.6,
    }));
}

// Module-level memoization — the registry is static per server
// instance, so rebuilding this array on every chunk request would be
// wasted work at 20,000+ entries across potentially dozens of chunks.
let cachedEntries: SitemapEntryData[] | null = null;

function getAllSitemapEntries(): SitemapEntryData[] {
  if (!cachedEntries) {
    cachedEntries = [...buildStaticRouteEntries(), ...buildToolRouteEntries()];
  }
  return cachedEntries;
}

/**
 * Tells Next.js how many sub-sitemaps to generate. Next.js
 * automatically:
 *  - serves a sitemap INDEX at /sitemap.xml listing every chunk
 *  - serves each chunk at /sitemap/0.xml, /sitemap/1.xml, ...
 * exactly matching the master spec's required URL pattern, with zero
 * hand-written XML (eliminating malformed-sitemap risk entirely).
 */
export async function generateSitemaps() {
  const totalEntries = getAllSitemapEntries().length;
  const totalChunks = Math.max(1, Math.ceil(totalEntries / SITEMAP_CHUNK_SIZE));
  return Array.from({ length: totalChunks }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const allEntries = getAllSitemapEntries();
  const start = id * SITEMAP_CHUNK_SIZE;
  const end = start + SITEMAP_CHUNK_SIZE;

  return allEntries.slice(start, end).map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
