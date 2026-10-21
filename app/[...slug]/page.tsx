import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolById, getAllTools } from "@/lib/tools-registry";
import { ToolPageClient } from "@/components/tool-engine/ToolPageClient";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCanonicalUrl } from "@/lib/canonical";
import { SITE_URL } from "@/lib/site-config";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.id.split("/"),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];
  const toolId = slugArray.join("/");
  const tool = getToolById(toolId);

  if (!tool) {
    return {};
  }

  return buildPageMetadata({
    title: tool.seoTitle || `${tool.name} — Free Online Tool`,
    description: tool.description,
    pathSegments: slugArray,
  });
}

export default async function DynamicToolPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];
  const toolId = slugArray.join("/");
  const tool = getToolById(toolId);

  if (!tool) {
    notFound();
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.name,
        item: buildCanonicalUrl(slugArray),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ToolPageClient tool={tool} />
    </div>
  );
}
