
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cleanQuery = query.trim().toLowerCase();
    const match = cleanQuery.match(/\d+/);
    
    startTransition(() => {
      if (match) {
        router.push(`/tools/free-ai-tool-${match[0]}`);
      } else {
        const toolId = (Math.abs(cleanQuery.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 19000) + 1;
        router.push(`/tools/free-ai-tool-${toolId}`);
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-2">
      <form onSubmit={handleSearch} className="relative flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 20,000+ AI tools (e.g. 'code', '125', 'seo')..."
          className="w-full px-5 py-4 pl-12 text-base text-gray-900 bg-white border-2 border-blue-500/30 rounded-2xl shadow-lg focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-400"
        />
        <svg
          className="absolute left-4 w-6 h-6 text-blue-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          {isPending ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
}

export { SearchBar };
