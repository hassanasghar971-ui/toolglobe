import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildStaticPageCanonicalUrl } from "@/lib/canonical";
import { SITE_NAME, SITE_URL, OWNER } from "@/lib/site-config";

const LAST_UPDATED = "January 15, 2025";

export const metadata: Metadata = buildPageMetadata({
  title: `Terms of Service | ${SITE_NAME}`,
  description: `The Terms of Service governing your use of ${SITE_NAME}'s free online tools, including acceptable use, warranty disclaimers, and liability limitations.`,
  pathSegments: ["terms"],
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
        <Section title="1. Agreement to Terms">
          <p>
            Welcome to {SITE_NAME} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
            accessible at{" "}
            <Link href="/" className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400">
              {SITE_URL}
            </Link>
            . By accessing or using our website and utility tools, you agree to be bound by
            these Terms of Service. If you disagree with any part of these terms, you may not
            access the website.
          </p>
        </Section>

        <Section title="2. Use of Free Tools">
          <p>
            All tools, calculators, converters, and generators provided on {SITE_NAME} are
            offered completely free of charge for personal, educational, and professional
            utility use. You agree to use our tools only for lawful purposes and in a manner
            that does not infringe the rights of, or restrict the use of the site by, any
            third party.
          </p>
        </Section>

        <Section title="3. Intellectual Property">
          <p>
            The design, source code, user interface, layout, and tool engines of {SITE_NAME}{" "}
            are the intellectual property of {OWNER.name} and are protected by applicable
            copyright and intellectual property laws. You may not copy, reproduce,
            redistribute, or reverse-engineer our proprietary code or interface elements
            without explicit prior written consent.
          </p>
        </Section>

        <Section title="4. Disclaimer of Warranties">
          <p>
            The tools and services on {SITE_NAME} are provided on an &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo; basis without warranties of any kind, either express or
            implied. We do not guarantee that the site will be uninterrupted, secure, or free
            of errors, or that tool outputs will be 100% accurate for your specific use case.
          </p>
        </Section>

        <Section title="5. Limitation of Liability">
          <p>
            In no event shall {OWNER.name} or {SITE_NAME} be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out of or
            connected with your use of, or inability to use, our website or tools.
          </p>
        </Section>

        <Section title="6. External Links">
          <p>
            Our website may contain links to third-party websites or services that are not
            owned or controlled by {SITE_NAME}. We assume no responsibility for the content,
            privacy policies, or practices of any third-party websites.
          </p>
        </Section>

        <Section title="7. Changes to Terms">
          <p>
            We reserve the right to modify or replace these Terms of Service at any time. Any
            changes will be posted on this page with a revised &ldquo;Last updated&rdquo; date.
            Your continued use of the site after changes constitutes your acceptance of the new
            terms.
          </p>
        </Section>

        <Section title="8. Contact Information">
          <p>
            If you have any questions about these Terms of Service, please contact{" "}
            {OWNER.name} at{" "}
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
