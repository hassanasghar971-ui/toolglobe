// app/robots.ts
// Lists every chunked sitemap file explicitly (generateSitemaps() does not
// auto-create a sitemap index), ensuring GSC and crawlers discover all
// 20,000+ URLs across every /sitemap/[id].xml chunk.

import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";
import { getAllTools } from "@/lib/tools-registry";

export default function robots(): MetadataRoute.Robots {
  const total = getAllTools().length;
  const chunks = Math.ceil(total / 5000);
  const sitemaps = Array.from({ length: chunks }, (_, id) => `${SITE_CONFIG.url}/sitemap/${id}.xml`);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/*?*page=", "/*?*category="],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: sitemaps,
    host: SITE_CONFIG.url,
  };
}
