import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

// ─── SITE METADATA ───────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://toolglobe.app"),
  title: {
    default: "ToolGlobe — 20,000+ Free Online Tools | No Signup Required",
    template: "%s | ToolGlobe — Free Online Tools",
  },
  description:
    "ToolGlobe offers 20,000+ free online micro-tools covering text, SEO, math, color, developer, finance, health, and more. 100% browser-based, no account needed, instant results.",
  keywords: [
    "free online tools",
    "text tools online",
    "seo tools free",
    "developer tools",
    "math calculator",
    "color converter",
    "unit converter",
    "password generator",
    "toolglobe",
    "micro tools",
    "online utilities",
  ],
  authors: [{ name: "Hassan Asghar", url: "mailto:hassan.asghar7868686@gmail.com" }],
  creator: "Hassan Asghar",
  publisher: "ToolGlobe",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ToolGlobe",
    title: "ToolGlobe — 20,000+ Free Online Tools",
    description: "Free online tools for everyone. Text, SEO, Math, Color, Developer tools and more. No signup, instant results.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolGlobe — 20,000+ Free Online Tools",
    description: "Free online tools for everyone. No signup. Instant results.",
    creator: "@toolglobe",
  },
  verification: {
    // ── REPLACE WITH YOUR GOOGLE SEARCH CONSOLE VERIFICATION CODE ──
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3B82F6" },
    { media: "(prefers-color-scheme: dark)", color: "#1E40AF" },
  ],
};

const QUICK_LINKS = [
  { href: "/text-tools/word-counter", label: "Word Counter" },
  { href: "/developer-tools/json-formatter", label: "JSON Formatter" },
  { href: "/password-tools/password-generator", label: "Password Generator" },
  { href: "/color-tools/hex-to-rgb", label: "HEX to RGB" },
  { href: "/seo-tools/meta-title-checker", label: "Meta Title Checker" },
  { href: "/math-tools/percentage-calculator", label: "% Calculator" },
  { href: "/encoding-tools/base64-encoder", label: "Base64 Encoder" },
  { href: "/random-generators/uuid-generator", label: "UUID Generator" },
];

