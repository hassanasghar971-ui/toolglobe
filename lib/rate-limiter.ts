// lib/rate-limiter.ts
// In-memory sliding-window rate limiter — no database required. Suitable for
// single-instance Node runtimes; safe no-op guards included for edge runtimes.

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfterMs?: number;
}

interface Bucket {
  timestamps: number[];
  lastAccess: number;
}

const buckets = new Map<string, Bucket>();

// Preset tiers for different surface areas of the app.
export const RATE_LIMIT_TIERS = {
  GLOBAL: { limit: 300, windowMs: 60_000 },
  TOOL_EXECUTION: { limit: 60, windowMs: 60_000 },
  API_STRICT: { limit: 20, windowMs: 60_000 },
  CONTACT_FORM: { limit: 5, windowMs: 300_000 },
} as const;

const MAX_BUCKETS = 50_000;
const STALE_MS = 10 * 60_000;
let cleanupScheduled = false;

function scheduleCleanup(): void {
  if (cleanupScheduled) return;
  if (typeof setInterval === "undefined") return;
  cleanupScheduled = true;
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now - bucket.lastAccess > STALE_MS) buckets.delete(key);
    }
    // Hard cap to prevent unbounded memory growth under abuse/DoS attempts.
    if (buckets.size > MAX_BUCKETS) {
      const excess = buckets.size - MAX_BUCKETS;
      let i = 0;
      for (const key of buckets.keys()) {
        if (i++ >= excess) break;
        buckets.delete(key);
      }
    }
  }, 60_000);
  if (typeof timer.unref === "function") timer.unref();
}

/**
 * Sliding-window rate limiter.
 * @param key unique identifier (e.g. `ip:route` or `ip:toolSlug`)
 */
export function slidingWindowRateLimit(key: string, limit = 60, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [], lastAccess: now };

  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);
  bucket.lastAccess = now;

  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    const oldest = bucket.timestamps[0];
    const resetAt = oldest + windowMs;
    return { allowed: false, remaining: 0, limit, resetAt, retryAfterMs: Math.max(0, resetAt - now) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  scheduleCleanup();

  return {
    allowed: true,
    remaining: limit - bucket.timestamps.length,
    limit,
    resetAt: now + windowMs,
  };
}

/** Extracts a best-effort client identifier from standard proxy headers. */
export function getClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const get = (name: string): string | undefined => {
    if (headers instanceof Headers) return headers.get(name) ?? undefined;
    const v = headers[name.toLowerCase()];
    return Array.isArray(v) ? v[0] : v;
  };
  const forwarded = get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return get("x-real-ip") ?? "unknown";
}

/** Convenience wrapper combining IP + route scoping + tier preset. */
export function checkRateLimit(
  ip: string,
  routeKey: string,
  tier: keyof typeof RATE_LIMIT_TIERS = "GLOBAL"
): RateLimitResult {
  const { limit, windowMs } = RATE_LIMIT_TIERS[tier];
  return slidingWindowRateLimit(`${tier}:${ip}:${routeKey}`, limit, windowMs);
}

/** Resets a specific bucket — useful for tests or admin overrides. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
