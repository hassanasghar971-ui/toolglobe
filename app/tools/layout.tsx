import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function ToolsSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
