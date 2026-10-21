'use client';

// UnitConverter — a single component that powers HUNDREDS of indexable
// "X to Y" converter pages. Which category/units/title it renders is
// determined entirely by props supplied by the tool registry (see
// scripts/generate-tools.js + data/tool-specs.json).

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { sanitizeNumber } from '@/lib/sanitizer';

/* ----------------------------- Type Definitions ----------------------------- */

type ConversionKind = 'linear' | 'temperature' | 'currency';

interface UnitMeta {
  label: string;
  /** For 'linear': multiply-to-base factor. For 'currency': units per 1 USD. Unused for temperature. */
  toBase?: number;
}

interface CategoryMeta {
  label: string;
  kind: ConversionKind;
  units: Record<string, UnitMeta>;
  disclaimer?: string;
}

export interface UnitConverterProps {
  category: string;
  defaultFrom?: string;
  defaultTo?: string;
  title?: string;
}

/* ------------------------------- Unit Database ------------------------------- */
/* This is the single source of truth for conversion math. Adding a unit here
   automatically becomes selectable on every page using this category, and the
   generator script can create additional "X to Y" landing pages for it. */

export const UNIT_CATEGORIES: Record<string, CategoryMeta> = {
  length: {
    label: 'Length',
    kind: 'linear',
    units: {
      mm: { label: 'Millimeters (mm)', toBase: 0.001 },
      cm: { label: 'Centimeters (cm)', toBase: 0.01 },
      m: { label: 'Meters (m)', toBase: 1 },
      km: { label: 'Kilometers (km)', toBase: 1000 },
      in: { label: 'Inches (in)', toBase: 0.0254 },
      ft: { label: 'Feet (ft)', toBase: 0.3048 },
      yd: { label: 'Yards (yd)', toBase: 0.9144 },
      mi: { label: 'Miles (mi)', toBase: 1609.344 },
      nmi: { label: 'Nautical Miles (nmi)', toBase: 1852 },
    },
  },
  weight: {
    label: 'Weight / Mass',
    kind: 'linear',
    units: {
      mg: { label: 'Milligrams (mg)', toBase: 0.000001 },
      g: { label: 'Grams (g)', toBase: 0.001 },
      kg: { label: 'Kilograms (kg)', toBase: 1 },
      t: { label: 'Metric Tons (t)', toBase: 1000 },
      oz: { label: 'Ounces (oz)', toBase: 0.0283495 },
      lb: { label: 'Pounds (lb)', toBase: 0.453592 },
      st: { label: 'Stone (st)', toBase: 6.35029 },
    },
  },
  area: {
    label: 'Area',
    kind: 'linear',
    units: {
      mm2: { label: 'Square Millimeters', toBase: 0.000001 },
      cm2: { label: 'Square Centimeters', toBase: 0.0001 },
      m2: { label: 'Square Meters', toBase: 1 },
      km2: { label: 'Square Kilometers', toBase: 1_000_000 },
      in2: { label: 'Square Inches', toBase: 0.00064516 },
      ft2: { label: 'Square Feet', toBase: 0.092903 },
      yd2: { label: 'Square Yards', toBase: 0.836127 },
      acre: { label: 'Acres', toBase: 4046.86 },
      hectare: { label: 'Hectares', toBase: 10000 },
    },
  },
  digital: {
    label: 'Digital Storage',
    kind: 'linear',
    disclaimer: 'Uses the 1024-based (binary) convention: 1 KB = 1024 Bytes.',
    units: {
      bit: { label: 'Bits', toBase: 0.125 },
      byte: { label: 'Bytes', toBase: 1 },
      kb: { label: 'Kilobytes (KB)', toBase: 1024 },
      mb: { label: 'Megabytes (MB)', toBase: 1024 ** 2 },
      gb: { label: 'Gigabytes (GB)', toBase: 1024 ** 3 },
      tb: { label: 'Terabytes (TB)', toBase: 1024 ** 4 },
      pb: { label: 'Petabytes (PB)', toBase: 1024 ** 5 },
    },
  },
  volume: {
    label: 'Volume',
    kind: 'linear',
    units: {
      ml: { label: 'Milliliters (ml)', toBase: 0.001 },
      l: { label: 'Liters (l)', toBase: 1 },
      m3: { label: 'Cubic Meters (m³)', toBase: 1000 },
      tsp: { label: 'Teaspoons', toBase: 0.00492892 },
      tbsp: { label: 'Tablespoons', toBase: 0.0147868 },
      floz: { label: 'Fluid Ounces', toBase: 0.0295735 },
      cup: { label: 'Cups', toBase: 0.24 },
      pt: { label: 'Pints', toBase: 0.473176 },
      qt: { label: 'Quarts', toBase: 0.946353 },
      gal: { label: 'Gallons', toBase: 3.78541 },
    },
  },
  speed: {
    label: 'Speed',
    kind: 'linear',
    units: {
      mps: { label: 'Meters/second', toBase: 1 },
      kph: { label: 'Kilometers/hour', toBase: 0.277778 },
      mph: { label: 'Miles/hour', toBase: 0.44704 },
      knot: { label: 'Knots', toBase: 0.514444 },
      fts: { label: 'Feet/second', toBase: 0.3048 },
    },
  },
  time: {
    label: 'Time',
    kind: 'linear',
    disclaimer: 'Month and year are averaged (30.44 / 365.25 days) for consistency.',
    units: {
      ms: { label: 'Milliseconds', toBase: 0.001 },
      s: { label: 'Seconds', toBase: 1 },
      min: { label: 'Minutes', toBase: 60 },
      hr: { label: 'Hours', toBase: 3600 },
      day: { label: 'Days', toBase: 86400 },
      week: { label: 'Weeks', toBase: 604800 },
      month: { label: 'Months (avg)', toBase: 2629800 },
      year: { label: 'Years (avg)', toBase: 31557600 },
    },
  },
  pressure: {
    label: 'Pressure',
    kind: 'linear',
    units: {
      pa: { label: 'Pascals (Pa)', toBase: 1 },
      kpa: { label: 'Kilopascals (kPa)', toBase: 1000 },
      bar: { label: 'Bar', toBase: 100000 },
      atm: { label: 'Atmospheres (atm)', toBase: 101325 },
      psi: { label: 'PSI', toBase: 6894.76 },
      torr: { label: 'Torr', toBase: 133.322 },
    },
  },
  temperature: {
    label: 'Temperature',
    kind: 'temperature',
    units: {
      c: { label: 'Celsius (°C)' },
      f: { label: 'Fahrenheit (°F)' },
      k: { label: 'Kelvin (K)' },
    },
  },
  currency: {
    label: 'Currency',
    kind: 'currency',
    disclaimer:
      'Static, indicative exchange rates (updated periodically by the developer) — ' +
      'ToolGlobe is a zero-API platform and does not fetch live market rates. ' +
      'For real-time trading rates, consult your bank or a licensed FX provider.',
    units: {
      usd: { label: 'US Dollar (USD)', toBase: 1 },
      eur: { label: 'Euro (EUR)', toBase: 0.92 },
      gbp: { label: 'British Pound (GBP)', toBase: 0.79 },
      pkr: { label: 'Pakistani Rupee (PKR)', toBase: 278.5 },
      inr: { label: 'Indian Rupee (INR)', toBase: 83.3 },
      aed: { label: 'UAE Dirham (AED)', toBase: 3.67 },
      sar: { label: 'Saudi Riyal (SAR)', toBase: 3.75 },
      cad: { label: 'Canadian Dollar (CAD)', toBase: 1.36 },
      aud: { label: 'Australian Dollar (AUD)', toBase: 1.52 },
      jpy: { label: 'Japanese Yen (JPY)', toBase: 149.5 },
      cny: { label: 'Chinese Yuan (CNY)', toBase: 7.24 },
    },
  },
};

