"use client";

import { useMemo, useState, useTransition } from "react";
import FieldRenderer from "@/components/tools/FieldRenderer";
import ToolResultPanel from "@/components/tools/ToolResultPanel";
import { sanitizeAndValidateFormValues } from "@/lib/security/sanitize";
import { runTransform } from "@/lib/factory/transform-rules";
import type { TransformResult } from "@/lib/factory/transform-rules";
import type { ToolDefinition } from "@/lib/tool-registry/types";

interface ToolRunnerProps {
  tool: ToolDefinition;
}

function buildDefaultValues(tool: ToolDefinition): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const field of tool.fields) {
    if (field.defaultValue !== undefined) {
      defaults[field.id] = field.defaultValue;
    }
  }
  return defaults;
}

export default function ToolRunner({ tool }: ToolRunnerProps) {
  const initialValues = useMemo(() => buildDefaultValues(tool), [tool]);

  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TransformResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (fieldId: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = sanitizeAndValidateFormValues(tool.fields, values);

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setResult(null);
      return;
    }

    setFieldErrors({});

    startTransition(() => {
      const transformResult = runTransform(
        tool.transform.ruleId,
        validation.data,
        tool.transform.config
      );
      setResult(transformResult);
    });
  };

  const handleReset = () => {
    setValues(initialValues);
    setFieldErrors({});
    setResult(null);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldRenderer
        fields={tool.fields}
        values={values}
        errors={fieldErrors}
        onChange={handleChange}
        disabled={isPending}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Processing..." : `Run ${tool.name}`}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reset
        </button>
      </div>

      <ToolResultPanel result={result} isProcessing={isPending} />
    </form>
  );
}
