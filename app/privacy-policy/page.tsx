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
    pathSegments: ["privacy-policy"],
    title: "Privacy Policy",
    description: `Read the ${SITE_NAME} privacy policy to understand what information is collected, how it is used, and your rights.`,
  });
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">Last updated: 2024</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Introduction
        </h2>
        <p className="leading-relaxed text-slate-700">
          {`This Privacy Policy explains how ${SITE_NAME} (accessible at ${SITE_URL}) collects, uses, and protects information when you use our free online tools. By using this site, you agree to the practices described below.`}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Information We Collect
        </h2>
        <p className="leading-relaxed text-slate-700">
          Most tools on this platform process data entirely in your
          browser and do not transmit your input to our servers. Where a
          tool requires server processing, only the minimum data needed
          to produce a result is used, and it is not stored beyond the
          request.
        </p>
        <p className="leading-relaxed text-slate-700">
          We may automatically collect standard technical information
          such as browser type, approximate location, device type, and
          pages visited, through analytics and advertising partners
          described below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Cookies and Advertising
        </h2>
        <p className="leading-relaxed text-slate-700">
          This site uses cookies and similar technologies to support
          advertising partners, including Google AdSense and Adsterra.
          These partners may use cookies to serve ads based on your
          prior visits to this and other websites. You can opt out of
          personalized advertising through your browser settings or via
          the Google Ads Settings page.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Data Security
        </h2>
        <p className="leading-relaxed text-slate-700">
          We apply reasonable technical safeguards, including a strict
          content security policy and input sanitization, to protect the
          platform. No method of transmission over the internet is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Third-Party Links
        </h2>
        <p className="leading-relaxed text-slate-700">
          {`${SITE_NAME} may contain links to third-party websites. We are not responsible for the privacy practices or content of those external sites.`}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Contact Us
        </h2>
        <p className="leading-relaxed text-slate-700">
          {`If you have questions about this Privacy Policy, you can reach ${OWNER_NAME} (${OWNER_NAME_LOCAL}), the owner of ${SITE_NAME}, using the details below.`}
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