const FOOTER_COLS = [
  {
    title: "Text & Writing",
    links: [
      { href: "/text-tools/word-counter", label: "Word Counter" },
      { href: "/text-tools/character-counter", label: "Character Counter" },
      { href: "/text-tools/text-reverser", label: "Text Reverser" },
      { href: "/writing-tools/headline-generator", label: "Headline Generator" },
      { href: "/writing-tools/rhyme-finder", label: "Rhyme Finder" },
    ],
  },
  {
    title: "Developer",
    links: [
      { href: "/developer-tools/json-formatter", label: "JSON Formatter" },
      { href: "/developer-tools/base64-encoder", label: "Base64 Encoder" },
      { href: "/developer-tools/uuid-generator", label: "UUID Generator" },
      { href: "/developer-tools/hash-generator", label: "Hash Generator" },
      { href: "/developer-tools/jwt-decoder", label: "JWT Decoder" },
    ],
  },
  {
    title: "SEO & Marketing",
    links: [
      { href: "/seo-tools/meta-title-checker", label: "Meta Title Checker" },
      { href: "/seo-tools/keyword-density-checker", label: "Keyword Density" },
      { href: "/seo-tools/long-tail-keyword-generator", label: "Keyword Generator" },
      { href: "/social-media-tools/hashtag-generator", label: "Hashtag Generator" },
      { href: "/seo-tools/schema-markup-generator", label: "Schema Generator" },
    ],
  },
  {
    title: "Finance & Health",
    links: [
      { href: "/finance-tools/compound-interest-calculator", label: "Compound Interest" },
      { href: "/finance-tools/loan-emi-calculator", label: "EMI Calculator" },
      { href: "/health-tools/bmi-calculator", label: "BMI Calculator" },
      { href: "/health-tools/calorie-calculator", label: "Calorie Calculator" },
      { href: "/finance-tools/roi-calculator", label: "ROI Calculator" },
    ],
  },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* ── TOP ADSENSE BANNER PLACEHOLDER ──────────────────────
            Replace the comment below with your AdSense <script> tag.
            Example:
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script>
        */}
        {/* ADSENSE_SCRIPT_TAG_HERE */}
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        {/* ── SKIP TO CONTENT (Accessibility) ─────────────────── */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        >
          Skip to main content
        </a>

        {/* ══════════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════════ */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          {/* ── TOP AD BANNER (pre-reserved 90px to prevent CLS) */}
          <div
            className="w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400"
            style={{ minHeight: "0px" }}
            aria-label="Advertisement"
          >
            {/* TOP_ADSENSE_BANNER_728x90
                Replace this div content with your AdSense 728×90 leaderboard code.
                Keep min-height: 90px to prevent CLS.
            */}
          </div>

          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:shadow-blue-300 transition-shadow">
                T
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-black text-slate-900 text-lg tracking-tight">ToolGlobe</span>
                <span className="text-xs text-slate-500 -mt-0.5">20,000+ Free Tools</span>
              </div>
            </Link>

            {/* Quick Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {QUICK_LINKS.slice(0, 5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-blue-200"
              >
                <span>🛠️</span>
                <span>All Tools</span>
              </Link>
              <Link href="/" className="sm:hidden text-2xl" aria-label="Home">🛠️</Link>
            </div>
          </nav>
        </header>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════════════════════ */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* ══════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════ */}
        <footer className="bg-slate-900 text-slate-400 mt-auto">
          {/* ── BOTTOM AD BANNER (pre-reserved to prevent CLS) ── */}
          <div
            className="w-full bg-slate-800 flex items-center justify-center"
            style={{ minHeight: "90px" }}
            aria-label="Advertisement"
          >
            {/* BOTTOM_ADSENSE_BANNER_728x90
                Replace this div with your AdSense 728×90 bottom banner code.
            */}
            <span className="text-slate-600 text-xs">Advertisement</span>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Footer Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
              {/* Brand Column */}
              <div className="col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black">
                    T
                  </div>
                  <span className="font-black text-white text-xl">ToolGlobe</span>
                </Link>
                <p className="text-sm leading-relaxed mb-4">
                  The world&apos;s largest free online micro-tools platform. 20,000+ tools covering text, SEO, math, color, developer utilities and more. No signup, no fees, instant results.
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Developer Contact</span>
                  <span className="font-medium text-slate-300">Hassan Asghar</span>
                  <a
                    href="mailto:hassan.asghar7868686@gmail.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors text-xs"
                  >
                    hassan.asghar7868686@gmail.com
                  </a>
                  <div className="flex gap-3 mt-2">
                    <a
                      href="https://wa.me/923451098607"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-green-900/40 hover:bg-green-900/60 text-green-400 hover:text-green-300 px-2.5 py-1 rounded-lg text-xs transition-all"
                    >
                      <span>📱</span>
                      <span>+92 345 109 8607</span>
                    </a>
                    <a
                      href="https://wa.me/923497726469"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-green-900/40 hover:bg-green-900/60 text-green-400 hover:text-green-300 px-2.5 py-1 rounded-lg text-xs transition-all"
                    >
                      <span>📱</span>
                      <span>+92 349 772 6469</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Link Columns */}
              {FOOTER_COLS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-white font-semibold text-sm mb-3">{col.title}</h3>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <p>
                © {new Date().getFullYear()} ToolGlobe. Developed by{" "}
                <span className="text-slate-300 font-medium">Hassan Asghar</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/sitemap.xml" className="hover:text-slate-200 transition-colors">Sitemap</Link>
                <span className="text-slate-700">·</span>
                <Link href="/sitemap-1.xml" className="hover:text-slate-200 transition-colors">Tools Index</Link>
                <span className="text-slate-700">·</span>
                <span className="text-slate-600">🔒 Privacy-First · 100% Free</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
