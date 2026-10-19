// lib/engines/engine-dispatcher.ts
import type { ToolDefinition } from "@/lib/types/tool";
import type { ExecutionValues, ToolExecutionResult } from "./types";
import { validateAndSanitizeFields } from "./validate-fields";
import { runTextEngine } from "./text-engine";
import { runConverterEngine } from "./converter-engine";
import { runCalculatorEngine } from "./calculator-engine";
import { runGeneratorEngine } from "./generator-engine";
import { runJsonEngine } from "./json-engine";
import { runEncoderEngine } from "./encoder-engine";
import { runColorEngine } from "./color-engine";
import { runDateTimeEngine } from "./date-time-engine";

/**
 * Single entry point for all synchronous tool execution. File-based
 * tools (engine === "file-processor") are intentionally excluded here
 * — they require async File/Canvas APIs and are dispatched directly
 * from components/tool-engine/ToolPageClient.tsx via lib/engines/file-engine.ts.
 */
export function executeTool(tool: ToolDefinition, rawValues: ExecutionValues): ToolExecutionResult {
  const { values, errors } = validateAndSanitizeFields(tool.fields, rawValues);

  if (Object.keys(errors).length > 0) {
    return { success: false, error: "Please correct the highlighted fields.", fieldErrors: errors };
  }

  switch (tool.engine) {
    case "text-transform":
      return runTextEngine(tool.engineConfig, values);
    case "unit-converter":
      return runConverterEngine(tool.engineConfig, values);
    case "calculator":
      return runCalculatorEngine(tool.engineConfig, values);
    case "generator":
      return runGeneratorEngine(tool.engineConfig, values);
    case "json-tool":
      return runJsonEngine(tool.engineConfig, values);
    case "encoder-decoder":
      return runEncoderEngine(tool.engineConfig, values);
    case "color-tool":
      return runColorEngine(tool.engineConfig, values);
    case "date-time-tool":
      return runDateTimeEngine(tool.engineConfig, values);
    case "file-processor":
      return {
        success: false,
        error: "This tool requires a file — use the Process File button below.",
      };
    default:
      return { success: false, error: `No execution engine registered for "${tool.engine}".` };
  }
}
