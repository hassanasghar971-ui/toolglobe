"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ToolDefinition } from "@/lib/types/tool";
import type { ToolExecutionResult } from "@/lib/engines/types";
import { executeTool } from "@/lib/engines/engine-dispatcher";
import { validateAndSanitizeFields } from "@/lib/engines/validate-fields";
import { FieldRenderer } from "./FieldRenderer";
import { ToolResultPanel } from "./ToolResultPanel";
import { FaqAccordion } from "./FaqAccordion";
import { RelatedToolsList } from "./RelatedToolsList";
import { ToolBreadcrumbs } from "./ToolBreadcrumbs";
import { ToolJsonLd } from "./ToolJsonLd";
import { AdsterraNativeBanner } from "@/components/ads/adsterra-native-banner";

const AUTO_EXECUTE_DEBOUNCE_MS = 400;

interface ToolPageClientProps {
  tool: ToolDefinition;
  relatedTools: ToolDefinition[];
}

type FieldValue = string | number | boolean | File | null | undefined;
type FieldValues = Record<string, FieldValue>;

function buildInitialValues(tool: ToolDefinition): FieldValues {
  const initial: FieldValues = {};
  for (const field of tool.fields) {
    if (field.defaultValue !== undefined) {
      initial[field.name] = field.defaultValue as FieldValue;
    } else if (field.type === "checkbox") {
      initial[field.name] = false;
    } else {
      initial[field.name] = "";
    }
  }
  return initial;
}

export function ToolPageClient({ tool, relatedTools }: ToolPageClientProps) {
  const [values, setValues] = useState<FieldValues>(() =>
    buildInitialValues(tool)
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset all local state whenever the tool itself changes (client-side
  // navigation between two tool pages reuses this component instance).
  useEffect(() => {
    setValues(buildInitialValues(tool));
    setFieldErrors({});
    setResult(null);
  }, [tool]);

  const hasFileField = useMemo(
    () => tool.fields.some((field) => field.type === "file"),
    [tool.fields]
  );

  const runExecution = useCallback(
    (currentValues: FieldValues) => {
      const { values: sanitized, errors } = validateAndSanitizeFields(
        tool.fields,
        currentValues
      );
      setFieldErrors(errors);

      if (Object.keys(errors).length > 0) {
        setResult(null);
        return;
      }

      try {
        const executionResult = executeTool(tool, sanitized);
        setResult(executionResult);
      } catch (error) {
        setResult({
          kind: "error",
          message:
            error instanceof Error
              ? error.message
              : "Something went wrong while running this tool. Please check your inputs and try again.",
        });
      }
    },
    [tool]
  );

  // Debounced auto-execution for text/number/select-style fields. File
  // fields are excluded from this effect and instead trigger execution
  // explicitly (see handleFieldChange) since reading file contents is async
  // and shouldn't re-run on every keystroke of unrelated fields.
  useEffect(() => {
    if (hasFileField) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runExecution(values);
    }, AUTO_EXECUTE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [values, hasFileField, runExecution]);

  const handleFieldChange = useCallback(
    (fieldName: string, value: FieldValue) => {
      setValues((prev) => {
        const next = { ...prev, [fieldName]: value };

        if (hasFileField && value instanceof File) {
          setIsProcessingFile(true);
          // Defer to the next tick so state settles before the (potentially
          // heavy, canvas-based) file-processing engine logic runs.
          setTimeout(() => {
            runExecution(next);
            setIsProcessingFile(false);
          }, 0);
        }

        return next;
      });
    },
    [hasFileField, runExecution]
  );

  const handleManualExecute = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    runExecution(values);
  }, [values, runExecution]);

  const handleReset = useCallback(() => {
    setValues(buildInitialValues(tool));
    setResult(null);
    setFieldErrors({});
  }, [tool]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolJsonLd tool={tool} />
      <ToolBreadcrumbs tool={tool} />

      <header className="mt-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {tool.name}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {tool.description}
        </p>
      </header>

      <section
        aria-label={`${tool.name} inputs`}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {tool.fields.map((field) => (
            <div
              key={field.id}
              className={
                field.type === "textarea" ? "sm:col-span-2" : undefined
              }
            >
              <FieldRenderer
                field={field}
                value={values[field.name]}
                error={fieldErrors[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {hasFileField && (
            <button
              type="button"
              onClick={handleManualExecute}
              disabled={isProcessingFile}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessingFile ? "Processing…" : "Run Tool"}
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Reset
          </button>
        </div>
      </section>

      {result && (
        <section aria-label={`${tool.name} result`} className="mt-6">
          <ToolResultPanel result={result} tool={tool} />
        </section>
      )}

      <AdsterraNativeBanner />

      {tool.seo.faqs.length > 0 && (
        <section aria-label="Frequently asked questions" className="mt-10">
          <FaqAccordion faqs={tool.seo.faqs} />
        </section>
      )}

      {relatedTools.length > 0 && (
        <section aria-label="Related tools" className="mt-10">
          <RelatedToolsList tools={relatedTools} />
        </section>
      )}

      <section className="mt-10 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
          About {tool.name}
        </h2>
        <p>{tool.longDescription}</p>
      </section>
    </main>
  );
}
