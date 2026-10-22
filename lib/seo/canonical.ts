import { SITE_URL } from "@/lib/constants/site";
import type { CategorySlug } from "@/lib/tool-registry/types";

function normalizeSegment(segment: string): string {
  return segment.replace(/^\/+|\/+$/g, "");
}

/** Absolute canonical URL for a tool page: /tools/{category}/{slug} */
export function buildCanonicalUrl(category: CategorySlug, slug: string): string {
  return `${SITE_URL}/tools/${normalizeSegment(category)}/${normalizeSegment(
    slug
  )}`;
}

/**
 * Absolute canonical URL for any static page, built from an explicit
 * segment array — e.g. buildStaticPageCanonicalUrl(["privacy-policy"])
 * or buildStaticPageCanonicalUrl(["category", "developer-tools"]).
 * Legacy single-string `path` inputs are not accepted anywhere in this
 * codebase (enforced by the `toolglobe/no-legacy-metadata-path` ESLint rule).
 */
export function buildStaticPageCanonicalUrl(pathSegments: string[]): string {
  const cleaned = pathSegments
    .map((segment) => normalizeSegment(segment))
    .filter((segment) => segment.length > 0);

  return cleaned.length === 0 ? SITE_URL : `${SITE_URL}/${cleaned.join("/")}`;
}