/* -------------------------------- Conversion Math -------------------------------- */

function toCelsius(value: number, unit: string): number {
  switch (unit) {
    case 'c': return value;
    case 'f': return ((value - 32) * 5) / 9;
    case 'k': return value - 273.15;
    default: throw new Error('Unsupported temperature unit');
  }
}

function fromCelsius(celsius: number, unit: string): number {
  switch (unit) {
    case 'c': return celsius;
    case 'f': return (celsius * 9) / 5 + 32;
    case 'k': return celsius + 273.15;
    default: throw new Error('Unsupported temperature unit');
  }
}

function convert(meta: CategoryMeta, value: number, from: string, to: string): number {
  switch (meta.kind) {
    case 'temperature':
      return fromCelsius(toCelsius(value, from), to);
    case 'currency': {
      const fromRate = meta.units[from]?.toBase ?? 1; // units of `from` per 1 USD
      const toRate = meta.units[to]?.toBase ?? 1;
      const usd = value / fromRate;
      return usd * toRate;
    }
    case 'linear':
    default: {
      const fromFactor = meta.units[from]?.toBase ?? 1;
      const toFactor = meta.units[to]?.toBase ?? 1;
      return (value * fromFactor) / toFactor;
    }
  }
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-6 || abs > 1e15)) return n.toExponential(6);
  const fixed = n.toFixed(8);
  const trimmed = fixed.replace(/\.?0+$/, '');
  return trimmed === '' || trimmed === '-' ? '0' : trimmed;
}

