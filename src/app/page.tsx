import { getToolsPage } from '@/lib/toolsData';
import { SearchBar } from '@/components/SearchBar';
import { AdLayout } from '@/components/AdLayout';

export default function HomePage() {
  const { tools, totalTools } = getToolsPage(1, 24);

  return (
    <div className="space-y-8">
      <section className="text-center py-12 px-4 bg-gray-900/40 border border-gray-800 rounded-3xl">
        <h1 className="text-4xl font-black text-white mb-4">
          Explore <span className="text-indigo-400">{totalTools.toLocaleString()}+</span> Live Free AI Utilities
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-6">
          Client-side web platform hosted on ToolGlobe directory. Fast, private, and 100% free.
        </p>
        <SearchBar />
      </section>

      <AdLayout type="banner" />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <a key={tool.id} href={`/tools/${tool.slug}`} className="bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-2xl p-5 transition-colors block">
            <span className="text-[10px] font-semibold text-indigo-400 bg-gray-800 px-2 py-0.5 rounded">{tool.category}</span>
            <h2 className="text-base font-bold text-white mt-2 mb-1">{tool.title}</h2>
            <p className="text-xs text-gray-400 line-clamp-2">{tool.metaDescription}</p>
          </a>
        ))}
      </section>
    </div>
  );
}
