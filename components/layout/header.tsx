import Link from "next/link";
import { Wrench } from "lucide-react";
import { getAllCategories } from "@/lib/tool-registry";
import { SITE_NAME } from "@/lib/constants/site";
import { CategoryNav } from "@/components/layout/category-nav";
import SearchBar from "@/components/search/SearchBar";
import MobileMenu from "@/components/layout/mobile-menu";

/**
 * Server Component — zero client JS of its own. Category data (max ~8-20
 * items, bounded regardless of the 20,000-tool catalog size) is fetched
 * server-side and passed down to the two client islands (MobileMenu,
 * SearchBar) that genuinely require interactivity.
 */
export function Header() {
  const categories = getAllCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Wrench className="h-6 w-6 text-brand-600" aria-hidden="true" />
          <span className="text-lg font-bold text-slate-900">{SITE_NAME}</span>
        </Link>

        <div className="hidden flex-1 lg:block">
          <CategoryNav categories={categories} />
        </div>

        <div className="ml-auto hidden flex-1 justify-end sm:flex lg:max-w-xs">
          <SearchBar />
        </div>

        <div className="ml-auto lg:hidden">
          <MobileMenu categories={categories} />
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-2 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
