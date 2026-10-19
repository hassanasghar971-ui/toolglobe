// components/search/ToolPreviewCard.tsx
import Link from "next/link";
import type { ToolDefinition } from "@/lib/types/tool";
import { buildToolPath } from "@/lib/slug-utils";

interface ToolPreviewCardProps {
  tool: ToolDefinition;
  variant?: "grid" | "row";
}

export default function ToolPreviewCard({ tool, variant = "grid" }: ToolPreviewCardProps) {
  const href = buildToolPath(tool.categorySlug, tool.slug);

  if (variant === "row") {
    return (
      <Link
        href={href}
        className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{tool.name}</p>
          <p className="truncate text-xs text-neutral-500">{tool.shortDescription}</p>
        </div>
        <span className="shrink-0 text-xs capitalize text-neutral-400">
          {tool.categorySlug.replace(/-/g, " ")}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-card border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lg"
    >
      <p className="font-semibold text-neutral-900 dark:text-neutral-100 transition-colors group-hover:text-brand-600">
        {tool.name}
      </p>
      <p className="mt-1.5 line-clamp-2 text-sm text-neutral-500">{tool.shortDescription}</p>
      <span className="mt-3 inline-block w-fit rounded-full bg-brand-50 dark:bg-brand-950/50 px-2.5 py-1 text-xs font-medium capitalize text-brand-600 dark:text-brand-400">
        {tool.categorySlug.replace(/-/g, " ")}
      </span>
    </Link>
  );
}
