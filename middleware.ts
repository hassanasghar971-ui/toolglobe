import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export const config = {
  matcher: [
    /*
     * Run on every route except Next.js internals and static files that
     * don't need a nonce, rate limiting, or a CSP header.
     */
    "/((?!_next/static|_next/image|favicon.ico|site.webmanifest|robots.txt|sitemap\\.xml|sitemap/).*)",
  ],
};

/** Generates a cryptographically random, base64-encoded nonce (Edge-safe Web Crypto). */
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Builds the per-request Content-Security-Policy. The nonce lets our own
 * inline/bundled scripts execute; 'strict-dynamic' lets scripts WE load
 * (e.g. the Adsterra native-banner invoke script injected via
 * document.createElement("script")) load further sub-resources. The
 * explicit Adsterra domain allowlists below are a defense-in-depth fallback
 * for browsers that don't fully honor 'strict-dynamic'.
 */
function buildCsp(nonce: string): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      "https://*.profitableratecpm.com",
      "https://*.highperformanceformat.com",
      "https://*.adsterratools.com",
      "https://*.adsterra.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https:", "blob:"],
    "font-src": ["'self'", "data:"],
    "connect-src": [
      "'self'",
      "https://*.profitableratecpm.com",
      "https://*.highperformanceformat.com",
      "https://*.adsterratools.com",
      "https://*.adsterra.com",
    ],
    "frame-src": [
      "'self'",
      "https://*.profitableratecpm.com",
      "https://*.highperformanceformat.com",
      "https://*.adsterratools.com",
    ],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([key, values]) =>
      values.length > 0 ? `${key} ${values.join(" ")}` : key
    )
    .join("; ");
}

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export default async function middleware(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(identifier);

  if (!rateLimitResult.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
    );
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": String(rateLimitResult.limit),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);
  response.headers.set("X-RateLimit-Limit", String(rateLimitResult.limit));
  response.headers.set(
    "X-RateLimit-Remaining",
    String(rateLimitResult.remaining)
  );

  return response;
}
