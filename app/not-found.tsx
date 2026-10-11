// app/not-found.tsx
// Styled 404 fallback — only reached for genuinely non-existent routes
// (the [...slug] catch-all handles every valid tool/family/category path).

import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 py-24">
      <div className="text-7xl animate-float">🧭</div>
      <h1 className="text-4xl font-black text-white">
        4<span className="text-gradient">0</span>4
      </h1>
      <p className="text-white/50 max-w-md">
        We couldn&apos;t find that page on {SITE_CONFIG.name}. It may have been renamed, or the
        link might be mistyped. Try searching our full tool directory instead.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/" className="glow-border px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:scale-105 transition-transform">
          🏠 Back to Home
        </Link>
        <Link href="/tools" className="glass-card px-5 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:scale-105 transition-transform">
          🔍 Browse All Tools
        </Link>
      </div>
    </div>
  );
}
