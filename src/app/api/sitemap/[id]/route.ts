// ============================================================
// TOOLGLOBE — Chunked Sitemap API Route (Drip-Feed Engine)
// Access via: /api/sitemap/1, /api/sitemap/2, etc.
// Also aliased via sitemap-N.xml redirect in middleware
// ============================================================

import { NextResponse, type NextRequest } from "next/server";
import { ALL_TOOLS, CATEGORIES } from "@/lib/tools-data";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://toolglobe.app";
const CHUNK_SIZE = 500;

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  const chunkId = parseInt(id, 10);
  const now = new Date().toISOString().split("T")[0];

  if (isNaN(chunkId) || chunkId < 1 || chunkId > 4) {
    return new NextResponse("Not Found", { status: 404 });
  }

  let urls: string[] = [];

  if (chunkId === 1) {
    const tools = ALL_TOOLS.slice(0, CHUNK_SIZE);
    urls = [
      `  <url>\n    <loc>${xmlEscape(BASE_URL)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
      ...CATEGORIES.map(
        (cat) =>
          `  <url>\n    <loc>${xmlEscape(`${BASE_URL}/${cat.slug}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
      ),
      ...tools.map(
        (tool) =>
          `  <url>\n    <loc>${xmlEscape(`${BASE_URL}/${tool.category}/${tool.slug}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>`
      ),
    ];
  } else if (chunkId === 2) {
    const tools = ALL_TOOLS.slice(CHUNK_SIZE, CHUNK_SIZE * 2);
    urls = [
      ...tools.map(
        (tool) =>
          `  <url>\n    <loc>${xmlEscape(`${BASE_URL}/${tool.category}/${tool.slug}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.75</priority>\n  </url>`
      ),
      ...generateSyntheticSlugs("text-tools", 50).map(
        (slug) =>
          `  <url>\n    <loc>${xmlEscape(`${BASE_URL}/text-tools/${slug}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
      ),
    ];
  } else if (chunkId === 3) {
    const categories3 = ["seo-tools", "developer-tools", "math-tools", "color-tools", "unit-converter"];
    for (const cat of categories3) {
      const slugs = generateSyntheticSlugs(cat, 60);
      urls.push(
        ...slugs.map(
          (slug) =>
            `  <url>\n    <loc>${xmlEscape(`${BASE_URL}/${cat}/${slug}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>`
        )
      );
    }
  } else {
    const categories4 = ["finance-tools","health-tools","writing-tools","social-media-tools","password-tools","encoding-tools","random-generators","binary-tools","json-tools","css-tools","crypto-tools","html-tools","ai-tools","misc-tools","string-tools"];
    for (const cat of categories4) {
      const slugs = generateSyntheticSlugs(cat, 30);
      urls.push(
        ...slugs.map(
          (slug) =>
            `  <url>\n    <loc>${xmlEscape(`${BASE_URL}/${cat}/${slug}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
        )
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}

function generateSyntheticSlugs(category: string, count: number): string[] {
  const bases: Record<string, string[]> = {
    "text-tools": ["word-counter","line-counter","paragraph-counter","sentence-counter","unique-word-finder","text-analyzer","capitalization-fixer","accent-remover","unicode-converter","smart-quotes-converter","text-cleaner","whitespace-normalizer","line-break-remover","tab-to-space-converter","html-tag-remover","text-joiner","text-wrapper","text-aligner","text-padding-tool","random-sentence-generator","text-statistics","reading-level-checker","passive-voice-detector","adverb-finder","adjective-counter","noun-finder","pronoun-replacer","text-highlighter","find-replace-tool","text-splitter","text-merger","text-extractor","text-trimmer","text-cutter","text-expander","abbreviation-expander","text-translator-hint","text-randomizer","text-scrambler","text-shuffle","text-rotate","text-mirror","text-encode","text-decode","text-compress","text-decompress","text-strip","text-normalize","text-tokenizer","text-segmenter"],
    "seo-tools": ["title-generator","description-generator","keyword-planner","search-volume-estimator","competitor-keyword-finder","backlink-anchor-generator","internal-link-optimizer","image-alt-text-generator","seo-score-checker","page-speed-insights","mobile-seo-checker","local-seo-optimizer","voice-search-optimizer","featured-snippet-optimizer","breadcrumb-generator","hreflang-generator","noindex-checker","canonical-checker","pagination-seo-helper","amp-validator","core-web-vitals-checker","title-tag-optimizer","h1-tag-checker","link-checker","broken-link-finder","redirect-checker","url-structure-analyzer","sitemap-validator","robots-txt-tester","google-preview-generator","serp-snippet-preview","rich-snippet-checker","structured-data-tester","keyword-gap-analyzer","content-gap-finder","seo-audit-tool","page-authority-estimator","domain-authority-checker","seo-report-generator","competitor-analysis-tool","rank-tracker-helper","ctr-optimizer","bounce-rate-analyzer","session-duration-tool","conversion-rate-optimizer","ab-test-calculator","landing-page-optimizer","call-to-action-generator","seo-checklist-tool","meta-robot-generator"],
    "developer-tools": ["code-minifier","code-beautifier","code-formatter","syntax-highlighter","variable-name-generator","function-name-generator","comment-remover","dead-code-detector","import-sorter","dependency-checker","api-endpoint-tester","rest-api-helper","graphql-query-builder","webhook-tester","curl-command-generator","http-header-analyzer","ssl-certificate-checker","cors-checker","cookie-analyzer","session-manager","token-generator","api-key-generator","secret-generator","environment-variable-helper","docker-command-generator","git-command-helper","npm-command-builder","package-json-validator","tsconfig-generator","eslint-config-generator","prettier-config-builder","webpack-config-helper","vite-config-generator","nextjs-config-helper","database-query-builder","sql-formatter","nosql-query-helper","mongodb-query-builder","redis-command-helper","terminal-command-generator","linux-command-reference","bash-script-helper","python-snippet-generator","javascript-snippet-helper","typescript-type-generator","css-property-reference","html-attribute-reference","browser-api-reference","web-performance-analyzer","pwa-manifest-generator"],
    "math-tools": ["addition-calculator","subtraction-calculator","multiplication-calculator","division-calculator","percentage-finder","fraction-simplifier","decimal-to-fraction","fraction-to-decimal","mixed-number-calculator","ratio-calculator","proportion-solver","equation-solver","linear-equation-solver","system-of-equations","polynomial-calculator","matrix-calculator","determinant-calculator","eigenvalue-calculator","vector-calculator","dot-product-calculator","cross-product-calculator","derivative-calculator","integral-calculator","limit-calculator","series-calculator","probability-calculator","combination-calculator","permutation-calculator","binomial-coefficient","expected-value-calculator","variance-calculator","standard-deviation","z-score-calculator","t-score-calculator","chi-square-calculator","correlation-calculator","regression-calculator","hypothesis-tester","confidence-interval","margin-of-error","number-base-converter","complex-number-calculator","absolute-value-calculator","ceiling-floor-calculator","round-number-tool","significant-figures","number-formatter","large-number-calculator","scientific-calculator","graphing-helper"],
    "color-tools": ["color-picker","color-mixer","color-blender","color-inverter","color-darkener","color-lightener","color-saturator","color-desaturator","analogous-colors","complementary-colors","triadic-colors","tetradic-colors","split-complementary","monochromatic-scheme","warm-colors-generator","cool-colors-generator","earth-tones-generator","pastel-colors-generator","neon-colors-generator","material-design-colors","bootstrap-colors","tailwind-colors","brand-color-extractor","logo-color-finder","color-accessibility-checker","color-blindness-simulator","color-temperature-converter","pantone-to-hex","ral-to-rgb","color-harmony-generator","websafe-colors","color-scheme-generator","sequential-palette","diverging-palette","qualitative-palette","choropleth-colors","heatmap-colors","color-gradient-steps","multi-stop-gradient","radial-gradient-generator","conic-gradient-maker","background-pattern-colors","ui-color-system","dark-mode-color-adapter","light-mode-colors","high-contrast-colors","print-color-calculator","color-swatch-generator","pantone-matcher","color-trend-analyzer"],
    "unit-converter": ["miles-to-km","km-to-miles","feet-to-meters","meters-to-feet","inches-to-cm","cm-to-inches","pounds-to-kg","kg-to-pounds","celsius-to-fahrenheit","fahrenheit-to-celsius","gallons-to-liters","liters-to-gallons","acres-to-sqm","sqm-to-acres","mph-to-kph","kph-to-mph","knots-to-mph","horsepower-converter","torque-converter","watt-to-hp","joules-to-btu","calories-to-joules","kilowatt-to-watt","ampere-to-milliampere","volt-to-millivolt","ohm-calculator","farad-converter","henry-converter","decibel-converter","hertz-to-rpm","rpm-to-rads","angular-velocity","linear-velocity","flow-rate-converter","viscosity-converter","density-converter","concentration-converter","molar-mass-calculator","molarity-calculator","ph-converter","light-intensity-converter","luminous-flux","illuminance-converter","radioactivity-converter","absorbed-dose","pixel-to-em","em-to-px","px-to-rem","rem-to-px","point-to-pixel","pica-converter"],
  };
  const defaultBases = Array.from({ length: count }, (_, i) => `tool-variant-${i + 1}`);
  const available = bases[category] || defaultBases;
  return available.slice(0, count);
}
