import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ToolGlobe is launching soon",
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-2xl font-semibold">ToolGlobe</h1>
      <p className="text-sm text-muted-foreground">
        Platform scaffolding complete (Phase 0). Tool registry, layout, and
        monetization are rolling out in subsequent build phases.
      </p>
    </main>
  );
}
