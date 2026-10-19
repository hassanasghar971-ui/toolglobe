// components/home/CategoryGrid.tsx
import Link from "next/link";
import {
  ArrowLeftRight,
  Calculator,
  Type,
  Code2,
  Sparkles,
  Palette,
  Image as ImageIconLucide,
  FileText,
  TrendingUp,
  Network,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tool-registry";

// Explicit named imports (not a namespace import of the whole icon
// library) keep this tree-shakeable — critical at 20,000+ page scale
// where bundle size directly impacts Core Web Vitals.
const ICON_MAP: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Calculator,
  Type,
  Code2,
  Sparkles,
  Palette,
  Image: ImageIconLucide,
  FileText,
  TrendingUp,
  Network,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Wrench;
}

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-3xl">
        Browse by Category
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const Icon = resolveIcon(category.icon);
          const toolCount = getToolsByCategory(category.slug).length;
          return (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="group flex items-start gap-4 rounded-card border border-neutral-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-950/50 dark:text-brand-400">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{category.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{category.shortDescription}</p>
                <span className="mt-2 inline-block text-xs font-medium text-brand-600 dark:text-brand-400">
                  {toolCount.toLocaleString()} tools →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
