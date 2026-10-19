import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildStaticPageCanonicalUrl } from "@/lib/canonical";
import { SITE_NAME, SITE_URL, OWNER } from "@/lib/site-config";

const LAST_UPDATED = "January 15, 2025";

export const metadata: Metadata = buildPageMetadata({
  title: `Terms of Service | ${SITE_NAME}`,
  description: `The Terms of Service governing your use of ${SITE_NAME}'s free online tools, including acceptable use, warranty disclaimers, and liability limitations.`,
  path: "/terms",
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Terms of Service",
      item: buildStaticPageCanonicalUrl("/terms"),
    },
  ],
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-8 space-y-8 text-slate-600 dark:text-slate-400">
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using {SITE_NAME} (&ldquo;the Service&rdquo;), operated by{" "}
            {OWNER.name}, you agree to be bound by these Terms of Service. If you do not agree
            to these terms, please discontinue use of the Service immediately.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            {SITE_NAME} provides free, browser-based utility tools including but not limited
            to unit converters, calculators, text tools, developer utilities, color tools, and
            generators. All computations are performed client-side within your browser. The
            Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any
            guarantee of uninterrupted access.
          </p>
        </Section>

        <Section title="3. Not Professional Advice">
          <p>
            Tools such as calculators (e.g., BMI, loan EMI, percentage) are provided for
            general informational and educational purposes only. They do not constitute
            financial, medical, legal, engineering, or other professional advice. Always
            consult a qualified professional before making decisions based on results from the
            Service.
          </p>
        </Section>

        <Section title="4. User Responsibilities">
          <p>By using {SITE_NAME}, you agree that you will not:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Use the Service for any unlawful purpose or in violation of any applicable law.</li>
            <li>Attempt to disrupt, overload, or bypass rate limiting, security, or anti-abuse measures.</li>
            <li>Scrape, crawl, or systematically extract data from the Service beyond standard, good-faith use.</li>
            <li>Upload or input malicious code, scripts, or content intended to harm the Service or other users.</li>
            <li>Misrepresent your identity or impersonate any person or entity while using the Service.</li>
          </ul>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            The {SITE_NAME} name, logo, design, source code, and tool engine are the
            intellectual property of {OWNER.name} unless otherwise noted. You may not copy,
            reproduce, or redistribute substantial portions of the Service without prior
            written permission.
          </p>
        </Section>

        <Section title="6. Third-Party Advertisements and Links">
          <p>
            {SITE_NAME} displays advertisements served by third parties, including Google
            AdSense and Adsterra, and may contain links to third-party websites. We do not
            control, endorse, or assume responsibility for the content, products, services, or
            privacy practices of any third party.
          </p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p>
            The Service is provided without warranties of any kind, express or implied,
            including but not limited to warranties of merchantability, fitness for a
            particular purpose, accuracy, or non-infringement. We do not warrant that results
            produced by any tool will be error-free or suitable for your specific needs.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, {OWNER.name} and {SITE_NAME} shall not be
            liable for any direct, indirect, incidental, consequential, or punitive damages
            arising from your use of, or inability to use, the Service, including but not
            limited to reliance on calculation or conversion results.
          </p>
        </Section>

        <Section title="9. Service Modifications and Availability">
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the Service,
            including individual tools, at any time without prior notice. We also reserve the
            right to update these Terms periodically.
          </p>
        </Section>

        <Section title="10. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with applicable law,
            without regard to conflict-of-law principles. Any disputes arising from these
            Terms shall be resolved through good-faith negotiation in the first instance.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            We reserve the right to restrict or terminate your access to the Service, without
            notice, if we believe you have violated these Terms or engaged in abusive
            behavior.
          </p>
        </Section>

        <Section title="12. Changes to These Terms">
          <p>
            We may revise these Terms from time to time. The &ldquo;Last updated&rdquo; date
            at the top of this page reflects the most recent revision. Continued use of the
            Service after changes constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            Questions about these Terms should be directed to {OWNER.name} at{" "}
            <a
              href={`mailto:${OWNER.email}`}
              className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
            >
              {OWNER.email}
            </a>{" "}
            or {OWNER.phones.map((p) => p.display).join(" / ")}.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}
