// lib/categories.ts

/**
 * ToolGlobe — Category Taxonomy
 * Single source of truth for category/subcategory structure.
 * Consumed by: lib/tool-registry.ts (FK validation), Phase 5 homepage
 * grid, Phase 4 category sitemaps, Phase 3 breadcrumb generation.
 */

export interface ToolSubcategory {
  slug: string;
  name: string;
  description: string;
}

export interface ToolCategory {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: string; // lucide-react icon name, rendered in Phase 5
  color: string; // tailwind color token used for category accent
  subcategories: ToolSubcategory[];
}

export const CATEGORIES: ToolCategory[] = [
  {
    slug: "unit-converters",
    name: "Unit Converters",
    shortDescription: "Convert between length, weight, temperature, and more.",
    longDescription:
      "A complete suite of precision unit converters covering length, mass, temperature, volume, speed, area, pressure, energy, and data storage — each using exact conversion factors, not approximations.",
    icon: "ArrowLeftRight",
    color: "brand",
    subcategories: [
      { slug: "length", name: "Length & Distance", description: "Meters, feet, miles, kilometers and more." },
      { slug: "weight-mass", name: "Weight & Mass", description: "Kilograms, pounds, ounces, tonnes and more." },
      { slug: "temperature", name: "Temperature", description: "Celsius, Fahrenheit, Kelvin conversions." },
      { slug: "volume", name: "Volume", description: "Liters, gallons, cups, milliliters and more." },
      { slug: "speed", name: "Speed", description: "km/h, mph, m/s, knots and more." },
      { slug: "area", name: "Area", description: "Square meters, acres, hectares and more." },
      { slug: "data-storage", name: "Data Storage", description: "Bytes, KB, MB, GB, TB conversions." },
      { slug: "time", name: "Time", description: "Seconds, minutes, hours, days conversions." },
      { slug: "pressure", name: "Pressure", description: "Pascal, bar, psi, atm conversions." },
      { slug: "energy", name: "Energy", description: "Joules, calories, kWh conversions." },
    ],
  },
  {
    slug: "calculators",
    name: "Calculators",
    shortDescription: "Finance, math, health, and everyday calculators.",
    longDescription:
      "Real formula-driven calculators for financial planning, health metrics, mathematics, and daily life decisions — every result computed live in your browser with transparent formulas.",
    icon: "Calculator",
    color: "brand",
    subcategories: [
      { slug: "finance", name: "Finance", description: "Loan, mortgage, interest, tax calculators." },
      { slug: "health-fitness", name: "Health & Fitness", description: "BMI, calorie, body fat calculators." },
      { slug: "math", name: "Math", description: "Percentage, ratio, algebra calculators." },
      { slug: "date-time", name: "Date & Time", description: "Age, date difference, countdown calculators." },
      { slug: "everyday", name: "Everyday", description: "Tip, fuel cost, discount calculators." },
    ],
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    shortDescription: "Case converters, counters, formatters, and text utilities.",
    longDescription:
      "Instant client-side text processing tools — case converters, word/character counters, formatters, duplicate removers, and more, all processed locally for speed and privacy.",
    icon: "Type",
    color: "brand",
    subcategories: [
      { slug: "case-conversion", name: "Case Conversion", description: "Uppercase, lowercase, title case and more." },
      { slug: "counters", name: "Counters", description: "Word, character, sentence counters." },
      { slug: "formatters", name: "Formatters", description: "Whitespace, line break, text cleanup tools." },
      { slug: "generators", name: "Text Generators", description: "Lorem ipsum, random text generators." },
    ],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    shortDescription: "JSON, encoding, hashing, and code utilities for developers.",
    longDescription:
      "Essential developer utilities including JSON formatting/validation, Base64 encoding, URL encoding, hashing algorithms, and code minifiers — built for speed and accuracy.",
    icon: "Code2",
    color: "brand",
    subcategories: [
      { slug: "json", name: "JSON Tools", description: "Format, validate, minify JSON." },
      { slug: "encoding", name: "Encoding", description: "Base64, URL, HTML entity encoding." },
      { slug: "hashing", name: "Hashing", description: "MD5, SHA-1, SHA-256 generators." },
      { slug: "formatters", name: "Code Formatters", description: "CSS, HTML, JS minify/beautify." },
    ],
  },
  {
    slug: "generators",
    name: "Generators",
    shortDescription: "Random passwords, UUIDs, usernames, and more.",
    longDescription:
      "Secure, client-side random generators for passwords, UUIDs, usernames, and unique identifiers — all generated locally using cryptographically strong randomness where applicable.",
    icon: "Sparkles",
    color: "brand",
    subcategories: [
      { slug: "security", name: "Security", description: "Password, PIN, API key generators." },
      { slug: "identifiers", name: "Identifiers", description: "UUID, slug, username generators." },
    ],
  },
  {
    slug: "color-tools",
    name: "Color Tools",
    shortDescription: "Color converters, palette generators, and contrast checkers.",
    longDescription:
      "A complete color toolkit for designers and developers — HEX/RGB/HSL converters, palette generators, and accessibility contrast checkers, all rendered live.",
    icon: "Palette",
    color: "brand",
    subcategories: [
      { slug: "conversion", name: "Color Conversion", description: "HEX, RGB, HSL, CMYK converters." },
      { slug: "palettes", name: "Palette Tools", description: "Palette and gradient generators." },
    ],
  },
  {
    slug: "image-tools",
    name: "Image Tools",
    shortDescription: "Compress, resize, and convert images in-browser.",
    longDescription:
      "Client-side image processing tools — resize, compress, and convert images between formats entirely in your browser, with no files ever uploaded to a server.",
    icon: "Image",
    color: "brand",
    subcategories: [
      { slug: "resize-compress", name: "Resize & Compress", description: "Resize and compress images." },
      { slug: "conversion", name: "Format Conversion", description: "Convert between PNG, JPG, WebP." },
    ],
  },
  {
    slug: "pdf-tools",
    name: "PDF Tools",
    shortDescription: "Merge, split, compress, and convert PDF files.",
    longDescription:
      "Browser-based PDF utilities — merge, split, compress, and convert documents without installing software or uploading sensitive files to third-party servers.",
    icon: "FileText",
    color: "brand",
    subcategories: [
      { slug: "merge-split", name: "Merge & Split", description: "Merge or split PDF files." },
      { slug: "conversion", name: "PDF Conversion", description: "Convert PDF to/from other formats." },
    ],
  },
  {
    slug: "seo-tools",
    name: "SEO Tools",
    shortDescription: "Meta tag generators, keyword density, and SERP preview tools.",
    longDescription:
      "Practical SEO utilities for webmasters — meta tag generators, keyword density analyzers, and SERP snippet previewers to optimize content before publishing.",
    icon: "TrendingUp",
    color: "brand",
    subcategories: [
      { slug: "meta-tags", name: "Meta Tags", description: "Meta title/description generators." },
      { slug: "analysis", name: "Content Analysis", description: "Keyword density, readability tools." },
    ],
  },
  {
    slug: "network-tools",
    name: "Network Tools",
    shortDescription: "IP lookup, subnet calculators, and DNS utilities.",
    longDescription:
      "Networking utilities for IT professionals — subnet calculators, IP address tools, and DNS record formatters, all computed instantly client-side.",
    icon: "Network",
    color: "brand",
    subcategories: [
      { slug: "ip-tools", name: "IP Tools", description: "IP subnet and CIDR calculators." },
    ],
  },
];

// ---------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------

const categoryBySlugMap = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return categoryBySlugMap.get(slug);
}

export function getSubcategory(
  categorySlug: string,
  subcategorySlug: string
): ToolSubcategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find((s) => s.slug === subcategorySlug);
}

export function isValidCategorySlug(slug: string): boolean {
  return categoryBySlugMap.has(slug);
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}
