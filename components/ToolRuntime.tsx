// components/ToolRuntime.tsx
// Interactive, secure tool execution runtime.
// - Converter/quickvalue tools: instant client-side math via lib/engines.convertUnit (zero lag, no network).
// - Text/math/seo tools: debounced calls to /api/tools/execute (server-side sanitization + rate limiting).

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { convertUnit } from "@/lib/engines";
import { getFamily } from "@/lib/units";
import type { ToolMeta } from "@/lib/tools-registry";

interface FieldDef {
  key: string;
  label: string;
  area?: boolean;
}

// Compact per-op field registries (required inputs only — not giant, ~20 entries total)
const MATH_FIELDS: Record<string, FieldDef[]> = {
  percentage: [{ key: "value", label: "Value" }, { key: "percent", label: "Percent" }],
  percentagechange: [{ key: "oldValue", label: "Old Value" }, { key: "newValue", label: "New Value" }],
  bmi: [{ key: "weightKg", label: "Weight (kg)" }, { key: "heightM", label: "Height (m)" }],
  bmr: [
    { key: "weightKg", label: "Weight (kg)" },
    { key: "heightCm", label: "Height (cm)" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender (male/female)" },
  ],
  simpleinterest: [{ key: "principal", label: "Principal" }, { key: "rate", label: "Rate (%)" }, { key: "years", label: "Years" }],
  compoundinterest: [
    { key: "principal", label: "Principal" },
    { key: "rate", label: "Rate (%)" },
    { key: "years", label: "Years" },
    { key: "n", label: "Compounds / Year" },
  ],
  quadratic: [{ key: "a", label: "a" }, { key: "b", label: "b" }, { key: "c", label: "c" }],
  gcd: [{ key: "a", label: "A" }, { key: "b", label: "B" }],
  lcm: [{ key: "a", label: "A" }, { key: "b", label: "B" }],
  factorial: [{ key: "n", label: "N" }],
  isprime: [{ key: "n", label: "Number" }],
  circlearea: [{ key: "radius", label: "Radius" }],
  trianglearea: [{ key: "base", label: "Base" }, { key: "height", label: "Height" }],
  loanpayment: [{ key: "principal", label: "Principal" }, { key: "rate", label: "Annual Rate (%)" }, { key: "months", label: "Months" }],
  discount: [{ key: "price", label: "Price" }, { key: "percent", label: "Discount %" }],
  tipcalculator: [{ key: "bill", label: "Bill Amount" }, { key: "percent", label: "Tip %" }, { key: "people", label: "People" }],
  average: [{ key: "values", label: "Comma-separated values", area: true }],
};

const SEO_FIELDS: Record<string, FieldDef[]> = {
  slugify: [{ key: "text", label: "Text", area: true }],
  metatitlecheck: [{ key: "title", label: "Meta Title" }],
  metadescriptioncheck: [{ key: "description", label: "Meta Description", area: true }],
  keyworddensity: [{ key: "text", label: "Content", area: true }, { key: "keyword", label: "Keyword" }],
  wordcounter: [{ key: "text", label: "Content", area: true }],
  readabilityscore: [{ key: "text", label: "Content", area: true }],
};

function useDebouncedEffect(effect: () => void, deps: unknown[], delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(effect, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function ToolRuntime({ tool }: { tool: ToolMeta }) {
  const isConverter = tool.kind === "converter" || tool.kind === "quickvalue";
  const opId = !isConverter ? tool.slug.split("/")[1] ?? "" : "";
  const category: "text" | "math" | "seo" | "convert" = isConverter ? "convert" : (tool.kind as "text" | "math" | "seo");

  const family = tool.family ? getFamily(tool.family) : undefined;
  const [fromUnit, setFromUnit] = useState(tool.fromUnit || family?.units[0]?.id || "");
  const [toUnit, setToUnit] = useState(tool.toUnit || family?.units[1]?.id || "");
  const [value, setValue] = useState(String(tool.value ?? 1));
  const [input, setInput] = useState("");

  const fieldDefs: FieldDef[] = category === "math" ? MATH_FIELDS[opId] ?? [] : category === "seo" ? SEO_FIELDS[opId] ?? [] : [];
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fieldDefs.forEach((f) => (init[f.key] = ""));
    return init;
  });

  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- Converter: instant client-side math, zero network lag ---------------
  useEffect(() => {
    if (!isConverter || !family) return;
    setError("");
    if (value.trim() === "" || isNaN(Number(value))) {
      setResult(null);
      return;
    }
    try {
      const out = convertUnit(tool.family!, fromUnit, toUnit, Number(value));
      setResult(+out.toFixed(8));
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  }, [isConverter, family, fromUnit, toUnit, value, tool.family]);

  // --- Text/Math/SEO: debounced secure server execution ---------------------
  const execute = useCallback(
    async (payload: Record<string, unknown>) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/tools/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, opId, payload }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error || "Execution failed");
          setResult(null);
        } else {
          setResult(data.result);
        }
      } catch {
        setError("Network error — please try again.");
      } finally {
        setLoading(false);
      }
    },
    [category, opId]
  );

  useDebouncedEffect(
    () => {
      if (isConverter) return;
      if (category === "text") {
        if (!input.trim()) {
          setResult(null);
          return;
        }
        execute({ input });
      } else {
        const hasAny = Object.values(fields).some((v) => v.trim() !== "");
        if (!hasAny) {
          setResult(null);
          return;
        }
        execute(fields);
      }
    },
    [isConverter, category, input, fields, execute],
    350
  );

  function handleCopy() {
    const text = typeof result === "object" && result !== null ? JSON.stringify(result, null, 2) : String(result ?? "");
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <div className="glass-panel p-6 sm:p-8 flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">{tool.title}</h1>
        <p className="text-sm text-white/50 mt-1">{tool.description}</p>
      </div>

      {isConverter && family ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/40 uppercase tracking-wide">From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="glass-card px-3 py-2 bg-transparent text-white outline-none"
              >
                {family.units.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#0b0f1f]">
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                const f = fromUnit;
                setFromUnit(toUnit);
                setToUnit(f);
              }}
              aria-label="Swap units"
              className="glow-border rounded-xl h-10 w-10 flex items-center justify-center text-white self-center"
            >
              ⇄
            </button>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/40 uppercase tracking-wide">To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="glass-card px-3 py-2 bg-transparent text-white outline-none"
              >
                {family.units.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#0b0f1f]">
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40 uppercase tracking-wide">Value</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="decimal"
              className="glass-card px-4 py-3 bg-transparent text-white text-lg outline-none"
              placeholder="Enter a value"
            />
          </div>
        </div>
      ) : category === "text" ? (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40 uppercase tracking-wide">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            maxLength={20000}
            className="glass-card px-4 py-3 bg-transparent text-white outline-none resize-y"
            placeholder="Type or paste text here..."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fieldDefs.map((f) => (
            <div key={f.key} className={`flex flex-col gap-1 ${f.area ? "sm:col-span-2" : ""}`}>
              <label className="text-xs text-white/40 uppercase tracking-wide">{f.label}</label>
              {f.area ? (
                <textarea
                  rows={4}
                  value={fields[f.key] || ""}
                  onChange={(e) => setFields((s) => ({ ...s, [f.key]: e.target.value }))}
                  className="glass-card px-4 py-3 bg-transparent text-white outline-none resize-y"
                />
              ) : (
                <input
                  value={fields[f.key] || ""}
                  onChange={(e) => setFields((s) => ({ ...s, [f.key]: e.target.value }))}
                  className="glass-card px-4 py-3 bg-transparent text-white outline-none"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="glow-border rounded-2xl p-5 min-h-[96px] flex flex-col justify-center gap-2">
        {loading && <span className="text-sm text-white/50 shimmer-bg rounded px-2 py-1 w-fit">Calculating…</span>}

        {!loading && error && <span className="text-sm text-red-300">{error}</span>}

        {!loading && !error && result !== null && result !== undefined && (
          <>
            <div className="text-xs uppercase tracking-wide text-white/40">Result</div>
            {typeof result === "object" ? (
              <div className="flex flex-col gap-1">
                {Object.entries(result as Record<string, unknown>).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm text-white/80 border-b border-white/5 py-1">
                    <span className="text-white/40">{k}</span>
                    <span className="font-mono">{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-2xl font-bold text-white font-mono break-all">{String(result)}</div>
            )}
            <button
              onClick={handleCopy}
              className="mt-2 self-start text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {copied ? "✅ Copied" : "📋 Copy Result"}
            </button>
          </>
        )}

        {!loading && !error && (result === null || result === undefined) && (
          <span className="text-sm text-white/30">Results will appear here instantly as you type.</span>
        )}
      </div>
    </div>
  );
}
