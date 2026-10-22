/**
 * The factory engine dispatches purely on `tool.transform.ruleId`.
 * No code here ever branches on a tool's slug — this is what keeps the
 * bundle size O(1) regardless of whether the registry holds 4 tools or
 * 20,000: adding a new tool that reuses an existing ruleId costs zero
 * additional JavaScript; adding a genuinely new transformation requires
 * exactly one new function registered in RULES below.
 */

export interface TransformSuccess {
  status: "success";
  output: string;
  meta?: Record<string, string | number>;
}

export interface TransformFailure {
  status: "error";
  message: string;
}

export type TransformResult = TransformSuccess | TransformFailure;

export type TransformFn = (
  values: Record<string, unknown>,
  config?: Record<string, unknown>
) => TransformResult;

/* ------------------------------------------------------------------ */
/* Rule: json-format-validate                                          */
/* ------------------------------------------------------------------ */

function sortObjectKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeysDeep);
  if (value !== null && typeof value === "object") {
    const entries = Object.keys(value as Record<string, unknown>).sort();
    return entries.reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = sortObjectKeysDeep((value as Record<string, unknown>)[key]);
      return acc;
    }, {});
  }
  return value;
}

function jsonFormatValidate(values: Record<string, unknown>): TransformResult {
  const raw = String(values.jsonInput ?? "");
  const indentSize = String(values.indentSize ?? "2");
  const sortKeys = Boolean(values.sortKeys);

  if (!raw.trim()) {
    return { status: "error", message: "Please paste JSON content to format." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON.";
    const positionMatch = message.match(/position (\d+)/i);

    if (positionMatch) {
      const position = Number(positionMatch[1]);
      const upToError = raw.slice(0, position);
      const line = upToError.split("\n").length;
      const lastNewline = upToError.lastIndexOf("\n");
      const column = position - lastNewline;
      return {
        status: "error",
        message: `Invalid JSON: ${message} (line ${line}, column ${column}).`,
      };
    }
    return { status: "error", message: `Invalid JSON: ${message}` };
  }

  const normalized = sortKeys ? sortObjectKeysDeep(parsed) : parsed;

  let output: string;
  if (indentSize === "minify") {
    output = JSON.stringify(normalized);
  } else if (indentSize === "tab") {
    output = JSON.stringify(normalized, null, "\t");
  } else {
    output = JSON.stringify(normalized, null, Number(indentSize) || 2);
  }

  return {
    status: "success",
    output,
    meta: { characters: output.length, valid: "yes" },
  };
}

/* ------------------------------------------------------------------ */
/* Rule: text-count-stats                                              */
/* ------------------------------------------------------------------ */

function textCountStats(values: Record<string, unknown>): TransformResult {
  const text = String(values.textInput ?? "");
  const countMode = String(values.countMode ?? "with-spaces");

  if (!text.trim()) {
    return { status: "error", message: "Please enter some text to analyze." };
  }

  const words = (text.trim().match(/\S+/g) ?? []).length;
  const charactersWithSpaces = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, "").length;
  const characters =
    countMode === "without-spaces" ? charactersWithoutSpaces : charactersWithSpaces;

  // Protect common abbreviations from being treated as sentence boundaries.
  const protectedText = text.replace(
    /\b(Mr|Mrs|Ms|Dr|Prof|e\.g|i\.e|etc)\./gi,
    (match) => match.replace(".", "∯")
  );
  const sentenceMatches = protectedText.match(/[^.!?]+[.!?]+/g);
  const sentences = sentenceMatches ? sentenceMatches.length : text.trim() ? 1 : 0;

  const paragraphs =
    text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean).length || (text.trim() ? 1 : 0);

  const readingTimeMinutes = Math.max(1, Math.ceil(words / 225));

  const output = [
    `Words: ${words}`,
    `Characters: ${characters}`,
    `Sentences: ${sentences}`,
    `Paragraphs: ${paragraphs}`,
    `Estimated reading time: ${readingTimeMinutes} min`,
  ].join("\n");

  return {
    status: "success",
    output,
    meta: { words, characters, sentences, paragraphs, readingTimeMinutes },
  };
}

