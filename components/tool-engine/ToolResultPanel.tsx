// components/tool-engine/ToolResultPanel.tsx
"use client";

import { useState } from "react";
import type { ToolExecutionResult, TableResult, ColorResult } from "@/lib/engines/types";
import type { ToolOutputConfig } from "@/lib/types/tool";

interface ToolResultPanelProps {
  result: ToolExecutionResult | null;
  outputConfig: ToolOutputConfig;
}

function isTableResult(v: unknown): v is TableResult {
  return typeof v === "object" && v !== null && "rows" in v;
}
function isColorResult(v: unknown): v is ColorResult {
  return typeof v === "object" && v !== null && "hex" in v && "rgb" in v;
}

export default function ToolResultPanel({ result, outputConfig }: ToolResultPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="rounded-card border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center text-sm text-neutral-500">
        Fill in the fields above and your result will appear here instantly.
      </div>
    );
  }

  if (!result.success) {
    return (
      <div
        role="alert"
        className="rounded-card border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400"
      >
        {result.error}
      </div>
    );
  }

  const getCopyText = (): string => {
    if (typeof result.value === "string" || typeof result.value === "number") {
      return String(result.value);
    }
    if (isTableResult(result.value)) {
      return result.value.rows.map((r) => `${r.label}: ${r.value}`).join("\n");
    }
    if (isColorResult(result.value)) {
      return `${result.value.hex} / ${result.value.rgb}`;
    }
    return "";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCopyText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable in this context — non-critical UX path.
    }
  };

  const handleDownload = () => {
    if (result.fileBlob) {
      const url = URL.createObjectURL(result.fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.fileName ?? "toolglobe-download";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const text = getCopyText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toolglobe-result.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-card border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Result</h3>
        <div className="flex gap-2">
          {outputConfig.copyable && (
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
          {outputConfig.downloadable && (
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Download
            </button>
          )}
        </div>
      </div>

      {result.format === "code" && (
        <pre className="overflow-x-auto rounded-md bg-neutral-900 p-4 text-xs text-green-400 font-mono">
          <code>{String(result.value)}</code>
        </pre>
      )}

      {(result.format === "text" || result.format === "number") && (
        <p className="break-words text-lg font-semibold text-brand-700 dark:text-brand-300">
          {String(result.value)}
        </p>
      )}

      {result.format === "table" && isTableResult(result.value) && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {result.value.rows.map((row) => (
                <tr key={row.label} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0">
                  <td className="py-2 pr-4 font-medium text-neutral-600 dark:text-neutral-400">{row.label}</td>
                  <td className="py-2 font-semibold text-brand-700 dark:text-brand-300">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.value.summary && <p className="mt-2 text-xs text-neutral-500">{result.value.summary}</p>}
        </div>
      )}

      {result.format === "color" && isColorResult(result.value) && (
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-lg border border-neutral-300 dark:border-neutral-700"
            style={{ backgroundColor: result.value.hex }}
            aria-label={`Color preview: ${result.value.hex}`}
          />
          <div className="text-sm">
            <p className="font-semibold">{result.value.hex}</p>
            <p className="text-neutral-500">{result.value.rgb}</p>
          </div>
        </div>
      )}

      {result.format === "image" && typeof result.value === "string" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={result.value}
          alt="Processed result preview"
          className="max-h-80 rounded-lg border border-neutral-200 dark:border-neutral-800"
        />
      )}
    </div>
  );
}
