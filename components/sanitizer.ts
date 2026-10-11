// components/sanitizer.ts
// Lightweight, zero-dependency XSS sanitization for payloads crossing engine
// and API boundaries. Defense-in-depth: strip dangerous markup, neutralize
// event handlers / protocol-based injections, and escape for safe HTML output.

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};

const DANGEROUS_PATTERNS: RegExp[] = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
  /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
  /<embed[\s\S]*?>/gi,
  /<link[\s\S]*?>/gi,
  /<style[\s\S]*?>[\s\S]*?<\/style>/gi,
  /on\w+\s*=\s*"[^"]*"/gi,
  /on\w+\s*=\s*'[^']*'/gi,
  /on\w+\s*=\s*[^\s>]+/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi,
  /<svg[\s\S]*?onload[\s\S]*?>/gi,
];

const SUSPICIOUS_PATTERNS: RegExp[] = [
  /<script/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /union\s+select/i,
  /drop\s+table/i,
  /\.\.\/\.\.\//,
  /%00/,
];

const BLOCKED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** Escapes all HTML-significant characters — use before rendering into DOM/HTML. */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"'/]/g, (c) => ENTITY_MAP[c] ?? c);
}

/** Removes scripts, iframes, inline event handlers, and dangerous protocols. */
export function stripDangerousMarkup(input: string): string {
  let out = input;
  for (const pattern of DANGEROUS_PATTERNS) out = out.replace(pattern, "");
  return out;
}

/** General-purpose sanitizer for strings entering text/math/SEO engines. */
export function sanitizeInput(input: unknown, maxLength = 10000): string {
  if (typeof input !== "string") return "";
  let s = input.slice(0, maxLength);
  s = stripDangerousMarkup(s);
  s = s.replace(/\0/g, "");
  return s;
}

/** Strict sanitizer for content destined for raw HTML injection. */
export function sanitizeForDisplay(input: unknown, maxLength = 10000): string {
  return escapeHtml(sanitizeInput(input, maxLength));
}

/** Recursively sanitizes plain objects/arrays (API payloads), guarding against
 * prototype pollution and oversized/malicious nested structures. */
export function sanitizeDeep<T>(value: T, depth = 0): T {
  if (depth > 8) return value;

  if (typeof value === "string") {
    return sanitizeInput(value, 20000) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.slice(0, 5000).map((v) => sanitizeDeep(v, depth + 1)) as unknown as T;
  }

  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (BLOCKED_KEYS.has(k)) continue;
      out[k] = sanitizeDeep(v, depth + 1);
    }
    return out as unknown as T;
  }

  return value;
}

/** Quick heuristic check used by middleware/rate-limiter to flag malicious payloads. */
export function isSuspicious(input: string): boolean {
  return SUSPICIOUS_PATTERNS.some((p) => p.test(input));
}

export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}
