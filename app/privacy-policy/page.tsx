import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildStaticPageCanonicalUrl } from "@/lib/canonical";
import { SITE_NAME, SITE_URL, OWNER } from "@/lib/site-config";

const LAST_UPDATED = "January 15, 2025";

export const metadata: Metadata = buildPageMetadata({
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Read the ${SITE_NAME} Privacy Policy to understand what information we collect, how third-party advertising cookies are used, and how to contact us with privacy questions.`,
  pathSegments: ["privacy-policy"],
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Privacy Policy",
      item: buildStaticPageCanonicalUrl("/privacy-policy"),
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-8 space-y-8 text-slate-600 dark:text-slate-400">
        <Section title="1. Introduction">
          <p>
            {SITE_NAME} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), accessible
            at{" "}
            <Link href="/" className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400">
              {SITE_URL}
            </Link>
            , is owned and operated by {OWNER.name}. This Privacy Policy explains what
            information is collected when you use {SITE_NAME}, how it is used, and the choices
            available to you. By using {SITE_NAME}, you agree to the practices described in
            this policy.
          </p>
        </Section>

        <Section title="2. Information We Do Not Collect">
          <p>
            Every tool on {SITE_NAME} runs entirely client-side in your browser using
            JavaScript. Text you type, files you upload, numbers you convert, and any other
            input into a tool is processed locally on your device and is{" "}
            <strong>never transmitted to, or stored on, our servers</strong>. We do not
            require account registration and do not collect names, passwords, or personal
            tool-input data.
          </p>
        </Section>

        <Section title="3. Information Collected Automatically">
          <p>
            Like most websites, our hosting provider and any analytics tools we use may
            automatically collect standard technical information, including:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>IP address (used for rate limiting and abuse prevention only)</li>
            <li>Browser type and version, device type, and operating system</li>
            <li>Pages visited, referring URL, and time spent on pages</li>
            <li>Approximate geographic location derived from IP address</li>
          </ul>
          <p>
            This information is used in aggregate to understand site performance, detect
            abuse, and improve the user experience. It is not used to identify you personally.
          </p>
        </Section>

        <Section title="4. Cookies and Similar Technologies">
          <p>
            {SITE_NAME} and its third-party advertising partners use cookies, local storage,
            and similar technologies to operate the site and to serve relevant advertisements.
            Specifically:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Essential cookies / local storage:</strong> used for site functionality
              such as remembering your theme preference and limiting how often certain UI
              elements (like our ad frequency-capping system) are shown per session.
            </li>
            <li>
              <strong>Advertising cookies:</strong> Google AdSense and Adsterra may set
              cookies to serve ads based on your visits to this and other websites.
            </li>
          </ul>
        </Section>

        <Section title="5. Third-Party Advertising">
          <p>
            We use third-party advertising companies, including Google AdSense and Adsterra,
            to serve ads when you visit {SITE_NAME}. These companies may use information about
            your visits to this and other websites (not including your name, address, email
            address, or telephone number) to provide advertisements about goods and services
            of interest to you.
          </p>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads
            to you based on your visit to {SITE_NAME} and/or other sites on the Internet. You
            may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
            >
              Google Ads Settings
            </a>{" "}
            or{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
            >
              www.aboutads.info/choices
            </a>
            .
          </p>
        </Section>

        <Section title="6. Children's Privacy">
          <p>
            {SITE_NAME} is not directed at children under the age of 13, and we do not
            knowingly collect personal information from children. If you believe a child has
            provided us with personal information, please contact us at{" "}
            <a
              href={`mailto:${OWNER.email}`}
              className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
            >
              {OWNER.email}
            </a>{" "}
            so we can take appropriate action.
          </p>
        </Section>

        <Section title="7. Data Security">
          <p>
            We implement industry-standard security measures, including strict Content
            Security Policy headers, HTTPS encryption, input sanitization, and rate limiting,
            to protect the site from common vulnerabilities. Because tool inputs are processed
            client-side and never transmitted, there is no server-side database of your tool
            activity to be compromised.
          </p>
        </Section>

        <Section title="8. Third-Party Links">
          <p>
            {SITE_NAME} may contain links to external websites. We are not responsible for the
            privacy practices or content of third-party sites. We encourage you to review the
            privacy policy of any site you visit.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on
            this page with an updated &ldquo;Last updated&rdquo; date. Continued use of{" "}
            {SITE_NAME} after changes constitutes acceptance of the revised policy.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>If you have questions about this Privacy Policy, contact {OWNER.name} at:</p>
          <ul className="list-none space-y-1 pl-0">
            <li>
              Email:{" "}
              <a
                href={`mailto:${OWNER.email}`}
                className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
              >
                {OWNER.email}
              </a>
            </li>
            {OWNER.phones.map((phone) => (
              <li key={phone.raw}>
                Phone:{" "}
                <a
                  href={`tel:${phone.raw}`}
                  className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
                >
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
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
