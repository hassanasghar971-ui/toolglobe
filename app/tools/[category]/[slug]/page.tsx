import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllToolPaths,
  getToolBySlug,
  getRelatedTools,
  getCategoryBySlug,
} from "@/lib/tool-registry";
import { buildToolPageMetadata } from "@/lib/seo/metadata";
import ToolJsonLd from "@/components/tools/ToolJsonLd";
import ToolBreadcrumbs from "@/components/tools/ToolBreadcrumbs";
import ToolRunner from "@/components/tools/ToolRunner";
import FaqAccordion from "@/components/tools/FaqAccordion";
import RelatedToolsList from "@/components/tools/RelatedToolsList";
import { AdSlot } from "@/components/ads/ad-slot";

export const revalidate = 86400;
export const dynamicParams = true;

interface ToolPageParams {
  category: string;
  slug: string;
}

export async function generateStaticParams(): Promise<ToolPageParams[]> {
  return getAllToolPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ToolPageParams>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = getToolBySlug(category, slug);

  if (!tool) {
    return {};
  }

  return buildToolPageMetadata(tool);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<ToolPageParams>;
}) {
  const { category, slug } = await params;
  const tool = getToolBySlug(category, slug);
  const categoryDefinition = getCategoryBySlug(category);

  if (!tool || !categoryDefinition) {
    notFound();
  }

  const relatedTools = getRelatedTools(tool, 4);

  return (
    <article className="space-y-10 pb-16">
      <ToolJsonLd tool={tool} category={categoryDefinition} />
      <ToolBreadcrumbs
        items={[
          { label: "Tools", href: "/tools" },
          {
            label: categoryDefinition.name,
            href: `/tools/${categoryDefinition.slug}`,
          },
          {
            label: tool.name,
            href: `/tools/${categoryDefinition.slug}/${tool.slug}`,
          },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {tool.name}
        </h1>
        <p className="text-base text-slate-600">{tool.shortDescription}</p>
      </header>

      <ToolRunner tool={tool} />

      {process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_PAGE ? (
        <AdSlot
          variant="adsense-display"
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_PAGE}
          className="my-8"
        />
      ) : null}

      <section aria-labelledby="about-heading" className="space-y-3">
        <h2 id="about-heading" className="text-xl font-semibold text-slate-900">
          About {tool.name}
        </h2>
        <p className="leading-relaxed text-slate-700">{tool.longDescription}</p>
      </section>

      <section aria-labelledby="usage-heading" className="space-y-3">
        <h2 id="usage-heading" className="text-xl font-semibold text-slate-900">
          How to Use {tool.name}
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-slate-700">
          {tool.usageGuide.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="examples-heading" className="space-y-3">
        <h2 id="examples-heading" className="text-xl font-semibold text-slate-900">
          Examples
        </h2>
        <ul className="space-y-2 text-slate-700">
          {tool.examples.map((example, index) => (
            <li key={index} className="rounded-md border border-slate-200 p-3">
              {example}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-heading" className="space-y-3">
        <h2 id="faq-heading" className="text-xl font-semibold text-slate-900">
          Frequently Asked Questions
        </h2>
        <FaqAccordion items={tool.faqs} />
      </section>

      <RelatedToolsList tools={relatedTools} />
    </article>
  );
}
