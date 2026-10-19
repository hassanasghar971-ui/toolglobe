// app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/*?*utm_"],
      },
      {
        // Explicitly welcome Google's ad crawler for AdSense/Adsterra
        // ad delivery verification once Phase 7 lands — declared now
        // so no robots.ts edit is needed when monetization ships.
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
