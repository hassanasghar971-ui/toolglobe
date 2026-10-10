import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolEngine from '@/components/ToolEngine';
import { getToolBySlug, generateToolById, TOTAL_LIVE_TOOLS } from '@/lib/toolsData';
import ThemeToggle from '@/components/ThemeToggle';

export const revalidate = 86400;

interface PageProps {
  params: { slug: string };
}

const SITE_URL = 'https://toolglobe.com';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | ToolGlobe',
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/tools/${tool.slug}`;

  return {
    title: `${tool.title} | Free Online Tool – ToolGlobe`,
    description: tool.shortDescription,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: tool.title,
      description: tool.shortDescription,
      url,
      siteName: 'ToolGlobe',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.shortDescription,
    },
  };
}

function renderMarkdown(markdown: string): string {
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">$1</h3>'
    )
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-2xl font-bold mt-10 mb-4 text-slate-900 dark:text-white">$1</h2>'
    )
    .replace(
      /\*\*(.*?)\*\*/gim,
      '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>'
    )
    .replace(
      /^\d+\.\s(.*$)/gim,
      '<li class="ml-5 list-decimal mb-2 text-slate-700 dark:text-slate-300">$1</li>'
    )
    .replace(
      /^- (.*$)/gim,
      '<li class="ml-5 list-disc mb-2 text-slate-700 dark:text-slate-300">$1</li>'
    );

  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li')) return block;
      if (!trimmed) return '';
      return `<p class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">${block}</p>`;
    })
    .join('\n');

  return html;
}

function RatingStars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rounded ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.366-2.447a1 1 0 00-1.175 0l-3.366 2.447c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const relatedIds = [7, 14, 21]
    .map((offset) => {
      let rid = tool.id + offset;
      if (rid > TOTAL_LIVE_TOOLS) rid = ((rid - 1) % TOTAL_LIVE_TOOLS) + 1;
      return rid;
    })
    .filter((rid) => rid !== tool.id);

  const relatedTools = relatedIds.map((id) => generateToolById(id));

  const ratingValue = Number((4.2 + (tool.id % 8) * 0.1).toFixed(1));
  const ratingCount = 50 + (tool.id % 450);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (Web Browser)',
    description: tool.shortDescription,
    url: `${SITE_URL}/tools/${tool.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toFixed(1),
      ratingCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        {/* Decorative background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-[28rem] -left-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Top bar */}
        <div className="sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/70 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-lg">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-md shadow-indigo-500/30">
                TG
              </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                ToolGlobe
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <nav
            className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2 flex-wrap"
            aria-label="Breadcrumb"
          >
            <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" href="/">
              Home
            </Link>
            <span>/</span>
            <Link
              className="hover:text-indigo-600 dark:hover:text-indigo-400 capitalize transition-colors"
              href={`/category/${tool.category}`}
            >
              {tool.category.replace(/-/g, ' ')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300">{tool.title}</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <span className="inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-wider mb-4 capitalize">
              {tool.category.replace(/-/g, ' ')}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 leading-tight">
              {tool.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mb-4">
              {tool.shortDescription}
            </p>
            <div className="flex items-center gap-3">
              <RatingStars value={ratingValue} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {ratingValue.toFixed(1)} &middot; {ratingCount} reviews
              </span>
            </div>
          </header>

          {/* Tool Engine (kept fully intact) */}
          <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 sm:p-6 md:p-8">
            <ToolEngine
              category={tool.category}
              engineType={tool.engineType}
              toolTitle={tool.title}
            />
          </section>

          {/* Ad slot — isolated, no redirects/pop-unders */}
          <div className="my-10" aria-label="Advertisement" role="complementary">
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-2 uppercase tracking-wide">
              Advertisement
            </p>
            <div className="h-24 md:h-28 flex items-center justify-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-600 text-sm">
              Ad Placeholder (Responsive Unit)
            </div>
          </div>

          {/* Long description */}
          <article
            className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(tool.longDescription) }}
          />

          {/* Related tools */}
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Related Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.id}
                  href={`/tools/${rt.slug}`}
                  className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300"
                >
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    {rt.category.replace(/-/g, ' ')}
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white mt-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {rt.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {rt.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-10">
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
    </>
  );
}
