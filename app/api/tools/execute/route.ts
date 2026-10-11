// app/api/tools/execute/route.ts
// Secure server-side execution endpoint for ToolRuntime.tsx (text/math/seo).
// Applies sliding-window rate-limiting + deep payload sanitization before
// dispatching into lib/engines.ts.

import { NextRequest, NextResponse } from "next/server";
import { runEngine, EngineCategory } from "@/lib/engines";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { sanitizeDeep, isSuspicious } from "@/components/sanitizer";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(ip, "tools-execute", "TOOL_EXECUTION");
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please slow down.", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { category, opId, payload } = (body ?? {}) as { category?: string; opId?: string; payload?: unknown };
  if (!category || typeof category !== "string") {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }

  const rawStr = JSON.stringify(payload ?? {});
  if (rawStr.length > 50000 || isSuspicious(rawStr)) {
    return NextResponse.json({ error: "Payload rejected by security filter" }, { status: 400 });
  }

  const safePayload = sanitizeDeep((payload ?? {}) as Record<string, unknown>);
  const { result, error } = runEngine(category as EngineCategory, String(opId || ""), safePayload);

  if (error) return NextResponse.json({ error }, { status: 422 });
  return NextResponse.json({ result });
}
