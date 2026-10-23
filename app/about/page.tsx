import type { Metadata } from "next";
import { ShieldCheck, Zap, Code2 } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAllTools } from "@/lib/tool-registry";
import {
  SITE_NAME,
  OWNER_NAME,
  OWNER_NAME_LOCAL,
  OWNER_CONTACT_EMAIL,
} from "@/lib/constants/site";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "About ToolGlobe — Free Online Tools, Built for Speed and Privacy",
  description:
    "Learn about ToolGlobe, a free online tools platform built by Hassan Asghar, focused on fast, privacy-respecting, browser-based utilities.",
  pathSegments: ["about"],
});

export default function AboutPage() {
  const toolCount = getAllTools().length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <OrganizationJsonLd />

      <h1 className="text-3xl font-bold text-slate-900">About {SITE_NAME}</h1>

      <div className="prose prose-slate mt-6 max-w-none text-sm leading-relaxed text-slate-700">
        <p>
          {SITE_NAME} was built around a simple idea: everyday utility tools
          — formatters, converters, counters, and calculators — should be
          fast, free, and should not require uploading your data to a
          stranger's server. Today the platform hosts {toolCount} fully
          functional tools, with new ones added regularly, across categories
          spanning developer utilities, text processing, math, and more.
        </p>

        <h2>What Makes ToolGlobe Different</h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Zap className="h-5 w-5 text-brand-600" />
          <p className="mt-3 text-sm font-semibold text-slate-800">
            Instant Processing
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Most tools run entirely in your browser — no waiting on a server
            round-trip for results.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ShieldCheck className="h-5 w-5 text-brand-600" />
          <p className="mt-3 text-sm font-semibold text-slate-800">
            Privacy by Design
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Your input data is processed locally and is never stored on our
            servers.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Code2 className="h-5 w-5 text-brand-600" />
          <p className="mt-3 text-sm font-semibold text-slate-800">
            Built for Accuracy
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Every tool ships with documented usage guides, real examples, and
            visible formulas, not black-box results.
          </p>
        </div>
      </div>

      <div className="prose prose-slate mt-10 max-w-none text-sm leading-relaxed text-slate-700">
        <h2>Who Built This</h2>
        <p>
          {SITE_NAME} is owned and developed by {OWNER_NAME} ({OWNER_NAME_LOCAL}
          ), who designs, builds, and maintains the platform's tools and
          infrastructure directly. For questions, feedback, or partnership
          inquiries, reach out at{" "}
          <a href={`mailto:${OWNER_CONTACT_EMAIL}`}>{OWNER_CONTACT_EMAIL}</a>{" "}
          or visit our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </main>
  );
}
