import type { Metadata } from "next";
import { TOOLS, TOOL_CATEGORIES, TOTAL_TOOLS_COUNT } from "@/lib/tools-registry";
import ToolsExplorer from "@/components/ToolsExplorer";

const BASE_URL = "https://pdflovers.com";

export const metadata: Metadata = {
  title: `All ${TOTAL_TOOLS_COUNT}+ Free PDF Tools`,
  description:
    "Browse the full library of free, client-side PDF tools on PDF Lovers Pro. Merge, split, compress, convert, edit, sign, and protect PDF files instantly in your browser.",
  alternates: { canonical: `${BASE_URL}/tools` },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "All Tools",
      item: `${BASE_URL}/tools`,
    },
  ],
};

export default function ToolsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container-page text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            All {TOTAL_TOOLS_COUNT}+ PDF Tools
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Every tool runs 100% inside your browser using WebAssembly. No
            uploads, no sign-ups, no limits.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <ToolsExplorer tools={TOOLS} categories={TOOL_CATEGORIES} />
        </div>
      </section>
    </>
  );
}
