import Link from "next/link";
import type { CategoryDefinition, ToolDefinition } from "@/lib/tool-registry/types";

interface SidebarProps {
  categories: CategoryDefinition[];
  featuredTools: ToolDefinition[];
  activeCategorySlug?: string;
}

export function Sidebar({ categories, featuredTools, activeCategorySlug }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-8">
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Categories
        </h2>
        <nav className="flex flex-col gap-1">
          {categories.map((category) => {
            const isActive = category.slug === activeCategorySlug;
            return (
              <Link
                key={category.slug}
                href={`/tools/${category.slug}`}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {featuredTools.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Featured Tools
          </h2>
          <ul className="flex flex-col gap-2">
            {featuredTools.map((tool) => (
              <li key={`${tool.category}-${tool.slug}`}>
                <Link
                  href={`/tools/${tool.category}/${tool.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-brand-600"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
