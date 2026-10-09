import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/toolsData';
import { AdLayout } from '@/components/AdLayout';
import { headers } from 'next/headers';

export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return { title: 'Tool Not Found' };

  const headersList = headers();
  const host = headersList.get('host') || 'toolglobe.vercel.app';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.longKeywords,
    alternates: {
      canonical: `${baseUrl}/tools/${tool.slug}`,
    },
  };
}

export default function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  return (
    <article className="max-w-4xl mx-auto">
      <AdLayout type="banner" />
      <header className="bg-gray-900 border border-gray-800 rounded-3xl p-8 my-6">
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded-full">
          {tool.category}
        </span>
        <h1 className="text-3xl font-black text-white my-4">{tool.title}</h1>
        <p className="text-gray-300 text-base leading-relaxed mb-6">{tool.metaDescription}</p>
        
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
          <textarea rows={4} placeholder={`Input data for ${tool.title}...`} className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 mb-3" />
          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg transition-colors">
            Execute Tool Instantly →
          </button>
        </div>
      </header>

      <section className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 my-6 text-gray-300 space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-white">Full Operational Specification</h2>
        {tool.longDescription.split('\n\n').map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </section>
      <AdLayout type="banner" />
    </article>
  );
}
