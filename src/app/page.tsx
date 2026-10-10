import { getToolsPage } from '@/lib/toolsData';
import SearchBar from '@/components/SearchBar';
import { AdLayout } from '@/components/AdLayout';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomePage() {
  const tools = getToolsPage();

  const categories = Array.from(
    new Set(tools.map((t) => t.category).filter(Boolean))
  ).slice(0, 8) as string[];

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 overflow-x-hidden">
      {/* Decorative background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-[30rem] -left-32 w-[28rem] h-[28rem] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[24rem] h-[24rem] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/70 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-md shadow-indigo-500/30">
              TG
            </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ToolGlobe
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Contact
            </Link>
          </nav>

          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {tools.length}+ Free Tools, Zero Sign-up
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            The Only Toolbox{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
              You&apos;ll Ever Need
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            Discover fast, free, and privacy-friendly online tools for developers, designers,
            and everyday productivity — all in one place.
          </p>

          <SearchBar />

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-sm text-slate-500 dark:text-slate-400">
            {['100% Free Forever', 'No Registration Required', 'Instant, In-Browser Results'].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </div>
              )
            )}
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors capitalize"
                >
                  {cat.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Tools Grid */}
        <AdLayout>
          <section className="mt-16 sm:mt-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Explore All Tools</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                  Hand-picked utilities, updated regularly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    {tool.category && (
                      <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                        {tool.category.replace(/-/g, ' ')}
                      </span>
                    )}
                    <svg
                      className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {tool.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {tool.shortDescription || tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </AdLayout>
      </div>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ToolGlobe. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
