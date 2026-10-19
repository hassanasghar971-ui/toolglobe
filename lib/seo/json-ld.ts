// lib/seo/json-ld.ts
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/site-config";
import type { ToolDefinition } from "@/lib/types/tool";

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [] as string[],
  };
}

/**
 * WebSite schema with a SearchAction target — this is what enables
 * Google's "Sitelinks Search Box" feature in SERPs once /search is
 * built in Phase 5.
 */
export function buildWebSiteSchema() {
  return {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * ItemList schema for category/homepage grids — tells Google explicitly
 * "this page is a curated list of N items" which strengthens eligibility
 * for list-style rich results and clarifies page intent to crawlers.
 */
export function buildItemListSchema(tools: ToolDefinition[], listName: string) {
  return {
    "@type": "ItemList",
    name: listName,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
      name: tool.name,
    })),
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Full homepage @graph — Organization + WebSite + featured ItemList. */
export function buildHomepageJsonLdGraph(featuredTools: ToolDefinition[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationSchema(),
      buildWebSiteSchema(),
      buildItemListSchema(featuredTools, `${SITE_NAME} Featured Tools`),
    ],
  };
}

/** Full category-page @graph — ItemList + Breadcrumb. */
export function buildCategoryJsonLdGraph(
  tools: ToolDefinition[],
  categoryName: string,
  categoryUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildItemListSchema(tools, `${categoryName} Tools`),
      buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: categoryName, url: categoryUrl },
      ]),
    ],
  };
}

/** Helper for safely injecting a JSON-LD object into a <script> tag. */
export function jsonLdScriptProps(data: object): { __html: string } {
  return { __html: JSON.stringify(data) };
}
