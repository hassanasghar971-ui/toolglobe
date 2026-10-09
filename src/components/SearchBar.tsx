'use client';

import { useState, useEffect } from 'react';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('tool-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto w-full">
      <div className="relative flex items-center">
        <input
          id="tool-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search live AI tools (e.g., ai-writing-1)..."
          className="w-full bg-gray-900/90 border border-gray-700/80 focus:border-indigo-500 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-400 focus:outline-none transition-all shadow-2xl pr-20"
        />
        <div className="absolute right-4 flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-800 border border-gray-700 px-2 py-1 rounded-md">
          <kbd className="font-sans">⌘</kbd>
          <kbd className="font-sans">K</kbd>
        </div>
      </div>
      {focused && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-2xl z-50">
          <p className="text-xs text-gray-400">Press enter to view results for <strong className="text-white">&quot;{query}&quot;</strong></p>
        </div>
      )}
    </div>
  );
};
