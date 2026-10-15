import type { Metadata } from "next";
import AdLayout from "@/components/AdLayout";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolglobe.com"), // اپنی اصل SITE_CONFIG.url سے بدل دیں
  title: {
    default: "ToolGlobe — Free Online Calculators, Converters & SEO Tools",
    template: "%s | ToolGlobe",
  },
  description:
    "Thousands of free, instant online tools: unit converters, calculators, text formatters, and SEO utilities. No signup required.",
  verification: {
    // ✅ Google Search Console tag — Next.js App Router کا سرکاری طریقہ۔
    // یہ خود بخود <meta name="google-site-verification" content="..." />
    // بنا کر <head> میں inject کر دیتا ہے۔
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

        {/* تمام ایڈ لاجک صرف AdLayout کے اندر ہے — یہاں کوئی
            براہ راست <script> ٹیگ موجود نہیں، ڈپلیکیٹ امپریشن سے بچنے کے لیے۔ */}
        <AdLayout />
      </body>
    </html>
  );
}
