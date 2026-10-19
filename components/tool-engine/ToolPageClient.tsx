// components/tool-engine/ToolPageClient.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ToolDefinition } from "@/lib/types/tool";
import type { ToolExecutionResult } from "@/lib/engines/types";
import { executeTool } from "@/lib/engines/engine-dispatcher";
import { resizeImage, compressImage, convertImageFormat } from "@/lib/engines/file-engine";
import FieldRenderer from "./FieldRenderer";
import ToolResultPanel from "./ToolResultPanel";

interface ToolPageClientProps {
  tool: ToolDefinition;
}

function getInitialValues(tool: ToolDefinition): Record<string, unknown> {
  const initial: Record<string, unknown> = {};
  for (const field of tool.fields) {
    if (field.defaultValue !== undefined) {
      initial[field.id] = field.defaultValue;
    }
  }
  return initial;
}

export default function ToolPageClient({ tool }: ToolPageClientProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() => getInitialValues(tool));
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const fieldErrors = useMemo(() => {
    if (result && !result.success && "fieldErrors" in result) {
      return result.fieldErrors ?? {};
    }
    return {};
  }, [result]);

  const handleFieldChange = useCallback((id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  // Auto-execute for all synchronous engines — debounced to stay
  // CWV-friendly on fast typing in textareas.
  useEffect(() => {
    if (tool.engine === "file-processor") return;

    const hasRequiredEmpty = tool.fields.some((f) => {
      if (!f.validation?.required) return false;
      const v = values[f.id];
      return v === undefined || v === "" || v === null;
    });
    if (hasRequiredEmpty) {
      setResult(null);
      return;
    }

    const timer = setTimeout(() => {
      setResult(executeTool(tool, values));
    }, 250);

    return () => clearTimeout(timer);
  }, [values, tool]);

  const handleProcessFile = useCallback(async () => {
    const file = values.inputFile as File | undefined;
    if (!file) {
      setResult({ success: false, error: "Please choose a file first." });
      return;
    }

    setIsProcessingFile(true);
    try {
      const operation = tool.engineConfig.operation as string;
      let processed;

      if (operation === "resize") {
        const maxWidth = Number(values.maxWidth) || 1920;
        const maxHeight = Number(values.maxHeight) || 1080;
        processed = await resizeImage(file, maxWidth, maxHeight);
      } else if (operation === "compress") {
        const quality = Number(values.quality) || 0.7;
        processed = await compressImage(file, quality);
      } else if (operation === "convert") {
        const targetFormat = (values.targetFormat as string) || "image/png";
        processed = await convertImageFormat(file, targetFormat as "image/png" | "image/jpeg" | "image/webp");
      } else {
        throw new Error("Unsupported file operation configured for this tool.");
      }

      setResult({
        success: true,
        format: "image",
        value: processed.dataUrl,
        fileBlob: processed.blob,
        fileName: processed.fileName,
      });
    } catch (e) {
      setResult({ success: false, error: e instanceof Error ? e.message : "File processing failed." });
    } finally {
      setIsProcessingFile(false);
    }
  }, [tool, values]);

  return (
    <div className="rounded-card border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-card">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {[...tool.fields]
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <div key={field.id} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
              <FieldRenderer
                field={field}
                value={values[field.id]}
                error={fieldErrors[field.id]}
                onChange={handleFieldChange}
              />
            </div>
          ))}
      </div>

      {tool.engine === "file-processor" && (
        <button
          type="button"
          onClick={handleProcessFile}
          disabled={isProcessingFile}
          className="mt-5 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
        >
          {isProcessingFile ? "Processing..." : "Process File"}
        </button>
      )}

      <div className="mt-6">
        <ToolResultPanel result={result} outputConfig={tool.output} />
      </div>
    </div>
  );
}
