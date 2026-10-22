import { toolDefinitionSchema } from "../types";
import type { ToolDefinition } from "../types";

const RAW_TEXT_TOOLS: ToolDefinition[] = [
  {
    slug: "word-character-counter",
    category: "text-tools",
    name: "Word & Character Counter",
    shortDescription:
      "Instantly count words, characters, sentences, and paragraphs with live reading-time estimates for writers, students, and editors.",
    longDescription:
      "The Word & Character Counter analyzes pasted or typed text in real time, reporting word count, character count (with and without spaces), sentence count, paragraph count, and an estimated reading time based on average adult reading speed. It is designed for students meeting assignment word limits, copywriters hitting platform character caps (such as meta descriptions or tweet limits), and editors auditing document length. The sentence and paragraph detection use punctuation-aware boundary rules rather than naive splitting, so abbreviations and decimal numbers do not inflate the sentence count artificially.",
    icon: "type",
    seo: {
      metaTitle: "Word & Character Counter – Free Online Text Counter Tool",
      metaDescription:
        "Count words, characters, sentences, and paragraphs instantly. Free online word counter with live reading time estimates and no sign-up required.",
      keywords: [
        "word counter",
        "character counter",
        "count words online",
        "text length checker",
        "reading time calculator",
        "sentence counter",
      ],
    },
    fields: [
      {
        id: "textInput",
        label: "Enter or paste your text",
        type: "textarea",
        placeholder: "Start typing or paste your text here...",
        required: true,
      },
      {
        id: "countMode",
        label: "Character count mode",
        type: "select",
        required: false,
        defaultValue: "with-spaces",
        options: [
          { label: "Include spaces", value: "with-spaces" },
          { label: "Exclude spaces", value: "without-spaces" },
        ],
      },
    ],
    transform: { ruleId: "text-count-stats", config: {} },
    usageGuide: [
      {
        step: 1,
        title: "Paste or type your text",
        description:
          "Enter any text directly into the input box — essays, social captions, articles, or scripts all work without a length limit.",
      },
      {
        step: 2,
        title: "Choose a character counting mode",
        description:
          "Toggle between counting with spaces (useful for platform character limits) or without spaces (useful for strict typing-speed metrics).",
      },
      {
        step: 3,
        title: "Read the live statistics panel",
        description:
          "Word count, character count, sentence count, paragraph count, and estimated reading time update automatically as you type.",
      },
    ],
    faqs: [
      {
        question: "How is reading time calculated?",
        answer:
          "Reading time is estimated using an average adult silent reading speed of 225 words per minute, rounded up to the nearest 30-second interval for practical use.",
      },
      {
        question: "Does the sentence counter get confused by abbreviations?",
        answer:
          "No. The sentence boundary detection recognizes common abbreviation patterns (such as 'Mr.', 'e.g.', and decimal numbers like '3.14') and does not treat the periods inside them as sentence endings.",
      },
      {
        question: "Is there a maximum text length I can analyze?",
        answer:
          "There is no hard-coded limit — the tool processes text entirely in your browser, so practical limits depend only on your device's available memory, typically allowing documents of tens of thousands of words.",
      },
    ],
    examples: [
      {
        title: "Checking a tweet-length caption",
        input: "Excited to launch our new product today! 🚀",
        output: "Words: 7 | Characters: 44 | Sentences: 1 | Reading time: <1 min",
        explanation:
          "Short-form social content is measured instantly, helping confirm it fits within platform character limits before posting.",
      },
    ],
    relatedToolSlugs: ["text-case-converter", "json-formatter-validator"],
    isFeatured: true,
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
  {
    slug: "text-case-converter",
    category: "text-tools",
    name: "Text Case Converter",
    shortDescription:
      "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case with one click.",
    longDescription:
      "The Text Case Converter transforms any block of text between six common casing conventions: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case. It is built for developers normalizing variable names, writers adjusting headline capitalization, and marketers preparing copy for different style guides. Title Case conversion correctly handles minor words (such as 'a', 'the', 'of') according to standard title-casing rules rather than naively capitalizing every word, and camelCase/snake_case conversions strip punctuation and normalize whitespace into valid identifier-safe tokens.",
    icon: "case-sensitive",
    seo: {
      metaTitle: "Text Case Converter – UPPERCASE, lowercase, Title Case",
      metaDescription:
        "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case instantly in your browser for free.",
      keywords: [
        "case converter",
        "text case converter",
        "uppercase to lowercase",
        "title case converter",
        "camel case converter",
        "snake case generator",
      ],
    },
    fields: [
      {
        id: "textInput",
        label: "Enter text to convert",
        type: "textarea",
        placeholder: "Type or paste the text you want to convert...",
        required: true,
      },
      {
        id: "targetCase",
        label: "Convert to",
        type: "select",
        required: true,
        defaultValue: "uppercase",
        options: [
          { label: "UPPERCASE", value: "uppercase" },
          { label: "lowercase", value: "lowercase" },
          { label: "Title Case", value: "title-case" },
          { label: "Sentence case", value: "sentence-case" },
          { label: "camelCase", value: "camel-case" },
          { label: "snake_case", value: "snake-case" },
        ],
      },
    ],
    transform: { ruleId: "text-case-convert", config: {} },
    usageGuide: [
      {
        step: 1,
        title: "Paste the text you want to convert",
        description:
          "Enter a single word, a sentence, or an entire paragraph — the converter processes text of any length instantly.",
      },
      {
        step: 2,
        title: "Select your target case format",
        description:
          "Choose from UPPERCASE, lowercase, Title Case, Sentence case, camelCase, or snake_case depending on your use case.",
      },
      {
        step: 3,
        title: "Copy the converted output",
        description:
          "The result updates live as you type or change the target format. Use the copy button to place it directly on your clipboard.",
      },
    ],
    faqs: [
      {
        question: "Does Title Case capitalize every single word?",
        answer:
          "No. Standard Title Case rules keep minor words such as 'a', 'an', 'the', 'and', and 'of' lowercase unless they are the first or last word of the text, matching conventional headline style guides.",
      },
      {
        question: "What happens to spaces when converting to camelCase or snake_case?",
        answer:
          "Spaces and punctuation are stripped and normalized: camelCase joins words with no separator and capitalizes each word after the first, while snake_case joins all words in lowercase separated by underscores.",
      },
      {
        question: "Can I convert multiple paragraphs at once?",
        answer:
          "Yes, the converter processes the entire input text block in one pass, preserving line breaks between paragraphs while applying the selected case transformation throughout.",
      },
    ],
    examples: [
      {
        title: "Converting a variable name to snake_case",
        input: "User First Name",
        output: "user_first_name",
        explanation:
          "Spaces are replaced with underscores and all characters are lowercased, producing a valid identifier for use in code.",
      },
      {
        title: "Converting a headline to Title Case",
        input: "the quick guide to effective seo",
        output: "The Quick Guide to Effective SEO",
        explanation:
          "Major words are capitalized while the minor word 'to' remains lowercase, following standard headline-casing conventions.",
      },
    ],
    relatedToolSlugs: ["word-character-counter", "json-formatter-validator"],
    isFeatured: false,
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
];

export const TEXT_TOOLS: ToolDefinition[] = RAW_TEXT_TOOLS.map((t) =>
  toolDefinitionSchema.parse(t)
);
