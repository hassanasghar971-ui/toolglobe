import { categoryDefinitionSchema } from "../types";
import type { CategoryDefinition } from "../types";

const RAW_CATEGORIES: CategoryDefinition[] = [
  {
    slug: "developer-tools",
    name: "Developer Tools",
    description:
      "JSON, code, encoding, and data-format utilities built for engineers who need fast, accurate, client-side processing without uploading sensitive data to a server.",
    icon: "code-2",
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    description:
      "Word counters, case converters, formatters, and text analysis utilities for writers, students, and content teams who need instant, accurate text transformations.",
    icon: "text-cursor-input",
  },
  {
    slug: "math-calculators",
    name: "Math & Calculators",
    description:
      "Percentage, financial, scientific, and everyday calculators that show their formulas and working, not just a final number.",
    icon: "calculator",
  },
  {
    slug: "image-tools",
    name: "Image Tools",
    description:
      "Browser-based image resizing, compression, and format-conversion utilities that never upload your files to a remote server.",
    icon: "image",
  },
  {
    slug: "pdf-tools",
    name: "PDF Tools",
    description:
      "Merge, split, compress, and convert PDF documents entirely in your browser for speed, privacy, and zero server upload.",
    icon: "file-text",
  },
  {
    slug: "seo-tools",
    name: "SEO Tools",
    description:
      "Meta tag generators, keyword density checkers, and on-page SEO utilities for marketers, bloggers, and site owners.",
    icon: "search",
  },
  {
    slug: "converters",
    name: "Unit Converters",
    description:
      "Length, weight, temperature, currency, and data-size converters with precise, verifiable conversion formulas shown inline.",
    icon: "repeat",
  },
  {
    slug: "color-tools",
    name: "Color Tools",
    description:
      "HEX, RGB, HSL converters, palette generators, and accessibility contrast checkers for designers and front-end developers.",
    icon: "palette",
  },
];

/** Parsed through Zod at module load — an invalid category throws at build time. */
export const CATEGORIES: CategoryDefinition[] = RAW_CATEGORIES.map((c) =>
  categoryDefinitionSchema.parse(c)
);
