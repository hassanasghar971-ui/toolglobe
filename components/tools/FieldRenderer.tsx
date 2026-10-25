"use client";

import type { ToolField } from "@/lib/tool-registry/types";

interface FieldRendererProps {
  fields: ToolField[];
  values: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (fieldId: string, value: unknown) => void;
  disabled?: boolean;
}

const BASE_INPUT_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:bg-slate-100";

function FieldInput({
  field,
  fieldId,
  value,
  onChange,
  disabled,
}: {
  field: ToolField;
  fieldId: string;
  value: unknown;
  onChange: (fieldId: string, value: unknown) => void;
  disabled?: boolean;
}) {
  switch (field.type) {
    case "textarea":
    case "json":
      return (
        <textarea
          id={fieldId}
          name={field.id}
          rows={8}
          placeholder={field.placeholder}
          value={typeof value === "string" ? value : ""}
          disabled={disabled}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`${BASE_INPUT_CLASS} font-mono`}
        />
      );

    case "number":
      return (
        <input
          id={fieldId}
          type="number"
          name={field.id}
          placeholder={field.placeholder}
          value={typeof value === "number" ? value : typeof value === "string" ? value : ""}
          min={field.min}
          max={field.max}
          step={field.step ?? "any"}
          disabled={disabled}
          onChange={(e) =>
            onChange(field.id, e.target.value === "" ? "" : Number(e.target.value))
          }
          className={BASE_INPUT_CLASS}
        />
      );

    case "select":
      return (
        <select
          id={fieldId}
          name={field.id}
          value={typeof value === "string" ? value : ""}
          disabled={disabled}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={BASE_INPUT_CLASS}
        >
          <option value="" disabled>
            Select an option
          </option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="flex flex-wrap gap-4">
          {(field.options ?? []).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                disabled={disabled}
                onChange={() => onChange(field.id, opt.value)}
                className="h-4 w-4 accent-brand-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            id={fieldId}
            type="checkbox"
            name={field.id}
            checked={Boolean(value)}
            disabled={disabled}
            onChange={(e) => onChange(field.id, e.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          Enable
        </label>
      );

    case "color":
      return (
        <input
          id={fieldId}
          type="color"
          name={field.id}
          value={typeof value === "string" && value ? value : "#2563eb"}
          disabled={disabled}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="h-10 w-20 cursor-pointer rounded border border-slate-300"
        />
      );

    case "date":
      return (
        <input
          id={fieldId}
          type="date"
          name={field.id}
          value={typeof value === "string" ? value : ""}
          disabled={disabled}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={BASE_INPUT_CLASS}
        />
      );

    case "file":
      return (
        <input
          id={fieldId}
          type="file"
          name={field.id}
          accept={field.accept}
          disabled={disabled}
          onChange={(e) 
