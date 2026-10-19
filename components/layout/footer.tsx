import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, OWNER } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/categories";
import { getTotalToolCount } from "@/lib/tool-registry";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const toolCount = getTotalToolCount();
  const featuredCategories = CATEGORIES.slice(0, 8);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-black text-white">
                T
              </span>
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {SITE_DESCRIPTION}
            </p>
            <p className="mt-3 text-sm font-medium text-brand-600 dark:text-brand-400">
              {toolCount.toLocaleString()}+ free online tools, 100% browser-based.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              Categories
            </h3>
            <ul className="mt-3 space-y-2">
              {featuredCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              Company
            </h3>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              Legal
            </h3>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              Contact
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href={`mailto:${OWNER.email}`}
                  className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {OWNER.email}
                </a>
              </li>
              {OWNER.phones.map((phone) => (
                <li key={phone.raw}>
                  <a
                    href={`tel:${phone.raw}`}
                    className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
              <li className="pt-1 text-slate-500 dark:text-slate-500">
                {OWNER.name} ({OWNER.nameLocal}) — {OWNER.role}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row dark:border-slate-800 dark:text-slate-500">
          <p>
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
          <p>
            Built by{" "}
            <a
              href={`mailto:${OWNER.email}`}
              className="font-medium text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
            >
              {OWNER.name}
            </a>
          </p>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-slate-400 dark:text-slate-600">
          {SITE_NAME} displays third-party advertisements, including Google AdSense and
          Adsterra, to keep every tool free. See our{" "}
          <Link
            href="/disclaimer"
            className="underline hover:text-brand-600 dark:hover:text-brand-400"
          >
            Disclaimer
          </Link>{" "}
          for details. {SITE_URL}
        </p>
      </div>
    </footer>
  );
}
