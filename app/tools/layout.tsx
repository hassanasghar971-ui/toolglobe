import type { ReactNode } from "react";
import { getAllCategories, getAllTools } from "@/lib/tool-registry";
import { Sidebar } from "@/components/layout/sidebar";

export default function ToolsSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const categories = getAllCategories();
  const featuredTools = getAllTools().filter((tool) => tool.isFeatured);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <Sidebar categories={categories} featuredTools={featuredTools} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
