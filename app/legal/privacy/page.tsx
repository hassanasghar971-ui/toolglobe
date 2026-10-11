// app/legal/privacy/page.tsx
// Complete, production-grade Privacy Policy covering GDPR, CCPA, and
// AdSense/Adsterra third-party cookie disclosures. Zero placeholder content.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, getLegalDeveloperCredit } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE_CONFIG.name}'s Privacy Policy — how we handle data, cookies, analytics, and third-party advertising including Google AdSense and Adsterra.`,
  alternates: { canonical: `${SITE_CONFIG.url}/legal/privacy` },
  robots: { index: true, follow: true },
};

const lastUpdated = "January 15, 2025";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="text-sm text-white/70 leading-relaxed flex flex-col gap-3">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  const { name, url, legal } = SITE_CONFIG;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-xs text-white/40">Last updated: {lastUpdated}</p>
      </div>

      <div className="glass-card p-6 sm:p-8 flex flex-col gap-8">
        <p className="text-sm text-white/70 leading-relaxed">
          This Privacy Policy explains how {name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
          accessible at {url}, collects, uses, discloses, and safeguards information when you visit
          or use our website and its free online tools. {getLegalDeveloperCredit()} By using{" "}
          {name}, you consent to the practices described in this policy.
        </p>

        <Section title="1. Information We Collect">
          <p>
            <strong className="text-white">a) Information You Provide Directly:</strong> When you
            use our Contact form, we collect the name, email address, and message content you
            voluntarily submit. We do not require account registration to use any tool on this
            platform.
          </p>
          <p>
            <strong className="text-white">b) Automatically Collected Information:</strong> Like
            most websites, our servers and third-party service providers automatically log standard
            technical data including IP address (used transiently for rate-limiting and abuse
            prevention, never stored permanently or sold), browser type and version, device type,
            operating system, referring URL, pages visited, and timestamps.
          </p>
          <p>
            <strong className="text-white">c) Tool Input Data:</strong> Text, numbers, and values
            you enter into our converters and calculators are processed in your browser or
            transiently on our server to compute a result and are{" "}
            <strong className="text-white">never stored, logged, or associated with your identity</strong>.
            {name} operates on a zero-database architecture for tool computations — no conversion
            history is retained server-side.
          </p>
        </Section>

        <Section title="2. Cookies and Tracking Technologies">
          <p>
            We and our third-party partners use cookies, web beacons, and similar tracking
            technologies to operate the website, remember preferences, analyze traffic, and serve
            relevant advertising. Cookies are small text files stored on your device.
          </p>
          <p>Types of cookies used on {name} include:</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong className="text-white">Essential cookies:</strong> required for core site functionality and security (e.g., rate-limiting tokens).</li>
            <li><strong className="text-white">Analytics cookies:</strong> help us understand aggregate usage patterns to improve tool performance and content.</li>
            <li><strong className="text-white">Advertising cookies:</strong> set by Google AdSense and Adsterra (see Section 3) to deliver and measure ads.</li>
          </ul>
          <p>
            You can control or delete cookies through your browser settings at any time. Disabling
            cookies may affect certain site features but will not prevent you from using our core
            conversion and calculation tools.
          </p>
        </Section>

        <Section title="3. Third-Party Advertising (Google AdSense &amp; Adsterra)">
          <p>
            We display advertisements served by third-party advertising networks, including{" "}
            <strong className="text-white">Google AdSense</strong> and{" "}
            <strong className="text-white">Adsterra</strong> (Placement ID: 31635306), to support
            the free operation of this platform.
          </p>
          <p>
            These third-party vendors use cookies, web beacons, and device identifiers to serve ads
            based on your prior visits to this website and other websites across the internet.
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based
            on your visits to this site and/or other sites on the Internet.
          </p>
          <p>
            You may opt out of personalized advertising by visiting{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline">
              Google Ads Settings
            </a>{" "}
            or the{" "}
            <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline">
              Network Advertising Initiative opt-out page
            </a>
            . Adsterra advertisements are loaded asynchronously and only after you scroll into view
            of an ad slot, using sandboxed iframes that cannot access the parent page&apos;s content
            or your tool inputs.
          </p>
          <p>
            We do not control the cookies set by third-party advertising networks. Please review
            Google&apos;s{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline">
              Advertising Partners policy
            </a>{" "}
            and Adsterra&apos;s privacy policy for details on their respective data practices.
          </p>
        </Section>

        <Section title="4. GDPR Compliance (European Economic Area Users)">
          <p>
            If you are located in the European Economic Area (EEA), you have rights under the
            General Data Protection Regulation (GDPR), including the right to access, correct,
            delete, restrict, or port your personal data, and the right to object to processing
            based on legitimate interest, including for advertising purposes.
          </p>
          <p>
            Our legal basis for processing limited technical data is legitimate interest (operating
            and securing the website) and, where applicable, your consent (advertising cookies). You
            may withdraw consent at any time via your browser&apos;s cookie settings or ad-network
            opt-out tools listed in Section 3. To exercise any GDPR right, contact us at{" "}
            <a href={`mailto:${legal.privacyEmail}`} className="text-indigo-300 underline">{legal.privacyEmail}</a>.
          </p>
        </Section>

        <Section title="5. CCPA Compliance (California Residents)">
          <p>
            Under the California Consumer Privacy Act (CCPA), California residents have the right
            to know what personal information is collected, request deletion of personal
            information, and opt out of the &quot;sale&quot; of personal information. {name} does
            not sell personal information to third parties for monetary consideration. Third-party
            advertising cookies may constitute a &quot;sale&quot; under CCPA&apos;s broad definition;
            you may opt out using the mechanisms described in Section 3 or by contacting us directly.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement reasonable technical safeguards including HTTPS encryption, Content
            Security Policy (CSP) headers, input sanitization against cross-site scripting (XSS),
            and sliding-window rate limiting to protect against abuse, injection attacks, and
            unauthorized access. However, no method of transmission over the Internet is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="7. Children&apos;s Privacy">
          <p>
            {name} does not knowingly collect personal information from children under the age of
            13 (or the applicable minimum age in your jurisdiction). If you believe a child has
            provided us with personal information, please contact us immediately so we can delete it.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            Contact form submissions are retained only as long as necessary to respond to your
            inquiry and for legitimate record-keeping purposes, after which they are deleted.
            Server access logs used for rate-limiting and security are retained transiently in
            memory and are not persisted to permanent storage.
          </p>
        </Section>

        <Section title="9. Third-Party Links">
          <p>
            Our website may contain links to external sites not operated by us. We are not
            responsible for the content, accuracy, or privacy practices of third-party websites.
            We encourage you to review the privacy policy of any external site you visit.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically to reflect changes in our practices or
            for legal, operational, or regulatory reasons. The &quot;Last updated&quot; date at the
            top of this page reflects the most recent revision. Continued use of {name} after
            changes are posted constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            For questions, data access/deletion requests, or concerns about this Privacy Policy,
            please contact us via our{" "}
            <Link href="/contact" className="text-indigo-300 underline">Contact page</Link> or email{" "}
            <a href={`mailto:${legal.privacyEmail}`} className="text-indigo-300 underline">{legal.privacyEmail}</a>.
            This platform is operated under the jurisdiction of {legal.jurisdiction}.
          </p>
        </Section>
      </div>
    </div>
  );
}
