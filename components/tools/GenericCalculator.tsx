'use client';

// GenericCalculator — one engine, dozens of formulas, driven entirely by the
// `formulaKey` prop. Each formula owns its own field schema + compute logic
// here (co-located to guarantee inputs always match what compute() expects),
// while the registry/generator only supplies metadata (title, slug, currency
// variant, etc.) — this is what lets one component serve 50+ distinct,
// SEO-indexable calculator pages.

import { useEffect, useState } from 'react';
import { sanitizeNumber, sanitizeString } from '@/lib/sanitizer';

/* --------------------------------- Types --------------------------------- */

interface FieldOption {
  label: string;
  value: string;
}

interface FieldDef {
  key: string;
  label: string;
  type: 'number' | 'date' | 'text' | 'select';
  defaultValue: string;
  options?: FieldOption[];
  placeholder?: string;
  step?: string;
}

interface CalcLine {
  label: string;
  value: string;
}

interface CalcResult {
  headline: CalcLine;
  lines?: CalcLine[];
  note?: string;
}

type CalcError = { error: string };

interface FormulaDef {
  title: string;
  fields: FieldDef[];
  compute: (values: Record<string, string>, ctx: { currencySymbol: string }) => CalcResult | CalcError;
}

export interface GenericCalculatorProps {
  formulaKey: string;
  title?: string;
  currencySymbol?: string;
  locale?: string;
}

/* ------------------------------- Helpers ------------------------------- */

function num(values: Record<string, string>, key: string, fallback = 0): number {
  return sanitizeNumber(values[key], fallback);
}

