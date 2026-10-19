"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/categories";
import { SearchBar } from "@/components/search/SearchBar";
import { SEARCH_OPEN_EVENT } from "@/components/search/SearchModal";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close all overlays on route change.
  useEffect(() => {
    setMobileOpen(false);
    setCategoriesOpen(false);
    setMobileCategoriesOpen(false);
  }, [pathname]);

  // Close desktop categories dropdown on outside click.
  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Lock body scroll while mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function openSearch() {
    window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors ${
        scrolled
          ? "border-slate-200 bg-white/90 backdrop-blur-md shadow-sm dark:border-slate-800 dark:bg-slate-950/90"
          : "border-transparent bg-white/70 backdrop-blur-sm dark:bg-slate-950/70"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-black text-white">
            T
          </span>
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-200">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/" className={navLinkClass(isActive("/"))}>
            Home
          </Link>

          <div className="relative" ref={categoriesRef}>
            <button
              type="button"
              onClick={() => setCategoriesOpen((v) => !v)}
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
              className={`${navLinkClass(pathname.startsWith("/category"))} flex items-center gap-1`}
            >
              Categories
              <ChevronDown
                className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-[32rem] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="grid grid-cols-2 gap-1">
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-400"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/#categories"
                  className="mt-3 block rounded-lg px-3 py-2 text-center text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-slate-800"
                >
                  View all categories →
                </Link>
              </div>
            )}
          </div>

          <Link href="/about" className={navLinkClass(isActive("/about"))}>
            About
          </Link>
          <Link href="/contact" className={navLinkClass(isActive("/contact"))}>
            Contact
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden w-64 sm:block lg:w-80">
            <SearchBar variant="compact" />
          </div>

          <button
            type="button"
            onClick={openSearch}
            aria-label="Search tools"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 sm:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-6 pt-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-1">
            <Link href="/" className={mobileLinkClass(isActive("/"))}>
              Home
            </Link>

            <button
              type="button"
              onClick={() => setMobileCategoriesOpen((v) => !v)}
              aria-expanded={mobileCategoriesOpen}
              className={`${mobileLinkClass(pathname.startsWith("/category"))} flex items-center justify-between`}
            >
              Categories
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileCategoriesOpen && (
              <div className="ml-2 grid grid-cols-2 gap-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="rounded-md px-2 py-1.5 text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/about" className={mobileLinkClass(isActive("/about"))}>
              About
            </Link>
            <Link href="/contact" className={mobileLinkClass(isActive("/contact"))}>
              Contact
            </Link>
          </nav>

          <div className="mt-4">
            <SearchBar variant="hero" />
          </div>
        </div>
      )}
    </header>
  );
}

function navLinkClass(active: boolean) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? "text-brand-600 dark:text-brand-400"
      : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
  }`;
}

function mobileLinkClass(active: boolean) {
  return `rounded-lg px-3 py-2.5 text-left text-base font-medium transition-colors ${
    active
      ? "bg-brand-50 text-brand-700 dark:bg-slate-900 dark:text-brand-400"
      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
  }`;
}
