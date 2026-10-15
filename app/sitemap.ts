import type { MetadataRoute } from "next";
import { getAllSlugsForSitemap } from "@/lib/tools-registry";

const CHUNK_SIZE = 5000;
const SITE_URL = "https://toolglobe.com"; // replace with real SITE_CONFIG.url

export async function generateSitemaps() {
  const allSlugs = getAllSlugsForSitemap();
  const chunkCount = Math.ceil(allSlugs.length / CHUNK_SIZE);
  return Array.from({ length: chunkCount }, (_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const allSlugs = getAllSlugsForSitemap();
  const start = id * CHUNK_SIZE;
  const end = start + CHUNK_SIZE;
  const chunk = allSlugs.slice(start, end);

  return chunk.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: slug.startsWith("convert/") && slug.split("/").length === 3 ? 0.8 : 0.6,
  }));
}
