import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolglobe.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ToolGlobe — 20,000+ Free Online Tools",
    template: "%s | ToolGlobe",
  },
  description:
    "ToolGlobe is a free, fast, and secure collection of 20,000+ real online utility tools for developers, students, and professionals.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
