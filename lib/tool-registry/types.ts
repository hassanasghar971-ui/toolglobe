import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Category taxonomy — extendable by appending a string, no migration  */
/* ------------------------------------------------------------------ */
export const CATEGORY_TAXONOMY = [
  "developer-tools",
  "text-tools",
  "math-calculators",
  "image-tools",
  "pdf-tools",
  "seo-tools",
  "converters",
  "color-tools",
] as const;

export type CategorySlug = (typeof CATEGORY_TAXONOMY)[number];
export const categorySlugSchema = z.enum(CATEGORY_TAXONOMY);

/* ------------------------------------------------------------------ */
/* Factory field contract (locked for FieldRenderer — Phase 2)         */
/* ------------------------------------------------------------------ */
export const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "select",
  "checkbox",
  "radio",
  "color",
  "date",
  "file",
  "json",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const fieldOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});
export type FieldOption = z.infer<typeof fieldOptionSchema>;

export const toolFieldSchema = z.object({
  id: z.string().min(1, "Field id is required"),
  label: z.string().min(1),
  type: z.enum(FIELD_TYPES),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  required: z.boolean().default(false),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  options: z.array(fieldOptionSchema).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  /** MIME accept string for file inputs, e.g. "image/*", ".csv" */
  accept: z.string().optional(),
  /** Regex source string — enforced through lib/security/sanitize.ts (Phase 2) */
  validationPattern: z.string().optional(),
});
export type ToolField = z.infer<typeof toolFieldSchema>;

/* ------------------------------------------------------------------ */
/* Content guardrail schemas — mechanically block thin content         */
/* ------------------------------------------------------------------ */
export const usageStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(5),
  description: z.string().min(20),
});
export type UsageStep = z.infer<typeof usageStepSchema>;

export const toolFaqSchema = z.object({
  question: z.string().min(10),
  answer: z.string().min(30),
});
export type ToolFaq = z.infer<typeof toolFaqSchema>;

export const toolExampleSchema = z.object({
  title: z.string().min(5),
  input: z.string().min(1),
  output: z.string().min(1),
  explanation: z.string().min(20),
});
export type ToolExample = z.infer<typeof toolExampleSchema>;

export const toolSeoSchema = z.object({
  metaTitle: z.string().min(15).max(70),
  metaDescription: z.string().min(50).max(160),
  keywords: z.array(z.string().min(2)).min(3),
});
export type ToolSeo = z.infer<typeof toolSeoSchema>;

/**
 * References a rule the Phase-2 factory engine dispatches on. The engine
 * never branches on tool.slug — it branches on transform.ruleId, keeping
 * the codebase O(1) in bundle size regardless of tool count.
 */
export const toolTransformSchema = z.object({
  ruleId: z.string().min(1),
  config: z.record(z.unknown()).optional(),
});
export type ToolTransform = z.infer<typeof toolTransformSchema>;

/* ------------------------------------------------------------------ */
/* The master Tool schema                                              */
/* ------------------------------------------------------------------ */
export const toolDefinitionSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  category: categorySlugSchema,
  name: z.string().min(3),
  shortDescription: z.string().min(40).max(160),
  longDescription: z.string().min(150),
  icon: z.string().min(1).default("wrench"),
  seo: toolSeoSchema,
  fields: z.array(toolFieldSchema).min(1),
  transform: toolTransformSchema,
  usageGuide: z.array(usageStepSchema).min(3),
  faqs: z.array(toolFaqSchema).min(3),
  examples: z.array(toolExampleSchema).min(1),
  relatedToolSlugs: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type ToolDefinition = z.infer<typeof toolDefinitionSchema>;

export const categoryDefinitionSchema = z.object({
  slug: categorySlugSchema,
  name: z.string().min(3),
  description: z.string().min(50),
  icon: z.string().min(1),
});
export type CategoryDefinition = z.infer<typeof categoryDefinitionSchema>;
