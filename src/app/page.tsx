import { getToolsPage } from '@/lib/toolsData';
import SearchBar from '@/components/SearchBar';
import { AdLayout } from '@/components/AdLayout';
import Link from 'next/link';

export default function HomePage() {
  const tools = getToolsPage();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AdLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
              ToolGlobe
            </h1>
            <p className="text-lg text-slate-600">
              Discover and use the best online tools for developer efficiency and productivity.
            </p>
          </header>

          <SearchBar />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 block"
              >
                <h2 className="text-xl font-bold mb-2 text-slate-800">{tool.title}</h2>
                <p className="text-slate-600 text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </AdLayout>
    </main>
  );
}
