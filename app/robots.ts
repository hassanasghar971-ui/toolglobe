import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";
import { getSitemapChunkCount } from "@/lib/seo/sitemap-data";

/**
 * Sitemap chunk URLs are derived from the exact same getSitemapChunkCount()
 * function app/sitemap.ts uses — the two files can never drift out of sync.
 */
export default function robots(): MetadataRoute.Robots {
  const chunkCount = getSitemapChunkCount();
  const sitemapUrls = Array.from(
    { length: chunkCount },
    (_, id) => `${SITE_URL}/sitemap/${id}.xml`
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: sitemapUrls,
    host: SITE_URL,
  };
}
