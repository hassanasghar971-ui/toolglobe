import Link from "next/link";
import {
  SITE_NAME,
  OWNER_NAME,
  OWNER_NAME_LOCAL,
  OWNER_CONTACT_EMAIL,
  OWNER_CONTACT_PHONE_PRIMARY,
  OWNER_CONTACT_PHONE_SECONDARY,
} from "@/lib/constants/site";
import { getAllCategories } from "@/lib/tool-registry";

/**
 * Server Component — owner/contact details below are rendered directly
 * into the server-generated HTML (view-source visible, no client fetch),
 * satisfying Google AdSense transparency requirements verbatim.
 *
 * NOTE: /about, /contact, /privacy-policy, /terms, /disclaimer ship in
 * Phase 7. Paths are fixed now so this file requires zero changes once
 * those routes exist — until then these links point to not-yet-built
 * pages (acceptable at this pre-launch build stage; the site is not yet
 * deployed to production end-to-end).
 */
export function Footer() {
  const categories = getAllCategories();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-slate-900">{SITE_NAME}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              A free, fast, and secure collection of 20,000+ real online
              utility tools for developers, students, and professionals.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">Categories</p>
            <ul className="mt-3 flex flex-col gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="text-sm text-slate-600 transition hover:text-brand-600"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">Company</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href="/about" className="text-sm text-slate-600 transition hover:text-brand-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 transition hover:text-brand-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-slate-600 transition hover:text-brand-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-600 transition hover:text-brand-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-slate-600 transition hover:text-brand-600">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">Contact & Ownership</p>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-600">
              <p>
                Owned &amp; developed by{" "}
                <span className="font-medium text-slate-800">
                  {OWNER_NAME} ({OWNER_NAME_LOCAL})
                </span>
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${OWNER_CONTACT_EMAIL}`}
                  className="text-brand-600 hover:underline"
                >
                  {OWNER_CONTACT_EMAIL}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:+${OWNER_CONTACT_PHONE_PRIMARY}`}
                  className="text-brand-600 hover:underline"
                >
                  +{OWNER_CONTACT_PHONE_PRIMARY}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:+${OWNER_CONTACT_PHONE_SECONDARY}`}
                  className="text-brand-600 hover:underline"
                >
                  +{OWNER_CONTACT_PHONE_SECONDARY}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          © {currentYear} {SITE_NAME}. All rights reserved. Developed and
          maintained by {OWNER_NAME} ({OWNER_NAME_LOCAL}).
        </div>
      </div>
    </footer>
  );
}
