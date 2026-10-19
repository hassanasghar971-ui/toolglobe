// components/tool-engine/RelatedToolsList.tsx
import Link from "next/link";
import type { ToolDefinition } from "@/lib/types/tool";
import { buildToolPath } from "@/lib/slug-utils";

interface RelatedToolsListProps {
  tools: ToolDefinition[];
}

export default function RelatedToolsList({ tools }: RelatedToolsListProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <section aria-label="Related Tools" className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">Related Tools</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={buildToolPath(tool.categorySlug, tool.slug)}
            className="rounded-card border border-neutral-200 dark:border-neutral-800 p-4 transition-colors hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30"
          >
            <p className="font-medium text-sm text-neutral-800 dark:text-neutral-200">{tool.name}</p>
            <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{tool.shortDescription}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
