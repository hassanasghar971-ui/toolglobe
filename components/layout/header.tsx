"use client";

import Link from "next/link";
import { Search, Menu, X, Wrench, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { SITE_NAME } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/categories";
import SearchBar from "@/components/search/SearchBar";
import { SEARCH_OPEN_EVENT } from "@/components/search/SearchModal";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openSearchModal = () => {
    window.dispatchEvent(new CustomEvent(SEARCH_OPEN_EVENT));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-transform group-hover:scale-105">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block w-72 lg:w-80">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/#categories"
            className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={openSearchModal}
            aria-label="Open search"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4">
            <SearchBar />
          </div>
          <nav className="flex flex-col space-y-3">
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300"
            >
              Categories
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
