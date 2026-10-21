import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildStaticPageCanonicalUrl } from "@/lib/canonical";
import { SITE_NAME, SITE_URL, OWNER } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: `Contact Us | ${SITE_NAME}`,
  description: `Get in touch with ${SITE_NAME}. Reach ${OWNER.name} directly by email or phone for support, bug reports, tool requests, or business inquiries.`,
  pathSegments: ["contact"],
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contact Us",
      item: buildStaticPageCanonicalUrl("/contact"),
    },
  ],
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
        Support & Inquiries
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Contact {OWNER.name}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
        Have feedback, found a bug, or want to suggest a new utility tool? Reach out directly using any of the channels below.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Email Us</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            For general queries, bug reports, or partnership proposals.
          </p>
          <a
            href={`mailto:${OWNER.email}`}
            className="mt-4 inline-block font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            {OWNER.email}
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Call / WhatsApp</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Available for urgent technical or business communication.
          </p>
          <div className="mt-4 flex flex-col gap-1">
            {OWNER.phones.map((phone) => (
              <a
                key={phone.raw}
                href={`tel:${phone.raw}`}
                className="font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                {phone.display}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-slate-50 p-6 border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Developer & Maintainer</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {SITE_NAME} is independently engineered and managed by <strong className="text-slate-900 dark:text-white">{OWNER.name}</strong> ({OWNER.role}), focusing on high-performance browser tools and optimal client-side privacy.
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
