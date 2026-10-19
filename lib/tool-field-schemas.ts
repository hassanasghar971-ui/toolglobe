// lib/tool-field-schemas.ts
import type {
  ToolField,
  ToolFieldOption,
  ToolFieldValidation,
} from "@/lib/types/tool";

/**
 * Factory functions for building ToolField objects consistently.
 * These are consumed by lib/tool-registry.ts when defining the
 * `fields` array of every ToolDefinition, and by the Phase 3
 * rendering engine (components/tool-engine/FieldRenderer.tsx) which
 * switches on `field.type` to render the correct real input control.
 */

let autoOrderCounter = 0;

/** Resets the internal order counter — call once per tool definition block. */
export function resetFieldOrder(): void {
  autoOrderCounter = 0;
}

function nextOrder(explicit?: number): number {
  if (typeof explicit === "number") return explicit;
  autoOrderCounter += 10;
  return autoOrderCounter;
}

interface BaseFieldArgs {
  id: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  order?: number;
  validation?: ToolFieldValidation;
}

export function textField(args: BaseFieldArgs & { defaultValue?: string }): ToolField {
  return {
    id: args.id,
    type: "text",
    label: args.label,
    placeholder: args.placeholder,
    helpText: args.helpText,
    defaultValue: args.defaultValue ?? "",
    validation: {
      maxLength: 500,
      ...args.validation,
    },
    order: nextOrder(args.order),
  };
}

export function textareaField(
  args: BaseFieldArgs & { defaultValue?: string; rows?: number }
): ToolField {
  return {
    id: args.id,
    type: "textarea",
    label: args.label,
    placeholder: args.placeholder,
    helpText: args.helpText,
    defaultValue: args.defaultValue ?? "",
    validation: {
      maxLength: 50_000, // generous but bounded — DoS-safe against huge paste payloads
      ...args.validation,
    },
    order: nextOrder(args.order),
  };
}

export function numberField(
  args: BaseFieldArgs & {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
  }
): ToolField {
  return {
    id: args.id,
    type: "number",
    label: args.label,
    placeholder: args.placeholder,
    helpText: args.helpText,
    defaultValue: args.defaultValue ?? 0,
    validation: {
      min: args.min,
      max: args.max,
      step: args.step ?? 1,
      ...args.validation,
    },
    order: nextOrder(args.order),
  };
}

export function selectField(
  args: BaseFieldArgs & {
    options: ToolFieldOption[];
    defaultValue?: string;
  }
): ToolField {
  if (args.options.length === 0) {
    throw new Error(
      `selectField "${args.id}" must have at least one option — empty selects are a content-quality violation.`
    );
  }
  return {
    id: args.id,
    type: "select",
    label: args.label,
    helpText: args.helpText,
    defaultValue: args.defaultValue ?? args.options[0]!.value,
    options: args.options,
    validation: { required: true, ...args.validation },
    order: nextOrder(args.order),
  };
}

export function multiselectField(
  args: BaseFieldArgs & { options: ToolFieldOption[] }
): ToolField {
  if (args.options.length === 0) {
    throw new Error(
      `multiselectField "${args.id}" must have at least one option.`
    );
  }
  return {
    id: args.id,
    type: "multiselect",
    label: args.label,
    helpText: args.helpText,
    options: args.options,
    validation: args.validation,
    order: nextOrder(args.order),
  };
}

export function checkboxField(
  args: BaseFieldArgs & { defaultValue?: boolean }
): ToolField {
  return {
    id: args.id,
    type: "checkbox",
    label: args.label,
    helpText: args.helpText,
    defaultValue: args.defaultValue ?? false,
    order: nextOrder(args.order),
  };
}

export function radioField(
  args: BaseFieldArgs & { options: ToolFieldOption[]; defaultValue?: string }
): ToolField {
  if (args.options.length < 2) {
    throw new Error(
      `radioField "${args.id}" must have at least two options.`
    );
  }
  return {
    id: args.id,
    type: "radio",
    label: args.label,
    helpText: args.helpText,
    defaultValue: args.defaultValue ?? args.options[0]!.value,
    options: args.options,
    validation: { required: true, ...args.validation },
    order: nextOrder(args.order),
  };
}

export function colorField(
  args: BaseFieldArgs & { defaultValue?: string }
): ToolField {
  return {
    id: args.id,
    type: "color",
    label: args.label,
    helpText: args.helpText,
    defaultValue: args.defaultValue ?? "#3366ff",
    validation: {
      pattern: "^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$",
      patternMessage: "Must be a valid hex color (e.g. #3366FF).",
      ...args.validation,
    },
    order: nextOrder(args.order),
  };
}

export function dateField(
  args: BaseFieldArgs & { defaultValue?: string; isDateTime?: boolean }
): ToolField {
  return {
    id: args.id,
    type: args.isDateTime ? "datetime" : "date",
    label: args.label,
    helpText: args.helpText,
    defaultValue: args.defaultValue,
    validation: { required: true, ...args.validation },
    order: nextOrder(args.order),
  };
}

export function fileField(
  args: BaseFieldArgs & {
    acceptedFileTypes: string[];
    maxFileSizeMb?: number;
  }
): ToolField {
  return {
    id: args.id,
    type: "file",
    label: args.label,
    helpText: args.helpText,
    validation: {
      required: true,
      acceptedFileTypes: args.acceptedFileTypes,
      maxFileSizeMb: args.maxFileSizeMb ?? 10,
      ...args.validation,
    },
    order: nextOrder(args.order),
  };
}

export function sliderField(
  args: BaseFieldArgs & {
    defaultValue?: number;
    min: number;
    max: number;
    step?: number;
  }
): ToolField {
  return {
    id: args.id,
    type: "slider",
    label: args.label,
    helpText: args.helpText,
    defaultValue: args.defaultValue ?? args.min,
    validation: {
      min: args.min,
      max: args.max,
      step: args.step ?? 1,
      ...args.validation,
    },
    order: nextOrder(args.order),
  };
}

export function passwordField(args: BaseFieldArgs): ToolField {
  return {
    id: args.id,
    type: "password",
    label: args.label,
    placeholder: args.placeholder,
    helpText: args.helpText,
    validation: { required: true, maxLength: 256, ...args.validation },
    order: nextOrder(args.order),
  };
}

export function urlField(args: BaseFieldArgs): ToolField {
  return {
    id: args.id,
    type: "url",
    label: args.label,
    placeholder: args.placeholder ?? "https://example.com",
    helpText: args.helpText,
    validation: {
      required: true,
      pattern: "^https?://.+",
      patternMessage: "Must start with http:// or https://",
      maxLength: 2048,
      ...args.validation,
    },
    order: nextOrder(args.order),
  };
}

export function emailField(args: BaseFieldArgs): ToolField {
  return {
    id: args.id,
    type: "email",
    label: args.label,
    placeholder: args.placeholder ?? "name@example.com",
    helpText: args.helpText,
    validation: {
      required: true,
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      patternMessage: "Must be a valid email address.",
      ...args.validation,
    },
    order: nextOrder(args.order),
  };
}
