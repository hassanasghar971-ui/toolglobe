import type { ToolDefinition, CategoryDefinition } from "@/lib/tool-registry/types";
import { buildCanonicalUrl, buildStaticPageCanonicalUrl } from "@/lib/seo/canonical";

interface ToolJsonLdProps {
  tool: ToolDefinition;
  category: CategoryDefinition;
}

export default function ToolJsonLd({ tool, category }: ToolJsonLdProps) {
  const toolUrl = buildCanonicalUrl(category.slug, tool.slug);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "SoftwareApplication",
      "@id": `${toolUrl}#software`,
      name: tool.name,
      description: tool.seo?.metaDescription ?? tool.shortDescription,
      url: toolUrl,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${toolUrl}#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Tools",
          item: buildStaticPageCanonicalUrl(["tools"]),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.name,
          item: buildStaticPageCanonicalUrl(["tools", category.slug]),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tool.name,
          item: toolUrl,
        },
      ],
    },
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${toolUrl}#faq`,
      mainEntity: tool.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  if (tool.usageGuide && tool.usageGuide.length > 0) {
    graph.push({
      "@type": "HowTo",
      "@id": `${toolUrl}#howto`,
      name: `How to use ${tool.name}`,
      step: tool.usageGuide.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text: step,
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  // Escape `<` to prevent breaking out of the <script> tag via injected
  // content (e.g. a tool/FAQ string containing "</script>").
  const serialized = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
