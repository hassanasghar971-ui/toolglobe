/**
 * Centralized Cache-Control header presets for ToolGlobe.
 *
 * Why this exists: Cache-Control strings were previously hand-rolled inline
 * inside next.config.ts header rules (Phase 4's sitemap patch). As more
 * route types gain bespoke caching needs (Phase 8+), duplicating raw strings
 * risks drift (e.g. one route says `stale-while-revalidate=43200` and
 * another typos `433200`). This module is the single place that defines
 * "what does caching mean for route type X" — everything else imports from
 * here, never re-declares the string.
 */

export const CACHE_PRESETS = {
  /**
   * Hashed, content-addressed build output (/_next/static/**).
   * Filename changes whenever content changes, so caching forever is safe.
   */
  immutableAsset: "public, max-age=31536000, immutable",

  /**
   * Static public assets that are not content-hashed (favicons, manifest,
   * /public/* images). Revalidate periodically in case of manual replacement.
   */
  longLivedStatic: "public, max-age=604800, stale-while-revalidate=86400",

  /**
   * ISR pages revalidated roughly hourly — homepage, category grids.
   * Matches `export const revalidate = 3600` used in app/page.tsx and
   * app/category/[slug]/page.tsx (Phase 5).
   */
  isrHourly: "public, s-maxage=3600, stale-while-revalidate=1800",

  /**
   * ISR pages revalidated roughly daily — individual tool pages and sitemap
   * chunks. Matches `export const revalidate = 86400` used in
   * app/[...slug]/page.tsx (Phase 3) and app/sitemap.ts (Phase 4).
   */
  isrDaily: "public, s-maxage=86400, stale-while-revalidate=43200",

  /**
   * Fully static informational/legal pages (About, Contact, Privacy, Terms,
   * Disclaimer — Phase 6). Content only changes via manual code edits /
   * redeploys, so a long edge TTL with a generous SWR window is safe.
   */
  staticLongTerm: "public, s-maxage=604800, stale-while-revalidate=86400",

  /**
   * Dynamic, query-dependent, or user-specific routes — internal search
   * results (app/search/page.tsx, Phase 5). Never cache at the edge since
   * output is a direct function of an arbitrary `?q=` string.
   */
  dynamicNoStore: "private, no-store, max-age=0",

  /**
   * API-style or rate-limit-sensitive endpoints. Always revalidate, never
   * serve stale, never let an intermediate cache store a response.
   */
  apiNoCache: "no-cache, no-store, must-revalidate",
} as const;

export type CachePresetKey = keyof typeof CACHE_PRESETS;

export function getCacheControl(preset: CachePresetKey): string {
  return CACHE_PRESETS[preset];
}

/**
 * Build a bespoke s-maxage/stale-while-revalidate pair for a route whose
 * revalidate window doesn't match a named preset. Defaults the SWR window to
 * 50% of maxAge — a safe general-purpose ratio that avoids serving overly
 * stale content while still absorbing traffic spikes during revalidation.
 */
export function buildRevalidateCacheControl(
  maxAgeSeconds: number,
  staleWhileRevalidateSeconds: number = Math.floor(maxAgeSeconds / 2)
): string {
  return `public, s-maxage=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`;
}

/**
 * Convenience setter for use inside route handlers / middleware that operate
 * on a mutable Headers instance (e.g. a future API route). Not currently
 * invoked by any Phase 1–7 file, but established now so Phase 9+ additions
 * never reach for a raw string.
 */
export function applyCacheHeader(headers: Headers, preset: CachePresetKey): void {
  headers.set("Cache-Control", getCacheControl(preset));
}
