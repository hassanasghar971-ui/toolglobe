// lib/engines/sanitize.ts

/**
 * Input/output sanitization utilities used by every engine before
 * processing user input and before rendering results back to the DOM.
 * Satisfies the master prompt's "input sanitization against XSS" rule
 * at the execution-engine boundary (complementing middleware.ts's
 * network-level CSP from Phase 1).
 */

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizePlainText(input: unknown, maxLength = 50_000): string {
  if (typeof input !== "string") return "";
  const stripped = input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
  return stripped.slice(0, maxLength);
}

export function sanitizeNumber(input: unknown, fallback = 0): number {
  const n = typeof input === "number" ? input : parseFloat(String(input));
  return Number.isFinite(n) ? n : fallback;
}

export function clampNumber(value: number, min?: number, max?: number): number {
  let v = value;
  if (typeof min === "number") v = Math.max(min, v);
  if (typeof max === "number") v = Math.min(max, v);
  return v;
}
