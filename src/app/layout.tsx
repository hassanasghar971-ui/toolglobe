import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToolGlobe - 20,000+ Free Online AI Utilities',
  description: 'World largest high-performance online tools directory. 100% free client-side execution.',
  metadataBase: new URL('https://toolglobe.vercel.app'),
  verification: {
    google: 'pwyfdDe7eDVI1cMvuebKjXMzJ6kFspOCtUPX7aDskuI',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="pwyfdDe7eDVI1cMvuebKjXMzJ6kFspOCtUPX7aDskuI" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Script
          strategy="lazyOnload"
          src="https://ruffianattorneymargarine.com/19e68ae5fadd9cd55f8b5b0201496f95/invoke.js"
        />

        <header className="w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-black text-xl text-white">
              <span className="bg-indigo-600 px-2.5 py-1 rounded-xl text-xs">TG</span> ToolGlobe
            </a>
            <div className="text-xs font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
              Live Tools Active
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="w-full border-t border-gray-900 bg-gray-950 py-8 text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-bold text-white mb-2">ToolGlobe Directory</p>
              <p>Managed by Hassan Asghar. Client-side browser execution.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-2">Legal Pages</p>
              <ul className="space-y-1">
                <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
                <li><a href="/contact" className="hover:underline">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-2">Developer Contacts</p>
              <p>Email: hassanasghar7868686@gmail.com</p>
              <p>WhatsApp 1: +92 349 7726469</p>
              <p>WhatsApp 2: +92 345 1098607</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
