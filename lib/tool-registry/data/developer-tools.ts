import { toolDefinitionSchema } from "../types";
import type { ToolDefinition } from "../types";

const RAW_DEVELOPER_TOOLS: ToolDefinition[] = [
  {
    slug: "json-formatter-validator",
    category: "developer-tools",
    name: "JSON Formatter & Validator",
    shortDescription:
      "Format, validate, and beautify messy JSON instantly in your browser with syntax error locations and one-click minification.",
    longDescription:
      "The JSON Formatter & Validator parses raw JSON text entirely on the client side — no data ever leaves your browser — and re-serializes it with consistent indentation, sorted or unsorted keys, and clear syntax error reporting including the exact line and character position of the failure. It is built for API developers debugging malformed payloads, QA engineers inspecting network responses, and students learning JSON structure. Unlike basic formatters, this tool distinguishes between a syntactically invalid document (unterminated strings, trailing commas, unquoted keys) and a structurally unusual-but-valid document, giving actionable feedback instead of a generic 'invalid JSON' message.",
    icon: "braces",
    seo: {
      metaTitle: "JSON Formatter & Validator Online – Free JSON Beautifier",
      metaDescription:
        "Format, validate, and beautify JSON online instantly. Get exact error line numbers. Fast, free, and fully client-side — no uploads required.",
      keywords: [
        "json formatter",
        "json validator",
        "json beautifier",
        "format json online",
        "validate json syntax",
        "minify json",
      ],
    },
    fields: [
      {
        id: "jsonInput",
        label: "Paste your JSON",
        type: "textarea",
        placeholder: '{"example": "paste your raw JSON here"}',
        helpText:
          "Your JSON is processed locally in your browser and is never uploaded.",
        required: true,
      },
      {
        id: "indentSize",
        label: "Indentation",
        type: "select",
        required: false,
        defaultValue: "2",
        options: [
          { label: "2 spaces", value: "2" },
          { label: "4 spaces", value: "4" },
          { label: "Tabs", value: "tab" },
          { label: "Minify (no whitespace)", value: "minify" },
        ],
      },
      {
        id: "sortKeys",
        label: "Sort object keys alphabetically",
        type: "checkbox",
        required: false,
        defaultValue: false,
      },
    ],
    transform: { ruleId: "json-format-validate", config: {} },
    usageGuide: [
      {
        step: 1,
        title: "Paste or type your raw JSON",
        description:
          "Copy the JSON response from your API client, config file, or log output and paste it into the input field. Partial or pretty-printed JSON both work.",
      },
      {
        step: 2,
        title: "Choose your indentation preference",
        description:
          "Select 2-space, 4-space, or tab indentation for readability, or choose Minify to strip all whitespace for production payloads.",
      },
      {
        step: 3,
        title: "Review the formatted output or error report",
        description:
          "Valid JSON is re-rendered instantly with syntax highlighting. If the JSON is invalid, the tool reports the exact line and character position of the first parsing failure.",
      },
      {
        step: 4,
        title: "Copy or download the result",
        description:
          "Use the copy button to place the formatted JSON on your clipboard, or download it as a .json file for use directly in your project.",
      },
    ],
    faqs: [
      {
        question: "Is my JSON data uploaded to a server?",
        answer:
          "No. All parsing, validation, and formatting happens entirely in your browser using native JavaScript JSON parsing. Your data never leaves your device, which makes this tool safe for API keys, tokens, and other sensitive payloads.",
      },
      {
        question: "Why does the tool report 'Unexpected token' errors?",
        answer:
          "This typically means your JSON contains a trailing comma after the last property, single quotes instead of double quotes around strings, or an unquoted object key — all valid in JavaScript object literals but invalid in strict JSON.",
      },
      {
        question: "Can I format very large JSON files?",
        answer:
          "Yes, the formatter handles payloads up into the multi-megabyte range directly in the browser. For extremely large files, performance depends on your device's available memory since processing is entirely client-side.",
      },
      {
        question: "What is the difference between formatting and minifying?",
        answer:
          "Formatting adds indentation and line breaks for human readability during development and debugging. Minifying removes all unnecessary whitespace to reduce payload size for production API responses or storage.",
      },
    ],
    examples: [
      {
        title: "Formatting a compact API response",
        input: '{"id":1,"name":"Alice","active":true}',
        output: '{\n  "id": 1,\n  "name": "Alice",\n  "active": true\n}',
        explanation:
          "A single-line JSON object is re-indented with 2-space formatting, making nested structures easy to scan during debugging.",
      },
      {
        title: "Catching a trailing comma error",
        input: '{"id":1,"name":"Alice",}',
        output:
          "Error: Unexpected token '}' at position 23 (line 1, column 24) — trailing comma is not valid in strict JSON.",
        explanation:
          "The tool pinpoints the exact invalid character rather than failing silently, so hand-written or legacy JSON can be fixed quickly.",
      },
    ],
    relatedToolSlugs: ["word-character-counter", "text-case-converter"],
    isFeatured: true,
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
];

export const DEVELOPER_TOOLS: ToolDefinition[] = RAW_DEVELOPER_TOOLS.map((t) =>
  toolDefinitionSchema.parse(t)
);
