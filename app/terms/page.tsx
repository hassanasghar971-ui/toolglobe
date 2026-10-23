import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  SITE_NAME,
  OWNER_NAME,
  OWNER_NAME_LOCAL,
  OWNER_CONTACT_EMAIL,
} from "@/lib/constants/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service | ToolGlobe",
  description:
    "Review the Terms of Service governing your use of ToolGlobe's free online tools, including acceptable use, liability limits, and intellectual property.",
  pathSegments: ["terms"],
});

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: January 15, 2024</p>

      <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-slate-700">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using {SITE_NAME} (toolglobe.app), owned and
          operated by {OWNER_NAME} ({OWNER_NAME_LOCAL}), you agree to be
          bound by these Terms of Service. If you do not agree, please
          discontinue use of the site.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          {SITE_NAME} provides a free collection of browser-based utility
          tools, including but not limited to text formatters, converters,
          and calculators. Tools are provided "as is" for general-purpose
          use.
        </p>

        <h2>3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use automated scripts to scrape or overload our servers;</li>
          <li>Attempt to bypass, disable, or interfere with our security measures;</li>
          <li>Use the tools to generate or process unlawful content;</li>
          <li>Reverse-engineer or resell access to our tools as a competing service.</li>
        </ul>

        <h2>4. No Warranty</h2>
        <p>
          Our tools are provided without warranties of any kind, express or
          implied, including fitness for a particular purpose. While we
          strive for accuracy in every calculation and transformation, we do
          not guarantee that results are error-free, and you should
          independently verify results used for financial, legal, medical,
          or other critical decisions.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, {OWNER_NAME} and{" "}
          {SITE_NAME} shall not be liable for any indirect, incidental, or
          consequential damages arising from your use of, or inability to
          use, the site or its tools.
        </p>

        <h2>6. Advertising</h2>
        <p>
          {SITE_NAME} is supported by advertising served through Google
          AdSense and Adsterra. By using the site, you acknowledge that
          advertisements, including third-party content, may be displayed
          alongside our tools.
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          The {SITE_NAME} name, logo, and website design are the property of{" "}
          {OWNER_NAME}. You retain full ownership of any content or data you
          input into our tools, which — as described in our Privacy Policy
          — is processed locally in your browser and not retained by us.
        </p>

        <h2>8. Changes to These Terms</h2>
        <p>
          We may revise these Terms from time to time. Continued use of the
          site after changes are posted constitutes acceptance of the
          revised Terms.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about these Terms can be directed to {OWNER_NAME} at{" "}
          {OWNER_CONTACT_EMAIL}.
        </p>
      </div>
    </main>
  );
}
