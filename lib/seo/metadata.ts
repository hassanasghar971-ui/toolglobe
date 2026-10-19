// lib/seo/metadata.ts
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";
import { buildCanonicalUrl } from "@/lib/slug-utils";

export interface PageMetadataInput {
  title: string;
  description: string;
  pathSegments: string[]; // [] => homepage
  indexable?: boolean; // default true
  canonicalOverride?: string; // for paginated pages via lib/canonical.ts
  ogType?: "website" | "article";
}

/**
 * Single builder for standards-compliant page metadata: ABSOLUTE
 * canonical (never relative), consistent robots directives, and
 * matching OpenGraph/Twitter tags. Every Phase 5/6 page should call
 * this rather than hand-assembling a Metadata object.
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const canonicalUrl = input.canonicalOverride ?? buildCanonicalUrl(input.pathSegments);
  const indexable = input.indexable ?? true;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: indexable,
      follow: true,
      googleBot: {
        index: indexable,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: input.ogType ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

/**
 * Category page metadata — handles the title suffix for page > 1
 * so paginated pages never compete with page 1 for the exact same
 * <title>, which is itself a soft form of duplicate-content signal.
 */
export function buildCategoryPageMetadata(args: {
  categoryName: string;
  categoryDescription: string;
  categorySlug: string;
  page?: number;
  canonicalOverride?: string;
}): Metadata {
  const page = args.page ?? 1;
  const title =
    page > 1
      ? `${args.categoryName} Tools — Page ${page} | ${SITE_NAME}`
      : `${args.categoryName} Tools | ${SITE_NAME}`;

  return buildPageMetadata({
    title,
    description: args.categoryDescription,
    pathSegments: [args.categorySlug],
    canonicalOverride: args.canonicalOverride,
  });
}
