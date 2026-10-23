import { SITE_URL } from "@/lib/constants/site";
import { getAllCategories, getAllTools } from "@/lib/tool-registry";

/** Hard spec requirement: no sub-sitemap may exceed 5,000 URLs. */
export const SITEMAP_CHUNK_SIZE = 5000;

export type SitemapChangeFrequency = "daily" | "weekly" | "monthly";

export interface SitemapUrlEntry {
  url: string;
  lastModified: string;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
}

/**
 * Only routes that are REAL and live in the current build are listed here.
 * Legal/static pages (Privacy, Terms, About, Contact, Disclaimer) are
 * intentionally omitted until Phase 7 ships those routes — add them to
 * this function, not anywhere else, once they exist.
 */
function getStaticUrlEntries(): SitemapUrlEntry[] {
  const now = new Date().toISOString();

  const homeEntry: SitemapUrlEntry = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  };

  const categoryEntries: SitemapUrlEntry[] = getAllCategories().map(
    (category) => ({
      url: `${SITE_URL}/tools/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [homeEntry, ...categoryEntries];
}

function getToolUrlEntries(): SitemapUrlEntry[] {
  return getAllTools().map((tool) => ({
    url: `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
    lastModified: tool.updatedAt,
    changeFrequency: "monthly",
    priority: tool.isFeatured ? 0.9 : 0.7,
  }));
}

/**
 * Single aggregation point — every URL that will ever appear in a sitemap
 * flows through this function. At 20,000+ tools this array is rebuilt per
 * invocation (acceptable: sitemap routes are crawler-traffic only and are
 * cached for 24h via the revalidate + header configuration below).
 */
export function getAllSitemapUrls(): SitemapUrlEntry[] {
  return [...getStaticUrlEntries(), ...getToolUrlEntries()];
}

export function getSitemapChunkCount(): number {
  const total = getAllSitemapUrls().length;
  return Math.max(1, Math.ceil(total / SITEMAP_CHUNK_SIZE));
}

export function getSitemapChunk(id: number): SitemapUrlEntry[] {
  const all = getAllSitemapUrls();
  const start = id * SITEMAP_CHUNK_SIZE;
  const end = start + SITEMAP_CHUNK_SIZE;
  return all.slice(start, end);
}
