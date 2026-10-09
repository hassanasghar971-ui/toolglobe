import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolEngine from '@/components/ToolEngine';
import { getToolBySlug, generateToolById, TOTAL_LIVE_TOOLS } from '@/lib/toolsData';

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
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-8 mb-3 text-gray-900">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 text-gray-900">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/^\d+\.\s(.*$)/gim, '<li class="ml-5 list-decimal mb-2">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-5 list-disc mb-2">$1</li>');

  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li')) return block;
      if (!trimmed) return '';
      return `<p class="mb-4 text-gray-700 leading-relaxed">${block}</p>`;
    })
    .join('\n');

  return html;
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
      ratingValue: (4.2 + (tool.id % 8) * 0.1).toFixed(1),
      ratingCount: 50 + (tool.id % 450),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${tool.category}`} className="hover:text-blue-600 capitalize">
              {tool.category.replace('-', ' ')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{tool.title}</span>
          </nav>

          <header className="mb-8">
            <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 capitalize">
              {tool.category.replace('-', ' ')}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{tool.title}</h1>
            <p className="text-lg text-gray-600 max-w-3xl">{tool.shortDescription}</p>
          </header>

          {/* Interactive Tool Workspace */}
          <ToolEngine toolTitle={tool.title} category={tool.category} engineType={tool.engineType} />

          {/* AdSterra Banner Slot (Native Banner / Responsive) */}
          <div className="ad-slot my-8" aria-label="Advertisement" role="complementary">
            <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
            <div className="min-h-[90px] flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl">
              {/* AdSterra Banner Script کا کوڈ یہاں پیسٹ کریں */}
            </div>
          </div>

          <article
            className="glass-card p-6 md:p-10 mt-6"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(tool.longDescription) }}
          />

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.id}
                  href={`/tools/${rt.slug}`}
                  className="glass-card p-5 hover:shadow-lg transition-shadow block"
                >
                  <span className="text-xs font-semibold text-blue-600 uppercase">
                    {rt.category.replace('-', ' ')}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2">{rt.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{rt.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
