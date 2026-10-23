import Link from "next/link";
import type { CategoryDefinition } from "@/lib/tool-registry/types";

interface CategoryNavProps {
  categories: CategoryDefinition[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  return (
    <nav aria-label="Tool categories" className="flex items-center gap-1 overflow-x-auto">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/tools/${category.slug}`}
          className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-600"
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
