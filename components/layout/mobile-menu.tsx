"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { CategoryDefinition } from "@/lib/tool-registry/types";

interface MobileMenuProps {
  categories: CategoryDefinition[];
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 top-[57px] z-30 max-h-[calc(100vh-57px)] overflow-y-auto border-b border-slate-200 bg-white p-4 shadow-lg lg:hidden">
          <nav aria-label="Tool categories" className="flex flex-col gap-1">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/tools/${category.slug}`}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
