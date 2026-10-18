import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | PDF Lovers Pro",
  description:
    "Learn about PDF Lovers Pro, a free, privacy-first, 100% client-side PDF toolkit with 42+ tools built by Hassan Asghar. No uploads, no servers, no data collection.",
  alternates: {
    canonical: "https://pdflovers.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        About PDF Lovers Pro
      </h1>

      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          PDF Lovers Pro was built on a simple but powerful idea: PDF tools should be free, fast,
          and genuinely private. Most online PDF websites quietly upload your documents to a
          remote server to process them — meaning your contracts, resumes, financial statements,
          and personal files pass through infrastructure you have no control over. PDF Lovers Pro
          takes a fundamentally different approach.
        </p>

        <h2>100% Client-Side Processing</h2>
        <p>
          Every single one of our 42+ tools — from merging and splitting to compressing,
          converting, watermarking, and password-protecting — runs entirely inside your web
          browser using WebAssembly and modern JavaScript engines such as{" "}
          <code>pdf-lib</code> and <code>pdfjs-dist</code>. Your files are loaded directly into
          your device's memory, processed instantly, and never transmitted to any server,
          database, or third-party storage system. When you close the tab, everything is
          automatically cleared.
        </p>

        <h2>Zero Database, Zero API Keys, Zero Tracking of File Content</h2>
        <p>
          PDF Lovers Pro does not operate a backend file-processing pipeline. There is no
          database storing your documents, and there is no hidden API silently uploading your
          data. This architecture was chosen deliberately to give professionals, students, and
          businesses a tool they can trust with sensitive paperwork.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe powerful document tools shouldn't require expensive subscriptions or compromise
          your privacy. PDF Lovers Pro is, and will remain, free to use — supported only by
          non-intrusive advertising so we can keep building new tools and maintaining the
          infrastructure that keeps this project running smoothly.
        </p>

        <h2>Meet the Founder</h2>
        <p>
          PDF Lovers Pro is independently designed, engineered, and maintained by{" "}
          <strong>Hassan Asghar</strong>, a full-stack architect passionate about building secure,
          high-performance, privacy-respecting web applications. Every tool on this platform is
          built, tested, and refined with real-world use cases in mind.
        </p>

        <p>
          Have feedback or a tool request? Reach out any time at{" "}
          <a href="mailto:hassanasghar7868686@gmail.com">hassanasghar7868686@gmail.com</a> or via
          WhatsApp at +92 345 1098607.
        </p>
      </div>
    </main>
  );
}
