import Link from "next/link";
import { CATEGORIES, getToolsByCategory } from "@/lib/tools-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ToolGlobe — 20,000+ Free Online Tools | No Signup Required",
  description:
    "Access 20,000+ free online tools instantly. Word counter, JSON formatter, password generator, color converter, SEO tools, math calculators and much more. No signup, 100% browser-based.",
  alternates: { canonical: "/" },
};

const STATS = [
  { label: "Free Tools", value: "20,000+" },
  { label: "Categories", value: "40+" },
  { label: "No Signup", value: "Ever" },
  { label: "Data Stored", value: "Zero" },
];

const FEATURED_TOOLS = [
  { category: "text-tools", slug: "word-counter", emoji: "📝" },
  { category: "developer-tools", slug: "json-formatter", emoji: "{ }" },
  { category: "password-tools", slug: "password-generator", emoji: "🔐" },
  { category: "seo-tools", slug: "meta-title-checker", emoji: "🔍" },
  { category: "color-tools", slug: "hex-to-rgb", emoji: "🎨" },
  { category: "math-tools", slug: "percentage-calculator", emoji: "🔢" },
  { category: "encoding-tools", slug: "base64-encoder", emoji: "🔄" },
  { category: "random-generators", slug: "uuid-generator", emoji: "🎲" },
];

export default function HomePage() {
  const featuredCategories = CATEGORIES.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* ══ HERO SECTION ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-indigo-900/30 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            20,000+ Tools · 100% Free · No Signup
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight">
            Every Tool You&apos;ll Ever Need
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              All in One Place
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            ToolGlobe delivers 20,000+ free micro-tools for text, SEO, development, math, colors, and more.
            100% browser-based — your data never leaves your device.
          </p>

          {/* Search / CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link
              href="#categories"
              className="flex-1 bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-center"
            >
              🛠️ Browse All Tools
            </Link>
            <Link
              href="/text-tools/word-counter"
              className="flex-1 bg-blue-500/30 border border-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-400/40 transition-all text-center"
            >
              ⚡ Try a Tool Free
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-blue-200 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MIDDLE AD SLOT (pre-reserved for Adsterra Native) ═ */}
      <div
        className="w-full bg-slate-100 flex items-center justify-center border-b border-slate-200"
        style={{ minHeight: "90px" }}
        aria-label="Advertisement"
      >
        {/* MIDDLE_ADSTERRA_NATIVE_SLOT
            Replace this div with your Adsterra Native/Smart Link code.
            Keep min-height: 90px to prevent CLS.
        */}
      </div>

      {/* ══ FEATURED QUICK TOOLS ══════════════════════════════ */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
            🔥 Most Popular Tools
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {FEATURED_TOOLS.map((ft) => {
              const toolName = ft.slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
              return (
                <Link
                  key={ft.slug}
                  href={`/${ft.category}/${ft.slug}`}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-center"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{ft.emoji}</span>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 leading-tight">
                    {toolName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CATEGORY GRID ════════════════════════════════════ */}
      <section id="categories" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Browse by Category</h2>
            <p className="text-slate-500">40+ categories, thousands of tools — find exactly what you need</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const tools = getToolsByCategory(cat.slug);
              const toolCount = tools.length;
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 p-5"
                >
                  {/* Gradient hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />

                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-sm shrink-0`}>
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors leading-tight mb-0.5">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full transition-colors">
                      {toolCount}+ tools
                    </span>
                    <span className="text-slate-300 group-hover:text-blue-500 transition-colors text-lg">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FEATURED CATEGORY SHOWCASE ═══════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Featured Categories</h2>
            <p className="text-slate-500">Deep-dive into our most popular tool categories</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCategories.map((cat) => {
              const tools = getToolsByCategory(cat.slug).slice(0, 6);
              return (
                <div key={cat.slug} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${cat.color} p-4 text-white flex items-center gap-3`}>
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="font-bold">{cat.name}</h3>
                      <p className="text-xs opacity-80">{cat.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/${cat.slug}/${tool.slug}`}
                          className="text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all truncate border border-transparent hover:border-blue-100"
                        >
                          → {tool.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/${cat.slug}`}
                      className={`block text-center text-xs font-semibold bg-gradient-to-r ${cat.color} text-white py-2 rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      View All {cat.name} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ WHY TOOLGLOBE ════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2">Why Millions Choose ToolGlobe</h2>
            <p className="text-slate-400">Built for professionals, students, and everyday users worldwide</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Instant Results", desc: "All tools process in milliseconds. No waiting, no loading spinners, just instant output." },
              { icon: "🔒", title: "100% Private", desc: "All computation happens in your browser. We never see, store or transmit your data." },
              { icon: "♾️", title: "Completely Free", desc: "Every tool, every feature, forever free. No premium tiers, no credit cards, no limits." },
              { icon: "📱", title: "Works Everywhere", desc: "Fully responsive design for desktop, tablet and mobile. Works on all modern browsers." },
              { icon: "🚀", title: "No Signup Required", desc: "Open any tool and start using it immediately. No account, no registration, ever." },
              { icon: "🌐", title: "20,000+ Tools", desc: "The world's most comprehensive collection of free online micro-tools in one platform." },
            ].map((feat) => (
              <div key={feat.title} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                <span className="text-3xl mb-3 block">{feat.icon}</span>
                <h3 className="font-bold text-white mb-1">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
