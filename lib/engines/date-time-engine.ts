// lib/engines/date-time-engine.ts
import type { ExecutionValues, ToolExecutionResult, TableResult } from "./types";

export function runDateTimeEngine(
  engineConfig: Record<string, unknown>,
  values: ExecutionValues
): ToolExecutionResult {
  const operation = engineConfig.operation as string;

  if (operation === "date-diff") {
    const start = new Date(values.startDate as string);
    const end = new Date(values.endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { success: false, error: "Please provide two valid dates." };
    }

    const diffMs = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    const table: TableResult = {
      rows: [
        { label: "Total Days", value: String(diffDays) },
        { label: "Approx. Years", value: String(years) },
        { label: "Approx. Months", value: String(months) },
        { label: "Remaining Days", value: String(days) },
      ],
    };

    return { success: true, format: "table", value: table };
  }

  if (operation === "age-calculator") {
    const birth = new Date(values.birthDate as string);
    const now = new Date();

    if (isNaN(birth.getTime())) {
      return { success: false, error: "Please provide a valid birth date." };
    }
    if (birth.getTime() > now.getTime()) {
      return { success: false, error: "Birth date cannot be in the future." };
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return {
      success: true,
      format: "text",
      value: `You are ${years} years, ${months} months, and ${days} days old.`,
    };
  }

  if (operation === "timestamp-converter") {
    const mode = values.mode as string;
    if (mode === "to-timestamp") {
      const date = new Date(values.dateInput as string);
      if (isNaN(date.getTime())) {
        return { success: false, error: "Please provide a valid date." };
      }
      return { success: true, format: "number", value: Math.floor(date.getTime() / 1000) };
    }
    const timestamp = Number(values.timestampInput);
    if (!Number.isFinite(timestamp)) {
      return { success: false, error: "Please provide a valid Unix timestamp." };
    }
    return { success: true, format: "text", value: new Date(timestamp * 1000).toISOString() };
  }

  return { success: false, error: `Unknown date/time operation: ${operation}` };
}
