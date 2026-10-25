import Link from "next/link";
import type { ToolDefinition } from "@/lib/tool-registry/types";

interface RelatedToolsListProps {
  tools: ToolDefinition[];
}

export default function RelatedToolsList({ tools }: RelatedToolsListProps) {
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-tools-heading" className="space-y-3">
      <h2
        id="related-tools-heading"
        className="text-xl font-semibold text-slate-900"
      >
        Related Tools
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.category}/${tool.slug}`}
              className="block rounded-lg border border-slate-200 p-4 transition hover:border-slate-400 hover:shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{tool.name}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {tool.shortDescription}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
