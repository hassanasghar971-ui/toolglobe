// lib/engines/text-engine.ts
import type { ExecutionValues, ToolExecutionResult } from "./types";

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

function toSentenceCase(s: string): string {
  const lower = s.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

export function runTextEngine(
  engineConfig: Record<string, unknown>,
  values: ExecutionValues
): ToolExecutionResult {
  const transformType = engineConfig.transformType as string;
  const inputText = typeof values.inputText === "string" ? values.inputText : "";

  if (transformType === "case") {
    const caseType = values.caseType as string;
    let result = inputText;
    switch (caseType) {
      case "upper":
        result = inputText.toUpperCase();
        break;
      case "lower":
        result = inputText.toLowerCase();
        break;
      case "title":
        result = toTitleCase(inputText);
        break;
      case "sentence":
        result = toSentenceCase(inputText);
        break;
    }
    return { success: true, format: "text", value: result };
  }

  if (transformType === "count") {
    const trimmed = inputText.trim();
    const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
    const charsWithSpaces = inputText.length;
    const charsNoSpaces = inputText.replace(/\s/g, "").length;
    const sentences = trimmed.length === 0 ? 0 : (trimmed.match(/[^.!?]+[.!?]*/g) || []).length;
    const paragraphs =
      trimmed.length === 0 ? 0 : trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length;

    return {
      success: true,
      format: "table",
      value: {
        rows: [
          { label: "Words", value: String(words) },
          { label: "Characters (with spaces)", value: String(charsWithSpaces) },
          { label: "Characters (no spaces)", value: String(charsNoSpaces) },
          { label: "Sentences", value: String(sentences) },
          { label: "Paragraphs", value: String(paragraphs) },
        ],
      },
    };
  }

  return { success: false, error: `Unknown text transform type: ${transformType}` };
}