/* ---------------------------------- Component ---------------------------------- */

export default function UnitConverter({ category, defaultFrom, defaultTo, title }: UnitConverterProps) {
  const meta = UNIT_CATEGORIES[category];

  if (!meta) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-yellow-400/30">
        <p className="text-sm">
          ⚠️ This converter category (<code>{category}</code>) is not configured yet.
          Please contact support if you believe this is an error.
        </p>
      </div>
    );
  }

  const unitKeys = Object.keys(meta.units);
  const initialFrom = defaultFrom && meta.units[defaultFrom] ? defaultFrom : unitKeys[0];
  const initialTo =
    defaultTo && meta.units[defaultTo] ? defaultTo : unitKeys[1] ?? unitKeys[0];

  const [fromUnit, setFromUnit] = useState(initialFrom);
  const [toUnit, setToUnit] = useState(initialTo);
  const [rawInput, setRawInput] = useState('1');

  const numericValue = useMemo(() => sanitizeNumber(rawInput, NaN), [rawInput]);

  const result = useMemo(() => {
    if (!Number.isFinite(numericValue)) return null;
    try {
      return convert(meta, numericValue, fromUnit, toUnit);
    } catch {
      return null;
    }
  }, [meta, numericValue, fromUnit, toUnit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits, decimal point, minus, and 'e' for scientific notation.
    const cleaned = e.target.value.replace(/[^0-9.eE+-]/g, '');
    setRawInput(cleaned);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const otherUnits = unitKeys.filter((u) => u !== fromUnit).slice(0, 5);

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
      <h2 className="text-lg font-semibold opacity-90">
        {title ?? `${meta.label} Converter`}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        {/* From */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide opacity-60">From</label>
          <input
            type="text"
            inputMode="decimal"
            value={rawInput}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter value"
            aria-label="Value to convert"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/20 border border-white/10"
          >
            {unitKeys.map((u) => (
              <option key={u} value={u}>{meta.units[u].label}</option>
            ))}
          </select>
        </div>

        {/* Swap */}
        <button
          onClick={handleSwap}
          aria-label="Swap units"
          className="h-12 w-12 mx-auto rounded-full bg-indigo-500/80 hover:bg-indigo-500 transition flex items-center justify-center text-xl"
        >
          ⇄
        </button>

        {/* To */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide opacity-60">To</label>
          <div className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 font-mono text-lg min-h-[48px] flex items-center">
            {result !== null ? formatNumber(result) : '—'}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/20 border border-white/10"
          >
            {unitKeys.map((u) => (
              <option key={u} value={u}>{meta.units[u].label}</option>
            ))}
          </select>
        </div>
      </div>

      {result !== null && (
        <p className="text-sm opacity-70">
          <strong>{rawInput || 0} {meta.units[fromUnit].label}</strong> ={' '}
          <strong>{formatNumber(result)} {meta.units[toUnit].label}</strong>
        </p>
      )}

      {meta.disclaimer && (
        <p className="text-xs opacity-50 border-t border-white/10 pt-3">ℹ️ {meta.disclaimer}</p>
      )}

      {otherUnits.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <p className="text-xs uppercase tracking-wide opacity-50 mb-2">Other conversions</p>
          <div className="flex flex-wrap gap-2">
            {otherUnits.map((u) => (
              <Link
                key={u}
                href={`/tools/${fromUnit}-to-${u}`}
                className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                {fromUnit.toUpperCase()} → {u.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
