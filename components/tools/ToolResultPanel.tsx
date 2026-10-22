"use client";

import { useState } from "react";
import { Check, Copy, Download, AlertTriangle } from "lucide-react";
import type { TransformResult } from "@/lib/factory/transform-rules";

interface ToolResultPanelProps {
  result: TransformResult | null;
  isProcessing?: boolean;
  downloadFileName?: string;
}

export default function ToolResultPanel({
  result,
  isProcessing,
  downloadFileName,
}: ToolResultPanelProps) {
  const [copied, setCopied] = useState(false);

  if (isProcessing) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Processing...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
        Your result will appear here.
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>{result.message}</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result.output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFileName ?? "toolglobe-result.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Result</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Rendered as a React text child — never dangerouslySetInnerHTML —
          so output is automatically HTML-escaped regardless of content. */}
      <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
        {result.output}
      </pre>

      {result.meta && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-3">
          {Object.entries(result.meta).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <dt className="font-medium capitalize text-slate-500">{key}</dt>
              <dd className="text-slate-800">{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
