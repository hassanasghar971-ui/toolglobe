// components/tool-engine/ToolBreadcrumbs.tsx
import Link from "next/link";
import type { ToolCategory } from "@/lib/categories";

interface ToolBreadcrumbsProps {
  category: ToolCategory;
  toolName: string;
}

export default function ToolBreadcrumbs({ category, toolName }: ToolBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={`/${category.slug}`} className="hover:text-brand-600 transition-colors">
            {category.name}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="font-medium text-neutral-700 dark:text-neutral-300">
          {toolName}
        </li>
      </ol>
    </nav>
  );
}
