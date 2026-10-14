
// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/site-config";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdLayout from "@/components/AdLayout";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — Free Online Converters, Calculators & Tools`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  verification: { google: SITE_CONFIG.verification.google },
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" className="dark">
      <head>
        {/* Exact GSC verification tag as mandated (also emitted via metadata.verification) */}
        <meta name="google-site-verification" content={SITE_CONFIG.verification.google} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ErrorBoundary>
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
              <Link href="/" className="text-lg font-bold text-gradient tracking-tight">
                {SITE_CONFIG.name}
              </Link>
              <div className="hidden sm:flex items-center gap-6 text-sm text-white/70">
                <Link href="/#categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
                <Link href="/#explorer" className="hover:text-white transition-colors">
                  Explore Tools
                </Link>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-1 w-full max-w-7xl mx-auto px-5 py-8">
            <AdLayout>{children}</AdLayout>
          </main>

          <footer className="border-t border-white/10 mt-10">
            <div className="max-w-7xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
              <p>
                © {year} {SITE_CONFIG.name}. All rights reserved.
              </p>
              <div className="flex gap-5">
                <Link href="/about" className="hover:text-white/70 transition-colors">
                  About
                </Link>
                <Link href="/legal/privacy" className="hover:text-white/70 transition-colors">
                  Privacy
                </Link>
                <Link href="/legal/terms" className="hover:text-white/70 transition-colors">
                  Terms
                </Link>
              </div>
            </div>
          </footer>
        </ErrorBoundary>

        {/* Adsterra Social Bar — loaded lazily after the page becomes interactive */}
        <Script
          id="adsterra-social-bar"
          src="https://pl31821509.profitableratecpmnetwork.com/83/76/79/8376798993af31a2763d6f51857d452c.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
