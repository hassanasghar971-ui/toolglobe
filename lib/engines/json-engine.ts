// lib/engines/json-engine.ts
import type { ExecutionValues, ToolExecutionResult } from "./types";

export function runJsonEngine(
  engineConfig: Record<string, unknown>,
  values: ExecutionValues
): ToolExecutionResult {
  const inputJson = typeof values.inputJson === "string" ? values.inputJson : "";
  const minify = Boolean(values.minify);
  const indentSize = Number(engineConfig.indentSize) || 2;

  if (inputJson.trim().length === 0) {
    return { success: false, error: "Please enter JSON data to format." };
  }

  try {
    const parsed = JSON.parse(inputJson);
    const output = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indentSize);
    return { success: true, format: "code", value: output };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON.";
    return { success: false, error: `JSON Parse Error: ${message}` };
  }
}
