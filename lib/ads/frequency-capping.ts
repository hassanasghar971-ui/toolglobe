export type AdFormatKey =
  | "adsterra-social-bar"
  | "adsterra-popunder"
  | "adsterra-direct-link";

const STORAGE_PREFIX = "tg_ad_freq_";
const COOKIE_PREFIX = "tg_ad_freq_";
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_IMPRESSIONS_PER_WINDOW = 2;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

/**
 * Dual-storage (localStorage + cookie) read, merged as a union. This means
 * a single storage layer being cleared (private browsing wiping
 * localStorage, or a cookie-blocking extension) cannot silently reset the
 * cap on its own — only clearing BOTH resets impression history.
 */
function readTimestamps(key: string): number[] {
  const now = Date.now();
  const sources: string[] = [];

  try {
    const fromLocalStorage = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (fromLocalStorage) sources.push(fromLocalStorage);
  } catch {
    // localStorage unavailable (private mode / disabled) — degrade gracefully.
  }

  const fromCookie = readCookie(COOKIE_PREFIX + key);
  if (fromCookie) sources.push(fromCookie);

  const merged = new Set<number>();
  for (const raw of sources) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const ts of parsed) {
          if (typeof ts === "number" && now - ts < WINDOW_MS) {
            merged.add(ts);
          }
        }
      }
    } catch {
      // Malformed/corrupted storage value — ignore rather than throw.
    }
  }

  return Array.from(merged).sort((a, b) => a - b);
}

function writeTimestamps(key: string, timestamps: number[]): void {
  const serialized = JSON.stringify(timestamps);
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, serialized);
  } catch {
    // Ignore — cookie write below still provides capping resilience.
  }
  writeCookie(COOKIE_PREFIX + key, serialized, WINDOW_MS / 1000);
}

/** Returns true if the given intrusive format is still under its 24h cap. */
export function canShowIntrusiveAd(format: AdFormatKey): boolean {
  if (!isBrowser()) return false;
  return readTimestamps(format).length < MAX_IMPRESSIONS_PER_WINDOW;
}

/** Records one impression/click against the rolling 24h window. */
export function recordIntrusiveAdImpression(format: AdFormatKey): void {
  if (!isBrowser()) return;
  const timestamps = readTimestamps(format);
  timestamps.push(Date.now());
  writeTimestamps(format, timestamps);
}

export function getRemainingImpressions(format: AdFormatKey): number {
  if (!isBrowser()) return 0;
  return Math.max(0, MAX_IMPRESSIONS_PER_WINDOW - readTimestamps(format).length);
}

export const AD_FREQUENCY_CONFIG = {
  maxImpressionsPerWindow: MAX_IMPRESSIONS_PER_WINDOW,
  windowMs: WINDOW_MS,
} as const;
