// lib/engines/validate-fields.ts
import type { ToolField } from "@/lib/types/tool";
import { sanitizeNumber, sanitizePlainText, clampNumber } from "./sanitize";

export interface FieldValidationResult {
  values: Record<string, unknown>;
  errors: Record<string, string>;
}

/**
 * Validates and sanitizes raw form values against a tool's field
 * schema before any engine touches the data. This is the single choke
 * point through which ALL user input passes — centralizing it here
 * (rather than per-engine) guarantees consistent XSS/overflow
 * protection across all 20,000+ tools regardless of engine type.
 */
export function validateAndSanitizeFields(
  fields: ToolField[],
  rawValues: Record<string, unknown>
): FieldValidationResult {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const raw = rawValues[field.id];
    const v = field.validation;

    switch (field.type) {
      case "number":
      case "slider": {
        const fallback = typeof field.defaultValue === "number" ? field.defaultValue : 0;
        let num = sanitizeNumber(raw, fallback);
        num = clampNumber(num, v?.min, v?.max);
        values[field.id] = num;
        if (v?.required && (raw === undefined || raw === "")) {
          errors[field.id] = `${field.label} is required.`;
        }
        break;
      }

      case "checkbox": {
        values[field.id] = Boolean(raw);
        break;
      }

      case "select":
      case "radio": {
        const str = typeof raw === "string" ? raw : String(field.defaultValue ?? "");
        const validOption = field.options?.some((o) => o.value === str);
        values[field.id] = validOption ? str : field.options?.[0]?.value ?? str;
        break;
      }

      case "multiselect": {
        values[field.id] = Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
        break;
      }

      case "file": {
        values[field.id] = raw ?? null;
        if (v?.required && !raw) {
          errors[field.id] = `${field.label} is required.`;
        }
        break;
      }

      case "color": {
        const str = sanitizePlainText(raw, 9) || String(field.defaultValue ?? "#000000");
        if (v?.pattern && !new RegExp(v.pattern).test(str)) {
          errors[field.id] = v.patternMessage ?? `${field.label} is invalid.`;
        }
        values[field.id] = str;
        break;
      }

      default: {
        // text, textarea, date, datetime, password, url, email
        const str = sanitizePlainText(raw, v?.maxLength ?? 50_000);
        if (v?.required && str.trim().length === 0) {
          errors[field.id] = `${field.label} is required.`;
        }
        if (v?.minLength && str.length > 0 && str.length < v.minLength) {
          errors[field.id] = `${field.label} must be at least ${v.minLength} characters.`;
        }
        if (v?.pattern && str.length > 0 && !new RegExp(v.pattern).test(str)) {
          errors[field.id] = v.patternMessage ?? `${field.label} is invalid.`;
        }
        values[field.id] = str;
      }
    }
  }

  return { values, errors };
}
