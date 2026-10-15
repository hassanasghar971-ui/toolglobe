import type { Metadata } from "next";
import Script from "next/script";
import AdLayout from "@/components/AdLayout";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolglobe.com"), // replace with real SITE_CONFIG.url
  title: {
    default: "ToolGlobe — Free Online Calculators, Converters & SEO Tools",
    template: "%s | ToolGlobe",
  },
  description:
    "Thousands of free, instant online tools: unit converters, calculators, text formatters, and SEO utilities. No signup required.",
  verification: {
    // ✅ EXACT tag you provided — embedded via Next.js metadata API, which
    // renders it as <meta name="google-site-verification" content="..." />
    // in the document <head> automatically. This is the framework-correct
    // way to do this in App Router (manual <head> tags are not supported
    // the same way as Pages Router).
    google: "pwyfdDe7eDVI1cMvuebKjXMzJ6kFspOCtUPX7aDskuI",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}

        {/* Native Banner container + lazy-load logic */}
        <AdLayout />

        {/* ✅ Adsterra Social Bar — exact script you provided, embedded
            verbatim. Using next/script with strategy="lazyOnload" so it
            loads AFTER the page is interactive, preventing any blocking
            of First Contentful Paint / Largest Contentful Paint. The
            original tag's async="async" attribute is preserved implicitly
            by next/script's loading strategy. */}
        <Script
          src="//pl26017366.highcpmgate.com/0d/17/2a/0d172a233b2112be8f02f92f254f15d1.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
