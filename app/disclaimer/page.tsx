import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildStaticPageCanonicalUrl } from "@/lib/canonical";
import { SITE_NAME, SITE_URL, OWNER } from "@/lib/site-config";

const LAST_UPDATED = "January 15, 2025";

export const metadata: Metadata = buildPageMetadata({
  title: `Disclaimer | ${SITE_NAME}`,
  description: `Important disclaimers regarding the accuracy, professional advice status, and third-party advertising shown on ${SITE_NAME}.`,
  pathSegments: ["disclaimer"],
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Disclaimer",
      item: buildStaticPageCanonicalUrl("/disclaimer"),
    },
  ],
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Disclaimer
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-8 space-y-8 text-slate-600 dark:text-slate-400">
        <Section title="1. General Disclaimer">
          <p>
            All tools, calculators, converters, and generators on {SITE_NAME} are provided
            &ldquo;as is&rdquo; for general informational and convenience purposes only.
            {" " + OWNER.name} makes no representations or warranties of any kind, express or
            implied, about the completeness, accuracy, reliability, suitability, or
            availability of any tool or the results it produces.
          </p>
        </Section>

        <Section title="2. Not Professional Advice">
          <p>
            Calculators such as BMI, loan EMI, and percentage tools are intended for general
            educational use and do <strong>not</strong> constitute medical, financial, legal,
            tax, or other professional advice. Always consult a qualified professional before
            acting on any result produced by a tool on this site.
          </p>
        </Section>

        <Section title="3. Accuracy and Reliability">
          <p>
            While we strive to keep formulas, unit-conversion factors, and generated output as
            accurate as possible, {SITE_NAME} cannot guarantee that every result is free of
            error. Any action you take based on information from this site is strictly at your
            own risk.
          </p>
        </Section>

        <Section title="4. Advertising Disclaimer">
          <p>
            {SITE_NAME} is monetized through third-party advertising networks, including
            Google AdSense and Adsterra. These networks may display ads, including social bar
            and native banner formats, and may use cookies to personalize advertising content.
            {" " + OWNER.name} does not create, verify, or endorse the content of third-party
            advertisements and is not responsible for the products, services, or claims made
            by advertisers.
          </p>
        </Section>

        <Section title="5. Affiliate Disclaimer">
          <p>
            {SITE_NAME} does not currently participate in any affiliate marketing programs. If
            this changes in the future, this section will be updated to disclose any
            applicable affiliate relationships.
          </p>
        </Section>

        <Section title="6. External Links Disclaimer">
          <p>
            {SITE_NAME} may contain links to external websites that are not provided or
            maintained by us. We do not guarantee the accuracy, relevance, timeliness, or
            completeness of any information on these external sites.
          </p>
        </Section>

        <Section title="7. Errors and Omissions">
          <p>
            While we make every effort to ensure tool logic and legal page content are
            accurate and current, {SITE_NAME} is not responsible for any errors or omissions,
            or for results obtained from the use of this information.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            Under no circumstances shall {OWNER.name} or {SITE_NAME} be held liable for any
            loss or damage of any kind incurred as a result of the use of this site or
            reliance on any information or tool output provided on this site.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Questions about this Disclaimer can be directed to {OWNER.name} at{" "}
            <a
              href={`mailto:${OWNER.email}`}
              className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
            >
              {OWNER.email}
            </a>
            .
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
