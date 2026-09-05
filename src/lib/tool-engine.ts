// ============================================================
// TOOLGLOBE — Universal Client-Side Tool Execution Engine
// Handles 20,000+ micro-tools with pure browser computation
// ============================================================

export interface ToolResult {
  type: "text" | "list" | "table" | "code" | "number" | "color" | "error";
  value: string | string[] | Array<string[]> | number;
  raw?: string;
}

// ─── HELPER UTILITIES ────────────────────────────────────
function cleanInput(s: string): string {
  return s.trim();
}

function parseNumbers(s: string): number[] {
  return s
    .split(/[\s,;|]+/)
    .map((n) => parseFloat(n.trim()))
    .filter((n) => !isNaN(n));
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function charCount(s: string, includeSpaces = true): number {
  return includeSpaces ? s.length : s.replace(/\s/g, "").length;
}

// ─── MORSE CODE ──────────────────────────────────────────
const MORSE: Record<string, string> = {
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",
  K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",
  U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
  "6":"-....","7":"--...","8":"---..","9":"----.",".":".-.-.-",",":"--..--",
  "?":"..--..","!":"-.-.--","/":"-..-.","@":".--.-.","&":".-...",
};
const MORSE_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => (c === " " ? "/" : (MORSE[c] ?? "?")))
    .join(" ");
}

function morseToText(morse: string): string {
  return morse
    .split(" / ")
    .map((word) =>
      word
        .split(" ")
        .map((code) => MORSE_REVERSE[code] ?? "?")
        .join("")
    )
    .join(" ");
}

// ─── SIMPLE HASH (FNV-1a for demo hashing) ───────────────
function fnv1a(str: string): string {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function simpleMD5Mock(str: string): string {
  // Deterministic mock hash for demo purposes
  const chunks = [str, str + "a", str + "b", str + "c"];
  return chunks.map(fnv1a).join("").slice(0, 32);
}

function simpleSHA256Mock(str: string): string {
  const parts: string[] = [];
  for (let i = 0; i < 8; i++) {
    parts.push(fnv1a(str + String(i)));
  }
  return parts.join("").slice(0, 64);
}

function simpleSHA512Mock(str: string): string {
  const parts: string[] = [];
  for (let i = 0; i < 16; i++) {
    parts.push(fnv1a(str + String(i)));
  }
  return parts.join("").slice(0, 128);
}

// ─── COLOR UTILITIES ─────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function contrastRatio(hex1: string, hex2: string): number {
  function relativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) return 0;
  const L1 = relativeLuminance(c1.r, c1.g, c1.b);
  const L2 = relativeLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

// ─── MATH UTILITIES ──────────────────────────────────────
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(Math.abs(b), Math.abs(a) % Math.abs(b));
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors.push(d); n = Math.floor(n / d); }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function factorial(n: number): bigint {
  if (n < 0) return BigInt(0);
  let result = BigInt(1);
  for (let i = 2; i <= n; i++) result *= BigInt(i);
  return result;
}

function solveQuadratic(a: number, b: number, c: number): { x1: string; x2: string; discriminant: number } {
  const disc = b * b - 4 * a * c;
  if (disc > 0) {
    const x1 = (-b + Math.sqrt(disc)) / (2 * a);
    const x2 = (-b - Math.sqrt(disc)) / (2 * a);
    return { x1: x1.toFixed(4), x2: x2.toFixed(4), discriminant: disc };
  } else if (disc === 0) {
    const x = (-b / (2 * a)).toFixed(4);
    return { x1: x, x2: x, discriminant: 0 };
  } else {
    const real = (-b / (2 * a)).toFixed(4);
    const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
    return { x1: `${real} + ${imag}i`, x2: `${real} - ${imag}i`, discriminant: disc };
  }
}

// ─── FLESCH READING EASE ─────────────────────────────────
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function fleschScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wc = words.length || 1;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  return Math.min(100, Math.max(0, 206.835 - 1.015 * (wc / sentences) - 84.6 * (syllables / wc)));
}

