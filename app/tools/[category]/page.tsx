import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, getAllTools } from "@/lib/tool-registry";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    pathSegments: ["tools"],
    title: "All Tool Categories",
    description:
      "Browse every free online tool category on ToolGlobe, from developer utilities to text processing and math calculators.",
  });
}

export default function ToolsDirectoryPage() {
  const categories = getAllCategories();
  const allTools = getAllTools();

  return (
    <div className="space-y-8 pb-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          All Tools
        </h1>
        <p className="text-base text-slate-600">
          {allTools.length.toLocaleString()} free tools across{" "}
          {categories.length} categories.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const toolCount = allTools.filter(
            (tool) => tool.category === category.slug
          ).length;

          return (
            <Link
              key={category.slug}
              href={`/tools/${category.slug}`}
              className="rounded-lg border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {category.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {category.description}
              </p>
              <p className="mt-3 text-sm font-medium text-brand-600">
                {toolCount.toLocaleString()} tools
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
