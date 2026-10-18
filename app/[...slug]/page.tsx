import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getAllSlugsForSitemap } from "@/lib/tools-registry";
import { buildToolSEO } from "@/lib/tool-specs-builder";
import ToolRenderer from "@/components/ToolRenderer";
import ToolArticle from "@/components/ToolArticle";

export const dynamicParams = true;
export const revalidate = 86400;

// 🌐 Domain Base configuration for absolute SEO URLs
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolglobe.com";

type PageProps = { params: { slug: string[] } };

function resolveTool(params: { slug: string[] }) {
  const fullSlug = (params.slug ?? []).join("/");
  if (!fullSlug) return null;
  return getToolBySlug(fullSlug);
}

function safeTruncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "...";
}

export async function generateStaticParams() {
  const slugs = getAllSlugsForSitemap(500);
  return slugs.map((slug) => ({ slug: slug.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = resolveTool(params);

  if (!tool) {
    return {
      title: "Tool Not Found | ToolGlobe",
      robots: "noindex, nofollow",
    };
  }

  const seo = buildToolSEO(tool);
  const selfPath = `/${tool.slug.startsWith("/") ? tool.slug.slice(1) : tool.slug}`;

  // Relative path logic
  const relativeCanonical =
    tool.kind === "quickvalue" && tool.family && tool.fromUnit && tool.toUnit
      ? `/convert/${tool.family}/${tool.fromUnit}-to-${tool.toUnit}`
      : selfPath;

  // ✅ ABSOLUTE CANONICAL URL (Fixes "User-declared canonical: None" in GSC)
  const absoluteCanonicalUrl = `${SITE_URL}${relativeCanonical.startsWith("/") ? relativeCanonical : "/" + relativeCanonical}`;
  const absoluteSelfUrl = `${SITE_URL}${selfPath}`;

  const desc = safeTruncate(tool.description, 160);

  return {
    title: tool.title,
    description: desc,
    alternates: { canonical: absoluteCanonicalUrl },
    robots: seo.robots,
    openGraph: {
      title: tool.title,
      description: desc,
      url: absoluteSelfUrl,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tool.title,
      description: desc,
    },
  };
}

export default function ToolPage({ params }: PageProps) {
  const tool = resolveTool(params);
  if (!tool) notFound();

  const seo = buildToolSEO(tool);

  return (
    <>
      {seo.jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <ToolRenderer tool={tool} />
      <ToolArticle content={seo.content} faq={seo.faq} />
    </>
  );
}
