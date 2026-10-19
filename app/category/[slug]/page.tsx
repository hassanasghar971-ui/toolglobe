// app/category/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getSubcategory, getAllCategorySlugs, type ToolCategory } from "@/lib/categories";
import { getToolsByCategory, getToolsBySubcategory, paginateTools } from "@/lib/tool-registry";
import { buildCanonicalUrl } from "@/lib/slug-utils";
import { buildCategoryCanonicalUrl } from "@/lib/canonical";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCategoryJsonLdGraph, jsonLdScriptProps } from "@/lib/seo/json-ld";
import CategoryToolsClient from "./CategoryToolsClient";

export const revalidate = 3600;
export const dynamicParams = true;

const PAGE_SIZE = 24;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; subcategory?: string }>;
}

export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

function parsePage(raw?: string): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function parseSubcategory(category: ToolCategory, raw?: string): string | undefined {
  if (!raw) return undefined;
  return category.subcategories.some((s) => s.slug === raw) ? raw : undefined;
}

/**
 * Builds the exact query-string canonical for a given (page,
 * subcategory) combination. Kept local to this route rather than
 * added to lib/canonical.ts (Phase 4, not editable here) — this logic
 * is specific to this single route's pagination+filter combination.
 */
function buildCategoryQueryCanonical(categorySlug: string, page: number, subcategorySlug?: string): string {
  const base = buildCanonicalUrl([categorySlug]);
  const params = new URLSearchParams();
  if (subcategorySlug) params.set("subcategory", subcategorySlug);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  const page = parsePage(sp.page);
  const subcategorySlug = parseSubcategory(category, sp.subcategory);
  const activeSubcategory = subcategorySlug ? getSubcategory(slug, subcategorySlug) : undefined;

  const sourceTools = subcategorySlug ? getToolsBySubcategory(slug, subcategorySlug) : getToolsByCategory(slug);
  const isEmpty = sourceTools.length === 0;

  const canonical = buildCategoryQueryCanonical(slug, page, subcategorySlug);
  const title = activeSubcategory
    ? `${activeSubcategory.name} Tools | ${category.name} | ToolGlobe`
    : page > 1
    ? `${category.name} Tools — Page ${page} | ToolGlobe`
    : `${category.name} Tools | ToolGlobe`;
  const description = activeSubcategory ? activeSubcategory.description : category.longDescription;

  return buildPageMetadata({
    title,
    description,
    pathSegments: [slug],
    canonicalOverride: canonical,
    // Empty subcategory views are defensively noindexed even though
    // they're excluded from the sitemap — a user could still reach
    // one via the UI chips, and Google may crawl internal links
    // independently of sitemap submission.
    indexable: !isEmpty,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const page = parsePage(sp.page);
  const subcategorySlug = parseSubcategory(category, sp.subcategory);
  const activeSubcategory = subcategorySlug ? getSubcategory(slug, subcategorySlug) : undefined;

  const sourceTools = subcategorySlug ? getToolsBySubcategory(slug, subcategorySlug) : getToolsByCategory(slug);
  const paginated = paginateTools(sourceTools, page, PAGE_SIZE);

  // Out-of-range pagination requests on non-empty sets are a dead end
  // — 404 rather than silently rendering an empty "page 97 of 3".
  if (sourceTools.length > 0 && page > paginated.totalPages) {
    notFound();
  }

  const categoryHubUrl = buildCategoryCanonicalUrl(slug);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(
          buildCategoryJsonLdGraph(paginated.tools, category.name, categoryHubUrl)
        )}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-brand-600">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-neutral-700 dark:text-neutral-300">
            {category.name}
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          {activeSubcategory ? `${activeSubcategory.name} Tools` : `${category.name} Tools`}
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
          {activeSubcategory ? activeSubcategory.description : category.longDescription}
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href={`/${slug}`}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            !subcategorySlug
              ? "bg-brand-500 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          }`}
        >
          All ({getToolsByCategory(slug).length})
        </Link>
        {category.subcategories.map((sub) => {
          const count = getToolsBySubcategory(slug, sub.slug).length;
          return (
            <Link
              key={sub.slug}
              href={`/${slug}?subcategory=${sub.slug}`}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                subcategorySlug === sub.slug
                  ? "bg-brand-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              }`}
            >
              {sub.name} ({count})
            </Link>
          );
        })}
      </div>

      {paginated.total === 0 ? (
        <div className="rounded-card border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-neutral-600 dark:text-neutral-400">
            Tools for {activeSubcategory ? activeSubcategory.name : category.name} are coming soon.
          </p>
          <Link href={`/${slug}`} className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
            ← Browse all {category.name} tools
          </Link>
        </div>
      ) : (
        <>
          <CategoryToolsClient tools={paginated.tools} />
          {paginated.totalPages > 1 && (
            <PaginationControls
              categorySlug={slug}
              subcategorySlug={subcategorySlug}
              currentPage={paginated.page}
              totalPages={paginated.totalPages}
            />
          )}
        </>
      )}
    </main>
  );
}

function buildPageHref(categorySlug: string, subcategorySlug: string | undefined, page: number): string {
  const params = new URLSearchParams();
  if (subcategorySlug) params.set("subcategory", subcategorySlug);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/${categorySlug}?${qs}` : `/${categorySlug}`;
}

function PaginationControls({
  categorySlug,
  subcategorySlug,
  currentPage,
  totalPages,
}: {
  categorySlug: string;
  subcategorySlug?: string;
  currentPage: number;
  totalPages: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildPageHref(categorySlug, subcategorySlug, Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          currentPage === 1
            ? "pointer-events-none border-neutral-200 text-neutral-300 dark:border-neutral-800"
            : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        }`}
      >
        ← Prev
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-neutral-400">…</span>}
          <Link
            href={buildPageHref(categorySlug, subcategorySlug, p)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              p === currentPage
                ? "bg-brand-500 text-white"
                : "border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            }`}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={buildPageHref(categorySlug, subcategorySlug, Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          currentPage === totalPages
            ? "pointer-events-none border-neutral-200 text-neutral-300 dark:border-neutral-800"
            : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}
