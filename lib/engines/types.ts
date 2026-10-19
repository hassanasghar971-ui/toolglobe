// lib/engines/types.ts

export type ExecutionValues = Record<string, unknown>;

export interface TableRow {
  label: string;
  value: string;
}

export interface TableResult {
  rows: TableRow[];
  summary?: string;
}

export interface ColorResult {
  hex: string;
  rgb: string;
  rgbValues: { r: number; g: number; b: number };
}

export type ExecutionValue = string | number | TableResult | ColorResult | string[];

export interface ToolExecutionSuccess {
  success: true;
  format: "text" | "number" | "table" | "image" | "file" | "code" | "color";
  value: ExecutionValue;
  fileBlob?: Blob;
  fileName?: string;
}

export interface ToolExecutionError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type ToolExecutionResult = ToolExecutionSuccess | ToolExecutionError;
