// app/sitemap.ts
// Next.js 15 chunked sitemap engine via generateSitemaps() — splits 20,000+
// URLs into clean 5,000-URL XML files served at /sitemap/0.xml, /sitemap/1.xml,
// etc. This permanently resolves Google Search Console "Could not fetch"
// timeout errors caused by monolithic sitemaps.

import type { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tools-registry";
import { SITE_CONFIG } from "@/lib/site-config";

const CHUNK_SIZE = 5000;

// Cache each sitemap chunk for 24h — tools are deterministic/static per build,
// so aggressive caching here is safe and keeps GSC fetch times fast.
export const revalidate = 86400;

const STATIC_ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, freq: "daily" },
  { path: "tools", priority: 0.9, freq: "daily" },
  { path: "about", priority: 0.5, freq: "monthly" },
  { path: "contact", priority: 0.4, freq: "monthly" },
  { path: "legal/privacy", priority: 0.3, freq: "yearly" },
  { path: "legal/terms", priority: 0.3, freq: "yearly" },
];

export async function generateSitemaps() {
  const total = getAllTools().length;
  const chunks = Math.ceil(total / CHUNK_SIZE);
  return Array.from({ length: chunks }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const all = getAllTools();
  const start = id * CHUNK_SIZE;
  const slice = all.slice(start, start + CHUNK_SIZE);
  const now = new Date();

  const toolEntries: MetadataRoute.Sitemap = slice.map((t) => ({
    url: `${SITE_CONFIG.url}/${t.slug}`,
    lastModified: now,
    changeFrequency: t.tier === 1 ? "weekly" : t.tier === 2 ? "monthly" : "yearly",
    priority: t.tier === 1 ? 0.9 : t.tier === 2 ? 0.6 : 0.3,
  }));

  // Static/legal routes only ride along on the very first chunk to avoid duplication.
  if (id === 0) {
    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
      url: `${SITE_CONFIG.url}/${r.path}`.replace(/\/$/, "") || SITE_CONFIG.url,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    }));
    return [...staticEntries, ...toolEntries];
  }

  return toolEntries;
}
