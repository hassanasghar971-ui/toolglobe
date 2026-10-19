// lib/rate-limit.ts
import { RATE_LIMIT } from "@/lib/site-config";

/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * ⚠️ PRODUCTION SCALING NOTE:
 * This Map lives per edge function instance. On Vercel's distributed
 * edge network, different regions/instances will have independent
 * counters — this is a FIRST LINE OF DEFENSE against abusive single-IP
 * bursts (scraping, scripted spam on tool execution endpoints), not a
 * globally authoritative limiter. For strict global quotas, replace
 * the internals of `checkRateLimit` with `@upstash/ratelimit` +
 * Upstash Redis — the function signature below is intentionally kept
 * stable so no caller (middleware.ts) needs to change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Hard memory ceiling guard — prevents unbounded Map growth under
// sustained DDoS-style traffic from rotating IPs.
const MAX_TRACKED_IDENTIFIERS = 50_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  windowMs: number = RATE_LIMIT.windowMs,
  maxRequests: number = RATE_LIMIT.maxRequests
): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
  }

  bucket.count += 1;
  buckets.set(identifier, bucket);

  // Lazy garbage collection — triggered only when the map grows large,
  // avoiding the need for setInterval (not reliably supported across
  // all edge runtimes for background timers).
  if (buckets.size > MAX_TRACKED_IDENTIFIERS) {
    for (const [key, value] of buckets) {
      if (now > value.resetAt) {
        buckets.delete(key);
      }
    }
  }

  const allowed = bucket.count <= maxRequests;

  return {
    allowed,
    remaining: Math.max(0, maxRequests - bucket.count),
    limit: maxRequests,
    resetAt: bucket.resetAt,
  };
}

/**
 * Extracts a best-effort client identifier from a Request object.
 * Vercel's edge network populates x-forwarded-for reliably; fallbacks
 * exist for local dev / non-proxied environments.
 */
export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown-client";
}
