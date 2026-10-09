
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/toolsData';
import AdLayout from '@/components/AdLayout';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};

  return {
    title: `${tool.title} | ToolGlobe Free AI Tools`,
    description: tool.shortDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: `https://toolglobe.vercel.app/tools/${tool.slug}`,
    },
  };
}

export default function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline text-blue-600">Home</Link> &gt;{' '}
        <span className="capitalize">{tool.category}</span> &gt;{' '}
        <span className="text-gray-800 font-semibold">{tool.title}</span>
      </nav>

      {/* 1. Tool Header (Visually First) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {tool.category}
          </span>
          <span className="text-xs text-gray-400">ID: #{tool.id}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{tool.title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">{tool.shortDescription}</p>

        {/* 2. Direct Action & Tool Links */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-800">Launch Utility Engine</h3>
            <p className="text-sm text-gray-500">Instant client-side execution, zero API key needed.</p>
          </div>
          <a
            href={`#tool-execution`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Access Tool Engine
          </a>
        </div>
      </div>

      {/* 3. Detailed Guide Content (400-600 Words) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 prose max-w-none">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Overview & Guide</h2>
        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
          {tool.longDescription}
        </div>
      </div>

      {/* 4. Safe Adsterra Native Placement (Below Primary Content) */}
      <div className="my-8 min-h-[250px] flex justify-center items-center bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4">
        <AdLayout type="native" />
      </div>

      {/* 5. Tool Execution Section */}
      <div id="tool-execution" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Interface</h2>
        <div className="p-8 bg-gray-50 rounded-lg text-center border">
          <p className="text-gray-600 mb-4">Ready to process your request using dynamic client-side logic.</p>
          <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition">
            Run {tool.title}
          </button>
        </div>
      </div>
    </div>
  );
}
