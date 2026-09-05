import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Security Headers ────────────────────────────────────
  poweredByHeader: false,

  // ── Compiler options ────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ── Image optimization ──────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },

  // ── Experimental features ───────────────────────────────
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
