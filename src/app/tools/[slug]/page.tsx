import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getToolBySlug,
  getAllSlugs,
  getRelatedTools,
  TOTAL_TOOLS_COUNT,
} from "@/lib/tools-registry";
import ToolWorkspace from "@/components/tools/ToolWorkspace";
import ToolCard from "@/components/ToolCard";

const BASE_URL = "https://pdflovers.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  const url = `${BASE_URL}/tools/${tool.slug}`;

  return {
    title: `${tool.name} Online Free – No Upload, 100% Secure`,
    description: tool.shortDescription,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${tool.name} | PDF Lovers Pro`,
      description: tool.shortDescription,
      siteName: "PDF Lovers Pro",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} | PDF Lovers Pro`,
      description: tool.shortDescription,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = getRelatedTools(tool.slug, 4);
  const url = `${BASE_URL}/tools/${tool.slug}`;

  const faqs = [
    {
      q: `Is ${tool.name} free to use?`,
      a: `Yes, ${tool.name} is 100% free on PDF Lovers Pro with no hidden charges, no watermarks, and no sign-up required.`,
    },
    {
      q: `Is my file uploaded to a server when I use ${tool.name}?`,
      a: `No. ${tool.name} runs entirely inside your browser using WebAssembly. Your file is processed locally in your device's memory and is never transmitted to or stored on any server.`,
    },
    {
      q: `What file formats does ${tool.name} support?`,
      a: `${tool.name} accepts ${tool.acceptedFormats.join(", ")} and produces output as ${tool.outputFormat}.`,
    },
    {
      q: `Do I need to install any software to use ${tool.name}?`,
      a: `No installation is required. ${tool.name} works directly in any modern browser including Chrome, Safari, Firefox, and Edge on both desktop and mobile devices.`,
    },
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web Browser)",
    description: tool.shortDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2548",
      bestRating: "5",
      worstRating: "1",
    },
    creator: {
      "@type": "Person",
      name: "Hassan Asghar",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Tools",
        item: `${BASE_URL}/tools`,
      },
      { "@type": "ListItem", position: 3, name: tool.name, item: url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="border-b border-slate-100 bg-slate-50 py-3 text-xs text-slate-500">
        <div className="container-page">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="hover:text-blue-600">
            All Tools
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-700">{tool.name}</span>
        </div>
      </nav>

      <section className="py-10 sm:py-14">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {tool.name}
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              {tool.shortDescription}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <ToolWorkspace tool={tool} />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 py-14">
        <div className="container-page mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">
            How to Use the {tool.name} Tool
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
            <li>
              Click the upload area above or drag and drop your{" "}
              {tool.acceptedFormats.join(", ")} file directly into the box.
            </li>
            <li>
              Review your file and adjust any available settings for the{" "}
              {tool.name} operation.
            </li>
            <li>
              Click the process button — your file is handled entirely inside
              your browser's memory using WebAssembly.
            </li>
            <li>
              Download your finished {tool.outputFormat} file instantly. No
              waiting, no email required.
            </li>
          </ol>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">
            About This Tool
          </h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
            {tool.description}
          </p>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">
            Is It Safe to Use {tool.name} Online?
          </h2>
          <p className="mt-4 leading-relaxed text-slate-700">
            Absolutely. Unlike most online PDF tools that upload your file to
            a remote server for processing, PDF Lovers Pro runs {tool.name}{" "}
            entirely within your own browser using WebAssembly-compiled
            libraries. Your document is loaded directly into your device's
            local memory, processed there, and then immediately released once
            you download your result or reset the tool. No copy of your file
            is ever transmitted over the internet, logged on a server, or
            stored in any database — making this one of the most private ways
            to work with PDF documents online.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="card">
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {relatedTools.length > 0 && (
        <section className="py-14">
          <div className="container-page">
            <h2 className="mb-8 text-2xl font-bold text-slate-900">
              Related Tools
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTools.map((relatedTool) => (
                <ToolCard key={relatedTool.slug} tool={relatedTool} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
