// lib/units.ts
// Dynamic JS Factory Engine for all 22 unit families.
// SI-prefixed "ladders" are generated algorithmically (19 prefixes per base unit)
// instead of being hand-written, keeping this file compact while covering
// thousands of real conversion combinations.

export interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  toBase: number; // linear multiplier -> base unit (ignored if toBaseFn present)
  toBaseFn?: (v: number) => number; // for non-linear (temperature) families
  fromBaseFn?: (v: number) => number;
}

export interface UnitFamily {
  id: string;
  name: string;
  icon: string;
  baseSymbol: string;
  units: UnitDef[];
}

// --- Factory primitives ---------------------------------------------------

const SI_PREFIXES: [string, number, string][] = [
  ["Y", 1e24, "Yotta"], ["Z", 1e21, "Zetta"], ["E", 1e18, "Exa"], ["P", 1e15, "Peta"],
  ["T", 1e12, "Tera"], ["G", 1e9, "Giga"], ["M", 1e6, "Mega"], ["k", 1e3, "Kilo"],
  ["h", 1e2, "Hecto"], ["da", 1e1, "Deca"], ["", 1, ""], ["d", 1e-1, "Deci"],
  ["c", 1e-2, "Centi"], ["m", 1e-3, "Milli"], ["µ", 1e-6, "Micro"], ["n", 1e-9, "Nano"],
  ["p", 1e-12, "Pico"], ["f", 1e-15, "Femto"], ["a", 1e-18, "Atto"],
];

const BIN_PREFIXES: [string, number][] = [
  ["Kibi", 2 ** 10], ["Mebi", 2 ** 20], ["Gibi", 2 ** 30],
  ["Tebi", 2 ** 40], ["Pebi", 2 ** 50], ["Exbi", 2 ** 60],
];

function mk(id: string, name: string, symbol: string, toBase: number): UnitDef {
  return { id, name, symbol, toBase };
}

function prefixedName(pname: string, baseName: string): string {
  return pname ? `${pname} ${baseName}` : baseName;
}

/** Generates a full 19-rung SI prefix ladder for any linear base unit. */
function siLadder(symbolBase: string, baseName: string): UnitDef[] {
  const idWord = baseName.toLowerCase().replace(/\s+/g, "");
  return SI_PREFIXES.map(([p, f, pname]) =>
    mk(`${pname.toLowerCase()}${idWord}`, prefixedName(pname, baseName), `${p}${symbolBase}`, f)
  );
}

/** Like siLadder but squares/cubes the factor (for area/volume-by-power units). */
function powerLadder(symbolBase: string, baseName: string, power: number): UnitDef[] {
  const idWord = baseName.toLowerCase().replace(/\s+/g, "");
  return SI_PREFIXES.map(([p, f, pname]) =>
    mk(`${pname.toLowerCase()}${idWord}`, prefixedName(pname, baseName), `${p}${symbolBase}`, Math.pow(f, power))
  );
}

function family(id: string, name: string, icon: string, baseSymbol: string, units: UnitDef[]): UnitFamily {
  return { id, name, icon, baseSymbol, units };
}

// --- 22 Unit Families -------------------------------------------------------

