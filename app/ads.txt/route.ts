import { NextResponse } from "next/server";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
const CA_PUB_PATTERN = /^ca-pub-\d{10,}$/;

/**
 * Serves /ads.txt at the site root. Returns 404 (NOT an empty 200) when no
 * valid publisher ID is configured — publishing an empty or malformed
 * ads.txt is flagged by Google as an issue, whereas a missing file is not.
 * See Phase 7 Architect's Note #1.
 */
export async function GET() {
  if (!ADSENSE_CLIENT || !CA_PUB_PATTERN.test(ADSENSE_CLIENT)) {
    return new NextResponse("Not configured", { status: 404 });
  }

  // ads.txt requires the "pub-XXXX" form, not AdSense's own "ca-pub-XXXX" tag format.
  const publisherId = ADSENSE_CLIENT.replace(/^ca-/, "");
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
