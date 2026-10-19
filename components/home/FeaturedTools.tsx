// components/home/FeaturedTools.tsx
import type { ToolDefinition } from "@/lib/types/tool";
import ToolPreviewCard from "@/components/search/ToolPreviewCard";

interface FeaturedToolsProps {
  tools: ToolDefinition[];
}

export default function FeaturedTools({ tools }: FeaturedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-3xl">
        Popular Tools
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolPreviewCard key={tool.id} tool={tool} variant="grid" />
        ))}
      </div>
    </section>
  );
}
