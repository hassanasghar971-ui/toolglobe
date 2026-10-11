// lib/tools-registry.ts
// Zero-database tool registry. Combines unit-family combinatorics, common-value
// quick-answer pages, and text/math/SEO op registries into 20,000+ routable
// tools via pure JS factory loops. Supports O(1) slug-based lookup (no full
// array scan) for high-performance runtime page rendering.

import { UNIT_FAMILIES, getFamily } from "./units";
import { TEXT_OPS, MATH_OPS, SEO_OPS } from "./engines";
import { ToolMeta } from "./tool-specs-builder";

export type { ToolMeta };

// Common numeric values used to generate long-tail "quick answer" pages
// (e.g. "10 km to miles"). Kept small & deterministic to control sitemap size.
const COMMON_VALUES: number[] = [1, 10, 100];

// Hand-curated high-value conversion pairs promoted to Tier 1 (fully indexed,
// prioritized in sitemap / internal linking).
const POPULAR_PAIRS = new Set<string>([
  "length:kilometer:mile", "length:mile:kilometer", "length:meter:foot",
  "length:centimeter:inch", "length:inch:centimeter",
  "mass:kilogram:pound", "mass:pound:kilogram", "mass:gram:ounce",
  "temperature:celsius:fahrenheit", "temperature:fahrenheit:celsius", "temperature:celsius:kelvin",
  "data:megabyte:gigabyte", "data:gigabyte:megabyte", "data:kilobyte:megabyte",
  "volume:liter:gallon", "volume:gallon:liter",
  "area:squaremeter:squarefoot", "area:acre:hectare",
  "speed:kph:mph", "speed:mph:kph",
  "time:second:minute", "time:minute:hour",
  "pressure:pascal:psi", "pressure:bar:psi",
  "energy:joule:calorie", "energy:kilowatthour:joule",
  "power:watt:horsepower", "power:horsepower:watt",
  "angle:degree:radian", "angle:radian:degree",
  "frequency:hertz:rpm",
  "force:newton:poundforce",
  "torque:newtonmeter:poundfoot",
]);

function computeTier(familyId: string, fromId: string, toId: string): 1 | 2 | 3 {
  if (POPULAR_PAIRS.has(`${familyId}:${fromId}:${toId}`)) return 1;
  const fam = getFamily(familyId);
  if (!fam) return 3;
  const i = fam.units.findIndex((u) => u.id === fromId);
  const j = fam.units.findIndex((u) => u.id === toId);
  return i === 0 || j === 0 ? 2 : 3;
}

function buildOpTool(kind: "text" | "math" | "seo", opId: string, label: string): ToolMeta {
  const prefix = kind === "text" ? "text" : kind === "math" ? "calculator" : "seo";
  const categoryName = kind === "text" ? "Text Tools" : kind === "math" ? "Calculators" : "SEO Tools";
  return {
    slug: `${prefix}/${opId}`,
    title: label,
    description: `${label} — free online ${categoryName.toLowerCase()} with instant, accurate results.`,
    category: categoryName,
    kind,
    tier: 1,
  };
}

function buildConverterTool(familyId: string, fromId: string, toId: string, value?: number): ToolMeta | null {
  const fam = getFamily(familyId);
  if (!fam) return null;
  const from = fam.units.find((u) => u.id === fromId);
  const to = fam.units.find((u) => u.id === toId);
  if (!from || !to) return null;

  const tier = computeTier(familyId, fromId, toId);
  const baseSlug = `convert/${familyId}/${from.id}-to-${to.id}`;

  if (value !== undefined) {
    return {
      slug: `convert/${familyId}/${value}-${from.id}-to-${to.id}`,
      title: `${value} ${from.name} to ${to.name}`,
      description: `What is ${value} ${from.symbol} in ${to.symbol}? Get the instant answer with formula and examples.`,
      category: fam.name,
      kind: "quickvalue",
      tier: 3,
      family: familyId,
      fromUnit: from.id,
      toUnit: to.id,
      fromName: from.name,
      toName: to.name,
      fromSymbol: from.symbol,
      toSymbol: to.symbol,
      value,
    };
  }

  return {
    slug: baseSlug,
    title: `${from.name} to ${to.name} Converter`,
    description: `Convert ${from.name} (${from.symbol}) to ${to.name} (${to.symbol}) instantly with formula and live examples.`,
    category: fam.name,
    kind: "converter",
    tier,
    family: familyId,
    fromUnit: from.id,
    toUnit: to.id,
    fromName: from.name,
    toName: to.name,
    fromSymbol: from.symbol,
    toSymbol: to.symbol,
  };
}

