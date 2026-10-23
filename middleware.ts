import { NextRequest, NextResponse } from "next/server";

/**
 * Phase 8 — Security Hardening Pass.
 *
 * Scope is intentionally narrow: `/api/*` only. This middleware does NOT
 * run against page routes, and therefore has zero impact on the static
 * generation / ISR strategy that the tool-page factory depends on.
 *
 * Responsibilities:
 * 1. Best-effort, per-edge-isolate sliding-window rate limiting on the
 *    public search API to blunt scripted abuse.
 * 2. Method allowlisting (defense in depth against unexpected verbs).
 *
 * NOT a substitute for a distributed limiter (Upstash/Vercel KV) under
 * real multi-region attack traffic — see SECURITY.md.
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(request: NextRequest): NextResponse | null {
  const key = `${getClientIp(request)}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please slow down." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((bucket.resetAt - now) / 1000).toString(),
        },
      }
    );
  }

  bucket.count += 1;
  return null;
}

export function middleware(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname.startsWith("/api/search")) {
    if (request.method !== "GET") {
      return new NextResponse(
        JSON.stringify({ error: "Method not allowed." }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const limited = checkRateLimit(request);
    if (limited) {
      return limited;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
