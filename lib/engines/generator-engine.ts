// lib/engines/generator-engine.ts
import type { ExecutionValues, ToolExecutionResult } from "./types";

function getSecureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0]! % max;
}

export function runGeneratorEngine(
  engineConfig: Record<string, unknown>,
  values: ExecutionValues
): ToolExecutionResult {
  const generatorType = engineConfig.generatorType as string;

  if (generatorType === "password") {
    const length = Math.min(128, Math.max(4, Number(values.length) || 16));
    const includeUppercase = Boolean(values.includeUppercase);
    const includeLowercase = Boolean(values.includeLowercase);
    const includeNumbers = Boolean(values.includeNumbers);
    const includeSymbols = Boolean(values.includeSymbols);

    const sets = [
      includeUppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
      includeLowercase ? "abcdefghijklmnopqrstuvwxyz" : "",
      includeNumbers ? "0123456789" : "",
      includeSymbols ? "!@#$%^&*()_+-=[]{}|;:,.<>?" : "",
    ].filter(Boolean);

    if (sets.length === 0) {
      return { success: false, error: "Select at least one character set." };
    }

    const allChars = sets.join("");
    let password = "";
    for (let i = 0; i < length; i++) {
      password += allChars[getSecureRandomInt(allChars.length)];
    }

    return { success: true, format: "text", value: password };
  }

  if (generatorType === "uuid-v4") {
    const count = Math.min(1000, Math.max(1, Number(values.count) || 5));
    const uppercase = Boolean(values.uppercase);
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const id = crypto.randomUUID();
      uuids.push(uppercase ? id.toUpperCase() : id);
    }
    return { success: true, format: "text", value: uuids.join("\n") };
  }

  return { success: false, error: `Unknown generator type: ${generatorType}` };
}
