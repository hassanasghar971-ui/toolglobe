'use client';

import React, { useEffect } from 'react';

interface AdLayoutProps {
  type?: 'banner' | 'sidebar';
}

export const AdLayout: React.FC<AdLayoutProps> = ({ type = 'banner' }) => {
  useEffect(() => {
    const containerId = 'container-e0ea5dfc463e6cf94420c8df40020bd9';
    const container = document.getElementById(containerId);

    if (container && !container.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://pl31735805.profitableratecpmnetwork.com/e0ea5dfc463e6cf94420c8df40020bd9/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      container.appendChild(script);
    }
  }, []);

  return (
    <aside
      aria-label="Sponsored Content"
      className={`relative w-full flex flex-col items-center justify-center bg-gray-900/30 border border-gray-800/80 rounded-2xl overflow-hidden my-6 ${
        type === 'sidebar' ? 'min-h-[600px]' : 'min-h-[280px]'
      }`}
    >
      <div className="absolute top-2 right-3 text-[10px] uppercase font-semibold text-gray-500 pointer-events-none">
        Advertisement
      </div>
      <div className="w-full h-full flex items-center justify-center p-2">
        <div id="container-e0ea5dfc463e6cf94420c8df40020bd9"></div>
      </div>
    </aside>
  );
};