// --- Generators (factory loops, not static arrays) ---------------------------

export function generateConverterTools(): ToolMeta[] {
  const tools: ToolMeta[] = [];
  for (const fam of UNIT_FAMILIES) {
    for (const from of fam.units) {
      for (const to of fam.units) {
        if (from.id === to.id) continue;
        const tool = buildConverterTool(fam.id, from.id, to.id);
        if (tool) tools.push(tool);
      }
    }
  }
  return tools;
}

export function generateQuickValueTools(): ToolMeta[] {
  const tools: ToolMeta[] = [];
  for (const fam of UNIT_FAMILIES) {
    for (const from of fam.units) {
      for (const to of fam.units) {
        if (from.id === to.id) continue;
        for (const val of COMMON_VALUES) {
          const tool = buildConverterTool(fam.id, from.id, to.id, val);
          if (tool) tools.push(tool);
        }
      }
    }
  }
  return tools;
}

export function generateTextTools(): ToolMeta[] {
  return Object.entries(TEXT_OPS).map(([id, op]) => buildOpTool("text", id, op.label));
}

export function generateMathTools(): ToolMeta[] {
  return Object.entries(MATH_OPS).map(([id, op]) => buildOpTool("math", id, op.label));
}

export function generateSeoTools(): ToolMeta[] {
  return Object.entries(SEO_OPS).map(([id, op]) => buildOpTool("seo", id, op.label));
}

// --- Memoized full enumeration (used for sitemap/static params only) --------

let _cache: ToolMeta[] | null = null;

export function getAllTools(): ToolMeta[] {
  if (_cache) return _cache;
  _cache = [
    ...generateConverterTools(),
    ...generateQuickValueTools(),
    ...generateTextTools(),
    ...generateMathTools(),
    ...generateSeoTools(),
  ];
  return _cache;
}

// --- O(1) slug parser (no full-array scan at request time) ------------------

const SLUG_RE = /^(?:(\d+(?:\.\d+)?)-)?([a-z0-9]+)-to-([a-z0-9]+)$/i;

export function getToolBySlug(slug: string): ToolMeta | null {
  const parts = slug.split("/").filter(Boolean);

  if (parts[0] === "convert" && parts.length === 3) {
    const familyId = parts[1];
    const m = parts[2].match(SLUG_RE);
    if (!m) return null;
    const [, valueStr, fromId, toId] = m;
    const value = valueStr ? Number(valueStr) : undefined;
    return buildConverterTool(familyId, fromId, toId, value);
  }

  if (parts[0] === "text" && parts[1] && TEXT_OPS[parts[1]]) return buildOpTool("text", parts[1], TEXT_OPS[parts[1]].label);
  if (parts[0] === "calculator" && parts[1] && MATH_OPS[parts[1]]) return buildOpTool("math", parts[1], MATH_OPS[parts[1]].label);
  if (parts[0] === "seo" && parts[1] && SEO_OPS[parts[1]]) return buildOpTool("seo", parts[1], SEO_OPS[parts[1]].label);

  return null;
}

// --- Category / pagination helpers -------------------------------------------

export function getToolsByCategory(category: string, page = 1, pageSize = 50): ToolMeta[] {
  const filtered = getAllTools().filter((t) => t.category === category);
  const start = (page - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllTools().map((t) => t.category)));
}

export function getAllSlugsForSitemap(limit?: number): string[] {
  const all = getAllTools().map((t) => t.slug);
  return typeof limit === "number" ? all.slice(0, limit) : all;
}

// --- Fast stats (no full materialization needed) -----------------------------

export function computeToolCounts() {
  let converterPairs = 0;
  for (const fam of UNIT_FAMILIES) converterPairs += fam.units.length * (fam.units.length - 1);
  const quickValue = converterPairs * COMMON_VALUES.length;
  const textCount = Object.keys(TEXT_OPS).length;
  const mathCount = Object.keys(MATH_OPS).length;
  const seoCount = Object.keys(SEO_OPS).length;
  const total = converterPairs + quickValue + textCount + mathCount + seoCount;
  return { converterPairs, quickValue, textCount, mathCount, seoCount, total };
}
