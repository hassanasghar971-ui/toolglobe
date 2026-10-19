// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico
     * - static asset extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function middleware(request: NextRequest) {
  // ---------------------------------------------------------------
  // 1. RATE LIMITING (DDoS / abuse first line of defense)
  // ---------------------------------------------------------------
  const identifier = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(identifier);

  if (!rateLimitResult.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please slow down and try again shortly.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil(
            (rateLimitResult.resetAt - Date.now()) / 1000
          ).toString(),
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // ---------------------------------------------------------------
  // 2. NONCE-BASED CONTENT SECURITY POLICY
  //    Base policy is intentionally STRICT (self-only). Ad-network
  //    domains (Adsterra / AdSense) are appended in Phase 7 via an
  //    explicit, documented diff to this file — never silently.
  // ---------------------------------------------------------------
  const nonce = generateNonce();

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self';
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // Propagate nonce + pathname to Server Components via request headers
  // (consumed later by components/ads/* in Phase 7, and optionally by
  // layout metadata logic in Phase 4/5).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // ---------------------------------------------------------------
  // 3. SECURITY HEADERS (defense-in-depth beyond next.config.ts)
  // ---------------------------------------------------------------
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    rateLimitResult.remaining.toString()
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  return response;
}
