#!/usr/bin/env node
/**
 * ToolGlobe Tool Generator
 * --------------------------------------------------------------------------
 * Reads data/tool-specs.json and expands it into lib/tools-registry.generated.ts
 *
 * Run manually:   node scripts/generate-tools.js
 * Run on deploy:  wired into "prebuild" in package.json so Vercel always
 *                 builds against a fresh, in-sync registry — zero manual steps.
 *
 * Add a new unit / currency / formula / text mode to data/tool-specs.json and
 * this script automatically produces new indexable, ad-monetized routes for
 * it the next time it runs. This is the actual mechanism for scaling toward
 * 20,000+ tools without hand-writing new components.
 * --------------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const SPEC_PATH = path.join(__dirname, '..', 'data', 'tool-specs.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'lib', 'tools-registry.generated.ts');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadSpec() {
  if (!fs.existsSync(SPEC_PATH)) {
    throw new Error(`[generate-tools] Spec file not found: ${SPEC_PATH}`);
  }
  try {
    return JSON.parse(fs.readFileSync(SPEC_PATH, 'utf-8'));
  } catch (err) {
    throw new Error(`[generate-tools] Invalid JSON in tool-specs.json: ${err.message}`);
  }
}

/* --------------------------- Family 1: Unit Converters --------------------------- */

function buildUnitConverterTools(spec, seenSlugs) {
  const tools = [];
  const categories = spec.unitConverters?.categories ?? [];

  for (const cat of categories) {
    const { key, label, units } = cat;
    if (!key || !label || !Array.isArray(units) || units.length < 2) {
      console.warn(`[generate-tools] Skipping malformed category:`, cat);
      continue;
    }

    // (a) Full category converter — dropdown UI for all units in this category
    const categorySlug = slugify(`${key}-converter`);
    if (!seenSlugs.has(categorySlug)) {
      seenSlugs.add(categorySlug);
      tools.push({
        slug: categorySlug,
        name: `${label} Converter`,
        category: 'Unit Converters',
        keywords: [key, label.toLowerCase(), 'converter', 'convert', ...units],
        componentImport: '@/components/tools/UnitConverter',
        props: { category: key, title: `${label} Converter` },
      });
    }

    // (b) Pairwise "X to Y" long-tail SEO landing pages
    for (const from of units) {
      for (const to of units) {
        if (from === to) continue;

        let slug = slugify(`${from}-to-${to}`);
        if (seenSlugs.has(slug)) slug = slugify(`${from}-to-${to}-${key}`);
        if (seenSlugs.has(slug)) continue; // extremely rare triple collision — skip safely

        seenSlugs.add(slug);
        tools.push({
          slug,
          name: `${from.toUpperCase()} to ${to.toUpperCase()} Converter`,
          category: 'Unit Converters',
          keywords: [from, to, key, 'convert', `${from} to ${to}`],
          componentImport: '@/components/tools/UnitConverter',
          props: {
            category: key,
            defaultFrom: from,
            defaultTo: to,
            title: `${from.toUpperCase()} to ${to.toUpperCase()} Converter`,
          },
        });
      }
    }
  }

  return tools;
}

/* ----------------------------- Family 2: Calculators ----------------------------- */

function buildCalculatorTools(spec, seenSlugs) {
  const tools = [];
  const calculators = spec.calculators ?? [];

  for (const calc of calculators) {
    if (!calc.formulaKey || !calc.slug || !calc.title) {
      console.warn(`[generate-tools] Skipping malformed calculator:`, calc);
      continue;
    }

    const variants = Array.isArray(calc.currencyVariants) && calc.currencyVariants.length
      ? calc.currencyVariants
      : [null];

    for (const variant of variants) {
      const slug = variant ? slugify(`${calc.slug}-${variant.code}`) : slugify(calc.slug);
      if (seenSlugs.has(slug)) {
        console.warn(`[generate-tools] Skipping duplicate calculator slug: ${slug}`);
        continue;
      }
      seenSlugs.add(slug);

      const name = variant ? `${calc.title} (${variant.code})` : calc.title;

      tools.push({
        slug,
        name,
        category: calc.category || 'Calculators',
        keywords: calc.keywords || [calc.formulaKey],
        componentImport: '@/components/tools/GenericCalculator',
        props: {
          formulaKey: calc.formulaKey,
          title: name,
          ...(variant ? { currencySymbol: variant.symbol, locale: variant.locale } : {}),
        },
      });
    }
  }

  return tools;
}

/* --------------------------- Family 3: Text Transformer --------------------------- */

function buildTextTransformerTools(spec, seenSlugs) {
  const tools = [];
  const modes = spec.textTransformer?.modes ?? [];

  for (const mode of modes) {
    if (!mode.key || !mode.slug || !mode.title) {
      console.warn(`[generate-tools] Skipping malformed text mode:`, mode);
      continue;
    }

    const slug = slugify(mode.slug);
    if (seenSlugs.has(slug)) {
      console.warn(`[generate-tools] Skipping duplicate text-tool slug: ${slug}`);
      continue;
    }
    seenSlugs.add(slug);

    tools.push({
      slug,
      name: mode.title,
      category: mode.category || 'Text Tools',
      keywords: mode.keywords || [mode.key],
      componentImport: '@/components/tools/TextTransformer',
      props: { mode: mode.key, title: mode.title },
    });
  }

  return tools;
}

/* --------------------------------- Code Emission --------------------------------- */

function toToolDefLiteral(tool) {
  return `  {
    slug: ${JSON.stringify(tool.slug)},
    name: ${JSON.stringify(tool.name)},
    category: ${JSON.stringify(tool.category)},
    keywords: ${JSON.stringify(tool.keywords)},
    component: () => import(${JSON.stringify(tool.componentImport)}),
    props: ${JSON.stringify(tool.props)},
  },`;
}

function generate() {
  const spec = loadSpec();
  const seenSlugs = new Set();

  const unitTools = buildUnitConverterTools(spec, seenSlugs);
  const calcTools = buildCalculatorTools(spec, seenSlugs);
  const textTools = buildTextTransformerTools(spec, seenSlugs);

  const all = [...unitTools, ...calcTools, ...textTools];

  const fileContents = `// ============================================================================
// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Source: data/tool-specs.json
// Regenerate: node scripts/generate-tools.js
// Total generated tools: ${all.length}
// ============================================================================

import type { ToolDef } from './tools-registry';

export const GENERATED_TOOLS: ToolDef[] = [
${all.map(toToolDefLiteral).join('\n')}
];
`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, fileContents, 'utf-8');

  console.log('✅ ToolGlobe registry generated successfully');
  console.log(`   • Unit Converters : ${unitTools.length}`);
  console.log(`   • Calculators     : ${calcTools.length}`);
  console.log(`   • Text Tools      : ${textTools.length}`);
  console.log(`   • TOTAL           : ${all.length}`);
  console.log(`📄 Output: ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

generate();