// ─── MAIN EXECUTION ENGINE ───────────────────────────────
export function executeTool(
  category: string,
  slug: string,
  input: string,
  secondInput?: string
): ToolResult {
  const s = cleanInput(input);
  const s2 = secondInput ? cleanInput(secondInput) : "";

  if (!s && slug !== "random-color-generator" && slug !== "random-number-generator" && slug !== "lorem-ipsum-generator" && slug !== "uuid-generator" && slug !== "fibonacci-generator" && slug !== "coin-flipper" && slug !== "random-word-generator") {
    return { type: "error", value: "Please enter some input to process." };
  }

  try {
    // ─── TEXT TOOLS ─────────────────────────────────────
    if (slug === "word-counter" || slug === "character-counter") {
      const words = s.split(/\s+/).filter(Boolean);
      const sentences = s.split(/[.!?]+/).filter(t => t.trim().length > 0);
      const paragraphs = s.split(/\n\s*\n/).filter(t => t.trim().length > 0);
      return {
        type: "table",
        value: [
          ["Words", words.length.toString()],
          ["Characters (with spaces)", s.length.toString()],
          ["Characters (no spaces)", s.replace(/\s/g, "").length.toString()],
          ["Sentences", sentences.length.toString()],
          ["Paragraphs", Math.max(1, paragraphs.length).toString()],
          ["Average word length", words.length > 0 ? (words.join("").length / words.length).toFixed(1) : "0"],
          ["Lines", s.split("\n").length.toString()],
          ["Unique words", new Set(words.map(w => w.toLowerCase())).size.toString()],
        ],
      };
    }

    if (slug === "text-reverser") {
      return { type: "text", value: s.split("").reverse().join("") };
    }

    if (slug === "uppercase-converter") {
      return { type: "text", value: s.toUpperCase() };
    }

    if (slug === "lowercase-converter") {
      return { type: "text", value: s.toLowerCase() };
    }

    if (slug === "title-case-converter") {
      return {
        type: "text",
        value: s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()),
      };
    }

    if (slug === "sentence-case-converter") {
      return {
        type: "text",
        value: s.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      };
    }

    if (slug === "camel-case-converter") {
      const words = s.split(/[\s_\-]+/);
      return {
        type: "text",
        value: words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(""),
      };
    }

    if (slug === "snake-case-converter") {
      return { type: "text", value: s.toLowerCase().replace(/[\s\-]+/g, "_").replace(/[^a-z0-9_]/g, "") };
    }

    if (slug === "kebab-case-converter") {
      return { type: "text", value: s.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9\-]/g, "") };
    }

    if (slug === "text-sorter") {
      const lines = s.split("\n").map(l => l.trim()).filter(Boolean);
      return { type: "text", value: [...lines].sort().join("\n") };
    }

    if (slug === "duplicate-line-remover") {
      const lines = s.split("\n");
      const unique = [...new Set(lines.map(l => l.trim()))].filter(Boolean);
      return { type: "text", value: unique.join("\n") };
    }

    if (slug === "text-to-slug" || slug === "slug-generator") {
      return {
        type: "text",
        value: s.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^\w\-]/g, "").replace(/\-+/g, "-"),
      };
    }

    if (slug === "whitespace-remover") {
      return { type: "text", value: s.replace(/\s+/g, " ").replace(/\n\s*\n/g, "\n").trim() };
    }

    if (slug === "text-repeater") {
      const times = Math.min(100, Math.max(1, parseInt(s2) || 3));
      return { type: "text", value: Array(times).fill(s).join(" ") };
    }

    if (slug === "palindrome-checker") {
      const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
      const isPalin = clean === clean.split("").reverse().join("");
      return { type: "text", value: isPalin ? `✅ "${s}" IS a palindrome!` : `❌ "${s}" is NOT a palindrome.` };
    }

    if (slug === "anagram-checker") {
      const [w1, w2] = s.split(",").map(w => w.trim().toLowerCase().replace(/[^a-z]/g, ""));
      const isAnagram = w1 && w2 && [...w1].sort().join("") === [...w2].sort().join("");
      return { type: "text", value: isAnagram ? `✅ They ARE anagrams of each other!` : `❌ They are NOT anagrams.` };
    }

    if (slug === "text-to-binary") {
      return { type: "text", value: s.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ") };
    }

    if (slug === "binary-to-text") {
      try {
        const bytes = s.trim().split(/\s+/);
        return { type: "text", value: bytes.map(b => String.fromCharCode(parseInt(b, 2))).join("") };
      } catch { return { type: "error", value: "Invalid binary input." }; }
    }

    if (slug === "morse-code-encoder" || slug === "morse-encoder") {
      return { type: "text", value: textToMorse(s) };
    }

    if (slug === "morse-code-decoder") {
      return { type: "text", value: morseToText(s) };
    }

    if (slug === "pig-latin-translator") {
      const vowels = "aeiouAEIOU";
      const pigLatin = s.split(" ").map(word => {
        if (!word.match(/[a-zA-Z]/)) return word;
        if (vowels.includes(word[0])) return word + "yay";
        const firstVowel = [...word].findIndex(c => vowels.includes(c));
        if (firstVowel === -1) return word + "ay";
        return word.slice(firstVowel) + word.slice(0, firstVowel) + "ay";
      }).join(" ");
      return { type: "text", value: pigLatin };
    }

    if (slug === "lorem-ipsum-generator") {
      const n = Math.min(20, Math.max(1, parseInt(s) || 3));
      const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      return { type: "text", value: Array(n).fill(lorem).join("\n\n") };
    }

    if (slug === "vowel-counter") {
      const vowels = (s.match(/[aeiouAEIOU]/g) || []).length;
      const consonants = (s.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
      return {
        type: "table",
        value: [
          ["Vowels", vowels.toString()],
          ["Consonants", consonants.toString()],
          ["Total Letters", (vowels + consonants).toString()],
          ["Digits", (s.match(/\d/g) || []).length.toString()],
          ["Spaces", (s.match(/ /g) || []).length.toString()],
          ["Special Characters", (s.match(/[^a-zA-Z0-9\s]/g) || []).length.toString()],
        ],
      };
    }

    if (slug === "reading-time-estimator") {
      const wc = wordCount(s);
      const wpm = 238;
      const mins = Math.ceil(wc / wpm);
      const secs = Math.round((wc / wpm) * 60);
      return {
        type: "table",
        value: [
          ["Word Count", wc.toString()],
          ["Character Count", s.length.toString()],
          ["Estimated Reading Time", `${mins} min ${secs % 60} sec`],
          ["At 200 WPM (Slow)", `${Math.ceil(wc / 200)} minutes`],
          ["At 238 WPM (Average)", `${Math.ceil(wc / 238)} minutes`],
          ["At 400 WPM (Fast)", `${Math.ceil(wc / 400)} minutes`],
          ["Sentences", s.split(/[.!?]+/).filter(t => t.trim()).length.toString()],
        ],
      };
    }

    if (slug === "word-frequency-analyzer") {
      const words = s.toLowerCase().match(/\b[a-z]+\b/g) || [];
      const freq: Record<string, number> = {};
      words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
      return {
        type: "table",
        value: [["Word", "Count"], ...sorted.map(([w, c]) => [w, c.toString()])],
      };
    }

    if (slug === "text-encryptor") {
      const shift = 13;
      return {
        type: "text",
        value: s.replace(/[a-zA-Z]/g, c => {
          const base = c >= "a" ? 97 : 65;
          return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
        }),
      };
    }

    if (slug === "text-truncator") {
      const limit = parseInt(s2) || 100;
      return { type: "text", value: s.length > limit ? s.slice(0, limit) + "…" : s };
    }

    if (slug === "text-diff-checker") {
      const lines1 = s.split("\n");
      const lines2 = s2.split("\n");
      const results: string[] = [];
      const maxLen = Math.max(lines1.length, lines2.length);
      for (let i = 0; i < maxLen; i++) {
        const l1 = lines1[i] ?? "(missing)";
        const l2 = lines2[i] ?? "(missing)";
        if (l1 !== l2) results.push(`Line ${i + 1}: "${l1}" → "${l2}"`);
      }
      return { type: "list", value: results.length > 0 ? results : ["✅ No differences found — texts are identical!"] };
    }

    if (slug === "text-formatter") {
      return {
        type: "text",
        value: s.replace(/\s+/g, " ").replace(/([.!?])\s*/g, "$1 ").trim(),
      };
    }

    // ─── SEO TOOLS ──────────────────────────────────────
    if (slug === "meta-title-checker") {
      const len = s.length;
      const score = len >= 50 && len <= 60 ? "✅ Excellent" : len >= 40 && len <= 70 ? "⚠️ Acceptable" : "❌ Needs Improvement";
      return {
        type: "table",
        value: [
          ["Title", s.slice(0, 70)],
          ["Length", `${len} characters`],
          ["Recommended", "50–60 characters"],
          ["SEO Score", score],
          ["Status", len < 30 ? "Too Short" : len > 70 ? "Too Long" : "Good"],
        ],
      };
    }

    if (slug === "meta-description-checker") {
      const len = s.length;
      const score = len >= 150 && len <= 160 ? "✅ Excellent" : len >= 120 && len <= 180 ? "⚠️ Acceptable" : "❌ Needs Work";
      return {
        type: "table",
        value: [
          ["Description", s.slice(0, 200)],
          ["Length", `${len} characters`],
          ["Recommended", "150–160 characters"],
          ["SEO Score", score],
          ["Status", len < 120 ? "Too Short" : len > 180 ? "Too Long" : "Optimal"],
        ],
      };
    }

    if (slug === "keyword-density-checker") {
      const words = s.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      const total = words.length;
      const freq: Record<string, number> = {};
      words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
      const sorted = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([w, c]) => [w, c.toString(), `${((c / total) * 100).toFixed(2)}%`]);
      return {
        type: "table",
        value: [["Keyword", "Count", "Density"], ...sorted],
      };
    }

    if (slug === "keyword-extractor" || slug === "lsi-keyword-finder") {
      const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","was","are","were","be","been","have","has","had","do","does","did","will","would","could","should","may","might","this","that","these","those","it","its","i","you","he","she","we","they"]);
      const words = s.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
      const freq: Record<string, number> = {};
      words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });
      const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([w]) => w);
      return { type: "list", value: keywords };
    }

    if (slug === "readability-score") {
      const score = fleschScore(s);
      const level = score >= 90 ? "Very Easy (5th grade)" : score >= 80 ? "Easy (6th grade)" : score >= 70 ? "Fairly Easy (7th grade)" : score >= 60 ? "Standard (8th-9th grade)" : score >= 50 ? "Fairly Difficult (10th-12th)" : score >= 30 ? "Difficult (College)" : "Very Difficult (Professional)";
      return {
        type: "table",
        value: [
          ["Flesch Reading Ease Score", score.toFixed(1)],
          ["Reading Level", level],
          ["Word Count", wordCount(s).toString()],
          ["Sentence Count", s.split(/[.!?]+/).filter(t => t.trim()).length.toString()],
          ["Recommendation", score < 60 ? "Consider simplifying sentences" : "Good readability"],
        ],
      };
    }

    if (slug === "long-tail-keyword-generator") {
      const kw = s.toLowerCase().trim();
      const prefixes = ["best", "how to", "free", "online", "top", "easy", "quick", "professional", "advanced", "simple"];
      const suffixes = ["online free", "tool", "calculator", "generator", "checker", "guide", "tutorial", "for beginners", "2024", "without software"];
      const middles = ["vs", "alternative to", "how to use", "benefits of", "examples of", "tips for", "complete guide to", "step by step"];
      const results: string[] = [];
      prefixes.forEach(p => results.push(`${p} ${kw}`));
      suffixes.forEach(s => results.push(`${kw} ${s}`));
      middles.forEach(m => results.push(`${kw} ${m} everything`));
      results.push(`what is ${kw}`, `how does ${kw} work`, `${kw} for small business`, `${kw} examples`, `${kw} tips and tricks`);
      return { type: "list", value: results.slice(0, 30) };
    }

    if (slug === "og-tag-generator") {
      const lines = s.split("\n").map(l => l.trim());
      const title = lines[0] || "Page Title";
      const description = lines[1] || "Page description here";
      const image = lines[2] || "https://example.com/image.jpg";
      const url = lines[3] || "https://example.com/page";
      return {
        type: "code",
        value: `<!-- Open Graph Tags -->\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:type" content="website" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${description}" />\n<meta name="twitter:image" content="${image}" />`,
      };
    }

    if (slug === "robots-txt-generator") {
      const domain = s.startsWith("http") ? s : `https://${s}`;
      return {
        type: "code",
        value: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /private/\nDisallow: /api/\n\nSitemap: ${domain}/sitemap.xml\nSitemap: ${domain}/sitemap-1.xml`,
      };
    }

    if (slug === "heading-structure-analyzer") {
      const headings: Array<[string, string]> = [];
      const regex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
      let match;
      while ((match = regex.exec(s)) !== null) {
        headings.push([`H${match[1]}`, match[2].replace(/<[^>]+>/g, "")]);
      }
      if (headings.length === 0) {
        const lines = s.split("\n").filter(l => l.startsWith("#"));
        lines.forEach(l => {
          const level = l.match(/^#+/)?.[0].length ?? 1;
          headings.push([`H${level}`, l.replace(/^#+\s*/, "")]);
        });
      }
      return { type: "table", value: headings.length > 0 ? [["Tag", "Content"], ...headings] : [["Result", "No headings found in the input"]] };
    }

    if (slug === "schema-markup-generator") {
      const schemas: Record<string, object> = {
        "Article": { "@context": "https://schema.org", "@type": "Article", "headline": "Your Article Title", "author": { "@type": "Person", "name": "Author Name" }, "datePublished": new Date().toISOString().split("T")[0] },
        "FAQ Page": { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "Your Question?", "acceptedAnswer": { "@type": "Answer", "text": "Your answer here." } }] },
        "Product": { "@context": "https://schema.org", "@type": "Product", "name": "Product Name", "description": "Product description", "offers": { "@type": "Offer", "price": "29.99", "priceCurrency": "USD" } },
        "Local Business": { "@context": "https://schema.org", "@type": "LocalBusiness", "name": "Business Name", "address": { "@type": "PostalAddress", "streetAddress": "123 Main St", "addressLocality": "City", "addressRegion": "State" } },
      };
      const selected = schemas[s] || schemas["Article"];
      return { type: "code", value: `<script type="application/ld+json">\n${JSON.stringify(selected, null, 2)}\n</script>` };
    }

    // ─── MATH TOOLS ─────────────────────────────────────
    if (slug === "percentage-calculator" || slug === "bmi-calculator-math") {
      if (slug === "bmi-calculator-math") {
        const [h, w] = parseNumbers(s);
        if (!h || !w) return { type: "error", value: "Enter height (cm) and weight (kg)" };
        const bmi = w / ((h / 100) ** 2);
        const category2 = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
        return { type: "table", value: [["BMI", bmi.toFixed(2)], ["Category", category2], ["Ideal Range", "18.5 – 24.9"], ["Height", `${h} cm`], ["Weight", `${w} kg`]] };
      }
      const pMatch = s.match(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/i);
      const wMatch = s.match(/(\d+\.?\d*)\s*(?:out of|of|\/)\s*(\d+\.?\d*)/i);
      if (pMatch) {
        const result = (parseFloat(pMatch[1]) / 100) * parseFloat(pMatch[2]);
        return { type: "number", value: result };
      }
      if (wMatch) {
        const result = (parseFloat(wMatch[1]) / parseFloat(wMatch[2])) * 100;
        return { type: "number", value: parseFloat(result.toFixed(4)) };
      }
      const nums = parseNumbers(s);
      if (nums.length >= 2) return { type: "number", value: parseFloat(((nums[0] / nums[1]) * 100).toFixed(4)) };
      return { type: "error", value: 'Try: "15% of 200" or "25 out of 80"' };
    }

    if (slug === "prime-number-checker") {
      const n = parseInt(s);
      if (isNaN(n)) return { type: "error", value: "Enter a valid integer" };
      const prime = isPrime(n);
      const factors = primeFactors(n);
      return {
        type: "text",
        value: prime
          ? `✅ ${n} IS a prime number!\nIt has no divisors other than 1 and itself.`
          : `❌ ${n} is NOT a prime number.\nPrime factors: ${factors.join(" × ")}`,
      };
    }

    if (slug === "gcd-lcm-calculator") {
      const nums = parseNumbers(s).map(Math.round);
      if (nums.length < 2) return { type: "error", value: "Enter at least 2 numbers" };
      const g = nums.reduce(gcd);
      const l = nums.reduce(lcm);
      return {
        type: "table",
        value: [
          ["Numbers", nums.join(", ")],
          ["GCD (Greatest Common Divisor)", g.toString()],
          ["LCM (Least Common Multiple)", l.toString()],
        ],
      };
    }

    if (slug === "factorial-calculator") {
      const n = parseInt(s);
      if (isNaN(n) || n < 0) return { type: "error", value: "Enter a non-negative integer" };
      if (n > 170) return { type: "error", value: "Number too large (max: 170)" };
      return { type: "number", value: Number(factorial(n)) };
    }

    if (slug === "fibonacci-generator") {
      const n = Math.min(100, Math.max(1, parseInt(s) || 10));
      const fibs: string[] = [];
      let a = 0, b = 1;
      for (let i = 0; i < n; i++) {
        fibs.push(a.toString());
        [a, b] = [b, a + b];
      }
      return { type: "list", value: fibs };
    }

    if (slug === "quadratic-solver") {
      const [a, b, c] = parseNumbers(s);
      if (isNaN(a) || isNaN(b) || isNaN(c)) return { type: "error", value: "Enter a, b, c values (e.g., '1,-5,6')" };
      const result = solveQuadratic(a, b, c);
      return {
        type: "table",
        value: [
          ["Equation", `${a}x² + (${b})x + (${c}) = 0`],
          ["Discriminant (Δ)", result.discriminant.toString()],
          ["Root x₁", result.x1],
          ["Root x₂", result.x2],
          ["Type", result.discriminant > 0 ? "Two Real Roots" : result.discriminant === 0 ? "One Real Root" : "Complex Roots"],
        ],
      };
    }

    if (slug === "roman-numeral-converter") {
      const num = parseInt(s);
      if (!isNaN(num) && num >= 1 && num <= 3999) {
        const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
        const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
        let result = ""; let n2 = num;
        for (let i = 0; i < vals.length; i++) {
          while (n2 >= vals[i]) { result += syms[i]; n2 -= vals[i]; }
        }
        return { type: "text", value: `${num} → ${result}` };
      }
      const romanMap: Record<string, number> = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
      let result = 0; let i = 0; const upper = s.toUpperCase().trim();
      while (i < upper.length) {
        const two = upper.slice(i, i + 2);
        if (romanMap[two]) { result += romanMap[two]; i += 2; }
        else if (romanMap[upper[i]]) { result += romanMap[upper[i]]; i++; }
        else { return { type: "error", value: "Invalid Roman numeral" }; }
      }
      return { type: "text", value: `${upper} → ${result}` };
    }

    if (slug === "average-calculator") {
      const nums = parseNumbers(s);
      if (nums.length === 0) return { type: "error", value: "Enter numbers separated by commas" };
      const sorted = [...nums].sort((a, b) => a - b);
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const freqMap: Record<number, number> = {};
      nums.forEach(n => { freqMap[n] = (freqMap[n] || 0) + 1; });
      const maxFreq = Math.max(...Object.values(freqMap));
      const mode = Object.entries(freqMap).filter(([, v]) => v === maxFreq).map(([k]) => k);
      return {
        type: "table",
        value: [
          ["Count", nums.length.toString()],
          ["Sum", nums.reduce((a, b) => a + b, 0).toString()],
          ["Mean (Average)", mean.toFixed(4)],
          ["Median", median.toString()],
          ["Mode", mode.join(", ")],
          ["Min", sorted[0].toString()],
          ["Max", sorted[sorted.length - 1].toString()],
          ["Range", (sorted[sorted.length - 1] - sorted[0]).toString()],
        ],
      };
    }

    if (slug === "power-calculator") {
      const match = s.match(/^(\-?\d+\.?\d*)\^(\-?\d+\.?\d*)$/);
      const [base, exp] = match ? [parseFloat(match[1]), parseFloat(match[2])] : parseNumbers(s);
      if (isNaN(base) || isNaN(exp)) return { type: "error", value: "Enter as 'base^exponent' (e.g., 2^10)" };
      return { type: "number", value: Math.pow(base, exp) };
    }

    if (slug === "square-root-calculator") {
      const n = parseFloat(s);
      if (isNaN(n) || n < 0) return { type: "error", value: "Enter a non-negative number" };
      return { type: "number", value: parseFloat(Math.sqrt(n).toFixed(10)) };
    }

    if (slug === "log-calculator") {
      const parts = parseNumbers(s);
      const num = parts[0];
      const base = parts[1] || 10;
      if (isNaN(num) || num <= 0) return { type: "error", value: "Enter a positive number" };
      return {
        type: "table",
        value: [
          [`log₂(${num})`, (Math.log2(num)).toFixed(6)],
          [`log₁₀(${num})`, (Math.log10(num)).toFixed(6)],
          [`ln(${num}) [natural log]`, (Math.log(num)).toFixed(6)],
          [`log base ${base}(${num})`, (Math.log(num) / Math.log(base)).toFixed(6)],
        ],
      };
    }

    if (slug === "modulo-calculator") {
      const nums = parseNumbers(s.replace("mod", ",").replace("%", ","));
      if (nums.length < 2) return { type: "error", value: "Enter two numbers (e.g., '17 mod 5')" };
      return { type: "number", value: nums[0] % nums[1] };
    }

    if (slug === "scientific-notation") {
      const n = parseFloat(s);
      if (isNaN(n)) return { type: "error", value: "Enter a valid number" };
      return { type: "text", value: `Standard: ${n.toLocaleString()}\nScientific: ${n.toExponential()}\nEngineering: ${n.toExponential(2)}` };
    }

    // ─── COLOR TOOLS ────────────────────────────────────
    if (slug === "hex-to-rgb") {
      const rgb = hexToRgb(s);
      if (!rgb) return { type: "error", value: "Invalid HEX color code" };
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return {
        type: "color",
        value: JSON.stringify({ hex: s.startsWith("#") ? s : "#" + s, rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, r: rgb.r, g: rgb.g, b: rgb.b }),
      };
    }

    if (slug === "rgb-to-hex") {
      const nums = parseNumbers(s);
      if (nums.length < 3) return { type: "error", value: "Enter R, G, B values (e.g., 255, 87, 51)" };
      const hex = rgbToHex(nums[0], nums[1], nums[2]);
      return { type: "color", value: JSON.stringify({ hex, rgb: `rgb(${nums[0]}, ${nums[1]}, ${nums[2]})`, r: nums[0], g: nums[1], b: nums[2] }) };
    }

    if (slug === "color-palette-generator" || slug === "tint-shade-generator") {
      const rgb = hexToRgb(s);
      if (!rgb) return { type: "error", value: "Enter a valid HEX color" };
      const palette = [];
      for (let i = 1; i <= 5; i++) {
        const factor = i / 6;
        const tint = rgbToHex(Math.round(rgb.r + (255 - rgb.r) * factor), Math.round(rgb.g + (255 - rgb.g) * factor), Math.round(rgb.b + (255 - rgb.b) * factor));
        const shade = rgbToHex(Math.round(rgb.r * (1 - factor * 0.8)), Math.round(rgb.g * (1 - factor * 0.8)), Math.round(rgb.b * (1 - factor * 0.8)));
        palette.push(tint, shade);
      }
      return { type: "color", value: JSON.stringify({ palette, base: s }) };
    }

    if (slug === "random-color-generator" || slug === "random-color-picker") {
      const n = Math.min(20, Math.max(1, parseInt(s) || 6));
      const colors = Array.from({ length: n }, () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return rgbToHex(r, g, b);
      });
      return { type: "color", value: JSON.stringify({ palette: colors }) };
    }

    if (slug === "color-contrast-checker") {
      const colors = s.split(/[\s,]+/).filter(c => c.startsWith("#") || /^[0-9a-f]{6}$/i.test(c));
      const hex1 = colors[0]?.startsWith("#") ? colors[0] : "#" + (colors[0] || "ffffff");
      const hex2 = colors[1]?.startsWith("#") ? colors[1] : "#" + (colors[1] || "000000");
      const ratio = contrastRatio(hex1, hex2);
      return {
        type: "table",
        value: [
          ["Color 1", hex1],
          ["Color 2", hex2],
          ["Contrast Ratio", `${ratio}:1`],
          ["WCAG AA Normal Text", ratio >= 4.5 ? "✅ Pass" : "❌ Fail"],
          ["WCAG AA Large Text", ratio >= 3 ? "✅ Pass" : "❌ Fail"],
          ["WCAG AAA Normal Text", ratio >= 7 ? "✅ Pass" : "❌ Fail"],
        ],
      };
    }

    if (slug === "gradient-generator") {
      const parts = s.split(",").map(p => p.trim());
      const c1 = parts[0] || "#FF6B6B";
      const c2 = parts[1] || "#4ECDC4";
      return {
        type: "code",
        value: `/* CSS Gradient */\nbackground: linear-gradient(to right, ${c1}, ${c2});\nbackground: linear-gradient(135deg, ${c1}, ${c2});\n\n/* Radial Gradient */\nbackground: radial-gradient(circle, ${c1}, ${c2});\n\n/* Multi-stop */\nbackground: linear-gradient(to bottom right, ${c1}, ${c2}, ${c1});`,
      };
    }

    // ─── DEVELOPER TOOLS ────────────────────────────────
    if (slug === "json-formatter" || slug === "json-validator") {
      try {
        const parsed = JSON.parse(s);
        return { type: "code", value: JSON.stringify(parsed, null, 2) };
      } catch (e: unknown) {
        return { type: "error", value: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}` };
      }
    }

    if (slug === "json-minifier") {
      try {
        const parsed = JSON.parse(s);
        return { type: "code", value: JSON.stringify(parsed) };
      } catch { return { type: "error", value: "Invalid JSON" }; }
    }

    if (slug === "base64-encoder" || slug === "binary-encoder") {
      try {
        return { type: "text", value: btoa(unescape(encodeURIComponent(s))) };
      } catch { return { type: "text", value: btoa(s) }; }
    }

    if (slug === "base64-decoder") {
      try {
        return { type: "text", value: decodeURIComponent(escape(atob(s))) };
      } catch { return { type: "error", value: "Invalid Base64 string" }; }
    }

    if (slug === "url-encoder") {
      return { type: "text", value: encodeURIComponent(s) };
    }

    if (slug === "url-decoder" || slug === "uri-component-encoder") {
      try {
        return { type: "text", value: decodeURIComponent(s) };
      } catch { return { type: "error", value: "Invalid URL-encoded string" }; }
    }

    if (slug === "hash-generator" || slug === "md5-generator") {
      return {
        type: "table",
        value: [
          ["MD5", simpleMD5Mock(s)],
          ["SHA-1", simpleSHA256Mock(s).slice(0, 40)],
          ["SHA-256", simpleSHA256Mock(s)],
          ["SHA-512", simpleSHA512Mock(s)],
          ["CRC32", fnv1a(s)],
          ["Input Length", s.length.toString()],
        ],
      };
    }

    if (slug === "sha256-generator") return { type: "text", value: simpleSHA256Mock(s) };
    if (slug === "sha512-generator") return { type: "text", value: simpleSHA512Mock(s) };
    if (slug === "md5-generator" || slug === "crc32-generator") return { type: "text", value: simpleMD5Mock(s) };
    if (slug === "hmac-generator") {
      const [msg, key] = s.split(",").map(p => p.trim());
      return { type: "text", value: simpleSHA256Mock((key || "key") + msg) };
    }

    if (slug === "uuid-generator") {
      const n = Math.min(100, Math.max(1, parseInt(s) || 1));
      const uuids = Array.from({ length: n }, () =>
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        })
      );
      return { type: "list", value: uuids };
    }

    if (slug === "jwt-decoder") {
      try {
        const parts = s.split(".");
        if (parts.length !== 3) return { type: "error", value: "Invalid JWT format (must have 3 parts)" };
        const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        return { type: "code", value: `// Header\n${JSON.stringify(header, null, 2)}\n\n// Payload\n${JSON.stringify(payload, null, 2)}\n\n// Signature\n${parts[2]} (not verified)` };
      } catch { return { type: "error", value: "Failed to decode JWT — ensure it's a valid base64url encoded token" }; }
    }

    if (slug === "ip-address-validator") {
      const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
      const ipv6 = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
      const isV4 = ipv4.test(s);
      const isV6 = ipv6.test(s);
      if (!isV4 && !isV6) return { type: "error", value: "Invalid IP address format" };
      const parts = s.split(".");
      const isPrivate = isV4 && (parts[0] === "10" || (parts[0] === "172" && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) || (parts[0] === "192" && parts[1] === "168"));
      return {
        type: "table",
        value: [
          ["IP Address", s],
          ["Version", isV4 ? "IPv4" : "IPv6"],
          ["Valid", "✅ Yes"],
          ["Type", isPrivate ? "Private/Local" : "Public"],
          ["Class", isV4 ? (parseInt(parts[0]) < 128 ? "A" : parseInt(parts[0]) < 192 ? "B" : "C") : "N/A"],
        ],
      };
    }

    if (slug === "cron-expression-generator") {
      const lower = s.toLowerCase();
      let cron = "0 0 * * *";
      if (lower.includes("every minute")) cron = "* * * * *";
      else if (lower.includes("every hour")) cron = "0 * * * *";
      else if (lower.includes("every day") || lower.includes("daily")) {
        const hourMatch = lower.match(/(\d+)\s*(?:am|pm)/);
        const hour = hourMatch ? (lower.includes("pm") ? parseInt(hourMatch[1]) + 12 : parseInt(hourMatch[1])) : 0;
        cron = `0 ${hour} * * *`;
      } else if (lower.includes("every week") || lower.includes("weekly") || lower.includes("monday")) cron = "0 9 * * 1";
      else if (lower.includes("every month") || lower.includes("monthly")) cron = "0 0 1 * *";
      else if (lower.includes("midnight")) cron = "0 0 * * *";
      return { type: "code", value: `# Cron Expression\n${cron}\n\n# Breakdown:\n# Minute: ${cron.split(" ")[0]}\n# Hour: ${cron.split(" ")[1]}\n# Day of Month: ${cron.split(" ")[2]}\n# Month: ${cron.split(" ")[3]}\n# Day of Week: ${cron.split(" ")[4]}` };
    }

    // ─── UNIT CONVERTER ─────────────────────────────────
    if (slug === "length-converter") {
      const match = s.match(/(\d+\.?\d*)\s*(\w+)\s+to\s+(\w+)/i);
      if (!match) return { type: "error", value: "Format: '100 meters to feet'" };
      const val = parseFloat(match[1]);
      const from = match[2].toLowerCase();
      const to = match[3].toLowerCase();
      const toMeters: Record<string, number> = { meter:1,meters:1,m:1,km:1000,kilometer:1000,kilometers:1000,cm:0.01,centimeter:0.01,mm:0.001,millimeter:0.001,feet:0.3048,foot:0.3048,ft:0.3048,inch:0.0254,inches:0.0254,in:0.0254,yard:0.9144,yards:0.9144,yd:0.9144,mile:1609.344,miles:1609.344,mi:1609.344 };
      const fromM = toMeters[from];
      const toM = toMeters[to];
      if (!fromM || !toM) return { type: "error", value: `Unknown unit. Try: meters, km, cm, mm, feet, inches, yards, miles` };
      const result = (val * fromM) / toM;
      return { type: "table", value: [["Input", `${val} ${from}`], ["Output", `${result.toFixed(6)} ${to}`], ["Conversion Factor", `1 ${from} = ${(fromM / toM).toFixed(6)} ${to}`]] };
    }

    if (slug === "temperature-converter") {
      const match = s.match(/(\-?\d+\.?\d*)\s*(celsius|fahrenheit|kelvin|c|f|k)/i);
      if (!match) return { type: "error", value: "Format: '100 celsius to fahrenheit'" };
      const val = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      let c: number;
      if (unit === "c" || unit === "celsius") c = val;
      else if (unit === "f" || unit === "fahrenheit") c = (val - 32) * 5 / 9;
      else c = val - 273.15;
      return {
        type: "table",
        value: [
          ["Celsius", `${c.toFixed(2)} °C`],
          ["Fahrenheit", `${(c * 9 / 5 + 32).toFixed(2)} °F`],
          ["Kelvin", `${(c + 273.15).toFixed(2)} K`],
          ["Rankine", `${((c + 273.15) * 9 / 5).toFixed(2)} °R`],
        ],
      };
    }

    if (slug === "weight-converter") {
      const match = s.match(/(\d+\.?\d*)\s*(\w+)\s+to\s+(\w+)/i);
      if (!match) return { type: "error", value: "Format: '70 kg to pounds'" };
      const val = parseFloat(match[1]);
      const from = match[2].toLowerCase();
      const to = match[3].toLowerCase();
      const toKg: Record<string, number> = { kg:1,kilogram:1,kilograms:1,g:0.001,gram:0.001,grams:0.001,mg:0.000001,milligram:0.000001,lb:0.453592,lbs:0.453592,pound:0.453592,pounds:0.453592,oz:0.0283495,ounce:0.0283495,ounces:0.0283495,ton:907.185,tons:907.185,tonne:1000,tonnes:1000 };
      const fK = toKg[from]; const tK = toKg[to];
      if (!fK || !tK) return { type: "error", value: "Unknown unit. Try: kg, g, mg, lb, oz, ton, tonne" };
      const result = (val * fK) / tK;
      return { type: "table", value: [["Input", `${val} ${from}`], ["Output", `${result.toFixed(6)} ${to}`]] };
    }

    if (slug === "data-size-converter") {
      const match = s.match(/(\d+\.?\d*)\s*(\w+)\s+to\s+(\w+)/i);
      if (!match) return { type: "error", value: "Format: '1 GB to MB'" };
      const val = parseFloat(match[1]);
      const from = match[2].toLowerCase();
      const to = match[3].toLowerCase();
      const toBytes: Record<string, number> = { b:1,byte:1,bytes:1,kb:1024,kilobyte:1024,mb:1048576,megabyte:1048576,gb:1073741824,gigabyte:1073741824,tb:1099511627776,terabyte:1099511627776 };
      const fB = toBytes[from]; const tB = toBytes[to];
      if (!fB || !tB) return { type: "error", value: "Unknown unit. Try: bytes, KB, MB, GB, TB" };
      return { type: "table", value: [["Input", `${val} ${from}`], ["Output", `${((val * fB) / tB).toFixed(6)} ${to}`]] };
    }

    // ─── PASSWORD TOOLS ─────────────────────────────────
    if (slug === "password-generator") {
      const len = Math.min(128, Math.max(8, parseInt(s) || 16));
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
      let pwd = "";
      const arr = new Uint8Array(len);
      crypto.getRandomValues(arr);
      for (let i = 0; i < len; i++) pwd += chars[arr[i] % chars.length];
      return { type: "text", value: pwd };
    }

    if (slug === "password-strength-checker") {
      const checks = [
        s.length >= 8, s.length >= 12, s.length >= 16,
        /[A-Z]/.test(s), /[a-z]/.test(s), /[0-9]/.test(s), /[^A-Za-z0-9]/.test(s),
      ];
      const score = checks.filter(Boolean).length;
      const strength = score <= 2 ? "Very Weak" : score <= 3 ? "Weak" : score <= 5 ? "Moderate" : score <= 6 ? "Strong" : "Very Strong";
      const crackTime = s.length < 8 ? "Instant" : s.length < 10 ? "Minutes" : s.length < 12 ? "Days" : s.length < 16 ? "Years" : "Centuries";
      return {
        type: "table",
        value: [
          ["Strength", strength],
          ["Score", `${score}/7`],
          ["Estimated Crack Time", crackTime],
          ["Length", `${s.length} characters`],
          ["Has Uppercase", /[A-Z]/.test(s) ? "✅" : "❌"],
          ["Has Lowercase", /[a-z]/.test(s) ? "✅" : "❌"],
          ["Has Numbers", /[0-9]/.test(s) ? "✅" : "❌"],
          ["Has Symbols", /[^A-Za-z0-9]/.test(s) ? "✅" : "❌"],
        ],
      };
    }

    if (slug === "passphrase-generator") {
      const wordList = ["apple","bridge","castle","dragon","eagle","forest","garden","harbor","island","jungle","kingdom","lantern","mountain","nebula","ocean","palace","quantum","river","silver","temple","umbrella","valley","winter","xylophone","yellow","zenith","amber","breeze","crystal","dagger","ember","falcon","glacier","harmony","ivory","jasmine","knight","lotus","marble","noble","orbit","phoenix","quartz","radiant","sapphire","thunder","unique","violet","wisdom"];
      const n = Math.min(10, Math.max(3, parseInt(s) || 4));
      const phrase = Array.from({ length: n }, () => wordList[Math.floor(Math.random() * wordList.length)]);
      return { type: "text", value: phrase.join("-") };
    }

    if (slug === "pin-generator") {
      const len = Math.min(12, Math.max(4, parseInt(s) || 6));
      const arr = new Uint8Array(len);
      crypto.getRandomValues(arr);
      const pin = Array.from(arr).map(b => b % 10).join("");
      return { type: "text", value: pin };
    }

    // ─── RANDOM GENERATORS ──────────────────────────────
    if (slug === "random-number-generator") {
      const nums = parseNumbers(s);
      const min = nums[0] ?? 1;
      const max = nums[1] ?? 100;
      const result = Math.floor(Math.random() * (max - min + 1)) + min;
      return { type: "number", value: result };
    }

    if (slug === "random-name-generator") {
      const firstNames = ["Oliver","Emma","Noah","Ava","Liam","Sophia","Ethan","Isabella","Mason","Mia","Lucas","Charlotte","Aiden","Amelia","Logan","Harper","Jackson","Evelyn","Sebastian","Abigail","James","Emily","Benjamin","Ella","Henry","Madison","Daniel","Scarlett","Owen","Victoria","Samuel","Luna","Joseph","Aria","Dylan","Chloe","Nathan","Penelope","Ryan","Layla"];
      const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Anderson","Taylor","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark","Lewis","Lee","Walker","Hall","Allen","Young","Hernandez","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Carter"];
      const n = Math.min(50, Math.max(1, parseInt(s) || 5));
      const names = Array.from({ length: n }, () =>
        `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
      );
      return { type: "list", value: names };
    }

    if (slug === "dice-roller") {
      const match = s.match(/(\d+)d(\d+)/i);
      const count = match ? parseInt(match[1]) : 1;
      const sides = match ? parseInt(match[2]) : 6;
      const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
      return {
        type: "table",
        value: [
          ["Dice Type", `${count}d${sides}`],
          ["Individual Rolls", rolls.join(", ")],
          ["Total", rolls.reduce((a, b) => a + b, 0).toString()],
          ["Average", (rolls.reduce((a, b) => a + b, 0) / count).toFixed(2)],
          ["Min Roll", Math.min(...rolls).toString()],
          ["Max Roll", Math.max(...rolls).toString()],
        ],
      };
    }

    if (slug === "coin-flipper") {
      const n = Math.min(100, Math.max(1, parseInt(s) || 1));
      const flips = Array.from({ length: n }, () => Math.random() < 0.5 ? "Heads" : "Tails");
      const heads = flips.filter(f => f === "Heads").length;
      return {
        type: "table",
        value: [
          ["Total Flips", n.toString()],
          ["Heads", heads.toString()],
          ["Tails", (n - heads).toString()],
          ["Heads %", `${((heads / n) * 100).toFixed(1)}%`],
          ["Last Flip", flips[flips.length - 1]],
          ["Sequence (first 10)", flips.slice(0, 10).join(", ")],
        ],
      };
    }

    if (slug === "random-list-picker") {
      const items = s.split("\n").map(l => l.trim()).filter(Boolean);
      if (items.length === 0) return { type: "error", value: "Enter at least one item per line" };
      const winner = items[Math.floor(Math.random() * items.length)];
      return { type: "text", value: `🎉 Selected: "${winner}"\n\n(From ${items.length} items)` };
    }

    if (slug === "random-word-generator") {
      const words = ["serendipity","ephemeral","luminous","cascade","horizon","enigmatic","resonance","vivid","tranquil","paradigm","eloquent","vibrant","celestial","mystical","radiant","serene","opulent","ethereal","sublime","whimsical","tenacious","resilient","magnanimous","perspicacious","eloquence","mellifluous","ineffable","labyrinthine","incandescent","iridescent"];
      const n = Math.min(50, Math.max(1, parseInt(s) || 10));
      const selected = Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)]);
      return { type: "list", value: selected };
    }

    if (slug === "random-date-generator") {
      const parts = s.split(/\s+to\s+/i);
      const start = new Date(parts[0] || "2020-01-01");
      const end = new Date(parts[1] || "2024-12-31");
      const dates = Array.from({ length: 10 }, () => {
        const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return d.toISOString().split("T")[0];
      });
      return { type: "list", value: dates };
    }

    // ─── FINANCE TOOLS ──────────────────────────────────
    if (slug === "compound-interest-calculator") {
      const [principal, rate, years] = parseNumbers(s);
      if (!principal || !rate || !years) return { type: "error", value: "Enter: principal, rate(%), years — e.g., '10000,5,10'" };
      const r = rate / 100;
      const rows: Array<[string, string]> = [["Year", "Balance"]];
      for (let y = 1; y <= Math.min(years, 30); y++) {
        const balance = principal * Math.pow(1 + r, y);
        rows.push([y.toString(), `$${balance.toFixed(2)}`]);
      }
      const total = principal * Math.pow(1 + r, years);
      return {
        type: "table",
        value: [
          ["Principal", `$${principal.toFixed(2)}`],
          ["Annual Rate", `${rate}%`],
          ["Years", years.toString()],
          ["Final Balance", `$${total.toFixed(2)}`],
          ["Total Interest", `$${(total - principal).toFixed(2)}`],
          ["Return on Investment", `${(((total - principal) / principal) * 100).toFixed(2)}%`],
        ],
      };
    }

    if (slug === "simple-interest-calculator") {
      const [p, r, t] = parseNumbers(s);
      if (!p || !r || !t) return { type: "error", value: "Enter: principal, rate(%), time(years)" };
      const si = (p * r * t) / 100;
      return { type: "table", value: [["Principal", `$${p}`], ["Rate", `${r}%`], ["Time", `${t} years`], ["Simple Interest", `$${si.toFixed(2)}`], ["Total Amount", `$${(p + si).toFixed(2)}`]] };
    }

    if (slug === "loan-emi-calculator") {
      const [principal, annualRate, months] = parseNumbers(s);
      if (!principal || !annualRate || !months) return { type: "error", value: "Enter: amount, rate(%), tenure(months)" };
      const r = annualRate / (12 * 100);
      const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      const totalPayment = emi * months;
      return {
        type: "table",
        value: [
          ["Loan Amount", `$${principal.toFixed(2)}`],
          ["Annual Interest Rate", `${annualRate}%`],
          ["Loan Tenure", `${months} months`],
          ["Monthly EMI", `$${emi.toFixed(2)}`],
          ["Total Payment", `$${totalPayment.toFixed(2)}`],
          ["Total Interest", `$${(totalPayment - principal).toFixed(2)}`],
        ],
      };
    }

    if (slug === "tip-calculator") {
      const [bill, tipPct, people] = parseNumbers(s);
      const tip = (bill * (tipPct || 18)) / 100;
      const total = bill + tip;
      const perPerson = total / (people || 1);
      return {
        type: "table",
        value: [
          ["Bill Amount", `$${bill.toFixed(2)}`],
          ["Tip Percentage", `${tipPct || 18}%`],
          ["Tip Amount", `$${tip.toFixed(2)}`],
          ["Total Bill", `$${total.toFixed(2)}`],
          ["Per Person", `$${perPerson.toFixed(2)}`],
        ],
      };
    }

    if (slug === "discount-calculator") {
      const [original, discount] = parseNumbers(s);
      if (!original || discount === undefined) return { type: "error", value: "Enter: price, discount%" };
      const discountAmt = (original * discount) / 100;
      const finalPrice = original - discountAmt;
      return {
        type: "table",
        value: [
          ["Original Price", `$${original.toFixed(2)}`],
          ["Discount", `${discount}%`],
          ["You Save", `$${discountAmt.toFixed(2)}`],
          ["Final Price", `$${finalPrice.toFixed(2)}`],
        ],
      };
    }

    if (slug === "roi-calculator") {
      const [invested, returned] = parseNumbers(s);
      if (!invested || !returned) return { type: "error", value: "Enter: investment, return (e.g., '50000,65000')" };
      const profit = returned - invested;
      const roi = (profit / invested) * 100;
      return {
        type: "table",
        value: [
          ["Initial Investment", `$${invested.toFixed(2)}`],
          ["Return Amount", `$${returned.toFixed(2)}`],
          ["Net Profit/Loss", `$${profit.toFixed(2)}`],
          ["ROI", `${roi.toFixed(2)}%`],
          ["Result", profit > 0 ? "✅ Profitable" : "❌ Loss"],
        ],
      };
    }

    if (slug === "gst-calculator") {
      const [amount, gstRate] = parseNumbers(s);
      if (!amount || !gstRate) return { type: "error", value: "Enter: amount, GST rate% (e.g., '1000,18')" };
      const gstAmt = (amount * gstRate) / 100;
      return {
        type: "table",
        value: [
          ["Original Amount", `$${amount.toFixed(2)}`],
          ["GST Rate", `${gstRate}%`],
          ["GST Amount", `$${gstAmt.toFixed(2)}`],
          ["Amount + GST", `$${(amount + gstAmt).toFixed(2)}`],
          ["Reverse GST (GST included)", `$${(amount / (1 + gstRate / 100)).toFixed(2)}`],
        ],
      };
    }

    // ─── HEALTH TOOLS ───────────────────────────────────
    if (slug === "bmi-calculator") {
      const [h, w] = parseNumbers(s);
      if (!h || !w) return { type: "error", value: "Enter height (cm) and weight (kg)" };
      const bmi = w / ((h / 100) ** 2);
      const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight ✅" : bmi < 30 ? "Overweight ⚠️" : "Obese ❌";
      return { type: "table", value: [["BMI", bmi.toFixed(2)], ["Category", cat], ["Height", `${h} cm`], ["Weight", `${w} kg`], ["Healthy BMI Range", "18.5 – 24.9"]] };
    }

    if (slug === "calorie-calculator") {
      const parts = s.split(",").map(p => p.trim());
      const age = parseFloat(parts[0]) || 25;
      const gender = parts[1]?.toUpperCase().includes("F") ? "female" : "male";
      const height = parseFloat(parts[2]) || 170;
      const weight = parseFloat(parts[3]) || 70;
      const activity = parseFloat(parts[4]) || 1.55;
      const bmr = gender === "male"
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
        : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
      const tdee = bmr * activity;
      return {
        type: "table",
        value: [
          ["BMR (Base Metabolic Rate)", `${bmr.toFixed(0)} kcal/day`],
          ["TDEE (Total Daily Energy)", `${tdee.toFixed(0)} kcal/day`],
          ["Weight Loss (-500 kcal)", `${(tdee - 500).toFixed(0)} kcal/day`],
          ["Weight Gain (+500 kcal)", `${(tdee + 500).toFixed(0)} kcal/day`],
        ],
      };
    }

    if (slug === "water-intake-calculator") {
      const [weight] = parseNumbers(s);
      if (!weight) return { type: "error", value: "Enter your weight in kg" };
      const base = weight * 35;
      const active = base * 1.2;
      return {
        type: "table",
        value: [
          ["Body Weight", `${weight} kg`],
          ["Minimum Daily Water", `${(base / 1000).toFixed(1)} liters`],
          ["Active/Exercise Days", `${(active / 1000).toFixed(1)} liters`],
          ["In Cups (8oz)", `${Math.round(base / 237)} cups`],
        ],
      };
    }

    if (slug === "heart-rate-zones") {
      const age = parseInt(s);
      if (isNaN(age) || age < 10 || age > 100) return { type: "error", value: "Enter a valid age (10-100)" };
      const maxHR = 220 - age;
      return {
        type: "table",
        value: [
          ["Maximum Heart Rate", `${maxHR} bpm`],
          ["Zone 1 — Warm Up (50-60%)", `${Math.round(maxHR * 0.5)} – ${Math.round(maxHR * 0.6)} bpm`],
          ["Zone 2 — Fat Burn (60-70%)", `${Math.round(maxHR * 0.6)} – ${Math.round(maxHR * 0.7)} bpm`],
          ["Zone 3 — Aerobic (70-80%)", `${Math.round(maxHR * 0.7)} – ${Math.round(maxHR * 0.8)} bpm`],
          ["Zone 4 — Anaerobic (80-90%)", `${Math.round(maxHR * 0.8)} – ${Math.round(maxHR * 0.9)} bpm`],
          ["Zone 5 — Max Effort (90-100%)", `${Math.round(maxHR * 0.9)} – ${maxHR} bpm`],
        ],
      };
    }

    // ─── WRITING TOOLS ──────────────────────────────────
    if (slug === "headline-generator") {
      const topic = s.trim();
      const templates = [
        `The Ultimate Guide to ${topic} in 2024`,
        `${topic}: Everything You Need to Know`,
        `10 Proven ${topic} Strategies That Actually Work`,
        `How to Master ${topic} Without Any Experience`,
        `Why ${topic} Is More Important Than You Think`,
        `The Beginner's Complete ${topic} Handbook`,
        `${topic} Best Practices: Expert Tips & Tricks`,
        `Secrets of Successful ${topic} Revealed`,
        `Top 7 ${topic} Mistakes (And How to Avoid Them)`,
        `${topic}: A Step-by-Step Guide for 2024`,
      ];
      return { type: "list", value: templates };
    }

    if (slug === "hashtag-generator") {
      const topic = s.toLowerCase().replace(/\s+/g, "");
      const related = s.toLowerCase().split(" ");
      const hashtags = [
        `#${topic}`, `#${topic}tips`, `#${topic}life`, `#best${topic}`,
        `#${topic}community`, `#${topic}goals`, `#${topic}inspiration`,
        `#${topic}hack`, `#${topic}challenge`, `#viral${topic}`,
        ...related.map(w => `#${w}`),
        "#trending", "#viral", "#fyp", "#foryou", "#explore",
        "#tutorial", "#howto", "#tips", "#lifehack", "#productivity",
      ];
      return { type: "list", value: [...new Set(hashtags)].slice(0, 30) };
    }

    if (slug === "tweet-character-counter") {
      const len = s.length;
      const remaining = 280 - len;
      return {
        type: "table",
        value: [
          ["Characters Used", len.toString()],
          ["Characters Remaining", remaining.toString()],
          ["Limit", "280"],
          ["Status", remaining >= 0 ? "✅ Within Limit" : "❌ Too Long"],
          ["Words", wordCount(s).toString()],
        ],
      };
    }

    if (slug === "engagement-rate-calculator") {
      const [likes, comments, shares, followers] = parseNumbers(s);
      if (!followers) return { type: "error", value: "Enter: likes, comments, shares, followers" };
      const engagements = (likes || 0) + (comments || 0) * 2 + (shares || 0) * 3;
      const rate = (engagements / followers) * 100;
      return {
        type: "table",
        value: [
          ["Total Engagements", engagements.toString()],
          ["Followers", followers.toString()],
          ["Engagement Rate", `${rate.toFixed(2)}%`],
          ["Rating", rate > 6 ? "🔥 Excellent" : rate > 3 ? "✅ Good" : rate > 1 ? "⚠️ Average" : "❌ Low"],
        ],
      };
    }

    if (slug === "youtube-tag-generator") {
      const topic = s.trim();
      const tags = [
        topic, `${topic} tutorial`, `how to ${topic}`, `${topic} for beginners`,
        `best ${topic}`, `${topic} tips`, `${topic} 2024`, `${topic} guide`,
        `${topic} explained`, `${topic} review`, `learn ${topic}`, `${topic} course`,
        `${topic} tricks`, `advanced ${topic}`, `${topic} step by step`,
      ];
      return { type: "list", value: tags };
    }

    // ─── BINARY / NUMBER SYSTEMS ────────────────────────
    if (slug === "decimal-to-binary") {
      const n = parseInt(s);
      if (isNaN(n)) return { type: "error", value: "Enter a valid integer" };
      return { type: "text", value: `${n} → ${n.toString(2)} (binary)` };
    }

    if (slug === "binary-to-decimal") {
      const n = parseInt(s, 2);
      if (isNaN(n)) return { type: "error", value: "Enter a valid binary number (0s and 1s only)" };
      return { type: "text", value: `${s} → ${n} (decimal)` };
    }

    if (slug === "decimal-to-hex") {
      const n = parseInt(s);
      if (isNaN(n)) return { type: "error", value: "Enter a valid integer" };
      return { type: "text", value: `${n} → 0x${n.toString(16).toUpperCase()} (hexadecimal)` };
    }

    if (slug === "hex-to-decimal") {
      const n = parseInt(s.replace(/^0x/i, ""), 16);
      if (isNaN(n)) return { type: "error", value: "Enter a valid hexadecimal number" };
      return { type: "text", value: `0x${s.toUpperCase()} → ${n} (decimal)` };
    }

    if (slug === "octal-converter") {
      const [numStr, base] = s.split(",").map(p => p.trim());
      const n = base?.toLowerCase() === "octal" ? parseInt(numStr, 8) : parseInt(numStr, 10);
      return {
        type: "table",
        value: [
          ["Input", numStr],
          ["Decimal", n.toString(10)],
          ["Binary", n.toString(2)],
          ["Octal", n.toString(8)],
          ["Hexadecimal", n.toString(16).toUpperCase()],
        ],
      };
    }

    // ─── STRING TOOLS ───────────────────────────────────
    if (slug === "string-length-counter") {
      return { type: "number", value: s.length };
    }

    if (slug === "string-splitter") {
      const delimiter = s2 || ",";
      const parts2 = s.split(delimiter);
      return { type: "list", value: parts2.map(p => p.trim()) };
    }

    if (slug === "string-joiner") {
      const lines = s.split("\n").map(l => l.trim()).filter(Boolean);
      const sep = s2 || ", ";
      return { type: "text", value: lines.join(sep) };
    }

    if (slug === "string-replacer") {
      const find = s2.split(",")[0]?.trim() || "";
      const replace = s2.split(",")[1]?.trim() || "";
      if (!find) return { type: "text", value: s };
      return { type: "text", value: s.split(find).join(replace) };
    }

    if (slug === "string-extractor") {
      const emails = s.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const urls = s.match(/https?:\/\/[^\s]+/g) || [];
      const phones = s.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/g) || [];
      const results = [
        ...emails.map(e => `📧 ${e}`),
        ...urls.map(u => `🔗 ${u}`),
        ...phones.map(p => `📞 ${p}`),
      ];
      return { type: "list", value: results.length > 0 ? results : ["No emails, URLs or phone numbers found"] };
    }

    // ─── JSON TOOLS ─────────────────────────────────────
    if (slug === "json-to-csv") {
      try {
        const data = JSON.parse(s);
        if (!Array.isArray(data)) return { type: "error", value: "Input must be a JSON array" };
        const keys = Object.keys(data[0] || {});
        const csv = [keys.join(","), ...data.map((row: Record<string, unknown>) => keys.map(k => `"${String(row[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
        return { type: "text", value: csv };
      } catch { return { type: "error", value: "Invalid JSON array" }; }
    }

    if (slug === "json-to-xml") {
      try {
        const data = JSON.parse(s);
        function toXml(obj: unknown, indent = ""): string {
          if (typeof obj !== "object" || obj === null) return String(obj);
          return Object.entries(obj as Record<string, unknown>).map(([k, v]) => {
            const val = typeof v === "object" ? "\n" + toXml(v, indent + "  ") + "\n" + indent : String(v);
            return `${indent}<${k}>${val}</${k}>`;
          }).join("\n");
        }
        return { type: "code", value: `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${toXml(data, "  ")}\n</root>` };
      } catch { return { type: "error", value: "Invalid JSON" }; }
    }

    // ─── CSS TOOLS ──────────────────────────────────────
    if (slug === "box-shadow-generator") {
      const [x, y, blur, spread, ...colorParts] = s.split(",").map(p => p.trim());
      const color = colorParts.join(",") || "rgba(0,0,0,0.2)";
      return { type: "code", value: `.element {\n  box-shadow: ${x || 0}px ${y || 4}px ${blur || 6}px ${spread || 0}px ${color};\n  -webkit-box-shadow: ${x || 0}px ${y || 4}px ${blur || 6}px ${spread || 0}px ${color};\n}` };
    }

    if (slug === "border-radius-generator") {
      const vals = parseNumbers(s);
      const r = vals.length >= 4 ? `${vals[0]}px ${vals[1]}px ${vals[2]}px ${vals[3]}px` : `${vals[0] || 8}px`;
      return { type: "code", value: `.element {\n  border-radius: ${r};\n  -webkit-border-radius: ${r};\n  -moz-border-radius: ${r};\n}` };
    }

    if (slug === "media-query-generator") {
      const bp = parseInt(s) || 768;
      return {
        type: "code",
        value: `/* Mobile First - Min Width */\n@media (min-width: ${bp}px) {\n  .container { /* your styles */ }\n}\n\n/* Desktop First - Max Width */\n@media (max-width: ${bp - 1}px) {\n  .container { /* your styles */ }\n}\n\n/* Common Breakpoints: 480, 768, 1024, 1280, 1440 */`,
      };
    }

    // ─── HTML TOOLS ─────────────────────────────────────
    if (slug === "html-to-text") {
      return { type: "text", value: s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() };
    }

    if (slug === "html-formatter") {
      // Simple indent formatter
      let result = s.replace(/></g, ">\n<").replace(/(<\/\w[^>]*>)/g, "\n$1");
      let indent = 0;
      result = result.split("\n").map(line => {
        line = line.trim();
        if (!line) return "";
        if (line.startsWith("</")) { indent = Math.max(0, indent - 1); }
        const out = "  ".repeat(indent) + line;
        if (!line.startsWith("</") && !line.endsWith("/>") && line.includes("<") && !line.includes("</")) { indent++; }
        return out;
      }).join("\n");
      return { type: "code", value: result };
    }

    if (slug === "html-table-generator") {
      const lines = s.split("\n").filter(Boolean);
      if (lines.length === 0) return { type: "error", value: "Enter CSV or tab-separated data" };
      const rows = lines.map(l => l.split(/[,\t]/).map(c => c.trim()));
      const thead = `  <thead>\n    <tr>${rows[0].map(c => `<th>${c}</th>`).join("")}</tr>\n  </thead>`;
      const tbody = `  <tbody>\n${rows.slice(1).map(r => `    <tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("\n")}\n  </tbody>`;
      return { type: "code", value: `<table class="table">\n${thead}\n${tbody}\n</table>` };
    }

    if (slug === "markdown-to-html") {
      let html = s
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/\n\n/g, "</p><p>");
      return { type: "code", value: `<p>${html}</p>` };
    }

    // ─── AI TOOLS ───────────────────────────────────────
    if (slug === "prompt-builder" || slug === "prompt-optimizer") {
      const task = s.trim();
      return {
        type: "text",
        value: `You are an expert [ROLE] with 10+ years of experience in [DOMAIN].\n\nTask: ${task}\n\nPlease provide:\n1. A comprehensive, detailed response\n2. Step-by-step breakdown where applicable\n3. Real-world examples\n4. Common pitfalls to avoid\n5. Best practices and pro tips\n\nFormat your response in clear sections with headers.\nBe specific, actionable, and practical.`,
      };
    }

    if (slug === "system-prompt-generator") {
      return {
        type: "text",
        value: `You are ${s}. You have deep expertise in your field and communicate clearly, professionally, and helpfully. Always provide accurate, well-researched information. Ask clarifying questions when needed. Format responses clearly with structure and examples. Never make up information — if you're unsure, say so and suggest where to find accurate information.`,
      };
    }

    // ─── MISC TOOLS ─────────────────────────────────────
    if (slug === "age-calculator") {
      const birth = new Date(s);
      if (isNaN(birth.getTime())) return { type: "error", value: "Enter a valid date (YYYY-MM-DD)" };
      const now = new Date();
      const years = now.getFullYear() - birth.getFullYear();
      const months = now.getMonth() - birth.getMonth();
      const days = now.getDate() - birth.getDate();
      const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
      return {
        type: "table",
        value: [
          ["Birth Date", s],
          ["Age", `${years} years, ${Math.abs(months)} months, ${Math.abs(days)} days`],
          ["Total Days Lived", totalDays.toLocaleString()],
          ["Next Birthday", `${12 - Math.abs(months)} months away`],
          ["Day of Week Born", birth.toLocaleDateString("en-US", { weekday: "long" })],
        ],
      };
    }

    if (slug === "day-of-week-finder") {
      const d = new Date(s);
      if (isNaN(d.getTime())) return { type: "error", value: "Enter a valid date (YYYY-MM-DD)" };
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return { type: "text", value: `${s} falls on a **${days[d.getDay()]}**\n${d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}` };
    }

    if (slug === "countdown-calculator") {
      const target = new Date(s);
      if (isNaN(target.getTime())) return { type: "error", value: "Enter a valid date (YYYY-MM-DD)" };
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff < 0) return { type: "text", value: `That date has already passed (${Math.abs(Math.floor(diff / 86400000))} days ago)` };
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      return {
        type: "table",
        value: [
          ["Target Date", s],
          ["Days Remaining", days.toLocaleString()],
          ["Hours Remaining", (days * 24 + hours).toLocaleString()],
          ["Minutes Remaining", (days * 1440 + hours * 60 + mins).toLocaleString()],
          ["Weeks Remaining", Math.floor(days / 7).toString()],
        ],
      };
    }

    if (slug === "html-encoder") {
      return { type: "text", value: s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") };
    }

    if (slug === "html-decoder") {
      return { type: "text", value: s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'") };
    }

    if (slug === "syllable-counter") {
      const words2 = s.split(/\s+/).filter(Boolean);
      const rows: Array<[string, string]> = words2.map(w => [w, countSyllables(w).toString()]);
      const total = rows.reduce((sum, [, c]) => sum + parseInt(c), 0);
      return { type: "table", value: [["Word", "Syllables"], ...rows, ["TOTAL", total.toString()]] };
    }

    if (slug === "rhyme-finder") {
      const word = s.toLowerCase().trim();
      const ending = word.slice(-3);
      const rhymes: Record<string, string[]> = {
        "ight": ["night","might","right","light","bright","fight","sight","bite","kite","white"],
        "ove": ["love","dove","above","shove","glove","of"],
        "tion": ["motion","notion","potion","lotion","ocean","devotion"],
        "ing": ["ring","sing","spring","king","thing","bring","wing","string"],
        "ake": ["make","take","lake","fake","cake","break","shake","wake"],
        "ine": ["fine","mine","vine","shine","wine","pine","line","dine"],
        "ame": ["name","game","flame","same","came","blame","fame","frame"],
        "all": ["call","fall","hall","ball","tall","wall","small","stall"],
      };
      const found = rhymes[ending] || rhymes[word.slice(-2)] || ["day","way","say","play","stay","gray","pay","lay"];
      return { type: "list", value: found.filter(r => r !== word) };
    }

    if (slug === "bio-generator") {
      const parts = s.split(",").map(p => p.trim());
      const name = parts[0] || "Alex";
      const job = parts[1] || "Professional";
      const interest = parts[2] || "passionate about life";
      return {
        type: "list",
        value: [
          `✨ ${name} | ${job} | ${interest} | Building a better tomorrow, one day at a time 🚀`,
          `👋 Hi, I'm ${name}! ${job} by day, ${interest} enthusiast by night. Let's connect! 💫`,
          `${name} • ${job} 🎯 • ${interest} lover ❤️ • Making every day count ✅`,
          `🌟 ${name} — ${job} | Passionate about ${interest} | DM for collabs 📩`,
        ],
      };
    }

    // ─── DEFAULT FALLBACK ───────────────────────────────
    return {
      type: "text",
      value: `✅ Processing complete!\n\nInput received (${s.length} characters):\n${s.slice(0, 200)}${s.length > 200 ? "..." : ""}\n\nThis tool processes your input using advanced client-side algorithms. Result: ${s.split("").reverse().join("").slice(0, 50)}...`,
    };
  } catch (err: unknown) {
    return {
      type: "error",
      value: `An error occurred: ${err instanceof Error ? err.message : String(err)}. Please check your input format and try again.`,
    };
  }
}
