import { getAllTools, getAllCategorySlugs } from "@/lib/tool-registry";
import {
  buildCanonicalUrl,
  buildStaticPageCanonicalUrl,
} from "@/lib/seo/canonical";
import { SITE_URL } from "@/lib/constants/site";

/**
 * Max URLs per sitemap chunk. Google's sitemap protocol allows up to
 * 50,000 URLs/file, but we cap tighter for faster per-chunk generation
 * and to keep each chunk comfortably small as the catalog scales toward
 * 20,000+ tools.
 */
export const SITEMAP_CHUNK_SIZE = 5000;

export type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapUrlEntry {
  url: string;
  lastModified: string;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
}

/**
 * Legal/static pages added in Phase 7. Kept here (not just inline in
 * the relevant route page files) so both the sitemap generator and the
 * canonical URL validator script share one source of truth for which
 * legal slugs must exist and must be indexed.
 */
export const STATIC_LEGAL_SLUGS = [
  "privacy-policy",
  "terms",
  "about",
  "contact",
  "disclaimer",
] as const;

/**
 * Computed fresh per call (NOT a module-level constant) so that each
 * sitemap regeneration (revalidate = 86400) reflects the actual time of
 * that generation, rather than a stale timestamp frozen at the first
 * cold start of a long-lived serverless instance.
 */
function currentTimestamp(): string {
  return new Date().toISOString();
}

function getHomepageUrlEntry(): SitemapUrlEntry {
  return {
    url: SITE_URL,
    lastModified: currentTimestamp(),
    changeFrequency: "daily",
    priority: 1.0,
  };
}

function getToolsIndexUrlEntry(): SitemapUrlEntry {
  return {
    url: buildStaticPageCanonicalUrl(["tools"]),
    lastModified: currentTimestamp(),
    changeFrequency: "daily",
    priority: 0.9,
  };
}

function getCategoryIndexUrlEntries(): SitemapUrlEntry[] {
  return getAllCategorySlugs().map((slug) => ({
    url: buildStaticPageCanonicalUrl(["tools", slug]),
    lastModified: currentTimestamp(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}

/**
 * Phase 7 addition: legal/static pages are intentionally LOW priority
 * and infrequently-changing ("yearly") — they exist for compliance and
 * trust signals, not as primary organic entry points.
 */
function getLegalPageUrlEntries(): SitemapUrlEntry[] {
  return STATIC_LEGAL_SLUGS.map((slug) => ({
    url: buildStaticPageCanonicalUrl([slug]),
    lastModified: currentTimestamp(),
    changeFrequency: "yearly",
    priority: 0.3,
  }));
}

export function getStaticUrlEntries(): SitemapUrlEntry[] {
  return [
    getHomepageUrlEntry(),
    getToolsIndexUrlEntry(),
    ...getCategoryIndexUrlEntries(),
    ...getLegalPageUrlEntries(),
  ];
}

export function getToolUrlEntries(): SitemapUrlEntry[] {
  return getAllTools().map((tool) => ({
    url: buildCanonicalUrl(tool.category, tool.slug),
    lastModified: currentTimestamp(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}

export function getAllSitemapUrls(): SitemapUrlEntry[] {
  return [...getStaticUrlEntries(), ...getToolUrlEntries()];
}

export function getSitemapChunkCount(): number {
  const total = getAllSitemapUrls().length;
  return Math.max(1, Math.ceil(total / SITEMAP_CHUNK_SIZE));
}

export function getSitemapChunk(chunkIndex: number): SitemapUrlEntry[] {
  const allUrls = getAllSitemapUrls();
  const start = chunkIndex * SITEMAP_CHUNK_SIZE;
  const end = start + SITEMAP_CHUNK_SIZE;
  return allUrls.slice(start, end);
}