export const UNIT_FAMILIES: UnitFamily[] = [
  family("length", "Length", "📏", "m", [
    ...siLadder("m", "meter"),
    mk("inch", "Inch", "in", 0.0254),
    mk("foot", "Foot", "ft", 0.3048),
    mk("yard", "Yard", "yd", 0.9144),
    mk("mile", "Mile", "mi", 1609.344),
    mk("nauticalmile", "Nautical Mile", "nmi", 1852),
  ]),

  family("mass", "Mass", "⚖️", "g", [
    ...siLadder("g", "gram"),
    mk("ounce", "Ounce", "oz", 28.3495),
    mk("pound", "Pound", "lb", 453.592),
    mk("stone", "Stone", "st", 6350.29),
    mk("ton", "Short Ton", "ton", 907184.74),
    mk("tonne", "Metric Tonne", "t", 1000000),
    mk("carat", "Carat", "ct", 0.2),
  ]),

  family("temperature", "Temperature", "🌡️", "°C", [
    { id: "celsius", name: "Celsius", symbol: "°C", toBase: 1, toBaseFn: (v) => v, fromBaseFn: (v) => v },
    { id: "fahrenheit", name: "Fahrenheit", symbol: "°F", toBase: 1, toBaseFn: (v) => ((v - 32) * 5) / 9, fromBaseFn: (v) => (v * 9) / 5 + 32 },
    { id: "kelvin", name: "Kelvin", symbol: "K", toBase: 1, toBaseFn: (v) => v - 273.15, fromBaseFn: (v) => v + 273.15 },
    { id: "rankine", name: "Rankine", symbol: "°R", toBase: 1, toBaseFn: (v) => ((v - 491.67) * 5) / 9, fromBaseFn: (v) => (v + 273.15) * (9 / 5) },
  ]),

  family("data", "Data Storage", "💾", "B", [
    ...siLadder("B", "byte"),
    mk("bit", "Bit", "bit", 0.125),
    ...BIN_PREFIXES.map(([pname, f]) => mk(`${pname.toLowerCase()}byte`, `${pname}byte`, `${pname.slice(0, 2)}B`, f)),
  ]),

  family("area", "Area", "🟩", "m²", [
    ...powerLadder("m²", "square meter", 2),
    mk("acre", "Acre", "ac", 4046.8564224),
    mk("hectare", "Hectare", "ha", 10000),
    mk("squarefoot", "Square Foot", "ft²", 0.09290304),
    mk("squareyard", "Square Yard", "yd²", 0.83612736),
    mk("squaremile", "Square Mile", "mi²", 2589988.110336),
    mk("squareinch", "Square Inch", "in²", 0.00064516),
  ]),

  family("volume", "Volume", "🧪", "L", [
    ...siLadder("L", "liter"),
    mk("cubicmeter", "Cubic Meter", "m³", 1000),
    mk("gallon", "US Gallon", "gal", 3.785411784),
    mk("quart", "Quart", "qt", 0.946352946),
    mk("pint", "Pint", "pt", 0.473176473),
    mk("cup", "Cup", "cup", 0.2365882365),
    mk("tablespoon", "Tablespoon", "tbsp", 0.0147867648),
    mk("teaspoon", "Teaspoon", "tsp", 0.0049289216),
    mk("fluidounce", "Fluid Ounce", "fl oz", 0.0295735296),
    mk("barrel", "Oil Barrel", "bbl", 158.987294928),
    mk("cubicinch", "Cubic Inch", "in³", 0.0163871),
    mk("cubicfoot", "Cubic Foot", "ft³", 28.316846592),
  ]),

  family("speed", "Speed", "🚀", "m/s", [
    mk("mps", "Meter per Second", "m/s", 1),
    mk("kph", "Kilometer per Hour", "km/h", 0.277778),
    mk("mph", "Mile per Hour", "mph", 0.44704),
    mk("fps", "Foot per Second", "ft/s", 0.3048),
    mk("knot", "Knot", "kn", 0.514444),
    mk("mach", "Mach (Speed of Sound)", "Ma", 343),
  ]),

  family("time", "Time", "⏱️", "s", [
    ...siLadder("s", "second"),
    mk("minute", "Minute", "min", 60),
    mk("hour", "Hour", "hr", 3600),
    mk("day", "Day", "day", 86400),
    mk("week", "Week", "wk", 604800),
    mk("month", "Month (avg)", "mo", 2629800),
    mk("year", "Year", "yr", 31557600),
    mk("decade", "Decade", "dec", 315576000),
    mk("century", "Century", "cent", 3155760000),
  ]),

  family("pressure", "Pressure", "🧭", "Pa", [
    ...siLadder("Pa", "pascal"),
    mk("bar", "Bar", "bar", 100000),
    mk("atm", "Atmosphere", "atm", 101325),
    mk("psi", "Pound per Sq Inch", "psi", 6894.757293168),
    mk("torr", "Torr", "Torr", 133.3223684211),
    mk("mmhg", "Millimeter of Mercury", "mmHg", 133.3223684211),
  ]),

  family("energy", "Energy", "⚡", "J", [
    ...siLadder("J", "joule"),
    mk("calorie", "Calorie", "cal", 4.184),
    mk("kilocalorie", "Kilocalorie", "kcal", 4184),
    mk("kilowatthour", "Kilowatt-hour", "kWh", 3600000),
    mk("btu", "British Thermal Unit", "BTU", 1055.05585262),
    mk("electronvolt", "Electronvolt", "eV", 1.602176634e-19),
    mk("footpound", "Foot-pound", "ft·lb", 1.3558179483),
  ]),

  family("power", "Power", "🔋", "W", [
    ...siLadder("W", "watt"),
    mk("horsepower", "Horsepower", "hp", 745.699872),
    mk("btuperhour", "BTU per Hour", "BTU/h", 0.29307107),
    mk("footpoundpersecond", "Foot-pound per Second", "ft·lb/s", 1.3558179483),
  ]),

  family("angle", "Angle", "📐", "rad", [
    mk("radian", "Radian", "rad", 1),
    mk("degree", "Degree", "°", Math.PI / 180),
    mk("gradian", "Gradian", "grad", Math.PI / 200),
    mk("arcminute", "Arcminute", "′", Math.PI / 10800),
    mk("arcsecond", "Arcsecond", "″", Math.PI / 648000),
    mk("turn", "Turn", "turn", 2 * Math.PI),
  ]),

  family("frequency", "Frequency", "📡", "Hz", [
    ...siLadder("Hz", "hertz"),
    mk("rpm", "Revolutions per Minute", "rpm", 1 / 60),
  ]),

  family("force", "Force", "💪", "N", [
    ...siLadder("N", "newton"),
    mk("poundforce", "Pound-force", "lbf", 4.4482216153),
    mk("dyne", "Dyne", "dyn", 0.00001),
    mk("kilogramforce", "Kilogram-force", "kgf", 9.80665),
  ]),

  family("torque", "Torque", "🔧", "N·m", [
    ...siLadder("N·m", "newton meter"),
    mk("poundfoot", "Pound-foot", "lb·ft", 1.3558179483),
    mk("ounceinch", "Ounce-inch", "oz·in", 0.0070615518),
  ]),

  family("density", "Density", "🧱", "kg/m³", [
    mk("kilogrampercubicmeter", "Kilogram per Cubic Meter", "kg/m³", 1),
    mk("gramspercubiccentimeter", "Gram per Cubic Centimeter", "g/cm³", 1000),
    mk("poundspercubicfoot", "Pound per Cubic Foot", "lb/ft³", 16.0184634),
    mk("poundspercubicinch", "Pound per Cubic Inch", "lb/in³", 27679.9047),
    mk("kilogramperliter", "Kilogram per Liter", "kg/L", 1000),
  ]),

  family("charge", "Electric Charge", "🔌", "C", [
    ...siLadder("C", "coulomb"),
    mk("amperehour", "Ampere-hour", "Ah", 3600),
    mk("milliamperehour", "Milliampere-hour", "mAh", 3.6),
  ]),

  family("current", "Electric Current", "⚡", "A", siLadder("A", "ampere")),
  family("voltage", "Voltage", "🔋", "V", siLadder("V", "volt")),
  family("resistance", "Resistance", "🧯", "Ω", siLadder("Ω", "ohm")),
  family("capacitance", "Capacitance", "🔆", "F", siLadder("F", "farad")),
  family("inductance", "Inductance", "🧲", "H", siLadder("H", "henry")),
];

// --- Lookup helpers ----------------------------------------------------------

export function getFamily(id: string): UnitFamily | undefined {
  return UNIT_FAMILIES.find((f) => f.id === id);
}

export function getUnit(familyId: string, unitId: string): UnitDef | undefined {
  return getFamily(familyId)?.units.find((u) => u.id === unitId);
}

export const FAMILY_IDS: string[] = UNIT_FAMILIES.map((f) => f.id);

export const TOTAL_UNITS: number = UNIT_FAMILIES.reduce((sum, f) => sum + f.units.length, 0);

export const TOTAL_CONVERTER_PAIRS: number = UNIT_FAMILIES.reduce(
  (sum, f) => sum + f.units.length * (f.units.length - 1),
  0
);
