import { toolDefinitionSchema } from "../types";
import type { ToolDefinition } from "../types";

const RAW_MATH_CALCULATORS: ToolDefinition[] = [
  {
    slug: "percentage-calculator",
    category: "math-calculators",
    name: "Percentage Calculator",
    shortDescription:
      "Calculate percentage of a number, percentage increase or decrease, and what-percent relationships with clear formulas shown.",
    longDescription:
      "The Percentage Calculator solves the four most common percentage problems people search for: finding what a given percentage of a number is, calculating the percentage increase or decrease between two values, determining what percent one number represents of another, and reversing a percentage to find the original value. Each result is shown alongside the exact formula used, so students can learn the underlying math rather than receiving an opaque answer, and professionals can verify the calculation method matches their use case (such as markup vs. margin, or raise vs. discount).",
    icon: "percent",
    seo: {
      metaTitle: "Percentage Calculator – Find, Increase, or Decrease %",
      metaDescription:
        "Calculate percentages instantly: find what percent one number is of another, or apply a percentage increase or decrease to any value.",
      keywords: [
        "percentage calculator",
        "percent increase calculator",
        "percent decrease calculator",
        "what percent is x of y",
        "calculate percentage online",
      ],
    },
    fields: [
      {
        id: "calculationMode",
        label: "What do you want to calculate?",
        type: "select",
        required: true,
        defaultValue: "percent-of",
        options: [
          { label: "X% of a number", value: "percent-of" },
          { label: "Percentage increase", value: "increase" },
          { label: "Percentage decrease", value: "decrease" },
          { label: "What percent is X of Y", value: "what-percent" },
        ],
      },
      {
        id: "valueA",
        label: "Value A",
        type: "number",
        required: true,
        placeholder: "e.g. 50",
      },
      {
        id: "valueB",
        label: "Value B",
        type: "number",
        required: true,
        placeholder: "e.g. 200",
      },
    ],
    transform: { ruleId: "math-percentage", config: {} },
    usageGuide: [
      {
        step: 1,
        title: "Select the type of percentage calculation",
        description:
          "Choose whether you want to find a percentage of a number, calculate a percentage change, or determine what percent one number is of another.",
      },
      {
        step: 2,
        title: "Enter your two values",
        description:
          "Input the percentage and base number, or the original and new values, depending on the calculation mode you selected.",
      },
      {
        step: 3,
        title: "View the result and formula",
        description:
          "The calculator displays the final answer immediately alongside the exact formula used, so you can verify the math or apply it manually elsewhere.",
      },
    ],
    faqs: [
      {
        question: "How do I calculate a percentage increase between two numbers?",
        answer:
          "Subtract the original value from the new value, divide the result by the original value, then multiply by 100. The calculator performs this automatically when you select 'Percentage increase' mode.",
      },
      {
        question: "What is the difference between percentage and percentage points?",
        answer:
          "A percentage change describes relative change (e.g., going from 50% to 75% is a 50% relative increase), while a percentage-point change describes the absolute difference (in this example, 25 percentage points). This calculator computes relative percentage change by default.",
      },
      {
        question: "Can this calculator handle negative numbers?",
        answer:
          "Yes, negative values are supported for percentage increase and decrease calculations, correctly reflecting scenarios such as revenue decline or temperature drops below zero.",
      },
    ],
    examples: [
      {
        title: "Finding 15% of 200",
        input: "15% of 200",
        output: "30",
        explanation:
          "Calculated as (15 ÷ 100) × 200 = 30, commonly used for tip calculations or discount amounts.",
      },
      {
        title: "Calculating a percentage increase from 50 to 75",
        input: "Original: 50, New: 75",
        output: "50% increase",
        explanation:
          "Calculated as ((75 − 50) ÷ 50) × 100 = 50%, showing the relative growth between the two values.",
      },
    ],
    relatedToolSlugs: ["word-character-counter"],
    isFeatured: true,
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
];

export const MATH_CALCULATORS: ToolDefinition[] = RAW_MATH_CALCULATORS.map(
  (t) => toolDefinitionSchema.parse(t)
);
