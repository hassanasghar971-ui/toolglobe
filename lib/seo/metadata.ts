import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { buildCanonicalUrl, buildStaticPageCanonicalUrl } from "./canonical";
import type { ToolDefinition } from "@/lib/tool-registry/types";

/**
 * Strict metadata contract for every static page in the app.
 * `pathSegments` is mandatory — a legacy `path: string` property is
 * intentionally NOT part of this interface and is banned by ESLint.
 */
export interface PageMetadataInput {
  title: string;
  description: string;
  pathSegments: string[];
  keywords?: string[];
  noIndex?: boolean;
  ogImagePath?: string;
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const canonicalUrl = buildStaticPageCanonicalUrl(input.pathSegments);
  const ogImage = input.ogImagePath ?? "/og/default.png";

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: canonicalUrl },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}${ogImage}` }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [`${SITE_URL}${ogImage}`],
    },
  };
}

/**
 * Tool-page metadata maps strictly from tool.seo.metaTitle,
 * tool.seo.metaDescription, and tool.shortDescription per the locked
 * architecture contract — no derivation, no fallback guessing.
 */
export function buildToolPageMetadata(tool: ToolDefinition): Metadata {
  const canonicalUrl = buildCanonicalUrl(tool.category, tool.slug);

  return {
    title: tool.seo.metaTitle,
    description: tool.seo.metaDescription,
    keywords: tool.seo.keywords,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title: tool.seo.metaTitle,
      description: tool.shortDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seo.metaTitle,
      description: tool.shortDescription,
    },
  };
}
