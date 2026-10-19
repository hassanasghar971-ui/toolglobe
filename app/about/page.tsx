import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildStaticPageCanonicalUrl } from "@/lib/canonical";
import { SITE_NAME, SITE_URL, OWNER } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/categories";
import { getTotalToolCount } from "@/lib/tool-registry";

export const metadata: Metadata = buildPageMetadata({
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}, a free platform offering ${getTotalToolCount().toLocaleString()}+ browser-based utility tools for unit conversion, calculations, text processing, developer workflows, and more — built and maintained by ${OWNER.name}.`,
  path: "/about",
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "About Us",
      item: buildStaticPageCanonicalUrl("/about"),
    },
  ],
};

export default function AboutPage() {
  const toolCount = getTotalToolCount();
  const categoryCount = CATEGORIES.length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
        About {SITE_NAME}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Free, fast, and private tools for everyday problems.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
        {SITE_NAME} is a growing library of {toolCount.toLocaleString()}+ utility tools
        spanning {categoryCount} categories — from unit converters and financial calculators
        to developer utilities, text processors, color tools, and generators. Every tool runs
        directly in your browser, giving you instant results without uploading your data
        anywhere.
      </p>

      <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat value={`${toolCount.toLocaleString()}+`} label="Tools" />
        <Stat value={`${categoryCount}`} label="Categories" />
        <Stat value="100%" label="Browser-based" />
        <Stat value="$0" label="Cost, always" />
      </section>

      <SectionHeading>Our Mission</SectionHeading>
      <p className="text-slate-600 dark:text-slate-400">
        We believe everyday digital tasks — converting units, formatting text, generating a
        password, calculating a loan payment — shouldn&apos;t require downloading software,
        creating an account, or handing over personal data. {SITE_NAME} was built to be the
        fastest path from &ldquo;I need to do X&rdquo; to &ldquo;done,&rdquo; for free, for
        everyone, on any device.
      </p>

      <SectionHeading>How {SITE_NAME} Works</SectionHeading>
      <p className="text-slate-600 dark:text-slate-400">
        Every tool on {SITE_NAME} executes entirely client-side using JavaScript running in
        your own browser. Numbers you convert, text you format, passwords you generate, and
        images you resize are processed on your device and are never uploaded to our servers
        or stored in a database. This design keeps {SITE_NAME} fast, private, and reliable
        even under heavy traffic.
      </p>

      <SectionHeading>Why {SITE_NAME} Is Free</SectionHeading>
      <p className="text-slate-600 dark:text-slate-400">
        {SITE_NAME} is supported by non-intrusive advertising (including Google AdSense and
        Adsterra). Ads help us cover hosting and development costs so that every tool can
        remain free to use, with no paywalls, subscriptions, or usage limits. Read our{" "}
        <Link
          href="/disclaimer"
          className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
        >
          Disclaimer
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
        >
          Privacy Policy
        </Link>{" "}
        for full details on how advertising works on this site.
      </p>

      <SectionHeading>Meet the Founder</SectionHeading>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          {OWNER.name}{" "}
          <span className="font-normal text-slate-500 dark:text-slate-400">
            ({OWNER.nameLocal})
          </span>
        </p>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{OWNER.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {OWNER.name} designed, built, and maintains {SITE_NAME} end-to-end — from the tool
          engine and search experience to security and performance. Have feedback, found a
          bug, or want to request a new tool? Reach out directly:
        </p>
        <div className="mt-4 flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
          <a href={`mailto:${OWNER.email}`} className="hover:text-brand-600 dark:hover:text-brand-400">
            {OWNER.email}
          </a>
          {OWNER.phones.map((phone) => (
            <a
              key={phone.raw}
              href={`tel:${phone.raw}`}
              className="hover:text-brand-600 dark:hover:text-brand-400"
            >
              {phone.display}
            </a>
          ))}
        </div>
      </div>

      <SectionHeading>Our Commitment</SectionHeading>
      <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-400">
        <li>No forced account creation, ever.</li>
        <li>No selling or sharing of user-submitted tool data — because we never receive it.</li>
        <li>
          Transparent, accessible legal pages: see our Privacy Policy, Terms of Service, and
          Disclaimer.
        </li>
        <li>Continuously expanding tool library based on real user demand.</li>
      </ul>

      <div className="mt-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-center text-white">
        <p className="text-lg font-semibold">Have a question or a tool suggestion?</p>
        <Link
          href="/contact"
          className="mt-3 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-transform hover:scale-105"
        >
          Contact Us
        </Link>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
      <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 text-xl font-bold text-slate-900 dark:text-white">{children}</h2>
  );
}
