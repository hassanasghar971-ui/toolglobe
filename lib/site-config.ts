// lib/site-config.ts
// Single source of truth for branding, legal identity, and monetization IDs.
// STRICT RULE: Developer identity must ONLY surface on /about, /legal, /privacy,
// /terms pages — never injected into the homepage hero or primary nav.

export interface DeveloperProfile {
  name: string;
  location: string;
  role: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  url: string;
  description: string;
  locale: string;
  foundingYear: number;
  developer: DeveloperProfile;
  verification: {
    google: string;
  };
  ads: {
    adsterraPlacementId: string;
  };
  legal: {
    privacyEmail: string;
    jurisdiction: string;
  };
  social: {
    twitter?: string;
    github?: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  name: "ToolGlobe",
  shortName: "ToolGlobe",
  url: "https://toolglobe.com",
  description:
    "ToolGlobe is a free, high-performance suite of 20,000+ unit converters, calculators, text utilities, and SEO tools — built for speed, accuracy, and zero clutter.",
  locale: "en-US",
  foundingYear: 2024,

  // Visible ONLY on /about, /legal/*, footer "Legal" sub-pages.
  developer: {
    name: "Hassan Asghar",
    location: "Sargodha, Pakistan",
    role: "Founder & Lead Engineer",
  },

  verification: {
    google: "pwyfdDe7eDVI1cMvuebKjXMzJ6kFspOCtUPX7aDskuI",
  },

  ads: {
    // Consumed by components/AdLayout.tsx (Phase 2) via CSP-safe async loader.
    adsterraPlacementId: "31635306",
  },

  legal: {
    privacyEmail: "privacy@toolglobe.com",
    jurisdiction: "Punjab, Pakistan",
  },

  social: {},
};

/**
 * Helper restricted to legal/about surfaces only.
 * Do NOT call this from homepage, hero, or navbar components.
 */
export function getLegalDeveloperCredit(): string {
  const { name, location } = SITE_CONFIG.developer;
  return `${SITE_CONFIG.name} is independently developed and maintained by ${name}, based in ${location}.`;
}

export function getGoogleVerificationMeta(): { google: string } {
  return { google: SITE_CONFIG.verification.google };
}

export function getAdsterraPlacementId(): string {
  return SITE_CONFIG.ads.adsterraPlacementId;
}
