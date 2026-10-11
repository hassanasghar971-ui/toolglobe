// app/[...slug]/page.tsx
// Fail-safe dynamic catch-all covering all 20,000+ tool routes plus unit
// family "hub" pages (e.g. /convert/length), with zero-404 fallback handling.
// Renders Phase 1's generated 200–400 word SEO content, FAQ accordions, and
// SoftwareApplication + FAQPage JSON-LD schema.

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getAllTools, computeToolCounts } from "@/lib/tools-registry";
import { buildToolSEO } from "@/lib/tool-specs-builder";
import { getFamily, UNIT_FAMILIES } from "@/lib/units";
import { SITE_CONFIG } from "@/lib/site-config";
import ToolRuntime from "@/components/ToolRuntime";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export const revalidate = 604800; // weekly ISR — safe for deterministic math/text tools
export const dynamicParams = true; // allow on-demand rendering for the long tail

// Pre-render only the highest-value Tier 1 routes + family hubs at build time;
// everything else renders on-demand (ISR) to keep build time bounded.
export async function generateStaticParams() {
  const tierOne = getAllTools()
    .filter((t) => t.tier === 1)
    .slice(0, 1500)
    .map((t) => ({ slug: t.slug.split("/") }));

  const familyHubs = UNIT_FAMILIES.map((f) => ({ slug: ["convert", f.id] }));

  return [...tierOne, ...familyHubs];
}

const HUB_CATEGORIES: Record<string, string> = {
  text: "Text Tools",
  calculator: "Calculators",
  seo: "SEO Tools",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.filter(Boolean);

  if (parts[0] === "convert" && parts.length === 2) {
    const fam = getFamily(parts[1]);
    if (!fam) return { title: "Not Found" };
    return {
      title: `${fam.name} Converter Hub — All ${fam.units.length} Units`,
      description: `Browse every ${fam.name} unit conversion on ${SITE_CONFIG.name}: ${fam.units.length} units and ${(fam.units.length * (fam.units.length - 1)).toLocaleString()} instant conversion combinations.`,
      alternates: { canonical: `${SITE_CONFIG.url}/convert/${fam.id}` },
    };
  }

  if (parts.length === 1 && HUB_CATEGORIES[parts[0]]) {
    const label = HUB_CATEGORIES[parts[0]];
    return {
      title: `${label} — Free Online Utilities`,
      description: `Explore every free ${label} on ${SITE_CONFIG.name}: fast, accurate, and ready to use instantly.`,
      alternates: { canonical: `${SITE_CONFIG.url}/${parts[0]}` },
    };
  }

  const tool = getToolBySlug(parts.join("/"));
  if (!tool) return { title: "Tool Not Found" };

  const seo = buildToolSEO(tool);
  return {
    title: tool.title,
    description: seo.content.slice(0, 155).trim() + "…",
    alternates: { canonical: `${SITE_CONFIG.url}/${tool.slug}` },
    robots: seo.robots,
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `${SITE_CONFIG.url}/${tool.slug}`,
      type: "website",
    },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const parts = slug.filter(Boolean);

  // --- Branch 1: Unit family hub page (/convert/length) ----------------------
  if (parts[0] === "convert" && parts.length === 2) {
    const fam = getFamily(parts[1]);
    if (!fam) notFound();

    return (
      <div className="flex flex-col gap-8">
        <nav className="text-xs text-white/40 flex gap-2">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white/60">{fam.name}</span>
        </nav>

        <div className="text-center">
          <span className="text-4xl">{fam.icon}</span>
          <h1 className="text-3xl font-bold text-white mt-2">{fam.name} Converter</h1>
          <p className="text-white/50 text-sm mt-2 max-w-xl mx-auto">
            Choose any pair of {fam.name.toLowerCase()} units below for an instant, accurate conversion.
            {fam.units.length} units generate {(fam.units.length * (fam.units.length - 1)).toLocaleString()} unique conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fam.units.flatMap((from) =>
            fam.units
              .filter((to) => to.id !== from.id)
              .slice(0, Math.max(1, Math.floor(24 / fam.units.length)))
              .map((to) => (
                <Link
                  key={`${from.id}-${to.id}`}
                  href={`/convert/${fam.id}/${from.id}-to-${to.id}`}
                  className="glass-card p-4 text-sm text-white/80 hover:text-white hover:shadow-glow transition-shadow"
                >
                  {from.name} → {to.name}
                </Link>
              ))
          )}
        </div>

        <div className="text-center">
          <Link href={`/tools?category=${encodeURIComponent(fam.name)}`} className="glow-border inline-block px-5 py-2.5 rounded-xl text-sm text-white">
            Browse all {fam.name} conversions →
          </Link>
        </div>
      </div>
    );
  }

  // --- Branch 2: Text/Calculator/SEO category hub (/text, /calculator, /seo) -
  if (parts.length === 1 && HUB_CATEGORIES[parts[0]]) {
    const label = HUB_CATEGORIES[parts[0]];
    return (
      <div className="flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold text-white">{label}</h1>
        <p className="text-white/50 text-sm max-w-xl mx-auto">
          Browse every free {label.toLowerCase()} utility available on {SITE_CONFIG.name}.
        </p>
        <div className="mx-auto">
          <Link href={`/tools?category=${encodeURIComponent(label)}`} className="glow-border inline-block px-5 py-2.5 rounded-xl text-sm text-white">
            View all {label} →
          </Link>
        </div>
      </div>
    );
  }

  // --- Branch 3: Individual tool page -----------------------------------------
  const tool = getToolBySlug(parts.join("/"));
  if (!tool) notFound();

  const seo = buildToolSEO(tool);
  const counts = computeToolCounts();

  return (
    <div className="flex flex-col gap-10">
      <nav className="text-xs text-white/40 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-white">Tools</Link>
        <span>/</span>
        <Link href={`/tools?category=${encodeURIComponent(tool.category)}`} className="hover:text-white">
          {tool.category}
        </Link>
        <span>/</span>
        <span className="text-white/60">{tool.title}</span>
      </nav>

      <ToolRuntime tool={tool} />

      <article className="glass-card p-6 sm:p-8 max-w-3xl mx-auto flex flex-col gap-4">
        <h2 className="text-lg font-bold text-white">About the {tool.title}</h2>
        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{seo.content}</p>
        <p className="text-[11px] text-white/30">
          Part of {SITE_CONFIG.name}&apos;s library of {counts.total.toLocaleString()}+ free tools.
        </p>
      </article>

      <section className="max-w-3xl mx-auto w-full flex flex-col gap-3">
        <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
        {seo.faq.map((f, i) => (
          <details key={i} className="glass-card p-4 group">
            <summary className="cursor-pointer font-medium text-white list-none flex justify-between items-center gap-4">
              <span>{f.q}</span>
              <span className="text-white/30 group-open:rotate-45 transition-transform shrink-0">+</span>
            </summary>
            <p className="text-sm text-white/60 mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>

      {seo.jsonLd.map((schema, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </div>
  );
}
