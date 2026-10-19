// lib/engines/calculator-engine.ts
import type { ExecutionValues, ToolExecutionResult, TableResult } from "./types";

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "celsius") celsius = value;
  else if (from === "fahrenheit") celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;

  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export function runCalculatorEngine(
  engineConfig: Record<string, unknown>,
  values: ExecutionValues
): ToolExecutionResult {
  const formulaType = engineConfig.formulaType as string;

  switch (formulaType) {
    case "percentage-of-value": {
      const percentage = Number(values.percentage);
      const value = Number(values.value);
      if (!Number.isFinite(percentage) || !Number.isFinite(value)) {
        return { success: false, error: "Please enter valid numbers." };
      }
      const result = (percentage * value) / 100;
      return { success: true, format: "number", value: Math.round(result * 1e6) / 1e6 };
    }

    case "loan-emi": {
      const principal = Number(values.principal);
      const annualRate = Number(values.annualRate);
      const tenureMonths = Number(values.tenureMonths);

      if (!Number.isFinite(principal) || principal <= 0) {
        return { success: false, error: "Loan amount must be a positive number." };
      }
      if (!Number.isFinite(tenureMonths) || tenureMonths <= 0) {
        return { success: false, error: "Tenure must be a positive number of months." };
      }

      const monthlyRate = annualRate / 12 / 100;
      let emi: number;
      if (monthlyRate === 0) {
        emi = principal / tenureMonths;
      } else {
        const factor = Math.pow(1 + monthlyRate, tenureMonths);
        emi = (principal * monthlyRate * factor) / (factor - 1);
      }
      const totalPayment = emi * tenureMonths;
      const totalInterest = totalPayment - principal;

      const table: TableResult = {
        rows: [
          { label: "Monthly EMI", value: emi.toFixed(2) },
          { label: "Total Interest Payable", value: totalInterest.toFixed(2) },
          { label: "Total Payment", value: totalPayment.toFixed(2) },
        ],
        summary: `Over ${tenureMonths} months at ${annualRate}% annual interest.`,
      };

      return { success: true, format: "table", value: table };
    }

    case "bmi": {
      const unitSystem = values.unitSystem as string;
      const weight = Number(values.weight);
      const height = Number(values.height);

      if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(height) || height <= 0) {
        return { success: false, error: "Please enter valid weight and height." };
      }

      let weightKg = weight;
      let heightM = height / 100;

      if (unitSystem === "imperial") {
        weightKg = weight * 0.45359237;
        heightM = height * 0.0254; // height entered in inches
      }

      const bmi = weightKg / (heightM * heightM);
      let category: string;
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal weight";
      else if (bmi < 30) category = "Overweight";
      else category = "Obese";

      return { success: true, format: "text", value: `Your BMI is ${bmi.toFixed(1)} (${category})` };
    }

    case "temperature": {
      const from = engineConfig.from as string;
      const to = engineConfig.to as string;
      const inputValue = Number(values.inputValue);
      if (!Number.isFinite(inputValue)) {
        return { success: false, error: "Please enter a valid numeric value." };
      }
      const result = convertTemperature(inputValue, from, to);
      return { success: true, format: "number", value: Math.round(result * 1e4) / 1e4 };
    }

    default:
      return { success: false, error: `Unknown formula type: ${formulaType}` };
  }
}
