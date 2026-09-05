// ============================================================
// TOOLGLOBE — Sitemap Index Engine (Drip-Feed Strategy)
// Chunk 1: Top 2,000 Priority Tools (instant index)
// Chunks 2–4: Progressive crawling for remaining tools
// ============================================================

import { NextResponse } from "next/server";
import { ALL_TOOLS, CATEGORIES } from "@/lib/tools-data";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24 hours

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://toolglobe.app";

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const now = new Date().toISOString().split("T")[0];

  // ── Sitemap index pointing to chunked sitemaps ──────────
  const sitemaps = [
    { url: `${BASE_URL}/api/sitemap/1`, lastmod: now }, // Priority tools (Top 2000)
    { url: `${BASE_URL}/api/sitemap/2`, lastmod: now }, // Batch 2
    { url: `${BASE_URL}/api/sitemap/3`, lastmod: now }, // Batch 3
    { url: `${BASE_URL}/api/sitemap/4`, lastmod: now }, // Categories & static
  ];

  // ── Also include some top tools directly for fast indexing
  const topTools = ALL_TOOLS.slice(0, 50);

  const directUrls = [
    // Homepage
    `  <url>\n    <loc>${xmlEscape(BASE_URL)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    // Category pages
    ...CATEGORIES.slice(0, 10).map(
      (cat) =>
        `  <url>\n    <loc>${xmlEscape(`${BASE_URL}/${cat.slug}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
    ),
    // Top 50 tools
    ...topTools.map(
      (tool) =>
        `  <url>\n    <loc>${xmlEscape(`${BASE_URL}/${tool.category}/${tool.slug}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) =>
      `  <sitemap>\n    <loc>${xmlEscape(s.url)}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`
  )
  .join("\n")}
</sitemapindex>

<!-- Supplemental direct URLs for fast Google discovery -->
<!-- Top Tool Pages Below (parsed by Googlebot as supplemental) -->
<!--
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${directUrls.join("\n")}
</urlset>
-->`;

  // Serve pure sitemap index
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) =>
      `  <sitemap>\n    <loc>${xmlEscape(s.url)}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  void xml; // suppress unused

  return new NextResponse(sitemapIndex, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
