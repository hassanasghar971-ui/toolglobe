// lib/types/tool.ts

/**
 * ToolGlobe — Core Type System
 * Every tool definition in the registry (lib/tool-registry.ts) must
 * satisfy ToolDefinition. Every input field must satisfy ToolField.
 * This file has ZERO runtime logic — types only.
 */

// ---------------------------------------------------------------------
// FIELD SYSTEM — the building blocks of every tool's real input UI
// ---------------------------------------------------------------------

export type ToolFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "color"
  | "date"
  | "datetime"
  | "file"
  | "slider"
  | "password"
  | "url"
  | "email";

export interface ToolFieldOption {
  label: string;
  value: string;
}

export interface ToolFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // regex source, applied client-side AND server-side
  patternMessage?: string;
  acceptedFileTypes?: string[]; // e.g. ['.png', '.jpg', 'image/*']
  maxFileSizeMb?: number;
}

export interface ToolField {
  id: string; // stable key used in form state + execution engine
  type: ToolFieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | number | boolean;
  options?: ToolFieldOption[]; // required for select/multiselect/radio
  validation?: ToolFieldValidation;
  order: number; // explicit render order (avoids array-reorder bugs)
}

// ---------------------------------------------------------------------
// EXECUTION ENGINE BINDING — which Phase 3 engine powers this tool
// ---------------------------------------------------------------------

export type ToolEngineType =
  | "text-transform" // case conversion, counters, encoders/decoders
  | "unit-converter" // numeric conversion between units
  | "calculator" // formula-driven numeric calculators
  | "generator" // random/password/lorem/UUID generators
  | "json-tool" // JSON format/validate/minify
  | "color-tool" // color conversion/palette tools
  | "date-time-tool" // date diff, age calculator, timestamp tools
  | "file-processor" // client-side file conversion (image/PDF/etc.)
  | "encoder-decoder"; // base64, URL encode, hashing

export interface ToolOutputConfig {
  /** Governs the result panel rendering in Phase 3's ToolResultPanel */
  format: "text" | "number" | "table" | "image" | "file" | "code" | "color";
  copyable: boolean;
  downloadable: boolean;
}

// ---------------------------------------------------------------------
// SEO / INDEXING CONTROL
// ---------------------------------------------------------------------

export type IndexTier = "high" | "medium" | "low";

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolSEO {
  metaTitle: string; // ≤ 60 chars recommended, enforced by validator
  metaDescription: string; // ≤ 160 chars recommended, enforced by validator
  indexTier: IndexTier;
  /**
   * low-tier tools (e.g. extremely niche unit pairs) render `noindex,follow`
   * in Phase 4's metadata generator — they still work and still link
   * internally (preserving crawl equity) but don't dilute index quality.
   */
  faqs: ToolFAQ[];
}

// ---------------------------------------------------------------------
// MASTER TOOL DEFINITION
// ---------------------------------------------------------------------

export interface ToolDefinition {
  id: string; // globally unique, stable, never reused even if tool is retired
  slug: string; // URL segment, unique within its category
  categorySlug: string; // FK into lib/categories.ts
  subcategorySlug?: string;

  name: string;
  shortDescription: string; // 1-sentence, used in cards/search results
  longDescription: string; // real, substantive paragraph(s) — required, non-empty

  engine: ToolEngineType;
  engineConfig: Record<string, unknown>; // engine-specific params (Phase 3 consumes)

  fields: ToolField[]; // MUST be non-empty — enforced by validator
  output: ToolOutputConfig;

  seo: ToolSEO;

  relatedToolSlugs: string[]; // internal linking — aids crawl + UX
  tags: string[];

  createdAt: string; // ISO date
  updatedAt: string; // ISO date — freshness signal for GSC
}

// ---------------------------------------------------------------------
// VALIDATION RESULT TYPES (used by tool-registry.ts build-time checks)
// ---------------------------------------------------------------------

export interface ToolValidationError {
  toolId: string;
  slug: string;
  reason: string;
}

export interface ToolRegistryValidationResult {
  valid: boolean;
  totalTools: number;
  errors: ToolValidationError[];
}
