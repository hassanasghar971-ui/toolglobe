import { CATEGORIES } from "./data/categories";
import { DEVELOPER_TOOLS } from "./data/developer-tools";
import { TEXT_TOOLS } from "./data/text-tools";
import { MATH_CALCULATORS } from "./data/math-calculators";
import { validateRegistryIntegrity } from "./validate";
import type { ToolDefinition, CategoryDefinition, CategorySlug } from "./types";

export * from "./types";

/**
 * Add new category data-file imports here as content shards grow.
 * This array is the single aggregation point for all 20,000+ tools —
 * no other module should hand-assemble tool lists.
 */
const ALL_TOOLS: ToolDefinition[] = [
  ...DEVELOPER_TOOLS,
  ...TEXT_TOOLS,
  ...MATH_CALCULATORS,
];

const ALL_CATEGORIES: CategoryDefinition[] = CATEGORIES;

/**
 * Fails the build immediately (not silently at runtime in production)
 * if any duplicate slug, duplicate meta tag, or dangling relation exists.
 */
const integrityCheck = validateRegistryIntegrity(ALL_TOOLS, ALL_CATEGORIES);
if (!integrityCheck.valid) {
  throw new Error(
    `[tool-registry] Registry integrity check failed:\n${integrityCheck.errors
      .map((e) => ` - ${e}`)
      .join("\n")}`
  );
}

export function getAllCategories(): CategoryDefinition[] {
  return ALL_CATEGORIES;
}

export function getAllCategorySlugs(): CategorySlug[] {
  return ALL_CATEGORIES.map((c) => c.slug);
}

export function getCategoryBySlug(
  slug: string
): CategoryDefinition | undefined {
  return ALL_CATEGORIES.find((c) => c.slug === slug);
}

export function getAllTools(): ToolDefinition[] {
  return ALL_TOOLS;
}

export function getToolsByCategory(category: CategorySlug): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.category === category);
}

export function getToolBySlug(
  category: string,
  slug: string
): ToolDefinition | undefined {
  return ALL_TOOLS.find((t) => t.category === category && t.slug === slug);
}

export function getAllToolPaths(): Array<{
  category: CategorySlug;
  slug: string;
}> {
  return ALL_TOOLS.map((t) => ({ category: t.category, slug: t.slug }));
}

export function getRelatedTools(
  tool: ToolDefinition,
  limit = 6
): ToolDefinition[] {
  const explicit = tool.relatedToolSlugs
    .map((slug) => ALL_TOOLS.find((t) => t.slug === slug))
    .filter((t): t is ToolDefinition => Boolean(t));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const sameCategoryFallback = ALL_TOOLS.filter(
    (t) =>
      t.category === tool.category &&
      t.slug !== tool.slug &&
      !explicit.includes(t)
  );

  return [...explicit, ...sameCategoryFallback].slice(0, limit);
}

export function searchTools(query: string): ToolDefinition[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return ALL_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(normalized) ||
      t.shortDescription.toLowerCase().includes(normalized) ||
      t.seo.keywords.some((k) => k.toLowerCase().includes(normalized))
  );
}
