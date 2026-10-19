import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Mail, Phone, Clock, MessageCircle } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildStaticPageCanonicalUrl } from "@/lib/canonical";
import { SITE_NAME, SITE_URL, OWNER } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: `Contact Us | ${SITE_NAME}`,
  description: `Get in touch with ${SITE_NAME}. Reach ${OWNER.name} directly by email or phone for support, bug reports, tool requests, or business inquiries.`,
  path: "/contact",
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

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${SITE_NAME}`,
  url: buildStaticPageCanonicalUrl("/contact"),
  mainEntity: {
    "@type": "Person",
    name: OWNER.name,
    jobTitle: OWNER.role,
    email: OWNER.email,
    telephone: OWNER.phones.map((p) => p.display),
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />

      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
        Get in Touch
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Contact {SITE_NAME}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
        Found a bug, have a tool idea, need help with a calculation, or want to discuss a
        business/advertising inquiry? {OWNER.name} personally reads every message sent to the
        channels below.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <ContactCard
          icon={<Mail className="h-5 w-5" />}
          title="Email"
          value={OWNER.email}
          href={`mailto:${OWNER.email}?subject=${encodeURIComponent(`${SITE_NAME} Inquiry`)}`}
        />
        <ContactCard
          icon={<Phone className="h-5 w-5" />}
          title="Phone / WhatsApp"
          value={OWNER.phones[0].display}
          href={`tel:${OWNER.phones[0].raw}`}
        />
        <ContactCard
          icon={<Phone className="h-5 w-5" />}
          title="Alternate Phone"
          value={OWNER.phones[1].display}
          href={`tel:${OWNER.phones[1].raw}`}
        />
        <ContactCard
          icon={<Clock className="h-5 w-5" />}
          title="Response Time"
          value="Within 24–48 hours"
        />
      </div>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <MessageCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          What to include in your message
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-400">
          <li>For bug reports: the tool URL, your browser, and the steps to reproduce.</li>
          <li>For new tool requests: what the tool should calculate, convert, or generate.</li>
          <li>For business/advertising inquiries: a brief description of your proposal.</li>
          <li>
            For legal/privacy questions: reference the relevant section of our{" "}
            <Link
              href="/privacy-policy"
              className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
            >
              Privacy Policy
            </Link>
            .
          </li>
        </ul>
      </section>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-500">
        {SITE_NAME} is owned and operated by {OWNER.name} ({OWNER.nameLocal}).
      </p>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-400">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">
          {title}
        </span>
        <span className="block text-sm font-medium text-slate-900 dark:text-white">
          {value}
        </span>
      </span>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} className="block">
      {content}
    </a>
  );
}
