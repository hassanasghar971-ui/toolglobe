import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import AdsterraLoader from "@/components/AdsterraLoader";

const BASE_URL = "https://pdflovers.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PDF Lovers Pro – Free Online PDF Tools, 100% Client-Side & Secure",
    template: "%s | PDF Lovers Pro",
  },
  description:
    "42+ free online PDF tools to merge, split, compress, convert, edit, sign and protect PDF files. 100% client-side WebAssembly processing — your files never leave your browser.",
  keywords: [
    "pdf tools",
    "merge pdf",
    "compress pdf",
    "convert pdf",
    "edit pdf online",
    "pdf lovers pro",
    "free pdf converter",
  ],
  authors: [{ name: "Hassan Asghar", url: BASE_URL }],
  creator: "Hassan Asghar",
  publisher: "PDF Lovers Pro",
  verification: {
    google: "pwyfdDe7eDVI1cMvuebKjXMzJ6kFspOCtUPX7aDskuI",
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "PDF Lovers Pro",
    title: "PDF Lovers Pro – Free Online PDF Tools",
    description:
      "42+ free, secure, 100% client-side PDF tools. No uploads, no servers, total privacy.",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PDF Lovers Pro - Free Online PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Lovers Pro – Free Online PDF Tools",
    description: "42+ free, secure, 100% client-side PDF tools.",
    images: [`${BASE_URL}/og-image.png`],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PDF Lovers Pro",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  founder: {
    "@type": "Person",
    name: "Hassan Asghar",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+92-345-1098607",
      contactType: "customer support",
      email: "hassanasghar7868686@gmail.com",
      availableLanguage: ["English"],
    },
  ],
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="pwyfdDe7eDVI1cMvuebKjXMzJ6kFspOCtUPX7aDskuI"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased">
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-extrabold text-blue-600"
            >
              <span aria-hidden="true">📄</span>
              <span>PDF Lovers Pro</span>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
              <Link href="/tools" className="transition hover:text-blue-600">
                All Tools
              </Link>
              <Link href="/about" className="transition hover:text-blue-600">
                About
              </Link>
              <Link href="/contact" className="transition hover:text-blue-600">
                Contact
              </Link>
            </div>
          </nav>
        </header>

        <main className="w-full flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-slate-50 py-10 text-sm text-slate-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  PDF Lovers Pro
                </h3>
                <p>
                  42+ free, secure PDF tools processed 100% inside your
                  browser. No uploads, no tracking of your document content,
                  ever.
                </p>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-slate-900">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="hover:text-blue-600">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-blue-600">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools" className="hover:text-blue-600">
                      All Tools
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-slate-900">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy-policy" className="hover:text-blue-600">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="hover:text-blue-600">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/disclaimer" className="hover:text-blue-600">
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-slate-900">
                  Contact Founder
                </h4>
                <p className="mb-1">Hassan Asghar</p>
                <p className="mb-1">
                  <a
                    href="mailto:hassanasghar7868686@gmail.com"
                    className="hover:text-blue-600"
                  >
                    hassanasghar7868686@gmail.com
                  </a>
                </p>
                <p>WhatsApp: +92 345 1098607</p>
              </div>
            </div>
            <p className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} PDF Lovers Pro (pdflovers.com).
              Engineered & Founded by Hassan Asghar. All rights reserved.
            </p>
          </div>
        </footer>

        <AdsterraLoader />
      </body>
    </html>
  );
}
