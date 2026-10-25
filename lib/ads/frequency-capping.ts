const STORAGE_PREFIX = "tg_ad_freq_";
const COOKIE_PREFIX = "tg_ad_freq_";

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_IMPRESSIONS = 2;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export type AdFormatKey =
  | "adsterra-social-bar"
  | "adsterra-popunder"
  | "adsterra-direct-link";

export const AD_FREQUENCY_CONFIG: Record<
  AdFormatKey,
  { maxImpressions: number; windowMs: number }
> = {
  "adsterra-social-bar": { maxImpressions: MAX_IMPRESSIONS, windowMs: WINDOW_MS },
  "adsterra-popunder": { maxImpressions: MAX_IMPRESSIONS, windowMs: WINDOW_MS },
  "adsterra-direct-link": { maxImpressions: MAX_IMPRESSIONS, windowMs: WINDOW_MS },
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  const captured = match?.[1];
  return captured !== undefined ? decodeURIComponent(captured) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

function parseTimestampArray(raw: string | null): number[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is number => typeof entry === "number");
  } catch {
    return [];
  }
}

function readTimestampsFromStorage(storageKey: string): number[] {
  if (!isBrowser()) return [];
  try {
    return parseTimestampArray(window.localStorage.getItem(storageKey));
  } catch {
    return [];
  }
}

function writeTimestampsToStorage(storageKey: string, timestamps: number[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(timestamps));
  } catch {
    // Fail silently — cookie record still applies the cap.
  }
}

function readTimestampsFromCookie(format: AdFormatKey): number[] {
  return parseTimestampArray(readCookie(`${COOKIE_PREFIX}${format}`));
}

function writeTimestampsToCookie(format: AdFormatKey, timestamps: number[]): void {
  writeCookie(
    `${COOKIE_PREFIX}${format}`,
    JSON.stringify(timestamps),
    COOKIE_MAX_AGE_SECONDS
  );
}

function pruneExpired(timestamps: number[], windowMs: number): number[] {
  const now = Date.now();
  return timestamps.filter((timestamp) => now - timestamp < windowMs);
}

function getCombinedTimestamps(format: AdFormatKey): number[] {
  const config = AD_FREQUENCY_CONFIG[format];
  const storageKey = `${STORAGE_PREFIX}${format}`;

  const fromStorage = pruneExpired(
    readTimestampsFromStorage(storageKey),
    config.windowMs
  );
  const fromCookie = pruneExpired(readTimestampsFromCookie(format), config.windowMs);

  return Array.from(new Set([...fromStorage, ...fromCookie])).sort((a, b) => a - b);
}

export function canShowIntrusiveAd(format: AdFormatKey): boolean {
  const config = AD_FREQUENCY_CONFIG[format];
  const timestamps = getCombinedTimestamps(format);
  return timestamps.length < config.maxImpressions;
}

export function recordIntrusiveAdImpression(format: AdFormatKey): void {
  const config = AD_FREQUENCY_CONFIG[format];
  const storageKey = `${STORAGE_PREFIX}${format}`;

  const updated = pruneExpired(
    [...getCombinedTimestamps(format), Date.now()],
    config.windowMs
  );

  writeTimestampsToStorage(storageKey, updated);
  writeTimestampsToCookie(format, updated);
}

export function getRemainingImpressions(format: AdFormatKey): number {
  const config = AD_FREQUENCY_CONFIG[format];
  const timestamps = getCombinedTimestamps(format);
  return Math.max(0, config.maxImpressions - timestamps.length);
}
