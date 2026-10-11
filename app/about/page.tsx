// app/about/page.tsx
// Legal attribution page — the ONLY surfaces (along with /legal/*) where the
// developer's identity is disclosed, per strict placement rules.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, getLegalDeveloperCredit } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_CONFIG.name}, our mission, and the independent developer behind our free online tools.`,
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
};

export default function AboutPage() {
  const { developer, legal, foundingYear, name } = SITE_CONFIG;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">About {name}</h1>

      <div className="glass-card p-6 sm:p-8 flex flex-col gap-5 text-white/70 text-sm leading-relaxed">
        <p>{SITE_CONFIG.description}</p>

        <p>
          {name} was founded in {foundingYear} with a single mission: make everyday calculations,
          unit conversions, and text utilities instantly accessible to anyone, anywhere — without
          paywalls, mandatory account creation, or cluttered interfaces that slow people down.
          Every tool on this platform is engineered to load fast, compute accurately, and respect
          your time and your data.
        </p>

        <h2 className="text-lg font-semibold text-white mt-2">Ownership &amp; Legal Attribution</h2>
        <p>{getLegalDeveloperCredit()}</p>
        <p>
          {developer.name} personally designed the architecture, conversion formulas, text-processing
          logic, and SEO systems that power every tool on {name}. {developer.name} operates this
          platform as an independent individual publisher under the laws of {legal.jurisdiction},
          and retains full responsibility for its content, accuracy, and ongoing maintenance.
        </p>
        <p>
          As {developer.role}, {developer.name} continues to personally review, test, and expand
          the tool library from {developer.location}, ensuring mathematical accuracy across all
          22 supported unit conversion families and every text, calculator, and SEO utility.
        </p>

        <h2 className="text-lg font-semibold text-white mt-2">Our Commitment to Users</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>100% free access to every converter, calculator, and text tool — forever.</li>
          <li>No unnecessary data collection. See our <Link href="/legal/privacy" className="text-indigo-300 underline">Privacy Policy</Link> for full details.</li>
          <li>Mathematically verified conversion factors sourced from standard international reference constants.</li>
          <li>Transparent advertising that never blocks core tool functionality.</li>
          <li>Continuous improvements driven directly by user feedback and real-world use cases.</li>
        </ul>

        <h2 className="text-lg font-semibold text-white mt-2">Editorial &amp; Accuracy Policy</h2>
        <p>
          All formulas and conversion constants used across {name} are cross-checked against
          internationally recognized standards (SI units, NIST reference tables, and standard
          engineering handbooks). If you believe you have found a calculation error, please report
          it immediately via our <Link href="/contact" className="text-indigo-300 underline">Contact page</Link> —
          corrections are reviewed and deployed promptly.
        </p>

        <h2 className="text-lg font-semibold text-white mt-2">Contact</h2>
        <p>
          For business inquiries, correction requests, partnership proposals, or legal notices,
          please reach out via our <Link href="/contact" className="text-indigo-300 underline">Contact page</Link>{" "}
          or email{" "}
          <a href={`mailto:${legal.privacyEmail}`} className="text-indigo-300 underline">
            {legal.privacyEmail}
          </a>
          .
        </p>

        <p className="text-xs text-white/40 pt-4 border-t border-white/10">
          © {new Date().getFullYear()} {name}. Independently developed and maintained by{" "}
          {developer.name}, {developer.location}.
        </p>
      </div>
    </div>
  );
}
