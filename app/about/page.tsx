import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAllTools, getAllCategories } from "@/lib/tool-registry";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import {
  SITE_NAME,
  OWNER_NAME,
  OWNER_NAME_LOCAL,
  OWNER_CONTACT_EMAIL,
  OWNER_CONTACT_PHONE_PRIMARY,
  OWNER_CONTACT_PHONE_SECONDARY,
} from "@/lib/constants/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pathSegments: ["about"],
    title: "About Us",
    description: `Learn about ${SITE_NAME}, a free online platform offering thousands of utility tools, and the team behind it.`,
  });
}

export default function AboutPage() {
  const toolCount = getAllTools().length;
  const categoryCount = getAllCategories().length;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <OrganizationJsonLd />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          About {SITE_NAME}
        </h1>
        <p className="text-base text-slate-600">
          {`${SITE_NAME} is on a mission to make everyday digital tasks faster and simpler for everyone, everywhere.`}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Our Mission</h2>
        <p className="leading-relaxed text-slate-700">
          {`We believe powerful utility software should not require downloads, sign-ups, or payment. ${SITE_NAME} currently hosts ${toolCount} free tools across ${categoryCount} categories, covering everyday needs in development, text processing, mathematics, images, documents, search optimization, unit conversion, and color design.`}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          What We Offer
        </h2>
        <p className="leading-relaxed text-slate-700">
          Every tool on this platform runs directly in your browser with
          clear usage instructions, real examples, and answers to common
          questions, so you can get accurate results without guesswork.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Ownership</h2>
        <p className="leading-relaxed text-slate-700">
          {`${SITE_NAME} is owned and operated by ${OWNER_NAME} (${OWNER_NAME_LOCAL}).`}
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

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Our Commitment
        </h2>
        <p className="leading-relaxed text-slate-700">
          {`We are committed to keeping ${SITE_NAME} fast, secure, and free to use. If you have a suggestion for a new tool or spot an issue with an existing one, our contact page is always open.`}
        </p>
      </section>
    </div>
  );
}
