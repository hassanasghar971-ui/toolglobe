"use client";

import { useState, useTransition, useId } from "react";
import type { ToolDefinition } from "@/types/tools";
import { executeTool } from "@/lib/engines/engine-dispatcher";
import { validateAndSanitizeFields } from "@/lib/engines/validate-fields";
import FieldRenderer from "./FieldRenderer";
import ToolResultPanel from "./ToolResultPanel";
import FaqAccordion from "./FaqAccordion";
import RelatedToolsList from "./RelatedToolsList";
import ToolBreadcrumbs from "./ToolBreadcrumbs";
import ToolJsonLd from "./ToolJsonLd";

interface ToolPageClientProps {
  tool: ToolDefinition;
}

export function ToolPageClient({ tool }: ToolPageClientProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.fields.forEach((field) => {
      initial[field.name] = field.defaultValue ?? "";
    });
    return initial;
  });

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formId = useId();

  const handleFieldChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(() => {
      const validation = validateAndSanitizeFields(tool.fields, formValues);
      if (!validation.success) {
        setError(validation.error);
        return;
      }

      try {
        const output = executeTool(tool.id, validation.data);
        setResult(output);
      } catch (err: any) {
        setError(err.message || "An error occurred while executing the tool.");
      }
    });
  };

  const handleReset = () => {
    const initial: Record<string, any> = {};
    tool.fields.forEach((field) => {
      initial[field.name] = field.defaultValue ?? "";
    });
    setFormValues(initial);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <ToolJsonLd tool={tool} />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <ToolBreadcrumbs tool={tool} />

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {tool.name}
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            {tool.description}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Tool Form Input Section */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              id={formId}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-6">
                {tool.fields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    value={formValues[field.name]}
                    onChange={(val) => handleFieldChange(field.name, val)}
                  />
                ))}
              </div>

              {error && (
                <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200 dark:bg-red-950/50 dark:border-red-900 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="mt-8 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Processing..." : tool.actionLabel || "Calculate / Run"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Result Output Panel */}
          <div className="lg:col-span-5">
            <ToolResultPanel result={result} tool={tool} />
          </div>
        </div>

        {/* FAQs Section */}
        {tool.faqs && tool.faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="mt-6">
              <FaqAccordion faqs={tool.faqs} />
            </div>
          </div>
        )}

        {/* Related Tools */}
        <div className="mt-16">
          <RelatedToolsList category={tool.category} currentToolId={tool.id} />
        </div>
      </main>
    </>
  );
}

export default ToolPageClient;
