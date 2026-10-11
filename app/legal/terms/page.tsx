// app/legal/terms/page.tsx
// Complete Terms of Service — zero placeholder content.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service governing your use of ${SITE_CONFIG.name}'s free online tools.`,
  alternates: { canonical: `${SITE_CONFIG.url}/legal/terms` },
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

export default function TermsPage() {
  const { name, url, legal } = SITE_CONFIG;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-xs text-white/40">Last updated: {lastUpdated}</p>
      </div>

      <div className="glass-card p-6 sm:p-8 flex flex-col gap-8">
        <p className="text-sm text-white/70 leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of {name},
          accessible at {url} (the &quot;Service&quot;). By accessing or using the Service, you
          agree to be bound by these Terms. If you do not agree, please discontinue use of the
          Service immediately.
        </p>

        <Section title="1. Description of Service">
          <p>
            {name} provides free, publicly accessible online unit converters, calculators,
            text-formatting utilities, and SEO tools. All computations are provided &quot;as is&quot;
            for informational and convenience purposes.
          </p>
        </Section>

        <Section title="2. Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Submit malicious code, scripts, or payloads intended to exploit, disrupt, or gain unauthorized access to the Service or its infrastructure;</li>
            <li>Attempt to bypass rate limits, scrape the Service at volumes that degrade performance for other users, or reverse-engineer backend logic for competing commercial redistribution;</li>
            <li>Upload or submit content that is unlawful, defamatory, obscene, or infringes on the intellectual property or privacy rights of others;</li>
            <li>Use automated means (bots, crawlers) to access the Service in a manner that violates our <Link href="/robots.txt" className="text-indigo-300 underline">robots.txt</Link> directives;</li>
            <li>Misrepresent your identity or affiliation when submitting the Contact form.</li>
          </ul>
        </Section>

        <Section title="3. No Warranty / Accuracy Disclaimer">
          <p>
            While we make reasonable efforts to ensure mathematical accuracy across all converters
            and calculators using verified standard conversion constants, the Service is provided
            &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, express
            or implied, including but not limited to warranties of merchantability, fitness for a
            particular purpose, or non-infringement.
          </p>
          <p>
            Results from this Service should not be solely relied upon for critical, medical,
            legal, financial, structural, or safety-critical decisions. Always verify important
            calculations with a qualified professional or certified reference source.
          </p>
        </Section>

        <Section title="4. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, {name} and its operator shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages,
            or any loss of profits, data, or goodwill, arising from your use of, or inability to
            use, the Service — even if advised of the possibility of such damages.
          </p>
        </Section>

        <Section title="5. Advertising &amp; Third-Party Content">
          <p>
            The Service displays third-party advertisements (including Google AdSense and
            Adsterra) to support free operation. We do not endorse, and are not responsible for,
            the content, products, or services advertised by third parties on this Service. Your
            interactions with advertisers are solely between you and the advertiser.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All source code, design, branding, and original written content on {name} are the
            intellectual property of its developer and are protected under applicable copyright
            and intellectual property laws. You may not copy, redistribute, or create derivative
            commercial products from our underlying tool logic or generated page content without
            prior written permission.
          </p>
        </Section>

        <Section title="7. User-Submitted Content">
          <p>
            By submitting information through our Contact form, you grant us a non-exclusive,
            royalty-free license to use that content solely for the purpose of responding to your
            inquiry and improving the Service. You represent that any content you submit does not
            violate the rights of any third party.
          </p>
        </Section>

        <Section title="8. Rate Limiting &amp; Fair Use">
          <p>
            To protect Service availability for all users, we employ sliding-window rate limiting
            on tool execution and form submission endpoints. Excessive or automated requests may be
            temporarily throttled or blocked without prior notice.
          </p>
        </Section>

        <Section title="9. Termination of Access">
          <p>
            We reserve the right to restrict or terminate your access to the Service, without
            notice, for conduct that we believe violates these Terms, applicable law, or is
            harmful to the interests of other users or the Service itself.
          </p>
        </Section>

        <Section title="10. Changes to the Service and Terms">
          <p>
            We may modify, suspend, or discontinue any part of the Service at any time without
            liability. We may also revise these Terms periodically; continued use of the Service
            after changes are posted constitutes your acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of{" "}
            {legal.jurisdiction}, without regard to conflict of law principles. Any disputes
            arising from these Terms or use of the Service shall be subject to the exclusive
            jurisdiction of the competent courts located in {legal.jurisdiction}.
          </p>
        </Section>

        <Section title="12. Severability">
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision
            shall be limited or eliminated to the minimum extent necessary, and the remaining
            provisions shall remain in full force and effect.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            Questions about these Terms should be directed to us via our{" "}
            <Link href="/contact" className="text-indigo-300 underline">Contact page</Link> or email{" "}
            <a href={`mailto:${legal.privacyEmail}`} className="text-indigo-300 underline">{legal.privacyEmail}</a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
