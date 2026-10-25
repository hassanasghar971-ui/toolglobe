import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  SITE_NAME,
  SITE_URL,
  OWNER_NAME,
  OWNER_NAME_LOCAL,
  OWNER_CONTACT_EMAIL,
  OWNER_CONTACT_PHONE_PRIMARY,
  OWNER_CONTACT_PHONE_SECONDARY,
} from "@/lib/constants/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pathSegments: ["terms"],
    title: "Terms of Service",
    description: `Read the terms and conditions governing your use of ${SITE_NAME}.`,
  });
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500">Last updated: 2024</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Agreement</h2>
        <p className="leading-relaxed text-slate-700">
          {`By accessing or using ${SITE_NAME} (${SITE_URL}), you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.`}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Use of Tools
        </h2>
        <p className="leading-relaxed text-slate-700">
          All tools are provided for free, general-purpose use. You are
          responsible for verifying the accuracy of any output before
          relying on it for professional, legal, financial, or technical
          decisions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          No Warranty
        </h2>
        <p className="leading-relaxed text-slate-700">
          Tools are provided without warranties of any kind, either
          express or implied, including without limitation warranties of
          merchantability, fitness for a particular purpose, or
          non-infringement. Use of this platform is entirely at your own
          risk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Limitation of Liability
        </h2>
        <p className="leading-relaxed text-slate-700">
          {`${SITE_NAME} and its owner shall not be liable for any indirect, incidental, or consequential damages arising from use of this site or its tools.`}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Advertising
        </h2>
        <p className="leading-relaxed text-slate-700">
          This site is supported by advertising, including Google
          AdSense and Adsterra. Use of the site constitutes acceptance
          of ad display as part of the free service model.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Changes to These Terms
        </h2>
        <p className="leading-relaxed text-slate-700">
          These terms may be updated from time to time. Continued use of
          the site after changes are posted constitutes acceptance of
          the revised terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Contact Us
        </h2>
        <p className="leading-relaxed text-slate-700">
          {`These Terms of Service are maintained by ${OWNER_NAME} (${OWNER_NAME_LOCAL}), the owner of ${SITE_NAME}.`}
        </p>
        <dl className="space-y-1 text-slate-700">
          <div className="flex gap-2">
            <dt className="font-medium">Email:</dt>
            <dd>{OWNER_CONTACT_EMAIL}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium">Phone:</dt>
            <dd>{OWNER_CONTACT_PHONE_PRIMARY}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium">Phone (alternate):</dt>
            <dd>{OWNER_CONTACT_PHONE_SECONDARY}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
