// lib/slug-utils.ts
import { SITE_URL } from "@/lib/site-config";

/**
 * Slug generation, validation, and absolute canonical URL building.
 * This is the ONLY place canonical URL strings are constructed from
 * raw segments — Phase 4's metadata generator imports buildCanonicalUrl
 * from here rather than re-implementing URL concatenation, preventing
 * the exact class of bug that causes trailing-slash / protocol
 * mismatches in Google Search Console.
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Converts arbitrary text into a URL-safe, lowercase, hyphenated slug. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length > 0 && slug.length <= 120;
}

/**
 * Builds the route path segments for a tool: /[category]/[tool-slug]
 * This is the single pattern used across the entire app for tool URLs.
 */
export function buildToolPathSegments(
  categorySlug: string,
  toolSlug: string
): string[] {
  return [categorySlug, toolSlug];
}

export function buildToolPath(categorySlug: string, toolSlug: string): string {
  return `/${buildToolPathSegments(categorySlug, toolSlug).join("/")}`;
}

/**
 * Builds the FULL ABSOLUTE canonical URL for a tool or any route segment
 * array. This directly satisfies the master requirement:
 * "Every dynamic tool route MUST compute and output an absolute
 * canonical URL — NO relative paths."
 */
export function buildCanonicalUrl(segments: string[]): string {
  const path = segments
    .map((s) => s.replace(/^\/+|\/+$/g, "")) // strip stray slashes per segment
    .filter(Boolean)
    .join("/");
  return `${SITE_URL}/${path}`;
}

export function buildCategoryPath(categorySlug: string): string {
  return `/${categorySlug}`;
}

/**
 * Slug uniqueness guard — used by tool-registry.ts at module-load time
 * to fail fast (build-time error) if two tools ever collide on the
 * same [category]/[slug] path, which would otherwise silently create
 * a duplicate-content / 404-shadowing bug in production.
 */
export function createSlugCollisionGuard() {
  const seen = new Set<string>();

  return {
    check(categorySlug: string, toolSlug: string, toolId: string): void {
      const key = `${categorySlug}/${toolSlug}`;
      if (seen.has(key)) {
        throw new Error(
          `[SLUG COLLISION] Tool "${toolId}" produces duplicate path "/${key}". ` +
            `Every tool must have a unique slug within its category.`
        );
      }
      seen.add(key);
    },
    size(): number {
      return seen.size;
    },
  };
}

/** Parses incoming [...slug] catch-all segments into category + tool slug. */
export function parseToolRouteSegments(
  segments: string[]
): { categorySlug: string; toolSlug: string } | null {
  if (segments.length !== 2) return null;
  const [categorySlug, toolSlug] = segments;
  if (!categorySlug || !toolSlug) return null;
  if (!isValidSlug(categorySlug) || !isValidSlug(toolSlug)) return null;
  return { categorySlug, toolSlug };
}
