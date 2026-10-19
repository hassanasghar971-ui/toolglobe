import type { NextConfig } from "next";
import { getCacheControl } from "./lib/cache-headers";

/**
 * Static security headers that apply to every route. Content-Security-Policy
 * is intentionally NOT set here — it is generated per-request in
 * middleware.ts because it must embed a fresh per-request nonce. Setting a
 * second, conflicting CSP here would cause the browser to enforce the
 * intersection of both policies, so CSP ownership belongs exclusively to
 * middleware.ts.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "toolglobe.app" },
      { protocol: "https", hostname: "**.toolglobe.app" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async headers() {
    return [
      // 1. Baseline security headers — every route.
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },

      // 2. Hashed Next.js build assets — cache forever, filenames change on
      //    every deploy so there's no staleness risk.
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: getCacheControl("immutableAsset") },
        ],
      },

      // 3. Static public assets.
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: getCacheControl("longLivedStatic") },
        ],
      },
      {
        source: "/site.webmanifest",
        headers: [
          { key: "Cache-Control", value: getCacheControl("longLivedStatic") },
        ],
      },

      // 4. Sitemap index + chunks — ISR-daily, edge-cached, GSC-friendly.
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: getCacheControl("isrDaily") }],
      },
      {
        source: "/sitemap/:id*",
        headers: [{ key: "Cache-Control", value: getCacheControl("isrDaily") }],
      },

      // 5. Static legal/informational pages — long edge TTL since content
      //    only changes via code edit + redeploy, never at request time.
      {
        source: "/:path(about|contact|privacy-policy|terms|disclaimer)",
        headers: [
          { key: "Cache-Control", value: getCacheControl("staticLongTerm") },
        ],
      },
    ];
  },
};

export default nextConfig;
