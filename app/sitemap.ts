import type { MetadataRoute } from "next";
import { getSitemapChunkCount, getSitemapChunk } from "@/lib/seo/sitemap-data";

/**
 * Paired with the explicit Cache-Control rule in next.config.ts — this
 * revalidate window (24h) is the source of truth for how often sitemap
 * chunks are regenerated as the registry grows toward 20,000+ tools.
 */
export const revalidate = 86400;

/**
 * Produces one sitemap file per chunk at /sitemap/0.xml, /sitemap/1.xml,
 * etc. Chunk count scales automatically: 5 tools today → 1 chunk,
 * 20,000+ tools in the future → 4+ chunks, with zero code changes.
 */
export async function generateSitemaps() {
  const chunkCount = getSitemapChunkCount();
  return Array.from({ length: chunkCount }, (_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const chunk = getSitemapChunk(id);

  return chunk.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
