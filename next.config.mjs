// next.config.mjs
// Core runtime hardening + CSP rules compatible with Adsterra (placement 31635306)
// and Google Search Console verification. Zero external image hosts by default.

/** @type {import('next').NextConfig} */
const ADSTERRA_DOMAINS = [
  "*.adsterra.com",
  "*.highperformanceformat.com",
  "*.profitablegatetocontent.com",
  "*.gampad.com",
];

const CSP_DIRECTIVES = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${ADSTERRA_DOMAINS.join(" ")}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: https: ${ADSTERRA_DOMAINS.join(" ")}`,
  `frame-src 'self' ${ADSTERRA_DOMAINS.join(" ")}`,
  `connect-src 'self' ${ADSTERRA_DOMAINS.join(" ")}`,
  `font-src 'self' data:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lib"],
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
