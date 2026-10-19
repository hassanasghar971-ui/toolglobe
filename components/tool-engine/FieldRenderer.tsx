// components/tool-engine/FieldRenderer.tsx
"use client";

import type { ToolField } from "@/lib/types/tool";

interface FieldRendererProps {
  field: ToolField;
  value: unknown;
  error?: string;
  onChange: (id: string, value: unknown) => void;
}

export default function FieldRenderer({ field, value, error, onChange }: FieldRendererProps) {
  const baseInputClass =
    "w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors";
  const errorClass = error ? "border-red-500 focus:ring-red-500" : "";

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.id}
            name={field.id}
            rows={6}
            placeholder={field.placeholder}
            value={typeof value === "string" ? value : ""}
            maxLength={field.validation?.maxLength}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={`${baseInputClass} ${errorClass} resize-y font-mono text-sm`}
          />
        );

      case "number":
        return (
          <input
            id={field.id}
            name={field.id}
            type="number"
            placeholder={field.placeholder}
            value={typeof value === "number" && Number.isFinite(value) ? value : ""}
            min={field.validation?.min}
            max={field.validation?.max}
            step={field.validation?.step ?? 1}
            onChange={(e) => onChange(field.id, e.target.valueAsNumber)}
            className={`${baseInputClass} ${errorClass}`}
          />
        );

      case "slider":
        return (
          <div className="flex items-center gap-3">
            <input
              id={field.id}
              name={field.id}
              type="range"
              min={field.validation?.min}
              max={field.validation?.max}
              step={field.validation?.step ?? 1}
              value={typeof value === "number" ? value : field.validation?.min ?? 0}
              onChange={(e) => onChange(field.id, Number(e.target.value))}
              className="flex-1 accent-brand-500"
            />
            <span className="w-12 text-right text-sm font-medium tabular-nums">{String(value ?? "")}</span>
          </div>
        );

      case "select":
        return (
          <select
            id={field.id}
            name={field.id}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={`${baseInputClass} ${errorClass}`}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="flex flex-wrap gap-4">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(field.id, opt.value)}
                  className="accent-brand-500"
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "multiselect":
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const selected = Array.isArray(value) && value.includes(opt.value);
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    const current = Array.isArray(value) ? [...value] : [];
                    const next = selected
                      ? current.filter((v) => v !== opt.value)
                      : [...current, opt.value];
                    onChange(field.id, next);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    selected
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-transparent border-neutral-300 dark:border-neutral-700"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              id={field.id}
              name={field.id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(field.id, e.target.checked)}
              className="h-4 w-4 accent-brand-500"
            />
            {field.label}
          </label>
        );

      case "color":
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={typeof value === "string" && /^#/.test(value) ? value : "#3366ff"}
              onChange={(e) => onChange(field.id, e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-neutral-300 dark:border-neutral-700"
            />
            <input
              type="text"
              value={typeof value === "string" ? value : ""}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.id, e.target.value)}
              className={`${baseInputClass} ${errorClass}`}
            />
          </div>
        );

      case "date":
      case "datetime":
        return (
          <input
            id={field.id}
            name={field.id}
            type={field.type === "datetime" ? "datetime-local" : "date"}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={`${baseInputClass} ${errorClass}`}
          />
        );

      case "file":
        return (
          <input
            id={field.id}
            name={field.id}
            type="file"
            accept={field.validation?.acceptedFileTypes?.join(",")}
            onChange={(e) => onChange(field.id, e.target.files?.[0] ?? null)}
            className={`${baseInputClass} ${errorClass} file:mr-3 file:rounded-md file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-white file:text-sm cursor-pointer`}
          />
        );

      case "password":
        return (
          <input
            id={field.id}
            name={field.id}
            type="password"
            placeholder={field.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={`${baseInputClass} ${errorClass}`}
          />
        );

      case "url":
      case "email":
      case "text":
      default:
        return (
          <input
            id={field.id}
            name={field.id}
            type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
            placeholder={field.placeholder}
            value={typeof value === "string" ? value : ""}
            maxLength={field.validation?.maxLength}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={`${baseInputClass} ${errorClass}`}
          />
        );
    }
  };

  if (field.type === "checkbox") {
    return (
      <div className="flex flex-col gap-1">
        {renderInput()}
        {field.helpText && <p className="text-xs text-neutral-500">{field.helpText}</p>}
        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.id} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {field.label}
      </label>
      {renderInput()}
      {field.helpText && <p className="text-xs text-neutral-500">{field.helpText}</p>}
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
