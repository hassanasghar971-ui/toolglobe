import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/* ------------------------------------------------------------------ */
/* Content Security Policy                                             */
/* ------------------------------------------------------------------ */
/**
 * Explicit allowlists only — no wildcard domains beyond documented ad
 * network subdomains. This keeps the attack surface minimal while
 * remaining fully compatible with:
 *   - Google AdSense (script, iframe, and beacon domains)
 * 1  - Adsterra (Social Bar, Native Banner, Direct Link, Popunder formats)
 * injected via next/script with strategy="lazyOnload" in Phase 6.
 */
const CSP_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'", // required by Next.js inline bootstrap + Google ad tags
    ...(isDev ? ["'unsafe-eval'"] : []), // Fast Refresh only — never shipped to prod
    "https://pagead2.googlesyndication.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://adservice.google.com",
    "https://googleads.g.doubleclick.net",
    "https://*.adsterra.com",
    "https://*.highperformanceformat.com",
    "https://*.profitabledisplaynetwork.com",
    "https://*.dropshipgalaxy.com",
  ],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  "connect-src": [
    "'self'",
    "https://www.google-analytics.com",
    "https://pagead2.googlesyndication.com",
    "https://adservice.google.com",
    "https://*.adsterra.com",
    "https://vitals.vercel-insights.com",
  ],
  "frame-src": [
    "'self'",
    "https://googleads.g.doubleclick.net",
    "https://tpc.googlesyndication.com",
    "https://*.google.com",
    "https://*.adsterra.com",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"],
};

function buildCspHeaderValue(): string {
  const directives = Object.entries(CSP_DIRECTIVES).map(
    ([key, values]) => `${key} ${values.join(" ")}`
  );
  directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

/* ------------------------------------------------------------------ */
/* Global security headers — applied to every route                    */
/* ------------------------------------------------------------------ */
const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCspHeaderValue() },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/* ------------------------------------------------------------------ */
/* Next.js configuration                                               */
/* ------------------------------------------------------------------ */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  trailingSlash: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async headers() {
    return [
      {
        // Global security headers — every route on the site
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Phase 4: chunked sitemap files — explicit cache contract,
        // independent of implicit ISR header behavior
        source: "/sitemap/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=86400, stale-while-revalidate",
          },
          { key: "Content-Type", value: "application/xml" },
        ],
      },
      {
        // Phase 4: robots.txt — same explicit cache contract
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=86400, stale-while-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
