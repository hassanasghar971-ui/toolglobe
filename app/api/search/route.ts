import { NextRequest, NextResponse } from "next/server";
import { searchTools } from "@/lib/tool-registry";
import { sanitizePlainText } from "@/lib/security/sanitize";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") ?? "";
  const query = sanitizePlainText(rawQuery).slice(0, 100);

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results = searchTools(query)
    .slice(0, 8)
    .map((tool) => ({
      name: tool.name,
      slug: tool.slug,
      category: tool.category,
      shortDescription: tool.shortDescription,
    }));

  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" } }
  );
}
