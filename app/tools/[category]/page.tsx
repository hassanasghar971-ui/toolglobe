import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategorySlugs,
  getCategoryBySlug,
  getToolsByCategory,
} from "@/lib/tool-registry";
import { buildPageMetadata } from "@/lib/seo/metadata";
import ToolBreadcrumbs from "@/components/tools/ToolBreadcrumbs";

export const revalidate = 86400;

interface CategoryPageParams {
  category: string;
}

export async function generateStaticParams(): Promise<CategoryPageParams[]> {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CategoryPageParams>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryDefinition = getCategoryBySlug(category);

  if (!categoryDefinition) {
    return {};
  }

  return buildPageMetadata({
    pathSegments: ["tools", categoryDefinition.slug],
    title: categoryDefinition.name,
    description: categoryDefinition.description,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<CategoryPageParams>;
}) {
  const { category } = await params;
  const categoryDefinition = getCategoryBySlug(category);

  if (!categoryDefinition) {
    notFound();
  }

  const tools = getToolsByCategory(categoryDefinition.slug);

  return (
    <div className="space-y-8 pb-16">
      <ToolBreadcrumbs
        items={[
          { label: "Tools", href: "/tools" },
          {
            label: categoryDefinition.name,
            href: `/tools/${categoryDefinition.slug}`,
          },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {categoryDefinition.name}
        </h1>
        <p className="text-base text-slate-600">
          {categoryDefinition.description}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${categoryDefinition.slug}/${tool.slug}`}
              className="block rounded-lg border border-slate-200 p-4 transition hover:border-slate-400 hover:shadow-sm"
            >
              <h2 className="font-semibold text-slate-900">{tool.name}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {tool.shortDescription}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
