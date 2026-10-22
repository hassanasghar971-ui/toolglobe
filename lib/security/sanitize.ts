import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";
import type { ToolField } from "@/lib/tool-registry/types";

/** Hard ceiling to prevent client-side memory-exhaustion DoS on any field. */
export const MAX_FIELD_LENGTH = 200_000;

/** Heuristic defense-in-depth check for freeform (textarea/json) fields that
 * are intentionally NOT run through a tag-stripping HTML sanitizer, since
 * doing so would corrupt legitimate JSON/code payloads containing angle
 * brackets as literal data rather than markup. */
const DANGEROUS_MARKUP_PATTERN = /<script[\s>]|javascript:|on\w+\s*=\s*["']/i;

export function containsDangerousMarkup(value: string): boolean {
  return DANGEROUS_MARKUP_PATTERN.test(value);
}

/** Full HTML-tag strip — used only for short, label-like `text` fields that
 * are never expected to contain legitimate markup or JSON syntax. */
export function sanitizePlainText(value: string): string {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

export class FieldValidationError extends Error {
  constructor(public readonly fieldErrors: Record<string, string>) {
    super("Field validation failed");
    this.name = "FieldValidationError";
  }
}

/** Builds a Zod object schema from a tool's field definitions. Number
 * fields coerce empty-string input to `undefined` first so a cleared input
 * correctly reports "is required" rather than a confusing "invalid number". */
function zodSchemaForField(field: ToolField): z.ZodTypeAny {
  switch (field.type) {
    case "number": {
      const base = z.preprocess(
        (v) => (v === "" || v === null || v === undefined ? undefined : v),
        z.coerce.number({ invalid_type_error: `${field.label} must be a valid number.` })
      );

      if (!field.required) return base.optional();

      let required = base.refine((v) => v !== undefined, {
        message: `${field.label} is required.`,
      });

      if (field.min !== undefined) {
        const min = field.min;
        required = required.refine((v) => v === undefined || (v as number) >= min, {
          message: `${field.label} must be at least ${min}.`,
        });
      }
      if (field.max !== undefined) {
        const max = field.max;
        required = required.refine((v) => v === undefined || (v as number) <= max, {
          message: `${field.label} must be at most ${max}.`,
        });
      }
      return required;
    }

    case "checkbox":
      return z.coerce.boolean().optional().default(false);

    case "select":
    case "radio": {
      const allowed = (field.options ?? []).map((o) => o.value);
      let schema = z.string();
      if (allowed.length > 0) {
        schema = schema.refine((v) => v === "" || allowed.includes(v), {
          message: `Invalid value selected for ${field.label}.`,
        });
      }
      return field.required
        ? schema.min(1, `${field.label} is required.`)
        : schema.optional();
    }

    case "file": {
      const schema = z.custom<File | null>(
        (v) => v === null || v === undefined || v instanceof File,
        { message: `${field.label} must be a valid file.` }
      );
      return field.required
        ? schema.refine((v) => v !== null && v !== undefined, {
            message: `${field.label} is required.`,
          })
        : schema.optional();
    }

    case "textarea":
    case "json":
    case "text":
    case "color":
    case "date":
    default: {
      let schema = z.string().max(MAX_FIELD_LENGTH, {
        message: `${field.label} exceeds the maximum allowed length.`,
      });
      if (field.required) {
        schema = schema.min(1, `${field.label} is required.`);
      }
      if (field.validationPattern) {
        const pattern = new RegExp(field.validationPattern);
        schema = schema.refine((v) => v.length === 0 || pattern.test(v), {
          message: `${field.label} format is invalid.`,
        });
      }
      return field.required ? schema : schema.optional();
    }
  }
}

export function buildFieldValidationSchema(fields: ToolField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    shape[field.id] = zodSchemaForField(field);
  }
  return z.object(shape);
}

export type SanitizeResult =
  | { success: true; data: Record<string, unknown> }
  | { success: false; fieldErrors: Record<string, string> };

/**
 * The single entry point the factory engine (ToolRunner) must call before
 * any transform rule executes. Pipeline:
 *   1. Length-guard every string field (DoS prevention).
 *   2. Strip HTML entirely from `text` fields.
 *   3. Reject (not mangle) `textarea`/`json` fields containing script-like
 *      payloads, preserving legitimate JSON/code content untouched.
 *   4. Run the Zod schema for required/min/max/pattern validation.
 */
export function sanitizeAndValidateFormValues(
  fields: ToolField[],
  rawValues: Record<string, unknown>
): SanitizeResult {
  const sanitizedValues: Record<string, unknown> = {};
  const preValidationErrors: Record<string, string> = {};

  for (const field of fields) {
    const raw = rawValues[field.id];

    if (typeof raw === "string") {
      if (raw.length > MAX_FIELD_LENGTH) {
        preValidationErrors[field.id] =
          `${field.label} exceeds the maximum allowed length of ${MAX_FIELD_LENGTH.toLocaleString()} characters.`;
        continue;
      }

      if (field.type === "textarea" || field.type === "json") {
        if (containsDangerousMarkup(raw)) {
          preValidationErrors[field.id] =
            `${field.label} contains disallowed script content and cannot be processed.`;
          continue;
        }
        sanitizedValues[field.id] = raw;
      } else {
        sanitizedValues[field.id] = sanitizePlainText(raw);
      }
    } else {
      sanitizedValues[field.id] = raw;
    }
  }

  if (Object.keys(preValidationErrors).length > 0) {
    return { success: false, fieldErrors: preValidationErrors };
  }

  const schema = buildFieldValidationSchema(fields);
  const result = schema.safeParse(sanitizedValues);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  return { success: true, data: result.data };
}
