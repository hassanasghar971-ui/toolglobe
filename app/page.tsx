import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe2 } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAllCategories, getAllTools } from "@/lib/tool-registry";
import { Sidebar } from "@/components/layout/sidebar";
import { AdSlot } from "@/components/ads/ad-slot";

export const metadata: Metadata = buildPageMetadata({
  title: "ToolGlobe — 20,000+ Free Online Tools for Developers & Professionals",
  description:
    "Explore ToolGlobe's growing library of free, fast, and secure online utility tools — JSON formatters, text converters, calculators, and more, all running instantly in your browser.",
  pathSegments: [],
  keywords: [
    "online tools",
    "free utility tools",
    "developer tools",
    "text tools",
    "calculators online",
  ],
});

export default function HomePage() {
  const categories = getAllCategories();
  const allTools = getAllTools();
  const featuredTools = allTools.filter((t) => t.isFeatured);

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            20,000+ Free Online Tools,
            <br className="hidden sm:block" /> All in One Place
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            ToolGlobe gives developers, students, and professionals instant
            access to real, functional utilities — JSON formatters, text
            converters, calculators, and more — processed securely in your
            browser with no sign-up required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-brand-600" /> Instant, client-side processing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-600" /> No data uploaded to servers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-brand-600" /> Free, forever
            </span>
          </div>
        </div>
      </section>

      {process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE && (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <AdSlot
            variant="adsense-display"
            adSlotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE}
          />
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <div className="hidden lg:block">
            <Sidebar categories={categories} featuredTools={featuredTools} />
          </div>

          <div className="flex flex-col gap-12">
            <div>
              <h2 className="mb-5 text-2xl font-bold text-slate-900">
                Browse by Category
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                  const toolCount = allTools.filter(
                    (t) => t.category === category.slug
                  ).length;
                  return (
                    <Link
                      key={category.slug}
                      href={`/tools/${category.slug}`}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
                    >
                      <div>
                        <p className="text-base font-semibold text-slate-800 group-hover:text-brand-600">
                          {category.name}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {category.description}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                        <span>
                          {toolCount} {toolCount === 1 ? "tool" : "tools"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {featuredTools.length > 0 && (
              <div>
                <h2 className="mb-5 text-2xl font-bold text-slate-900">
                  Featured Tools
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {featuredTools.map((tool) => (
                    <Link
                      key={`${tool.category}-${tool.slug}`}
                      href={`/tools/${tool.category}/${tool.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-brand-600">
                          {tool.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {tool.shortDescription}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
