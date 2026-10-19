/**
 * Centralized Cache-Control header presets for ToolGlobe.
 *
 * This is the single place that defines "what does caching mean for route
 * type X" — next.config.ts and any future route handler import from here
 * rather than re-declaring raw Cache-Control strings inline.
 */

export const CACHE_PRESETS = {
  /** Hashed, content-addressed build output (/_next/static/**). */
  immutableAsset: "public, max-age=31536000, immutable",

  /** Static public assets that are not content-hashed (favicons, manifest). */
  longLivedStatic: "public, max-age=604800, stale-while-revalidate=86400",

  /** ISR pages revalidated roughly hourly — homepage, category grids. */
  isrHourly: "public, s-maxage=3600, stale-while-revalidate=1800",

  /** ISR pages revalidated roughly daily — tool pages, sitemap chunks. */
  isrDaily: "public, s-maxage=86400, stale-while-revalidate=43200",

  /** Fully static informational/legal pages (About, Contact, Privacy, etc.). */
  staticLongTerm: "public, s-maxage=604800, stale-while-revalidate=86400",

  /** Dynamic, query-dependent routes — internal search results. */
  dynamicNoStore: "private, no-store, max-age=0",

  /** API-style or rate-limit-sensitive endpoints. */
  apiNoCache: "no-cache, no-store, must-revalidate",
} as const;

export type CachePresetKey = keyof typeof CACHE_PRESETS;

export function getCacheControl(preset: CachePresetKey): string {
  return CACHE_PRESETS[preset];
}

export function buildRevalidateCacheControl(
  maxAgeSeconds: number,
  staleWhileRevalidateSeconds: number = Math.floor(maxAgeSeconds / 2)
): string {
  return `public, s-maxage=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`;
}

export function applyCacheHeader(headers: Headers, preset: CachePresetKey): void {
  headers.set("Cache-Control", getCacheControl(preset));
}
