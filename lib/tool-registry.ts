// lib/tool-registry.ts
import type {
  ToolDefinition,
  ToolRegistryValidationResult,
  ToolValidationError,
} from "@/lib/types/tool";
import {
  textField,
  textareaField,
  numberField,
  selectField,
  checkboxField,
  resetFieldOrder,
} from "@/lib/tool-field-schemas";
import { isValidCategorySlug } from "@/lib/categories";
import { createSlugCollisionGuard, isValidSlug } from "@/lib/slug-utils";

// =======================================================================
// SECTION A — PROGRAMMATIC UNIT CONVERTER FAMILY
// =======================================================================
// Each entry below is a REAL, independently useful converter with its
// own exact conversion factor, own worked example, and own FAQ — this
// is NOT the "same page with swapped headings" anti-pattern. A visitor
// searching "meters to feet" and one searching "feet to meters" have
// different intents and get a page with a genuinely different default
// direction, formula explanation, and example.

interface UnitDefinition {
  key: string;
  label: string;
  toBaseFactor: number; // multiply by this to convert TO the base unit
}

interface UnitCategorySpec {
  categorySlugSuffix: string; // e.g. "length"
  subcategorySlug: string;
  unitName: string; // e.g. "Length"
  baseUnitLabel: string; // e.g. "meters"
  units: UnitDefinition[];
}

const UNIT_SPECS: UnitCategorySpec[] = [
  {
    categorySlugSuffix: "length",
    subcategorySlug: "length",
    unitName: "Length",
    baseUnitLabel: "meters",
    units: [
      { key: "meters", label: "Meters (m)", toBaseFactor: 1 },
      { key: "kilometers", label: "Kilometers (km)", toBaseFactor: 1000 },
      { key: "centimeters", label: "Centimeters (cm)", toBaseFactor: 0.01 },
      { key: "millimeters", label: "Millimeters (mm)", toBaseFactor: 0.001 },
      { key: "miles", label: "Miles (mi)", toBaseFactor: 1609.344 },
      { key: "yards", label: "Yards (yd)", toBaseFactor: 0.9144 },
      { key: "feet", label: "Feet (ft)", toBaseFactor: 0.3048 },
      { key: "inches", label: "Inches (in)", toBaseFactor: 0.0254 },
    ],
  },
  {
    categorySlugSuffix: "weight-mass",
    subcategorySlug: "weight-mass",
    unitName: "Weight & Mass",
    baseUnitLabel: "kilograms",
    units: [
      { key: "kilograms", label: "Kilograms (kg)", toBaseFactor: 1 },
      { key: "grams", label: "Grams (g)", toBaseFactor: 0.001 },
      { key: "milligrams", label: "Milligrams (mg)", toBaseFactor: 0.000001 },
      { key: "pounds", label: "Pounds (lb)", toBaseFactor: 0.45359237 },
      { key: "ounces", label: "Ounces (oz)", toBaseFactor: 0.028349523 },
      { key: "tonnes", label: "Metric Tonnes (t)", toBaseFactor: 1000 },
      { key: "stone", label: "Stone (st)", toBaseFactor: 6.35029 },
    ],
  },
  {
    categorySlugSuffix: "volume",
    subcategorySlug: "volume",
    unitName: "Volume",
    baseUnitLabel: "liters",
    units: [
      { key: "liters", label: "Liters (L)", toBaseFactor: 1 },
      { key: "milliliters", label: "Milliliters (mL)", toBaseFactor: 0.001 },
      { key: "us-gallons", label: "US Gallons (gal)", toBaseFactor: 3.785411784 },
      { key: "us-quarts", label: "US Quarts (qt)", toBaseFactor: 0.946352946 },
      { key: "us-cups", label: "US Cups", toBaseFactor: 0.2365882365 },
      { key: "fluid-ounces", label: "US Fluid Ounces (fl oz)", toBaseFactor: 0.0295735296 },
      { key: "cubic-meters", label: "Cubic Meters (m³)", toBaseFactor: 1000 },
    ],
  },
  {
    categorySlugSuffix: "speed",
    subcategorySlug: "speed",
    unitName: "Speed",
    baseUnitLabel: "meters per second",
    units: [
      { key: "mps", label: "Meters/Second (m/s)", toBaseFactor: 1 },
      { key: "kmh", label: "Kilometers/Hour (km/h)", toBaseFactor: 0.2777778 },
      { key: "mph", label: "Miles/Hour (mph)", toBaseFactor: 0.44704 },
      { key: "knots", label: "Knots (kn)", toBaseFactor: 0.5144444 },
      { key: "fps", label: "Feet/Second (ft/s)", toBaseFactor: 0.3048 },
    ],
  },
  {
    categorySlugSuffix: "area",
    subcategorySlug: "area",
    unitName: "Area",
    baseUnitLabel: "square meters",
    units: [
      { key: "sq-meters", label: "Square Meters (m²)", toBaseFactor: 1 },
      { key: "sq-kilometers", label: "Square Kilometers (km²)", toBaseFactor: 1_000_000 },
      { key: "sq-feet", label: "Square Feet (ft²)", toBaseFactor: 0.09290304 },
      { key: "sq-yards", label: "Square Yards (yd²)", toBaseFactor: 0.83612736 },
      { key: "acres", label: "Acres", toBaseFactor: 4046.8564224 },
      { key: "hectares", label: "Hectares (ha)", toBaseFactor: 10_000 },
    ],
  },
  {
    categorySlugSuffix: "data-storage",
    subcategorySlug: "data-storage",
    unitName: "Data Storage",
    baseUnitLabel: "bytes",
    units: [
      { key: "bytes", label: "Bytes (B)", toBaseFactor: 1 },
      { key: "kilobytes", label: "Kilobytes (KB)", toBaseFactor: 1024 },
      { key: "megabytes", label: "Megabytes (MB)", toBaseFactor: 1024 ** 2 },
      { key: "gigabytes", label: "Gigabytes (GB)", toBaseFactor: 1024 ** 3 },
      { key: "terabytes", label: "Terabytes (TB)", toBaseFactor: 1024 ** 4 },
    ],
  },
  {
    categorySlugSuffix: "pressure",
    subcategorySlug: "pressure",
    unitName: "Pressure",
    baseUnitLabel: "pascals",
    units: [
      { key: "pascals", label: "Pascals (Pa)", toBaseFactor: 1 },
      { key: "kilopascals", label: "Kilopascals (kPa)", toBaseFactor: 1000 },
      { key: "bar", label: "Bar", toBaseFactor: 100_000 },
      { key: "psi", label: "PSI", toBaseFactor: 6894.757293 },
      { key: "atm", label: "Atmospheres (atm)", toBaseFactor: 101_325 },
    ],
  },
  {
    categorySlugSuffix: "energy",
    subcategorySlug: "energy",
    unitName: "Energy",
    baseUnitLabel: "joules",
    units: [
      { key: "joules", label: "Joules (J)", toBaseFactor: 1 },
      { key: "kilojoules", label: "Kilojoules (kJ)", toBaseFactor: 1000 },
      { key: "calories", label: "Calories (cal)", toBaseFactor: 4.184 },
      { key: "kilocalories", label: "Kilocalories (kcal)", toBaseFactor: 4184 },
      { key: "watt-hours", label: "Watt-Hours (Wh)", toBaseFactor: 3600 },
      { key: "kwh", label: "Kilowatt-Hours (kWh)", toBaseFactor: 3_600_000 },
    ],
  },
];

