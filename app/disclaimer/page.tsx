import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, OWNER_NAME, OWNER_CONTACT_EMAIL } from "@/lib/constants/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer | ToolGlobe",
  description:
    "ToolGlobe's disclaimer covering tool accuracy limitations, third-party links, and advertising content on our free online utility platform.",
  pathSegments: ["disclaimer"],
});

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Disclaimer</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: January 15, 2024</p>

      <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-slate-700">
        <h2>General Information Only</h2>
        <p>
          The tools, calculators, and content provided on {SITE_NAME} are
          intended for general informational and productivity purposes only.
          While each tool is built and tested to perform its stated
          function accurately, {OWNER_NAME} makes no representations or
          warranties of any kind, express or implied, about the completeness,
          accuracy, reliability, or suitability of the results for any
          particular purpose.
        </p>

        <h2>Not Professional Advice</h2>
        <p>
          Outputs from our calculators (including percentage and financial
          calculators) and text or data tools should not be treated as
          financial, legal, medical, or other professional advice. Always
          consult a qualified professional before making decisions based on
          results obtained from this website.
        </p>

        <h2>Third-Party Links and Advertising</h2>
        <p>
          {SITE_NAME} displays advertisements through Google AdSense and
          Adsterra, which may include links to third-party websites. We do
          not control, endorse, or assume responsibility for the content,
          privacy practices, or accuracy of any third-party site linked from
          an advertisement or external reference on our platform.
        </p>

        <h2>No Data Retention Liability</h2>
        <p>
          Because the vast majority of our tools process data entirely in
          your browser, we are not responsible for data loss resulting from
          browser crashes, closed tabs, or device failure during tool use.
          We recommend saving important results using the copy or download
          functions provided within each tool.
        </p>

        <h2>Availability</h2>
        <p>
          We aim to keep {SITE_NAME} available at all times but do not
          guarantee uninterrupted access. The site may be temporarily
          unavailable for maintenance, updates, or reasons beyond our
          control.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this Disclaimer can be sent to {OWNER_NAME} at{" "}
          {OWNER_CONTACT_EMAIL}.
        </p>
      </div>
    </main>
  );
}
