// lib/canonical.ts
import { buildCanonicalUrl } from "@/lib/slug-utils";

/**
 * SEO CANONICALIZATION POLICY LAYER.
 *
 * This file sits ABOVE lib/slug-utils.ts (Phase 2) — it does not
 * reimplement URL construction (buildCanonicalUrl already does that),
 * it encodes POLICY decisions about which canonical a given page type
 * should declare: homepage, category index, paginated category pages.
 *
 * Consumed by: Phase 5's category/pagination pages, Phase 6's legal
 * pages (via buildHomeCanonicalUrl-style helpers if needed).
 */

export interface PaginationCanonicalOptions {
  basePathSegments: string[];
  page: number;
}

/**
 * Pagination canonical policy: each paginated page self-canonicalizes
 * (page 2 → canonical of page 2), rather than collapsing everything to
 * page 1. Collapsing to page 1 is an outdated pattern that causes
 * Google to drop deep pagination from the index entirely, hiding tools
 * on page 3+ from search. Page 1 itself never appends a redundant
 * `?page=1` query string to its own canonical.
 */
export function buildPaginatedCanonicalUrl({
  basePathSegments,
  page,
}: PaginationCanonicalOptions): string {
  const base = buildCanonicalUrl(basePathSegments);
  if (page <= 1) return base;
  return `${base}?page=${page}`;
}

export function buildCategoryCanonicalUrl(categorySlug: string): string {
  return buildCanonicalUrl([categorySlug]);
}

export function buildHomeCanonicalUrl(): string {
  return buildCanonicalUrl([]);
}

export function buildStaticPageCanonicalUrl(pathSegment: string): string {
  return buildCanonicalUrl([pathSegment]);
}
