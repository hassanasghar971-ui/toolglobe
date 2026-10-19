function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "https://toolglobe.app"
);

export const SITE_NAME = "ToolGlobe";

export const SITE_TAGLINE = "20,000+ Free Online Tools, Zero Sign-Up";

export const SITE_DESCRIPTION =
  "ToolGlobe gives you instant access to thousands of free, fast, browser-based tools — unit converters, calculators, text utilities, developer tools, generators, and more. No sign-up, no downloads, no data leaves your device.";

export const SITE_LOCALE = "en_US";

export const SITE_KEYWORDS = [
  "free online tools",
  "unit converter",
  "calculator",
  "text tools",
  "developer tools",
  "generators",
  "pdf tools",
  "image tools",
  "color tools",
  "seo tools",
];

export const SITE_VERIFICATION = {
  google: process.env.SITE_VERIFICATION_GOOGLE || "",
  bing: process.env.SITE_VERIFICATION_BING || "",
};

export const SITEMAP_CHUNK_SIZE = 5000;

export const RATE_LIMIT = {
  maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 120),
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
};

/**
 * Single source of truth for owner/contact details across the entire site.
 * Every legal page, the footer, the About page, the Contact page, and all
 * JSON-LD Person/ContactPage schemas import from here. NEVER hardcode these
 * strings anywhere else in the codebase.
 */
export const OWNER = {
  name: "Hassan Asghar",
  nameLocal: "حسن اصغر",
  role: "Founder & Developer",
  email: "hassanasghar7868686@gmail.com",
  phones: [
    { display: "+92 345 1098607", raw: "00923451098607" },
    { display: "+92 349 7726469", raw: "00923497726469" },
  ],
} as const;
