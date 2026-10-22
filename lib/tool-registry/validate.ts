import type { ToolDefinition, CategoryDefinition } from "./types";

export interface RegistryValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateRegistryIntegrity(
  tools: ToolDefinition[],
  categories: CategoryDefinition[]
): RegistryValidationResult {
  const errors: string[] = [];

  const seenCanonicalPaths = new Set<string>();
  const seenMetaTitles = new Set<string>();
  const seenMetaDescriptions = new Set<string>();
  const validCategorySlugs = new Set(categories.map((c) => c.slug));

  for (const tool of tools) {
    const canonicalPath = `${tool.category}/${tool.slug}`;

    if (seenCanonicalPaths.has(canonicalPath)) {
      errors.push(`Duplicate tool path detected: /tools/${canonicalPath}`);
    }
    seenCanonicalPaths.add(canonicalPath);

    const normalizedTitle = tool.seo.metaTitle.trim().toLowerCase();
    if (seenMetaTitles.has(normalizedTitle)) {
      errors.push(
        `Duplicate metaTitle "${tool.seo.metaTitle}" on /tools/${canonicalPath} — violates duplicate-content guardrail.`
      );
    }
    seenMetaTitles.add(normalizedTitle);

    const normalizedDescription = tool.seo.metaDescription
      .trim()
      .toLowerCase();
    if (seenMetaDescriptions.has(normalizedDescription)) {
      errors.push(
        `Duplicate metaDescription on /tools/${canonicalPath} — violates duplicate-content guardrail.`
      );
    }
    seenMetaDescriptions.add(normalizedDescription);

    if (!validCategorySlugs.has(tool.category)) {
      errors.push(
        `Tool "${tool.slug}" references unknown category "${tool.category}".`
      );
    }

    for (const relatedSlug of tool.relatedToolSlugs) {
      const exists = tools.some(
        (t) => t.slug === relatedSlug && t.slug !== tool.slug
      );
      if (!exists) {
        errors.push(
          `Tool "${tool.slug}" lists unknown relatedToolSlug "${relatedSlug}".`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
