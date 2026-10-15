export type FieldDef = {
  name: string;
  label: string;
  type: "number" | "text" | "select";
  options?: string[];
  defaultValue?: string;
};

export const MATH_FIELDS: Record<string, FieldDef[]> = {
  percentage: [
    { name: "value", label: "Value", type: "number" },
    { name: "percent", label: "Percent (%)", type: "number" },
  ],
  percentagechange: [
    { name: "oldValue", label: "Old Value", type: "number" },
    { name: "newValue", label: "New Value", type: "number" },
  ],
  bmi: [
    { name: "weightKg", label: "Weight (kg)", type: "number" },
    { name: "heightM", label: "Height (m)", type: "number" },
  ],
  bmr: [
    { name: "weightKg", label: "Weight (kg)", type: "number" },
    { name: "heightCm", label: "Height (cm)", type: "number" },
    { name: "age", label: "Age", type: "number" },
    { name: "gender", label: "Gender", type: "select", options: ["male", "female"] },
  ],
  simpleinterest: [
    { name: "principal", label: "Principal", type: "number" },
    { name: "rate", label: "Rate (%)", type: "number" },
    { name: "years", label: "Years", type: "number" },
  ],
  compoundinterest: [
    { name: "principal", label: "Principal", type: "number" },
    { name: "rate", label: "Rate (%)", type: "number" },
    { name: "years", label: "Years", type: "number" },
    { name: "n", label: "Compounds/Year", type: "number", defaultValue: "1" },
  ],
  quadratic: [
    { name: "a", label: "a", type: "number" },
    { name: "b", label: "b", type: "number" },
    { name: "c", label: "c", type: "number" },
  ],
  gcd: [
    { name: "a", label: "Number A", type: "number" },
    { name: "b", label: "Number B", type: "number" },
  ],
  lcm: [
    { name: "a", label: "Number A", type: "number" },
    { name: "b", label: "Number B", type: "number" },
  ],
  factorial: [{ name: "n", label: "Number (n)", type: "number" }],
  isprime: [{ name: "n", label: "Number (n)", type: "number" }],
  circlearea: [{ name: "radius", label: "Radius", type: "number" }],
  trianglearea: [
    { name: "base", label: "Base", type: "number" },
    { name: "height", label: "Height", type: "number" },
  ],
  loanpayment: [
    { name: "principal", label: "Principal", type: "number" },
    { name: "rate", label: "Annual Rate (%)", type: "number" },
    { name: "months", label: "Months", type: "number" },
  ],
  discount: [
    { name: "price", label: "Price", type: "number" },
    { name: "percent", label: "Discount (%)", type: "number" },
  ],
  tipcalculator: [
    { name: "bill", label: "Bill Amount", type: "number" },
    { name: "percent", label: "Tip (%)", type: "number" },
    { name: "people", label: "People", type: "number", defaultValue: "1" },
  ],
  average: [
    { name: "values", label: "Comma-separated numbers", type: "text", defaultValue: "1,2,3" },
  ],
};

export const SEO_FIELDS: Record<string, FieldDef[]> = {
  slugify: [{ name: "text", label: "Text", type: "text" }],
  metatitlecheck: [{ name: "title", label: "Meta Title", type: "text" }],
  metadescriptioncheck: [{ name: "description", label: "Meta Description", type: "text" }],
  keyworddensity: [
    { name: "text", label: "Content", type: "text" },
    { name: "keyword", label: "Target Keyword", type: "text" },
  ],
  wordcounter: [{ name: "text", label: "Content", type: "text" }],
  readabilityscore: [{ name: "text", label: "Content", type: "text" }],
};
