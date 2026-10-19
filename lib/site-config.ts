// lib/site-config.ts

/**
 * ToolGlobe — Global Site Configuration
 * Single source of truth. Do NOT hardcode brand/owner data anywhere else.
 * Imported by: metadata generators (Phase 4), legal pages (Phase 6),
 * footer/header (Phase 6), JSON-LD schemas (Phase 4).
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolglobe.app"
).replace(/\/$/, ""); // strip trailing slash to prevent double-slash canonical bugs

export const SITE_NAME = "ToolGlobe";

export const SITE_TAGLINE =
  "20,000+ Free Online Tools — Fast, Secure, No Signup Required";

export const SITE_DESCRIPTION =
  "ToolGlobe hosts 20,000+ real, functional online utility tools — converters, calculators, generators, text tools, image tools and more. 100% free, browser-based, no installation required.";

export const SITE_LOCALE = "en_US";

export const SITE_KEYWORDS = [
  "online tools",
  "free tools",
  "converter",
  "calculator",
  "generator",
  "text tools",
  "image tools",
  "developer tools",
  "toolglobe",
];

/**
 * OWNER / DEVELOPER — required for AdSense transparency review.
 * Rendered verbatim on: /about, /contact, /privacy-policy,
 * /terms, /disclaimer, and the global site footer.
 *
 * NOTE: Source prompt provided "حسن اصغر 7868686@gmail.com" as a single
 * string for "Contact Email". This has been parsed as name + email.
 * If the intended email differs, update ONLY this file — it propagates
 * everywhere automatically.
 */
export const OWNER = {
  name: "Hassan Asghar",
  nameLocal: "حسن اصغر",
  role: "Founder & Developer",
  email: "7868686@gmail.com",
  phones: [
    { display: "+92 345 1098607", raw: "00923451098607" },
    { display: "+92 349 7726469", raw: "00923497726469" },
  ],
} as const;

/**
 * Social / verification placeholders — populate via env vars per
 * environment (dev/staging/prod) to avoid committing secrets or
 * environment-specific IDs into source control.
 */
export const SITE_VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
};

/**
 * Sitemap chunking config — consumed in Phase 4 by app/sitemap.ts
 * Defined here (not in Phase 4 files) because it is a global site
 * constant, not sitemap-generation logic.
 */
export const SITEMAP_CHUNK_SIZE = 5000;

/**
 * Rate limiting defaults — overridable via env, consumed by
 * lib/rate-limit.ts and middleware.ts within this same phase.
 */
export const RATE_LIMIT = {
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 120),
};
