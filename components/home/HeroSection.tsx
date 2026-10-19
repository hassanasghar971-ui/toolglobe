// components/home/HeroSection.tsx
import SearchBar from "@/components/search/SearchBar";

interface HeroSectionProps {
  totalTools: number;
  totalCategories: number;
}

export default function HeroSection({ totalTools, totalCategories }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white px-4 py-20 text-center dark:from-brand-950/30 dark:to-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:bg-brand-950/50 dark:text-brand-400">
          100% Free · No Signup Required
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl">
          {totalTools.toLocaleString()}+ Free Online Tools,
          <br className="hidden sm:block" /> One Platform.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
          Converters, calculators, generators, and developer utilities — all instant, all browser-based, all free.
        </p>

        <div className="mt-8">
          <SearchBar variant="hero" />
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-neutral-500">
          <span>
            <strong className="text-neutral-800 dark:text-neutral-200">{totalTools.toLocaleString()}+</strong> Tools
          </span>
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
          <span>
            <strong className="text-neutral-800 dark:text-neutral-200">{totalCategories}</strong> Categories
          </span>
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
          <span>
            <strong className="text-neutral-800 dark:text-neutral-200">0</strong> Signups Needed
          </span>
        </div>
      </div>
    </section>
  );
}
