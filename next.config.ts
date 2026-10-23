import type { NextConfig } from "next";

/**
 * Phase 8 hardening pass over the Phase 0/4 unified config:
 * - Added explicit `frame-src` (AdSense/Adsterra render via <iframe>;
 *   this was previously missing and would have silently blocked ad
 *   creatives in production).
 * - Removed fonts.googleapis.com / fonts.gstatic.com from font-src —
 *   Inter is now self-hosted at build time via next/font (see
 *   app/layout.tsx), so no runtime Google Fonts request exists.
 * - Added Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy /
 *   X-Permitted-Cross-Domain-Policies.
 * - Deliberately NOT nonce-based — see SECURITY.md for the full
 *   rationale (nonce-CSP is incompatible with the static/ISR tool-page
 *   factory this project depends on).
 */

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://tpc.googlesyndication.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://adservice.google.com",
    "https://*.adsterra.com",
    "https://*.highperformanceformat.com",
    "https://*.profitabledisplaynetwork.com",
    "https://*.dropshipgalaxy.com",
  ].join(" "),
  "style-src 'self' 'unsafe-inline'",
  [
    "img-src 'self' data: blob:",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://www.google-analytics.com",
    "https://*.adsterra.com",
    "https://*.highperformanceformat.com",
    "https://*.profitabledisplaynetwork.com",
  ].join(" "),
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    "https://vitals.vercel-insights.com",
    "https://www.google-analytics.com",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://*.adsterra.com",
  ].join(" "),
  [
    "frame-src 'self'",
    "https://googleads.g.doubleclick.net",
    "https://tpc.googlesyndication.com",
    "https://*.adsterra.com",
    "https://*.highperformanceformat.com",
  ].join(" "),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Phase 8 additions:
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups", // allow-popups: Adsterra Popunder/Social Bar rely on window.open
  },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const CACHE_IMMUTABLE_HEADERS = [
  {
    key: "Cache-Control",
    value: "s-maxage=86400, stale-while-revalidate=43200",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [], // no external image domains trusted — hardens image optimizer against SSRF-style abuse
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/sitemap/:path*", headers: CACHE_IMMUTABLE_HEADERS },
      { source: "/robots.txt", headers: CACHE_IMMUTABLE_HEADERS },
      { source: "/ads.txt", headers: CACHE_IMMUTABLE_HEADERS },
    ];
  },
};

export default nextConfig;
