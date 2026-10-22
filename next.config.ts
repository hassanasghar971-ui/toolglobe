import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * CSP source allowlists are intentionally explicit (no wildcards beyond
 * documented ad-network subdomains) to keep the attack surface minimal
 * while remaining compatible with Google AdSense + Adsterra script tags
 * that will be injected via next/script in Phase 6.
 */
const CSP_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'", // required by Next.js bootstrap + Google ad scripts
    ...(isDev ? ["'unsafe-eval'"] : []), // Fast Refresh only, never in prod
    "https://pagead2.googlesyndication.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://adservice.google.com",
    "https://*.adsterra.com",
    "https://*.highperformanceformat.com",
    "https://*.profitabledisplaynetwork.com",
  ],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  "connect-src": [
    "'self'",
    "https://www.google-analytics.com",
    "https://pagead2.googlesyndication.com",
    "https://*.adsterra.com",
    "https://vitals.vercel-insights.com",
  ],
  "frame-src": [
    "'self'",
    "https://googleads.g.doubleclick.net",
    "https://tpc.googlesyndication.com",
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
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