/* ------------------------------------------------------------------ */
/* Rule: text-case-convert                                             */
/* ------------------------------------------------------------------ */

const TITLE_CASE_MINOR_WORDS = new Set([
  "a", "an", "the", "and", "but", "or", "nor", "for",
  "of", "on", "in", "to", "with", "as", "at", "by",
]);

function toTitleCase(text: string): string {
  const words = text.toLowerCase().split(/\s+/);
  return words
    .map((word, index) => {
      if (word.length === 0) return word;
      const isEdge = index === 0 || index === words.length - 1;
      if (!isEdge && TITLE_CASE_MINOR_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function toSentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
}

function toCamelCase(text: string): string {
  const words = text.trim().split(/[\s_-]+/).filter(Boolean);
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

function toSnakeCase(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function textCaseConvert(values: Record<string, unknown>): TransformResult {
  const text = String(values.textInput ?? "");
  const targetCase = String(values.targetCase ?? "uppercase");

  if (!text) {
    return { status: "error", message: "Please enter text to convert." };
  }

  switch (targetCase) {
    case "uppercase":
      return { status: "success", output: text.toUpperCase() };
    case "lowercase":
      return { status: "success", output: text.toLowerCase() };
    case "title-case":
      return { status: "success", output: toTitleCase(text) };
    case "sentence-case":
      return { status: "success", output: toSentenceCase(text) };
    case "camel-case":
      return { status: "success", output: toCamelCase(text) };
    case "snake-case":
      return { status: "success", output: toSnakeCase(text) };
    default:
      return {
        status: "error",
        message: `Unsupported case format: "${targetCase}".`,
      };
  }
}

/* ------------------------------------------------------------------ */
/* Rule: math-percentage                                               */
/* ------------------------------------------------------------------ */

function mathPercentage(values: Record<string, unknown>): TransformResult {
  const mode = String(values.calculationMode ?? "percent-of");
  const a = Number(values.valueA);
  const b = Number(values.valueB);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return { status: "error", message: "Please enter valid numbers for both values." };
  }

  switch (mode) {
    case "percent-of": {
      const result = (a / 100) * b;
      return {
        status: "success",
        output: `${result}`,
        meta: { formula: `(${a} ÷ 100) × ${b} = ${result}` },
      };
    }
    case "increase": {
      if (a === 0) {
        return {
          status: "error",
          message: "Value A (original value) cannot be zero for a percentage increase calculation.",
        };
      }
      const result = ((b - a) / a) * 100;
      return {
        status: "success",
        output: `${result.toFixed(2)}%`,
        meta: { formula: `((${b} − ${a}) ÷ ${a}) × 100 = ${result.toFixed(2)}%` },
      };
    }
    case "decrease": {
      if (a === 0) {
        return {
          status: "error",
          message: "Value A (original value) cannot be zero for a percentage decrease calculation.",
        };
      }
      const result = ((a - b) / a) * 100;
      return {
        status: "success",
        output: `${result.toFixed(2)}%`,
        meta: { formula: `((${a} − ${b}) ÷ ${a}) × 100 = ${result.toFixed(2)}%` },
      };
    }
    case "what-percent": {
      if (b === 0) {
        return { status: "error", message: "Value B cannot be zero." };
      }
      const result = (a / b) * 100;
      return {
        status: "success",
        output: `${result.toFixed(2)}%`,
        meta: { formula: `(${a} ÷ ${b}) × 100 = ${result.toFixed(2)}%` },
      };
    }
    default:
      return { status: "error", message: `Unsupported calculation mode: "${mode}".` };
  }
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                           */
/* ------------------------------------------------------------------ */

const RULES: Record<string, TransformFn> = {
  "json-format-validate": jsonFormatValidate,
  "text-count-stats": textCountStats,
  "text-case-convert": textCaseConvert,
  "math-percentage": mathPercentage,
};

export function runTransform(
  ruleId: string,
  values: Record<string, unknown>,
  config?: Record<string, unknown>
): TransformResult {
  const fn = RULES[ruleId];
  if (!fn) {
    return {
      status: "error",
      message: `This tool is misconfigured: unknown transform rule "${ruleId}".`,
    };
  }
  try {
    return fn(values, config);
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "An unexpected processing error occurred.",
    };
  }
}
