// lib/engines/converter-engine.ts
import type { ExecutionValues, ToolExecutionResult } from "./types";

export function runConverterEngine(
  engineConfig: Record<string, unknown>,
  values: ExecutionValues
): ToolExecutionResult {
  const toBaseFactor = Number(engineConfig.toBaseFactor);
  const targetBaseFactor = Number(engineConfig.targetBaseFactor);
  const inputValue = Number(values.inputValue);

  if (!Number.isFinite(inputValue)) {
    return { success: false, error: "Please enter a valid numeric value." };
  }
  if (!Number.isFinite(toBaseFactor) || !Number.isFinite(targetBaseFactor) || targetBaseFactor === 0) {
    return { success: false, error: "Converter configuration error." };
  }

  const baseValue = inputValue * toBaseFactor;
  const result = baseValue / targetBaseFactor;
  const rounded = Math.round(result * 1e8) / 1e8;

  return { success: true, format: "number", value: rounded };
}
