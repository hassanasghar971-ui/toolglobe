"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CategoryDefinition } from "@/lib/tool-registry/types";

interface CategoryNavProps {
  categories: CategoryDefinition[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Tool categories" className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const href = `/tools/${category.slug}`;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={category.slug}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            }
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}
