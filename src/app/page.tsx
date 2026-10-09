
import { getToolsPage } from '@/lib/toolsData';
import SearchBar from '@/components/SearchBar';
import AdLayout from '@/components/AdLayout';
import Link from 'next/link';

export default function HomePage() {
  const { tools } = getToolsPage(1, 24);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Discover <span className="text-blue-600">20,000+</span> Free High-Speed Utilities
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Browser-based AI and developer tools with zero server latency and total privacy.
        </p>
        <SearchBar />
      </section>

      <div className="my-8 flex justify-center">
        <AdLayout type="native" />
      </div>

      <section className="my-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured AI Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                {tool.category}
              </span>
              <h3 className="font-bold text-gray-900 mt-3 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {tool.shortDescription}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
