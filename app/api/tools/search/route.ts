// app/api/tools/search/route.ts
// Server-side search endpoint for ToolExplorer.tsx — keeps the full 20,000+
// tool registry out of the client bundle entirely.

import { NextRequest, NextResponse } from "next/server";
import { getAllTools, getAllCategories } from "@/lib/tools-registry";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { sanitizeInput } from "@/components/sanitizer";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(ip, "tools-search", "GLOBAL");
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = sanitizeInput(searchParams.get("q") || "", 100).toLowerCase().trim();
  const category = sanitizeInput(searchParams.get("category") || "", 60).trim();

  let pool = getAllTools();
  if (category) pool = pool.filter((t) => t.category === category);
  if (q) pool = pool.filter((t) => t.title.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));

  const results = pool.slice(0, 40).map((t) => ({ slug: t.slug, title: t.title, category: t.category }));

  return NextResponse.json({ results, total: pool.length, categories: getAllCategories() });
}
