// lib/engines.ts
// Compact execution engines: Unit Conversion, Text Formatting, Math/Calculators, SEO Utilities.
// All inputs are sanitized before processing to prevent injection into downstream renders.

import { UNIT_FAMILIES } from "./units";
import { sanitizeInput, sanitizeDeep } from "@/components/sanitizer";

// --- 1. Unit Conversion Engine ----------------------------------------------

export function convertUnit(familyId: string, fromId: string, toId: string, value: number): number {
  const fam = UNIT_FAMILIES.find((f) => f.id === familyId);
  if (!fam) throw new Error(`Unknown unit family: ${familyId}`);
  const from = fam.units.find((u) => u.id === fromId);
  const to = fam.units.find((u) => u.id === toId);
  if (!from || !to) throw new Error(`Unknown unit in family ${familyId}`);
  if (!Number.isFinite(value)) throw new Error("Invalid numeric input");

  const base = from.toBaseFn ? from.toBaseFn(value) : value * from.toBase;
  const result = to.fromBaseFn ? to.fromBaseFn(base) : base / to.toBase;
  return result;
}

// --- 2. Text Formatting Engine ----------------------------------------------

function wordsOf(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
}

const ENTITY_MAP: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const ENTITY_REVERSE: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };

export const TEXT_OPS: Record<string, { label: string; run: (input: string) => unknown }> = {
  uppercase: { label: "Uppercase Converter", run: (s) => s.toUpperCase() },
  lowercase: { label: "Lowercase Converter", run: (s) => s.toLowerCase() },
  titlecase: { label: "Title Case Converter", run: (s) => s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase()) },
  sentencecase: { label: "Sentence Case Converter", run: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()) },
  camelcase: { label: "camelCase Converter", run: (s) => wordsOf(s).map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join("") },
  pascalcase: { label: "PascalCase Converter", run: (s) => wordsOf(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("") },
  snakecase: { label: "snake_case Converter", run: (s) => wordsOf(s).map((w) => w.toLowerCase()).join("_") },
  kebabcase: { label: "kebab-case Converter", run: (s) => wordsOf(s).map((w) => w.toLowerCase()).join("-") },
  slug: { label: "Slug Generator", run: (s) => wordsOf(s).map((w) => w.toLowerCase()).join("-") },
  reverse: { label: "Text Reverser", run: (s) => s.split("").reverse().join("") },
  base64encode: { label: "Base64 Encoder", run: (s) => Buffer.from(s, "utf-8").toString("base64") },
  base64decode: { label: "Base64 Decoder", run: (s) => Buffer.from(s, "base64").toString("utf-8") },
  urlencode: { label: "URL Encoder", run: (s) => encodeURIComponent(s) },
  urldecode: { label: "URL Decoder", run: (s) => decodeURIComponent(s) },
  removespaces: { label: "Remove Spaces", run: (s) => s.replace(/\s+/g, "") },
  trimextraspaces: { label: "Trim Extra Spaces", run: (s) => s.replace(/\s+/g, " ").trim() },
  countwords: { label: "Word Counter", run: (s) => ({ words: s.trim() ? s.trim().split(/\s+/).length : 0 }) },
  countchars: { label: "Character Counter", run: (s) => ({ chars: s.length, charsNoSpaces: s.replace(/\s/g, "").length }) },
  rot13: { label: "ROT13 Cipher", run: (s) => s.replace(/[a-zA-Z]/g, (c) => { const base = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base); }) },
  binaryencode: { label: "Text to Binary", run: (s) => s.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ") },
  binarydecode: { label: "Binary to Text", run: (s) => s.trim().split(/\s+/).filter(Boolean).map((b) => String.fromCharCode(parseInt(b, 2))).join("") },
  htmlentityencode: { label: "HTML Entity Encoder", run: (s) => s.replace(/[&<>"']/g, (c) => ENTITY_MAP[c]) },
  htmlentitydecode: { label: "HTML Entity Decoder", run: (s) => s.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (m) => ENTITY_REVERSE[m]) },
};

// --- 3. Math / Calculator Engine --------------------------------------------

function gcdOf(x: number, y: number): number {
  return y === 0 ? Math.abs(x) : gcdOf(y, x % y);
}

export const MATH_OPS: Record<string, { label: string; run: (p: Record<string, number | string>) => unknown }> = {
  percentage: { label: "Percentage Calculator", run: ({ value, percent }) => ({ result: (Number(value) * Number(percent)) / 100 }) },
  percentagechange: { label: "Percentage Change Calculator", run: ({ oldValue, newValue }) => ({ result: ((Number(newValue) - Number(oldValue)) / Number(oldValue)) * 100 }) },
  bmi: { label: "BMI Calculator", run: ({ weightKg, heightM }) => ({ bmi: +(Number(weightKg) / (Number(heightM) * Number(heightM))).toFixed(2) }) },
  bmr: { label: "BMR Calculator", run: ({ weightKg, heightCm, age, gender }) => { const s = gender === "male" ? 5 : -161; return { bmr: Math.round(10 * Number(weightKg) + 6.25 * Number(heightCm) - 5 * Number(age) + s) }; } },
  simpleinterest: { label: "Simple Interest Calculator", run: ({ principal, rate, years }) => { const i = (Number(principal) * Number(rate) * Number(years)) / 100; return { interest: +i.toFixed(2), total: +(Number(principal) + i).toFixed(2) }; } },
  compoundinterest: { label: "Compound Interest Calculator", run: ({ principal, rate, years, n = 1 }) => { const total = Number(principal) * Math.pow(1 + Number(rate) / 100 / Number(n), Number(n) * Number(years)); return { total: +total.toFixed(2), interest: +(total - Number(principal)).toFixed(2) }; } },
  quadratic: { label: "Quadratic Equation Solver", run: ({ a, b, c }) => { const A = Number(a), B = Number(b), C = Number(c); const d = B * B - 4 * A * C; if (d < 0) return { roots: [], discriminant: d }; const sq = Math.sqrt(d); return { roots: [+((-B + sq) / (2 * A)).toFixed(4), +((-B - sq) / (2 * A)).toFixed(4)], discriminant: d }; } },
  gcd: { label: "GCD Calculator", run: ({ a, b }) => ({ result: gcdOf(Number(a), Number(b)) }) },
  lcm: { label: "LCM Calculator", run: ({ a, b }) => ({ result: Math.abs(Number(a) * Number(b)) / gcdOf(Number(a), Number(b)) }) },
  factorial: { label: "Factorial Calculator", run: ({ n }) => { let r = 1; for (let i = 2; i <= Number(n); i++) r *= i; return { result: r }; } },
  isprime: { label: "Prime Number Checker", run: ({ n }) => { const num = Number(n); if (num < 2) return { isPrime: false }; for (let i = 2; i * i <= num; i++) if (num % i === 0) return { isPrime: false }; return { isPrime: true }; } },
  circlearea: { label: "Circle Area Calculator", run: ({ radius }) => ({ result: +(Math.PI * Number(radius) ** 2).toFixed(4) }) },
  trianglearea: { label: "Triangle Area Calculator", run: ({ base, height }) => ({ result: (Number(base) * Number(height)) / 2 }) },
  loanpayment: { label: "Loan Payment Calculator", run: ({ principal, rate, months }) => { const r = Number(rate) / 100 / 12; const m = Number(months); const p = Number(principal); const pay = r === 0 ? p / m : (p * r) / (1 - Math.pow(1 + r, -m)); return { monthlyPayment: +pay.toFixed(2) }; } },
  discount: { label: "Discount Calculator", run: ({ price, percent }) => { const d = Number(price) * (Number(percent) / 100); return { discount: +d.toFixed(2), finalPrice: +(Number(price) - d).toFixed(2) }; } },
  tipcalculator: { label: "Tip Calculator", run: ({ bill, percent, people = 1 }) => { const tip = Number(bill) * (Number(percent) / 100); const total = Number(bill) + tip; return { tip: +tip.toFixed(2), total: +total.toFixed(2), perPerson: +(total / Number(people)).toFixed(2) }; } },
  average: { label: "Average Calculator", run: ({ values }) => { const arr = String(values).split(",").map(Number).filter((n) => !isNaN(n)); return { result: +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(4) }; } },
};

// --- 4. SEO Utility Engine ---------------------------------------------------

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const matches = w.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export const SEO_OPS: Record<string, { label: string; run: (p: Record<string, string>) => unknown }> = {
  slugify: { label: "Slug Generator", run: ({ text }) => ({ slug: text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }) },
  metatitlecheck: { label: "Meta Title Length Checker", run: ({ title }) => ({ length: title.length, status: title.length >= 50 && title.length <= 60 ? "optimal" : title.length < 50 ? "too short" : "too long" }) },
  metadescriptioncheck: { label: "Meta Description Checker", run: ({ description }) => ({ length: description.length, status: description.length >= 150 && description.length <= 160 ? "optimal" : description.length < 150 ? "too short" : "too long" }) },
  keyworddensity: { label: "Keyword Density Checker", run: ({ text, keyword }) => { const words = text.toLowerCase().split(/\s+/).filter(Boolean); const kw = keyword.toLowerCase(); const count = words.filter((w) => w === kw).length; return { count, density: words.length ? +((count / words.length) * 100).toFixed(2) : 0 }; } },
  wordcounter: { label: "SEO Word Counter", run: ({ text }) => ({ words: text.trim() ? text.trim().split(/\s+/).length : 0, characters: text.length }) },
  readabilityscore: { label: "Flesch Readability Score", run: ({ text }) => { const sentences = Math.max(1, (text.match(/[.!?]+/g) || []).length); const words = text.trim().split(/\s+/).filter(Boolean); const wc = Math.max(1, words.length); const syllables = words.reduce((a, w) => a + countSyllables(w), 0); const score = 206.835 - 1.015 * (wc / sentences) - 84.6 * (syllables / wc); const lvl = score > 90 ? "Very Easy" : score > 60 ? "Standard" : score > 30 ? "Difficult" : "Very Confusing"; return { score: +score.toFixed(2), level: lvl }; } },
};

// --- 5. Unified Dispatcher ---------------------------------------------------

export type EngineCategory = "convert" | "text" | "math" | "seo";

export function runEngine(category: EngineCategory, opId: string, payload: Record<string, unknown>): { result?: unknown; error?: string } {
  try {
    if (category === "convert") {
      const { family, from, to, value } = payload as { family: string; from: string; to: string; value: number | string };
      return { result: convertUnit(family, from, to, Number(value)) };
    }

    const registry = category === "text" ? TEXT_OPS : category === "math" ? MATH_OPS : SEO_OPS;
    const op = registry[opId];
    if (!op) return { error: "Unknown operation" };

    if (category === "text") {
      const input = sanitizeInput((payload as { input?: string }).input ?? "", 20000);
      return { result: op.run(input as never) };
    }

    const safePayload = sanitizeDeep(payload) as Record<string, string>;
    return { result: op.run(safePayload as never) };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Engine execution failed";
    return { error: msg };
  }
}
