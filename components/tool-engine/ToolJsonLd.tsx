// components/tool-engine/ToolJsonLd.tsx
import type { ToolDefinition } from "@/lib/types/tool";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

interface ToolJsonLdProps {
  tool: ToolDefinition;
  canonicalUrl: string;
  categoryName: string;
}

/**
 * Tool-page-scoped structured data (WebApplication + FAQPage +
 * BreadcrumbList). This is intentionally local to the tool-engine
 * component set — Phase 4 will introduce lib/seo/json-ld.ts for
 * SITE-WIDE schemas (Organization, WebSite, ItemList on category/home
 * pages) that this component does not and should not duplicate.
 */
export default function ToolJsonLd({ tool, canonicalUrl, categoryName }: ToolJsonLdProps) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        url: canonicalUrl,
        description: tool.longDescription,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (Web Browser)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      ...(tool.seo.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: tool.seo.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: categoryName, item: `${SITE_URL}/${tool.categorySlug}` },
          { "@type": "ListItem", position: 3, name: tool.name, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
