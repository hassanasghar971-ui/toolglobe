import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  OWNER_NAME,
  OWNER_NAME_LOCAL,
  OWNER_CONTACT_EMAIL,
  OWNER_CONTACT_PHONE_PRIMARY,
  OWNER_CONTACT_PHONE_SECONDARY,
} from "@/lib/constants/site";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact ToolGlobe — Get in Touch",
  description:
    "Contact ToolGlobe's owner Hassan Asghar directly via email or phone for support, feedback, or partnership inquiries.",
  pathSegments: ["contact"],
});

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
      <p className="mt-3 text-base text-slate-600">
        Have a question, found a bug, or want to suggest a new tool? Reach
        out directly — every message goes straight to {OWNER_NAME}.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-800">
              {OWNER_NAME} ({OWNER_NAME_LOCAL})
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Owner &amp; Developer, ToolGlobe
            </p>

            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-700">
              <a
                href={`mailto:${OWNER_CONTACT_EMAIL}`}
                className="flex items-center gap-2 hover:text-brand-600"
              >
                <Mail className="h-4 w-4" /> {OWNER_CONTACT_EMAIL}
              </a>
              <a
                href={`tel:+${OWNER_CONTACT_PHONE_PRIMARY}`}
                className="flex items-center gap-2 hover:text-brand-600"
              >
                <Phone className="h-4 w-4" /> +{OWNER_CONTACT_PHONE_PRIMARY}
              </a>
              <a
                href={`tel:+${OWNER_CONTACT_PHONE_SECONDARY}`}
                className="flex items-center gap-2 hover:text-brand-600"
              >
                <Phone className="h-4 w-4" /> +{OWNER_CONTACT_PHONE_SECONDARY}
              </a>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            For privacy or legal inquiries, please see our{" "}
            <a href="/privacy-policy" className="text-brand-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-brand-600 hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