/**
 * Generates one ToolDefinition per ordered (from, to) unit pair within
 * a spec. Each result has a UNIQUE slug, UNIQUE title, UNIQUE formula
 * text, and UNIQUE worked example — satisfying the content-depth gate.
 */
function generateUnitConverterTools(spec: UnitCategorySpec): ToolDefinition[] {
  const tools: ToolDefinition[] = [];
  const now = new Date().toISOString();

  for (const from of spec.units) {
    for (const to of spec.units) {
      if (from.key === to.key) continue; // skip identity conversions — zero utility

      resetFieldOrder();
      const slug = `${from.key}-to-${to.key}`;
      const factor = from.toBaseFactor / to.toBaseFactor;
      const exampleInput = 10;
      const exampleOutput = +(exampleInput * factor).toFixed(6);

      const name = `${from.label.split(" (")[0]} to ${to.label.split(" (")[0]} Converter`;

      tools.push({
        id: `unit-${spec.categorySlugSuffix}-${slug}`,
        slug,
        categorySlug: "unit-converters",
        subcategorySlug: spec.subcategorySlug,
        name,
        shortDescription: `Convert ${from.label} to ${to.label} instantly with exact precision.`,
        longDescription:
          `This ${spec.unitName.toLowerCase()} converter transforms values from ${from.label} ` +
          `into ${to.label} using the precise conversion factor 1 ${from.key.replace(/-/g, " ")} = ` +
          `${factor.toFixed(10).replace(/0+$/, "").replace(/\.$/, "")} ${to.key.replace(/-/g, " ")}. ` +
          `For example, ${exampleInput} ${from.label} equals exactly ${exampleOutput} ${to.label}. ` +
          `All calculations run instantly in your browser — no page reload, no data sent to a server.`,
        engine: "unit-converter",
        engineConfig: {
          fromUnit: from.key,
          toUnit: to.key,
          toBaseFactor: from.toBaseFactor,
          targetBaseFactor: to.toBaseFactor,
          baseUnitLabel: spec.baseUnitLabel,
        },
        fields: [
          numberField({
            id: "inputValue",
            label: `Value in ${from.label}`,
            defaultValue: exampleInput,
            helpText: `Enter the quantity in ${from.label} you want to convert.`,
          }),
        ],
        output: { format: "number", copyable: true, downloadable: false },
        seo: {
          metaTitle: `${name} — Free Online Tool`,
          metaDescription: `Convert ${from.label} to ${to.label} instantly. Free, accurate ${spec.unitName.toLowerCase()} converter with exact conversion factors — no signup required.`,
          indexTier: "high",
          faqs: [
            {
              question: `How do I convert ${from.label} to ${to.label}?`,
              answer: `Multiply the value in ${from.label} by ${factor.toFixed(6)} to get the equivalent in ${to.label}. For example, ${exampleInput} ${from.label} = ${exampleOutput} ${to.label}.`,
            },
            {
              question: `What is 1 ${from.label} in ${to.label}?`,
              answer: `1 ${from.label} equals ${factor.toFixed(6)} ${to.label}.`,
            },
          ],
        },
        relatedToolSlugs: spec.units
          .filter((u) => u.key !== from.key && u.key !== to.key)
          .slice(0, 3)
          .map((u) => `${from.key}-to-${u.key}`),
        tags: [spec.unitName.toLowerCase(), from.key, to.key, "converter"],
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return tools;
}

// Special case: Temperature cannot use a linear factor (offset-based),
// so it is hand-authored with real per-scale formulas rather than
// forced into the generic factor-based generator above.
function generateTemperatureConverterTools(): ToolDefinition[] {
  type Scale = "celsius" | "fahrenheit" | "kelvin";
  const scales: { key: Scale; label: string }[] = [
    { key: "celsius", label: "Celsius (°C)" },
    { key: "fahrenheit", label: "Fahrenheit (°F)" },
    { key: "kelvin", label: "Kelvin (K)" },
  ];

  const now = new Date().toISOString();
  const tools: ToolDefinition[] = [];

  const convert = (value: number, from: Scale, to: Scale): number => {
    let celsius: number;
    if (from === "celsius") celsius = value;
    else if (from === "fahrenheit") celsius = ((value - 32) * 5) / 9;
    else celsius = value - 273.15;

    if (to === "celsius") return celsius;
    if (to === "fahrenheit") return (celsius * 9) / 5 + 32;
    return celsius + 273.15;
  };

  for (const from of scales) {
    for (const to of scales) {
      if (from.key === to.key) continue;
      resetFieldOrder();
      const slug = `${from.key}-to-${to.key}`;
      const example = 25;
      const result = +convert(example, from.key, to.key).toFixed(2);
      const name = `${from.label.split(" (")[0]} to ${to.label.split(" (")[0]} Converter`;

      tools.push({
        id: `unit-temperature-${slug}`,
        slug,
        categorySlug: "unit-converters",
        subcategorySlug: "temperature",
        name,
        shortDescription: `Convert ${from.label} to ${to.label} using the exact formula.`,
        longDescription:
          `This temperature converter transforms ${from.label} into ${to.label} using the ` +
          `standard scientific conversion formula. For example, ${example}${from.key === "celsius" ? "°C" : from.key === "fahrenheit" ? "°F" : "K"} ` +
          `equals ${result}${to.key === "celsius" ? "°C" : to.key === "fahrenheit" ? "°F" : "K"}. ` +
          `Calculations happen instantly in your browser using double-precision arithmetic.`,
        engine: "calculator",
        engineConfig: { formulaType: "temperature", from: from.key, to: to.key },
        fields: [
          numberField({
            id: "inputValue",
            label: `Value in ${from.label}`,
            defaultValue: example,
          }),
        ],
        output: { format: "number", copyable: true, downloadable: false },
        seo: {
          metaTitle: `${name} — Free Online Tool`,
          metaDescription: `Convert ${from.label} to ${to.label} instantly with the precise temperature formula. Free and accurate — no signup required.`,
          indexTier: "high",
          faqs: [
            {
              question: `What is the formula to convert ${from.label} to ${to.label}?`,
              answer:
                from.key === "celsius" && to.key === "fahrenheit"
                  ? "°F = (°C × 9/5) + 32"
                  : from.key === "fahrenheit" && to.key === "celsius"
                  ? "°C = (°F − 32) × 5/9"
                  : from.key === "celsius" && to.key === "kelvin"
                  ? "K = °C + 273.15"
                  : from.key === "kelvin" && to.key === "celsius"
                  ? "°C = K − 273.15"
                  : from.key === "fahrenheit" && to.key === "kelvin"
                  ? "K = (°F − 32) × 5/9 + 273.15"
                  : "°F = (K − 273.15) × 9/5 + 32",
            },
            {
              question: `What is ${example} ${from.label} in ${to.label}?`,
              answer: `${example} ${from.label} equals ${result} ${to.label}.`,
            },
          ],
        },
        relatedToolSlugs: scales
          .filter((s) => s.key !== from.key && s.key !== to.key)
          .map((s) => `${from.key}-to-${s.key}`),
        tags: ["temperature", from.key, to.key, "converter"],
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return tools;
}

// =======================================================================
// SECTION B — HAND-AUTHORED FLAGSHIP TOOLS (non-converter categories)
// =======================================================================

function buildFlagshipTools(): ToolDefinition[] {
  const now = new Date().toISOString();
  const tools: ToolDefinition[] = [];

  // --- Calculators: Finance ---
  resetFieldOrder();
  tools.push({
    id: "calc-percentage",
    slug: "percentage-calculator",
    categorySlug: "calculators",
    subcategorySlug: "math",
    name: "Percentage Calculator",
    shortDescription: "Calculate percentages, percentage increase/decrease, and ratios instantly.",
    longDescription:
      "This percentage calculator handles the three most common percentage problems: finding what percentage one number is of another, calculating a percentage of a given value, and determining percentage increase or decrease between two numbers. All math runs instantly in your browser with no rounding errors.",
    engine: "calculator",
    engineConfig: { formulaType: "percentage-of-value" },
    fields: [
      numberField({ id: "percentage", label: "Percentage (%)", defaultValue: 25 }),
      numberField({ id: "value", label: "Of Value", defaultValue: 200 }),
    ],
    output: { format: "number", copyable: true, downloadable: false },
    seo: {
      metaTitle: "Percentage Calculator — Free Online Tool",
      metaDescription: "Calculate percentages, percentage increase, and percentage decrease instantly. Free, accurate, no signup required.",
      indexTier: "high",
      faqs: [
        { question: "How do I calculate a percentage of a number?", answer: "Multiply the number by the percentage, then divide by 100. For example, 25% of 200 is (25 × 200) / 100 = 50." },
        { question: "How do I calculate percentage increase?", answer: "Subtract the original value from the new value, divide by the original value, then multiply by 100." },
      ],
    },
    relatedToolSlugs: ["loan-emi-calculator", "discount-calculator"],
    tags: ["percentage", "math", "calculator"],
    createdAt: now,
    updatedAt: now,
  });

  resetFieldOrder();
  tools.push({
    id: "calc-loan-emi",
    slug: "loan-emi-calculator",
    categorySlug: "calculators",
    subcategorySlug: "finance",
    name: "Loan EMI Calculator",
    shortDescription: "Calculate your monthly loan installment (EMI) with interest breakdown.",
    longDescription:
      "This EMI calculator uses the standard reducing-balance formula EMI = [P × R × (1+R)^N] / [(1+R)^N − 1] to compute your exact monthly installment, where P is principal, R is monthly interest rate, and N is the number of months. It also shows total interest payable over the loan term.",
    engine: "calculator",
    engineConfig: { formulaType: "loan-emi" },
    fields: [
      numberField({ id: "principal", label: "Loan Amount", defaultValue: 100000, min: 0 }),
      numberField({ id: "annualRate", label: "Annual Interest Rate (%)", defaultValue: 8.5, min: 0, step: 0.1 }),
      numberField({ id: "tenureMonths", label: "Loan Tenure (Months)", defaultValue: 36, min: 1 }),
    ],
    output: { format: "table", copyable: true, downloadable: true },
    seo: {
      metaTitle: "Loan EMI Calculator — Free Online Tool",
      metaDescription: "Calculate your monthly loan EMI, total interest, and total payment instantly. Free and accurate EMI calculator.",
      indexTier: "high",
      faqs: [
        { question: "What formula is used to calculate EMI?", answer: "EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P = principal, R = monthly interest rate, N = number of monthly installments." },
        { question: "Does this include processing fees?", answer: "No, this calculator computes pure principal and interest EMI. Lender fees should be added separately." },
      ],
    },
    relatedToolSlugs: ["percentage-calculator"],
    tags: ["loan", "emi", "finance", "calculator"],
    createdAt: now,
    updatedAt: now,
  });

  // --- Calculators: Health ---
  resetFieldOrder();
  tools.push({
    id: "calc-bmi",
    slug: "bmi-calculator",
    categorySlug: "calculators",
    subcategorySlug: "health-fitness",
    name: "BMI Calculator",
    shortDescription: "Calculate your Body Mass Index (BMI) and see your weight category.",
    longDescription:
      "This BMI calculator uses the standard formula BMI = weight(kg) / height(m)² to compute your Body Mass Index and classify it according to World Health Organization categories: underweight, normal, overweight, and obese. Supports both metric and imperial units.",
    engine: "calculator",
    engineConfig: { formulaType: "bmi" },
    fields: [
      selectField({
        id: "unitSystem",
        label: "Unit System",
        options: [
          { label: "Metric (kg, cm)", value: "metric" },
          { label: "Imperial (lb, in)", value: "imperial" },
        ],
      }),
      numberField({ id: "weight", label: "Weight", defaultValue: 70, min: 1 }),
      numberField({ id: "height", label: "Height", defaultValue: 170, min: 1 }),
    ],
    output: { format: "text", copyable: true, downloadable: false },
    seo: {
      metaTitle: "BMI Calculator — Free Online Tool",
      metaDescription: "Calculate your Body Mass Index (BMI) instantly with metric or imperial units. Free, accurate BMI calculator with category classification.",
      indexTier: "high",
      faqs: [
        { question: "What is a healthy BMI range?", answer: "According to the WHO, a BMI between 18.5 and 24.9 is considered a healthy weight range for most adults." },
        { question: "Is BMI accurate for everyone?", answer: "BMI is a general screening tool and does not account for muscle mass, bone density, or body composition differences." },
      ],
    },
    relatedToolSlugs: ["percentage-calculator"],
    tags: ["bmi", "health", "fitness", "calculator"],
    createdAt: now,
    updatedAt: now,
  });

  // --- Text Tools ---
  resetFieldOrder();
  tools.push({
    id: "text-case-converter",
    slug: "case-converter",
    categorySlug: "text-tools",
    subcategorySlug: "case-conversion",
    name: "Text Case Converter",
    shortDescription: "Convert text to uppercase, lowercase, title case, or sentence case instantly.",
    longDescription:
      "This text case converter transforms any input text into uppercase, lowercase, title case, or sentence case in real time as you type, entirely in your browser. Useful for formatting headlines, cleaning up pasted content, or preparing text for different style guides.",
    engine: "text-transform",
    engineConfig: { transformType: "case" },
    fields: [
      textareaField({ id: "inputText", label: "Your Text", placeholder: "Type or paste text here..." }),
      selectField({
        id: "caseType",
        label: "Convert To",
        options: [
          { label: "UPPERCASE", value: "upper" },
          { label: "lowercase", value: "lower" },
          { label: "Title Case", value: "title" },
          { label: "Sentence case", value: "sentence" },
        ],
      }),
    ],
    output: { format: "text", copyable: true, downloadable: false },
    seo: {
      metaTitle: "Text Case Converter — Free Online Tool",
      metaDescription: "Convert text to uppercase, lowercase, title case, or sentence case instantly. Free, fast, browser-based text case converter.",
      indexTier: "high",
      faqs: [
        { question: "Does this tool store my text?", answer: "No. All conversion happens locally in your browser — no text is sent to or stored on any server." },
        { question: "What is Title Case?", answer: "Title Case capitalizes the first letter of each major word, commonly used for headlines and titles." },
      ],
    },
    relatedToolSlugs: ["word-counter"],
    tags: ["text", "case", "converter"],
    createdAt: now,
    updatedAt: now,
  });

  resetFieldOrder();
  tools.push({
    id: "text-word-counter",
    slug: "word-counter",
    categorySlug: "text-tools",
    subcategorySlug: "counters",
    name: "Word Counter",
    shortDescription: "Count words, characters, sentences, and paragraphs in real time.",
    longDescription:
      "This word counter analyzes your text as you type and instantly reports word count, character count (with and without spaces), sentence count, and paragraph count. Useful for meeting essay requirements, social media limits, or SEO content length targets.",
    engine: "text-transform",
    engineConfig: { transformType: "count" },
    fields: [
      textareaField({ id: "inputText", label: "Your Text", placeholder: "Start typing to see live counts..." }),
    ],
    output: { format: "table", copyable: false, downloadable: false },
    seo: {
      metaTitle: "Word Counter — Free Online Tool",
      metaDescription: "Count words, characters, and sentences in real time. Free online word counter for essays, posts, and SEO content.",
      indexTier: "high",
      faqs: [
        { question: "Does the word counter include spaces?", answer: "The tool displays both character count with spaces and without spaces, so you can see both measurements." },
        { question: "Is there a word limit?", answer: "No limit is enforced by the tool itself, though extremely large documents may process slightly slower." },
      ],
    },
    relatedToolSlugs: ["case-converter"],
    tags: ["text", "counter", "words"],
    createdAt: now,
    updatedAt: now,
  });

  // --- Developer Tools ---
  resetFieldOrder();
  tools.push({
    id: "dev-json-formatter",
    slug: "json-formatter",
    categorySlug: "developer-tools",
    subcategorySlug: "json",
    name: "JSON Formatter & Validator",
    shortDescription: "Format, validate, and beautify JSON data instantly with error highlighting.",
    longDescription:
      "This JSON formatter parses your input, validates its syntax, and outputs a cleanly indented, human-readable version. If the JSON is malformed, it reports the exact parse error so you can fix it quickly — all processing happens client-side for privacy and speed.",
    engine: "json-tool",
    engineConfig: { mode: "format", indentSize: 2 },
    fields: [
      textareaField({
        id: "inputJson",
        label: "JSON Input",
        placeholder: '{"example": "paste your JSON here"}',
        validation: { required: true, maxLength: 200_000 },
      }),
      checkboxField({ id: "minify", label: "Minify instead of beautify" }),
    ],
    output: { format: "code", copyable: true, downloadable: true },
    seo: {
      metaTitle: "JSON Formatter & Validator — Free Online Tool",
      metaDescription: "Format, validate, and beautify JSON instantly in your browser. Free JSON formatter with syntax error detection.",
      indexTier: "high",
      faqs: [
        { question: "Is my JSON data uploaded to a server?", answer: "No. All formatting and validation happens entirely in your browser using client-side JavaScript." },
        { question: "What happens if my JSON is invalid?", answer: "The tool displays the exact error message and position where parsing failed, helping you locate the issue quickly." },
      ],
    },
    relatedToolSlugs: ["base64-encoder-decoder"],
    tags: ["json", "developer", "formatter", "validator"],
    createdAt: now,
    updatedAt: now,
  });

  resetFieldOrder();
  tools.push({
    id: "dev-base64",
    slug: "base64-encoder-decoder",
    categorySlug: "developer-tools",
    subcategorySlug: "encoding",
    name: "Base64 Encoder & Decoder",
    shortDescription: "Encode text to Base64 or decode Base64 strings back to plain text.",
    longDescription:
      "This tool converts plain text into Base64-encoded output or decodes existing Base64 strings back into readable text, using the browser's native encoding APIs for guaranteed correctness and speed. Commonly used for embedding binary-safe data in JSON, URLs, or emails.",
    engine: "encoder-decoder",
    engineConfig: { codec: "base64" },
    fields: [
      textareaField({ id: "inputText", label: "Input", placeholder: "Enter text or Base64 string..." }),
      selectField({
        id: "mode",
        label: "Mode",
        options: [
          { label: "Encode to Base64", value: "encode" },
          { label: "Decode from Base64", value: "decode" },
        ],
      }),
    ],
    output: { format: "text", copyable: true, downloadable: false },
    seo: {
      metaTitle: "Base64 Encoder & Decoder — Free Online Tool",
      metaDescription: "Encode text to Base64 or decode Base64 to text instantly. Free, fast, browser-based Base64 converter.",
      indexTier: "high",
      faqs: [
        { question: "Is Base64 encoding the same as encryption?", answer: "No. Base64 is an encoding scheme, not encryption — it provides no security and can be reversed by anyone." },
        { question: "Can I decode any Base64 string?", answer: "Yes, as long as the input is valid Base64. Invalid input will produce a decoding error." },
      ],
    },
    relatedToolSlugs: ["json-formatter"],
    tags: ["base64", "encoding", "decoding", "developer"],
    createdAt: now,
    updatedAt: now,
  });

  // --- Generators ---
  resetFieldOrder();
  tools.push({
    id: "gen-password",
    slug: "password-generator",
    categorySlug: "generators",
    subcategorySlug: "security",
    name: "Strong Password Generator",
    shortDescription: "Generate cryptographically secure random passwords with custom rules.",
    longDescription:
      "This password generator uses the browser's cryptographically secure random number generator (crypto.getRandomValues) to create strong, unpredictable passwords. You can customize length and character sets (uppercase, lowercase, numbers, symbols) to meet any security policy.",
    engine: "generator",
    engineConfig: { generatorType: "password" },
    fields: [
      numberField({ id: "length", label: "Password Length", defaultValue: 16, min: 4, max: 128 }),
      checkboxField({ id: "includeUppercase", label: "Include Uppercase Letters", defaultValue: true }),
      checkboxField({ id: "includeLowercase", label: "Include Lowercase Letters", defaultValue: true }),
      checkboxField({ id: "includeNumbers", label: "Include Numbers", defaultValue: true }),
      checkboxField({ id: "includeSymbols", label: "Include Symbols", defaultValue: true }),
    ],
    output: { format: "text", copyable: true, downloadable: false },
    seo: {
      metaTitle: "Strong Password Generator — Free Online Tool",
      metaDescription: "Generate cryptographically secure random passwords instantly. Free, customizable password generator — no data stored.",
      indexTier: "high",
      faqs: [
        { question: "Is this password generator secure?", answer: "Yes, it uses the Web Crypto API's getRandomValues method, which provides cryptographically secure randomness suitable for password generation." },
        { question: "Are generated passwords stored anywhere?", answer: "No. Passwords are generated and displayed entirely in your browser and are never transmitted or stored." },
      ],
    },
    relatedToolSlugs: ["uuid-generator"],
    tags: ["password", "security", "generator"],
    createdAt: now,
    updatedAt: now,
  });

  resetFieldOrder();
  tools.push({
    id: "gen-uuid",
    slug: "uuid-generator",
    categorySlug: "generators",
    subcategorySlug: "identifiers",
    name: "UUID Generator",
    shortDescription: "Generate RFC 4122 version 4 UUIDs instantly, one or in bulk.",
    longDescription:
      "This UUID generator creates RFC 4122-compliant version 4 UUIDs using the browser's native crypto.randomUUID() API, ensuring standards-compliant, collision-resistant unique identifiers for use in databases, APIs, and distributed systems.",
    engine: "generator",
    engineConfig: { generatorType: "uuid-v4" },
    fields: [
      numberField({ id: "count", label: "Number of UUIDs", defaultValue: 5, min: 1, max: 1000 }),
      checkboxField({ id: "uppercase", label: "Uppercase output" }),
    ],
    output: { format: "text", copyable: true, downloadable: true },
    seo: {
      metaTitle: "UUID Generator (v4) — Free Online Tool",
      metaDescription: "Generate RFC 4122 version 4 UUIDs instantly, in bulk. Free, standards-compliant UUID generator.",
      indexTier: "high",
      faqs: [
        { question: "What is a UUID v4?", answer: "A UUID version 4 is a 128-bit universally unique identifier generated using random numbers, with a vanishingly small probability of collision." },
        { question: "Can I generate multiple UUIDs at once?", answer: "Yes, you can generate up to 1000 UUIDs in a single batch and download them as a text file." },
      ],
    },
    relatedToolSlugs: ["password-generator"],
    tags: ["uuid", "generator", "developer"],
    createdAt: now,
    updatedAt: now,
  });

  // --- Color Tools ---
  resetFieldOrder();
  tools.push({
    id: "color-hex-to-rgb",
    slug: "hex-to-rgb-converter",
    categorySlug: "color-tools",
    subcategorySlug: "conversion",
    name: "HEX to RGB Converter",
    shortDescription: "Convert HEX color codes to RGB values instantly with a live preview.",
    longDescription:
      "This tool converts any HEX color code (e.g. #3366FF) into its equivalent RGB value (e.g. rgb(51, 102, 255)), with a live color swatch preview. Useful for designers and developers moving between CSS color formats.",
    engine: "color-tool",
    engineConfig: { conversionType: "hex-to-rgb" },
    fields: [
      textField({
        id: "hexValue",
        label: "HEX Color",
        defaultValue: "#3366FF",
        placeholder: "#3366FF",
        validation: {
          required: true,
          pattern: "^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$",
          patternMessage: "Enter a valid HEX color, e.g. #3366FF",
        },
      }),
    ],
    output: { format: "color", copyable: true, downloadable: false },
    seo: {
      metaTitle: "HEX to RGB Converter — Free Online Tool",
      metaDescription: "Convert HEX color codes to RGB values instantly with live preview. Free color converter for designers and developers.",
      indexTier: "high",
      faqs: [
        { question: "How is HEX converted to RGB?", answer: "Each pair of HEX digits represents the red, green, and blue channel values in base-16, which are converted to base-10 to produce the RGB equivalent." },
        { question: "Does this support 3-digit HEX codes?", answer: "Yes, shorthand 3-digit HEX codes (e.g. #36F) are automatically expanded and converted correctly." },
      ],
    },
    relatedToolSlugs: [],
    tags: ["color", "hex", "rgb", "converter"],
    createdAt: now,
    updatedAt: now,
  });

  return tools;
}

// =======================================================================
// SECTION C — REGISTRY ASSEMBLY
// =======================================================================

function assembleRegistry(): ToolDefinition[] {
  const unitTools = UNIT_SPECS.flatMap(generateUnitConverterTools);
  const temperatureTools = generateTemperatureConverterTools();
  const flagshipTools = buildFlagshipTools();

  return [...unitTools, ...temperatureTools, ...flagshipTools];
}

export const TOOL_REGISTRY: ToolDefinition[] = assembleRegistry();

// =======================================================================
// SECTION D — BUILD-TIME VALIDATION (enforces "zero dummy pages")
// =======================================================================

export function validateToolRegistry(): ToolRegistryValidationResult {
  const errors: ToolValidationError[] = [];
  const collisionGuard = createSlugCollisionGuard();
  const idSet = new Set<string>();

  for (const tool of TOOL_REGISTRY) {
    // Unique ID check
    if (idSet.has(tool.id)) {
      errors.push({ toolId: tool.id, slug: tool.slug, reason: "Duplicate tool id." });
    }
    idSet.add(tool.id);

    // Slug format check
    if (!isValidSlug(tool.slug)) {
      errors.push({ toolId: tool.id, slug: tool.slug, reason: "Invalid slug format." });
    }

    // Category FK check
    if (!isValidCategorySlug(tool.categorySlug)) {
      errors.push({
        toolId: tool.id,
        slug: tool.slug,
        reason: `References unknown category "${tool.categorySlug}".`,
      });
    }

    // Slug collision check (category + slug must be globally unique)
    try {
      collisionGuard.check(tool.categorySlug, tool.slug, tool.id);
    } catch (e) {
      errors.push({
        toolId: tool.id,
        slug: tool.slug,
        reason: (e as Error).message,
      });
    }

    // --- CONTENT DEPTH GATE (anti-thin-content enforcement) ---
    if (!tool.longDescription || tool.longDescription.trim().length < 80) {
      errors.push({
        toolId: tool.id,
        slug: tool.slug,
        reason: "longDescription is missing or too short (< 80 chars) — thin content risk.",
      });
    }
    if (!tool.seo.faqs || tool.seo.faqs.length < 2) {
      errors.push({
        toolId: tool.id,
        slug: tool.slug,
        reason: "Must have at least 2 FAQ entries for FAQ schema + content depth.",
      });
    }
    if (!tool.fields || tool.fields.length === 0) {
      errors.push({
        toolId: tool.id,
        slug: tool.slug,
        reason: "Tool has zero input fields — this is a dummy/non-functional page.",
      });
    }
    if (tool.seo.metaTitle.length > 70) {
      errors.push({
        toolId: tool.id,
        slug: tool.slug,
        reason: `metaTitle exceeds 70 chars (${tool.seo.metaTitle.length}).`,
      });
    }
    if (tool.seo.metaDescription.length > 170) {
      errors.push({
        toolId: tool.id,
        slug: tool.slug,
        reason: `metaDescription exceeds 170 chars (${tool.seo.metaDescription.length}).`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    totalTools: TOOL_REGISTRY.length,
    errors,
  };
}

// Fail fast at module load — if this throws, `next build` fails,
// which is the intended behavior: we would rather break the build
// than ship a single thin/broken tool page to production.
const validationResult = validateToolRegistry();
if (!validationResult.valid) {
  const preview = validationResult.errors.slice(0, 10)
    .map((e) => `  - [${e.toolId}] /${e.slug}: ${e.reason}`)
    .join("\n");
  throw new Error(
    `[TOOL REGISTRY VALIDATION FAILED] ${validationResult.errors.length} error(s) found ` +
      `across ${validationResult.totalTools} tools:\n${preview}` +
      (validationResult.errors.length > 10 ? "\n  ...and more." : "")
  );
}

// =======================================================================
// SECTION E — PUBLIC QUERY API (consumed by Phase 3, 4, 5)
// =======================================================================

const toolBySlugKey = new Map(
  TOOL_REGISTRY.map((t) => [`${t.categorySlug}/${t.slug}`, t])
);
const toolById = new Map(TOOL_REGISTRY.map((t) => [t.id, t]));

export function getToolByPath(
  categorySlug: string,
  toolSlug: string
): ToolDefinition | undefined {
  return toolBySlugKey.get(`${categorySlug}/${toolSlug}`);
}

export function getToolById(id: string): ToolDefinition | undefined {
  return toolById.get(id);
}

export function getAllTools(): ToolDefinition[] {
  return TOOL_REGISTRY;
}

export function getToolsByCategory(categorySlug: string): ToolDefinition[] {
  return TOOL_REGISTRY.filter((t) => t.categorySlug === categorySlug);
}

export function getToolsBySubcategory(
  categorySlug: string,
  subcategorySlug: string
): ToolDefinition[] {
  return TOOL_REGISTRY.filter(
    (t) => t.categorySlug === categorySlug && t.subcategorySlug === subcategorySlug
  );
}

export function getHighTierTools(): ToolDefinition[] {
  return TOOL_REGISTRY.filter((t) => t.seo.indexTier === "high");
}

export function getRelatedTools(tool: ToolDefinition, limit = 4): ToolDefinition[] {
  const related = tool.relatedToolSlugs
    .map((slug) => getToolByPath(tool.categorySlug, slug))
    .filter((t): t is ToolDefinition => Boolean(t));
  return related.slice(0, limit);
}

export interface PaginatedTools {
  tools: ToolDefinition[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function paginateTools(
  source: ToolDefinition[],
  page: number,
  pageSize = 24
): PaginatedTools {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  return {
    tools: source.slice(start, end),
    total: source.length,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(source.length / pageSize)),
  };
}

export function getTotalToolCount(): number {
  return TOOL_REGISTRY.length;
}
