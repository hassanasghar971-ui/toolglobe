import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighTierTools, getToolByPath, getRelatedTools } from "@/lib/tool-registry";
import { getCategoryBySlug } from "@/lib/categories";
import { parseToolRouteSegments, buildCanonicalUrl, buildToolPathSegments } from "@/lib/slug-utils";
import { ToolBreadcrumbs } from "@/components/tool-engine/ToolBreadcrumbs";
import { ToolPageClient } from "@/components/tool-engine/ToolPageClient";
import { FaqAccordion } from "@/components/tool-engine/FaqAccordion";
import { RelatedToolsList } from "@/components/tool-engine/RelatedToolsList";
import { ToolJsonLd } from "@/components/tool-engine/ToolJsonLd";

// ISR: tool logic/content rarely changes — 24h revalidation balances
// freshness with edge-cache efficiency at 20,000+ page scale.
export const revalidate = 86400;
export const dynamicParams = true;

interface ToolPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  // Pre-render only high-tier tools at build time to keep `next build`
  // bounded as the registry scales toward 20,000+. Remaining tools
  // render on-demand via dynamicParams + ISR above — they are still
  // fully indexable; Google crawls them on first request and the edge
  // caches the result thereafter (s-maxage behavior from next.config).
  return getHighTierTools().map((tool) => ({
    slug: buildToolPathSegments(tool.categorySlug, tool.slug),
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseToolRouteSegments(slug);
  if (!parsed) return {};

  const tool = getToolByPath(parsed.categorySlug, parsed.toolSlug);
  if (!tool) return {};

  // ABSOLUTE canonical URL — required by master spec, never relative.
  const canonicalUrl = buildCanonicalUrl(buildToolPathSegments(tool.categorySlug, tool.slug));
  const shouldIndex = tool.seo.indexTier !== "low";

  return {
    title: tool.seo.metaTitle,
    description: tool.seo.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: tool.seo.metaTitle,
      description: tool.seo.metaDescription,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seo.metaTitle,
      description: tool.seo.metaDescription,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const parsed = parseToolRouteSegments(slug);
  if (!parsed) notFound();

  const tool = getToolByPath(parsed.categorySlug, parsed.toolSlug);
  if (!tool) notFound();

  const category = getCategoryBySlug(tool.categorySlug);
  if (!category) notFound();

  const canonicalUrl = buildCanonicalUrl(buildToolPathSegments(tool.categorySlug, tool.slug));
  const relatedTools = getRelatedTools(tool);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolJsonLd tool={tool} canonicalUrl={canonicalUrl} categoryName={category.name} />
      <ToolBreadcrumbs category={category} toolName={tool.name} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          {tool.name}
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">{tool.shortDescription}</p>
      </header>

      <ToolPageClient tool={tool} />

      <section className="mt-10 max-w-none">
        <h2 className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-100">About This Tool</h2>
        <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">{tool.longDescription}</p>
      </section>

      <FaqAccordion faqs={tool.seo.faqs} />
      <RelatedToolsList tools={relatedTools} />
    </main>
  );
}
