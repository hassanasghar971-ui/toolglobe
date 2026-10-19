// lib/engines/encoder-engine.ts
import type { ExecutionValues, ToolExecutionResult } from "./types";

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function runEncoderEngine(
  engineConfig: Record<string, unknown>,
  values: ExecutionValues
): ToolExecutionResult {
  const codec = engineConfig.codec as string;
  const inputText = typeof values.inputText === "string" ? values.inputText : "";
  const mode = values.mode as string;

  if (codec === "base64") {
    try {
      if (mode === "encode") {
        return { success: true, format: "text", value: utf8ToBase64(inputText) };
      }
      return { success: true, format: "text", value: base64ToUtf8(inputText) };
    } catch {
      return { success: false, error: "Invalid Base64 input — unable to decode." };
    }
  }

  return { success: false, error: `Unknown codec: ${codec}` };
}
