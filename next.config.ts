// next.config.ts
import type { NextConfig } from "next";

/**
 * Static, route-independent security headers.
 * Dynamic CSP (with nonce) is handled per-request in middleware.ts —
 * these headers complement it and apply even to routes middleware
 * might skip (e.g. static assets served directly by the CDN).
 */
const staticSecurityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Enables modern image formats automatically (CWV: LCP improvement)
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "toolglobe.app",
      },
    ],
  },

  async headers() {
    return [
      {
        // Applies to every route — static security baseline.
        source: "/:path*",
        headers: staticSecurityHeaders,
      },
      {
        // Immutable caching for Next.js build assets (CWV + bandwidth).
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Guards against build-time crashes caused by third-party ad script
  // type-checking noise (scripts are loaded in Phase 7 via <Script>,
  // not imported as modules, so this has no effect on app code safety).
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
