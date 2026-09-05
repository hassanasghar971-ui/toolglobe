// ============================================================
// TOOLGLOBE — Master Tool Engine Page
// On-demand SSR with dynamic UI + rich content + schema
// NO generateStaticParams — force-dynamic for zero build timeout
// ============================================================

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getToolBySlug, synthesizeTool } from "@/lib/tools-data";
import {
  generateRichContent,
  generateWebAppSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo-and-security";
import ToolPageClient from "./ToolPageClient";

// ── CRITICAL: prevent static pre-rendering ──────────────────
export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://toolglobe.app";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const cat = getCategoryBySlug(category);
  const tool = getToolBySlug(category, slug) || synthesizeTool(category, slug);

  const catName = cat?.name ?? category.replace(/-/g, " ");
  const kw1 = tool.keywords[0] ?? `${tool.name.toLowerCase()} online free`;

  const title = `${tool.name} — Free Online ${tool.name} Tool`;
  const description = `Free ${tool.name} online. ${tool.description} No signup required — instant results in your browser. Best ${kw1} available.`;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: `/${category}/${slug}` },
    openGraph: {
      title: `${tool.name} | ToolGlobe`,
      description,
      type: "website",
      siteName: "ToolGlobe",
      url: `${BASE_URL}/${category}/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${tool.name} — Free Online Tool | ToolGlobe`,
      description,
    },
    other: {
      "tool:category": catName,
      "tool:name": tool.name,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { category, slug } = await params;

  const cat = getCategoryBySlug(category);
  const tool = getToolBySlug(category, slug) || synthesizeTool(category, slug);

  if (!cat && !tool) notFound();

  const catName = cat?.name ?? category.replace(/-/g, " ");
  const richContent = generateRichContent(
    tool.name,
    tool.description,
    category,
    slug,
    tool.keywords
  );

  const webAppSchema = generateWebAppSchema(tool.name, tool.description, category, slug, BASE_URL);
  const faqSchema = generateFAQSchema(richContent.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema(category, catName, tool.name, slug, BASE_URL);

  return (
    <>
      {/* ── JSON-LD Schema Injection ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: webAppSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />

      <ToolPageClient
        tool={tool}
        category={category}
        catName={catName}
        catColor={cat?.color ?? "from-blue-500 to-indigo-600"}
        catIcon={cat?.icon ?? "🛠️"}
        richContent={richContent}
        baseUrl={BASE_URL}
      />
    </>
  );
}