function dateOf(values: Record<string, string>, key: string): Date | null {
  const raw = sanitizeString(values[key], 32);
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function money(value: number, symbol: string): string {
  if (!Number.isFinite(value)) return `${symbol}—`;
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function round(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/* ----------------------------- Formula Library ----------------------------- */

export const FORMULA_DEFS: Record<string, FormulaDef> = {
  'simple-interest': {
    title: 'Simple Interest Calculator',
    fields: [
      { key: 'principal', label: 'Principal Amount', type: 'number', defaultValue: '1000' },
      { key: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '5', step: '0.01' },
      { key: 'years', label: 'Time Period (years)', type: 'number', defaultValue: '2', step: '0.1' },
    ],
    compute: (v, ctx) => {
      const p = num(v, 'principal'), r = num(v, 'rate'), t = num(v, 'years');
      if (p <= 0 || t <= 0) return { error: 'Principal and time must be greater than zero.' };
      const interest = (p * r * t) / 100;
      return {
        headline: { label: 'Total Payable', value: money(p + interest, ctx.currencySymbol) },
        lines: [{ label: 'Interest Earned', value: money(interest, ctx.currencySymbol) }],
      };
    },
  },

  'compound-interest': {
    title: 'Compound Interest Calculator',
    fields: [
      { key: 'principal', label: 'Principal Amount', type: 'number', defaultValue: '1000' },
      { key: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '5', step: '0.01' },
      { key: 'years', label: 'Time Period (years)', type: 'number', defaultValue: '5', step: '0.1' },
      {
        key: 'n', label: 'Compounding Frequency', type: 'select', defaultValue: '12',
        options: [
          { label: 'Annually', value: '1' }, { label: 'Semi-Annually', value: '2' },
          { label: 'Quarterly', value: '4' }, { label: 'Monthly', value: '12' },
          { label: 'Daily', value: '365' },
        ],
      },
    ],
    compute: (v, ctx) => {
      const p = num(v, 'principal'), r = num(v, 'rate'), t = num(v, 'years'), n = num(v, 'n', 12);
      if (p <= 0 || t <= 0 || n <= 0) return { error: 'All values must be greater than zero.' };
      const amount = p * Math.pow(1 + r / 100 / n, n * t);
      return {
        headline: { label: 'Final Amount', value: money(amount, ctx.currencySymbol) },
        lines: [{ label: 'Interest Earned', value: money(amount - p, ctx.currencySymbol) }],
      };
    },
  },

  'loan-emi': {
    title: 'Loan EMI Calculator',
    fields: [
      { key: 'loanAmount', label: 'Loan Amount', type: 'number', defaultValue: '200000' },
      { key: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '8', step: '0.01' },
      { key: 'months', label: 'Tenure (months)', type: 'number', defaultValue: '60' },
    ],
    compute: (v, ctx) => {
      const p = num(v, 'loanAmount'), annual = num(v, 'rate'), n = num(v, 'months');
      if (p <= 0 || n <= 0) return { error: 'Loan amount and tenure must be greater than zero.' };
      const r = annual / 12 / 100;
      const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      return {
        headline: { label: 'Monthly EMI', value: money(emi, ctx.currencySymbol) },
        lines: [
          { label: 'Total Payment', value: money(total, ctx.currencySymbol) },
          { label: 'Total Interest', value: money(total - p, ctx.currencySymbol) },
        ],
      };
    },
  },

  'bmi-metric': {
    title: 'BMI Calculator (Metric)',
    fields: [
      { key: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: '70' },
      { key: 'height', label: 'Height (cm)', type: 'number', defaultValue: '175' },
    ],
    compute: (v) => {
      const w = num(v, 'weight'), h = num(v, 'height');
      if (w <= 0 || h <= 0) return { error: 'Weight and height must be greater than zero.' };
      const bmi = w / Math.pow(h / 100, 2);
      return {
        headline: { label: 'Your BMI', value: round(bmi, 1) },
        lines: [{ label: 'Category', value: bmiCategory(bmi) }],
        note: 'BMI is a general screening tool, not a diagnostic measure.',
      };
    },
  },

  'bmi-imperial': {
    title: 'BMI Calculator (Imperial)',
    fields: [
      { key: 'weight', label: 'Weight (lb)', type: 'number', defaultValue: '154' },
      { key: 'height', label: 'Height (in)', type: 'number', defaultValue: '69' },
    ],
    compute: (v) => {
      const w = num(v, 'weight'), h = num(v, 'height');
      if (w <= 0 || h <= 0) return { error: 'Weight and height must be greater than zero.' };
      const bmi = (703 * w) / (h * h);
      return {
        headline: { label: 'Your BMI', value: round(bmi, 1) },
        lines: [{ label: 'Category', value: bmiCategory(bmi) }],
        note: 'BMI is a general screening tool, not a diagnostic measure.',
      };
    },
  },

  'percentage-of': {
    title: 'Percentage Calculator',
    fields: [
      { key: 'value', label: 'Value', type: 'number', defaultValue: '200' },
      { key: 'percent', label: 'Percentage (%)', type: 'number', defaultValue: '15', step: '0.1' },
    ],
    compute: (v) => {
      const value = num(v, 'value'), pct = num(v, 'percent');
      return { headline: { label: `${pct}% of ${value}`, value: round((value * pct) / 100) } };
    },
  },

  'percentage-change': {
    title: 'Percentage Change Calculator',
    fields: [
      { key: 'oldValue', label: 'Old Value', type: 'number', defaultValue: '100' },
      { key: 'newValue', label: 'New Value', type: 'number', defaultValue: '120' },
    ],
    compute: (v) => {
      const o = num(v, 'oldValue'), n2 = num(v, 'newValue');
      if (o === 0) return { error: 'Old value cannot be zero.' };
      const change = ((n2 - o) / o) * 100;
      return {
        headline: {
          label: change >= 0 ? 'Percentage Increase' : 'Percentage Decrease',
          value: `${round(Math.abs(change), 2)}%`,
        },
      };
    },
  },

  discount: {
    title: 'Discount Calculator',
    fields: [
      { key: 'price', label: 'Original Price', type: 'number', defaultValue: '1000' },
      { key: 'discount', label: 'Discount (%)', type: 'number', defaultValue: '20', step: '0.1' },
    ],
    compute: (v, ctx) => {
      const price = num(v, 'price'), discount = num(v, 'discount');
      const saved = (price * discount) / 100;
      return {
        headline: { label: 'Final Price', value: money(price - saved, ctx.currencySymbol) },
        lines: [{ label: 'You Save', value: money(saved, ctx.currencySymbol) }],
      };
    },
  },

  'tip-calculator': {
    title: 'Tip Calculator',
    fields: [
      { key: 'bill', label: 'Bill Amount', type: 'number', defaultValue: '50' },
      { key: 'tip', label: 'Tip (%)', type: 'number', defaultValue: '15' },
      { key: 'split', label: 'Split Between (people)', type: 'number', defaultValue: '1' },
    ],
    compute: (v, ctx) => {
      const bill = num(v, 'bill'), tipPct = num(v, 'tip'), split = Math.max(1, num(v, 'split', 1));
      const tipAmount = (bill * tipPct) / 100;
      const total = bill + tipAmount;
      return {
        headline: { label: 'Total Per Person', value: money(total / split, ctx.currencySymbol) },
        lines: [
          { label: 'Tip Amount', value: money(tipAmount, ctx.currencySymbol) },
          { label: 'Grand Total', value: money(total, ctx.currencySymbol) },
        ],
      };
    },
  },

  'tax-calculator': {
    title: 'Sales Tax Calculator',
    fields: [
      { key: 'amount', label: 'Amount', type: 'number', defaultValue: '100' },
      { key: 'rate', label: 'Tax Rate (%)', type: 'number', defaultValue: '10', step: '0.1' },
    ],
    compute: (v, ctx) => {
      const amount = num(v, 'amount'), rate = num(v, 'rate');
      const tax = (amount * rate) / 100;
      return {
        headline: { label: 'Total Amount', value: money(amount + tax, ctx.currencySymbol) },
        lines: [{ label: 'Tax Amount', value: money(tax, ctx.currencySymbol) }],
      };
    },
  },

  'average-stats': {
    title: 'Average / Statistics Calculator',
    fields: [
      { key: 'numbers', label: 'Numbers (comma or space separated)', type: 'text', defaultValue: '10, 20, 30, 40' },
    ],
    compute: (v) => {
      const raw = sanitizeString(v.numbers, 5000);
      const parsed = raw
        .split(/[\s,]+/)
        .map((s) => parseFloat(s))
        .filter((n) => Number.isFinite(n));
      if (parsed.length === 0) return { error: 'Enter at least one valid number.' };
      const sum = parsed.reduce((a, b) => a + b, 0);
      const avg = sum / parsed.length;
      const sorted = [...parsed].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      return {
        headline: { label: 'Average', value: round(avg, 4) },
        lines: [
          { label: 'Count', value: String(parsed.length) },
          { label: 'Sum', value: round(sum, 4) },
          { label: 'Min', value: round(Math.min(...parsed), 4) },
          { label: 'Max', value: round(Math.max(...parsed), 4) },
          { label: 'Median', value: round(median, 4) },
        ],
      };
    },
  },

  'age-calculator': {
    title: 'Age Calculator',
    fields: [
      { key: 'birthDate', label: 'Date of Birth', type: 'date', defaultValue: '2000-01-01' },
      { key: 'asOfDate', label: 'As Of Date', type: 'date', defaultValue: new Date().toISOString().slice(0, 10) },
    ],
    compute: (v) => {
      const birth = dateOf(v, 'birthDate');
      const asOf = dateOf(v, 'asOfDate');
      if (!birth || !asOf) return { error: 'Please provide valid dates.' };
      if (birth > asOf) return { error: 'Birth date must be before the "as of" date.' };

      let years = asOf.getFullYear() - birth.getFullYear();
      let months = asOf.getMonth() - birth.getMonth();
      let days = asOf.getDate() - birth.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = asOf.getMonth() === 0 ? 11 : asOf.getMonth() - 1;
        const prevYear = asOf.getMonth() === 0 ? asOf.getFullYear() - 1 : asOf.getFullYear();
        days += daysInMonth(prevMonth, prevYear);
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      return {
        headline: { label: 'Age', value: `${years} years, ${months} months, ${days} days` },
        lines: [{ label: 'Total Days Alive', value: String(Math.floor((asOf.getTime() - birth.getTime()) / 86400000)) }],
      };
    },
  },

  'date-difference': {
    title: 'Date Difference Calculator',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date', defaultValue: new Date().toISOString().slice(0, 10) },
      { key: 'endDate', label: 'End Date', type: 'date', defaultValue: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) },
    ],
    compute: (v) => {
      const start = dateOf(v, 'startDate');
      const end = dateOf(v, 'endDate');
      if (!start || !end) return { error: 'Please provide valid dates.' };
      const diffMs = Math.abs(end.getTime() - start.getTime());
      const days = Math.round(diffMs / 86400000);
      return {
        headline: { label: 'Total Days', value: String(days) },
        lines: [
          { label: 'Weeks', value: round(days / 7, 2) },
          { label: 'Months (approx)', value: round(days / 30.44, 2) },
          { label: 'Years (approx)', value: round(days / 365.25, 2) },
        ],
      };
    },
  },

  'circle-area': {
    title: 'Circle Area Calculator',
    fields: [{ key: 'radius', label: 'Radius', type: 'number', defaultValue: '5' }],
    compute: (v) => {
      const r = num(v, 'radius');
      if (r <= 0) return { error: 'Radius must be greater than zero.' };
      return {
        headline: { label: 'Area', value: round(Math.PI * r * r, 4) },
        lines: [
          { label: 'Circumference', value: round(2 * Math.PI * r, 4) },
          { label: 'Diameter', value: round(2 * r, 4) },
        ],
      };
    },
  },

  pythagorean: {
    title: 'Pythagorean Theorem Calculator',
    fields: [
      { key: 'a', label: 'Leg A', type: 'number', defaultValue: '3' },
      { key: 'b', label: 'Leg B', type: 'number', defaultValue: '4' },
    ],
    compute: (v) => {
      const a = num(v, 'a'), b = num(v, 'b');
      if (a <= 0 || b <= 0) return { error: 'Both legs must be greater than zero.' };
      return { headline: { label: 'Hypotenuse', value: round(Math.sqrt(a * a + b * b), 4) } };
    },
  },

  cagr: {
    title: 'CAGR Calculator',
    fields: [
      { key: 'begin', label: 'Beginning Value', type: 'number', defaultValue: '1000' },
      { key: 'end', label: 'Ending Value', type: 'number', defaultValue: '2000' },
      { key: 'years', label: 'Number of Years', type: 'number', defaultValue: '3' },
    ],
    compute: (v) => {
      const begin = num(v, 'begin'), end = num(v, 'end'), years = num(v, 'years');
      if (begin <= 0 || years <= 0) return { error: 'Beginning value and years must be greater than zero.' };
      const cagr = (Math.pow(end / begin, 1 / years) - 1) * 100;
      return { headline: { label: 'CAGR', value: `${round(cagr, 2)}%` } };
    },
  },

  'break-even': {
    title: 'Break-Even Point Calculator',
    fields: [
      { key: 'fixedCosts', label: 'Fixed Costs', type: 'number', defaultValue: '5000' },
      { key: 'price', label: 'Price Per Unit', type: 'number', defaultValue: '50' },
      { key: 'variableCost', label: 'Variable Cost Per Unit', type: 'number', defaultValue: '20' },
    ],
    compute: (v, ctx) => {
      const fixed = num(v, 'fixedCosts'), price = num(v, 'price'), varCost = num(v, 'variableCost');
      if (price <= varCost) return { error: 'Price per unit must be greater than variable cost per unit.' };
      const units = fixed / (price - varCost);
      return {
        headline: { label: 'Break-Even Units', value: round(units, 0) },
        lines: [{ label: 'Break-Even Revenue', value: money(units * price, ctx.currencySymbol) }],
      };
    },
  },

  'fuel-cost': {
    title: 'Fuel Cost Calculator',
    fields: [
      { key: 'distance', label: 'Distance (km)', type: 'number', defaultValue: '100' },
      { key: 'efficiency', label: 'Fuel Efficiency (km/liter)', type: 'number', defaultValue: '15' },
      { key: 'price', label: 'Price Per Liter', type: 'number', defaultValue: '1.5' },
    ],
    compute: (v, ctx) => {
      const distance = num(v, 'distance'), eff = num(v, 'efficiency'), price = num(v, 'price');
      if (eff <= 0) return { error: 'Fuel efficiency must be greater than zero.' };
      const fuelNeeded = distance / eff;
      return {
        headline: { label: 'Total Fuel Cost', value: money(fuelNeeded * price, ctx.currencySymbol) },
        lines: [{ label: 'Fuel Needed (liters)', value: round(fuelNeeded, 2) }],
      };
    },
  },
};

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/* --------------------------------- Component --------------------------------- */

export default function GenericCalculator({
  formulaKey,
  title,
  currencySymbol = '$',
  locale = 'en-US',
}: GenericCalculatorProps) {
  const def = FORMULA_DEFS[formulaKey];
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!def) return;
    const initial: Record<string, string> = {};
    def.fields.forEach((f) => (initial[f.key] = f.defaultValue));
    setValues(initial);
  }, [formulaKey, def]);

  if (!def) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-yellow-400/30">
        <p className="text-sm">
          ⚠️ This calculator (<code>{formulaKey}</code>) is not configured yet.
        </p>
      </div>
    );
  }

  const handleChange = (key: string, raw: string, type: FieldDef['type']) => {
    const safe = type === 'number' ? raw.replace(/[^0-9.eE+-]/g, '') : sanitizeString(raw, 256);
    setValues((prev) => ({ ...prev, [key]: safe }));
  };

  const result = def.compute(values, { currencySymbol });
  const isError = 'error' in result;

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
      <h2 className="text-lg font-semibold opacity-90">{title ?? def.title}</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {def.fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <label className="text-xs uppercase tracking-wide opacity-60">{field.label}</label>
            {field.type === 'select' ? (
              <select
                value={values[field.key] ?? field.defaultValue}
                onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                className="w-full px-3 py-2 rounded-xl bg-black/20 border border-white/10"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type === 'number' ? 'text' : field.type}
                inputMode={field.type === 'number' ? 'decimal' : undefined}
                step={field.step}
                value={values[field.key] ?? field.defaultValue}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                className="w-full px-3 py-2 rounded-xl bg-black/20 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}
          </div>
        ))}
      </div>

      {isError ? (
        <div className="rounded-xl p-4 bg-red-500/10 border border-red-400/30 text-sm text-red-300">
          ⚠️ {(result as CalcError).error}
        </div>
      ) : (
        <div className="rounded-2xl p-5 bg-indigo-500/10 border border-indigo-400/20 space-y-2">
          <p className="text-2xl font-bold">
            {(result as CalcResult).headline.value}
            <span className="block text-xs font-normal opacity-60 mt-1">
              {(result as CalcResult).headline.label}
            </span>
          </p>
          {(result as CalcResult).lines && (
            <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
              {(result as CalcResult).lines!.map((line) => (
                <div key={line.label} className="text-sm flex justify-between">
                  <span className="opacity-60">{line.label}</span>
                  <span className="font-medium">{line.value}</span>
                </div>
              ))}
            </div>
          )}
          {(result as CalcResult).note && (
            <p className="text-xs opacity-50 pt-2">ℹ️ {(result as CalcResult).note}</p>
          )}
        </div>
      )}
    </div>
  );
}
