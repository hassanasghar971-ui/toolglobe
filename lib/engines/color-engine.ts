// lib/engines/color-engine.ts
import type { ExecutionValues, ToolExecutionResult, ColorResult } from "./types";

function expandShorthandHex(hex: string): string {
  if (hex.length === 4) {
    return "#" + hex.slice(1).split("").map((c) => c + c).join("");
  }
  return hex;
}

export function runColorEngine(
  engineConfig: Record<string, unknown>,
  values: ExecutionValues
): ToolExecutionResult {
  const conversionType = engineConfig.conversionType as string;

  if (conversionType === "hex-to-rgb") {
    const raw = typeof values.hexValue === "string" ? values.hexValue.trim() : "";
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(raw)) {
      return { success: false, error: "Please enter a valid HEX color, e.g. #3366FF." };
    }
    const hex = expandShorthandHex(raw);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const result: ColorResult = {
      hex: hex.toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      rgbValues: { r, g, b },
    };

    return { success: true, format: "color", value: result };
  }

  return { success: false, error: `Unknown color conversion type: ${conversionType}` };
}
