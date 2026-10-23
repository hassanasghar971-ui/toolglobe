import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllToolPaths,
  getToolBySlug,
  getCategoryBySlug,
  getRelatedTools,
} from "@/lib/tool-registry";
import { buildToolPageMetadata } from "@/lib/seo/metadata";
import ToolRunner from "@/components/tools/ToolRunner";
import ToolBreadcrumbs from "@/components/tools/ToolBreadcrumbs";
import ToolJsonLd from "@/components/tools/ToolJsonLd";
import FaqAccordion from "@/components/tools/FaqAccordion";
import RelatedToolsList from "@/components/tools/RelatedToolsList";
import { AdSlot } from "@/components/ads/ad-slot";

interface ToolPageProps {
  params: Promise<{ category: string; slug: string }>;
}

/** Pre-renders every tool currently in the registry at build time. As the
 * registry grows toward 20,000 entries, new tools not yet in this list are
 * rendered on first request (dynamicParams below) and cached for 24h —
 * keeping build time bounded regardless of total catalog size. */
export async function generateStaticParams() {
  return getAllToolPaths().map(({ category, slug }) => ({ category, slug }));
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = getToolBySlug(category, slug);
  if (!tool) notFound();
  return buildToolPageMetadata(tool);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { category, slug } = await params;

  const tool = getToolBySlug(category, slug);
  if (!tool) notFound();

  const categoryDef = getCategoryBySlug(tool.category);
  if (!categoryDef) notFound();

  const relatedTools = getRelatedTools(tool);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolJsonLd tool={tool} category={categoryDef} />
      <ToolBreadcrumbs tool={tool} category={categoryDef} />

      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {categoryDef.name}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {tool.name}
        </h1>
        <p className="mt-3 text-base text-slate-600">{tool.shortDescription}</p>
      </header>

      <section
        aria-labelledby="tool-runner-heading"
        className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 id="tool-runner-heading" className="sr-only">
          {tool.name} tool
        </h2>
        <ToolRunner tool={tool} />
      </section>

      {process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_PAGE && (
        <div className="mb-12">
          <AdSlot
            variant="adsense-display"
            adSlotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_PAGE}
            className="mx-auto max-w-3xl"
          />
        </div>
      )}

      <section aria-labelledby="about-heading" className="mb-12">
        <h2 id="about-heading" className="mb-3 text-xl font-semibold text-slate-900">
          About this tool
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          {tool.longDescription}
        </p>
      </section>

      <section aria-labelledby="usage-heading" className="mb-12">
        <h2 id="usage-heading" className="mb-4 text-xl font-semibold text-slate-900">
          How to use {tool.name}
        </h2>
        <ol className="flex flex-col gap-4">
          {tool.usageGuide
            .sort((a, b) => a.step - b.step)
            .map((step) => (
              <li key={step.step} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">
                  {step.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
        </ol>
      </section>

      <section aria-labelledby="examples-heading" className="mb-12">
        <h2 id="examples-heading" className="mb-4 text-xl font-semibold text-slate-900">
          Real-world examples
        </h2>
        <div className="flex flex-col gap-4">
          {tool.examples.map((example) => (
            <div
              key={example.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="mb-2 text-sm font-semibold text-slate-800">
                {example.title}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-slate-400">
                    Input
                  </p>
                  <pre className="overflow-auto rounded-lg bg-white p-2 text-xs text-slate-700">
                    {example.input}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-slate-400">
                    Output
                  </p>
                  <pre className="overflow-auto rounded-lg bg-white p-2 text-xs text-slate-700">
                    {example.output}
                  </pre>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {example.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mb-12">
        <h2 id="faq-heading" className="mb-4 text-xl font-semibold text-slate-900">
          Frequently asked questions
        </h2>
        <FaqAccordion faqs={tool.faqs} />
      </section>

      {relatedTools.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-4 text-xl font-semibold text-slate-900">
            Related tools
          </h2>
          <RelatedToolsList tools={relatedTools} />
        </section>
      )}
    </main>
  );
}
