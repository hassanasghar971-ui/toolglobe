"use client";

import { useState } from "react";
import { runEngine, type EngineCategory } from "@/lib/engines";
import { MATH_FIELDS, SEO_FIELDS } from "@/lib/tool-field-schemas";
import type { ToolMeta } from "@/lib/tool-specs-builder";

interface Props {
  tool: ToolMeta;
}

function getEngineCategory(tool: ToolMeta): EngineCategory {
  switch (tool.kind) {
    case "converter":
    case "quickvalue":
      return "convert";
    case "text":
      return "text";
    case "math":
      return "math";
    case "seo":
      return "seo";
    default:
      return "text";
  }
}

function getOpId(tool: ToolMeta): string {
  return tool.slug.split("/")[1] ?? "";
}

export default function ToolRenderer({ tool }: Props) {
  const category = getEngineCategory(tool);
  const opId = getOpId(tool);

  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [convValue, setConvValue] = useState<string>(
    tool.kind === "quickvalue" && tool.value !== undefined ? String(tool.value) : "1"
  );

  const [textInput, setTextInput] = useState("");

  const fieldDefs =
    category === "math" ? MATH_FIELDS[opId] : category === "seo" ? SEO_FIELDS[opId] : undefined;

  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fieldDefs?.forEach((f) => {
      initial[f.name] = f.defaultValue ?? "";
    });
    return initial;
  });

  function updateField(name: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  }

  function execute() {
    setError(null);
    setLoading(true);
    try {
      let payload: Record<string, unknown> = {};

      if (category === "convert") {
        if (!tool.family || !tool.fromUnit || !tool.toUnit) {
          throw new Error("Converter tool is missing family/unit metadata");
        }
        payload = {
          family: tool.family,
          from: tool.fromUnit,
          to: tool.toUnit,
          value: Number(convValue),
        };
      } else if (category === "text") {
        payload = { input: textInput };
      } else {
        payload = fieldValues;
      }

      const res = runEngine(category, opId, payload);
      if (res.error) {
        setError(res.error);
        setResult(null);
      } else {
        setResult(res.result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Execution failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{tool.title}</h1>
      <p className="text-gray-600 mb-6">{tool.description}</p>

      <div className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
        {category === "convert" && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">
              Value ({tool.fromSymbol ?? tool.fromUnit})
            </label>
            <input
              type="number"
              value={convValue}
              onChange={(e) => setConvValue(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70"
            />
            <p className="text-sm text-gray-500">
              Converting {tool.fromName ?? tool.fromUnit} → {tool.toName ?? tool.toUnit}
            </p>
          </div>
        )}

        {category === "text" && (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={6}
            placeholder="Enter your text..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70"
          />
        )}

        {(category === "math" || category === "seo") && (
          <div className="flex flex-col gap-3">
            {fieldDefs && fieldDefs.length > 0 ? (
              fieldDefs.map((f) => (
                <div key={f.name} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      value={fieldValues[f.name] ?? ""}
                      onChange={(e) => updateField(f.name, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={fieldValues[f.name] ?? ""}
                      onChange={(e) => updateField(f.name, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Input (raw)</label>
                <textarea
                  rows={4}
                  onChange={(e) => updateField("text", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="No field schema found for this op — using generic text input"
                />
                <p className="text-xs text-amber-600">
                  ⚠ No schema defined for &quot;{opId}&quot; in tool-field-schemas.ts.
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={execute}
          disabled={loading}
          className="mt-5 w-full md:w-auto px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {result !== null && !error && <ResultDisplay result={result} />}
      </div>
    </main>
  );
}

function ResultDisplay({ result }: { result: unknown }) {
  if (typeof result === "object" && result !== null) {
    return (
      <div className="mt-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
        {Object.entries(result as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm py-1">
            <span className="text-gray-600 capitalize">{k}</span>
            <span className="font-semibold text-gray-900">{String(v)}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-lg font-semibold text-gray-900">
      {String(result)}
    </div>
  );
}
