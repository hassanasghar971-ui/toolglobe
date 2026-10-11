// app/page.tsx
import Link from "next/link";
import { UNIT_FAMILIES } from "@/lib/units";
import { computeToolCounts, getAllCategories } from "@/lib/tools-registry";
import ToolExplorer from "@/components/ToolExplorer";

export default function HomePage() {
  const stats = computeToolCounts();
  const categories = getAllCategories();

  return (
    <div className="flex flex-col gap-16">
      <section className="relative text-center py-16 px-4">
        <div className="absolute inset-0 -z-10 opacity-40 animate-float pointer-events-none">
          <div className="w-72 h-72 mx-auto rounded-full bg-indigo-500/30 blur-3xl" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-5">
          <span className="text-gradient">{stats.total.toLocaleString()}+</span> Free Tools,
          <br className="hidden sm:block" /> One Instant Platform
        </h1>
        <p className="max-w-2xl mx-auto text-white/60 text-base sm:text-lg mb-8">
          Unit converters, calculators, text utilities, and SEO tools — all free, fast, accurate,
          and built for zero friction. No signup. No clutter. Just instant answers.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="#explorer"
            className="glow-border rounded-2xl px-6 py-3 text-sm font-semibold text-white hover:scale-105 transition-transform"
          >
            🔍 Explore All Tools
          </Link>
          <Link
            href="#categories"
            className="glass-card rounded-2xl px-6 py-3 text-sm font-semibold text-white/80 hover:text-white hover:scale-105 transition-transform"
          >
            📦 Browse Categories
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: "Converters", value: stats.converterPairs },
            { label: "Quick Answers", value: stats.quickValue },
            { label: "Text Tools", value: stats.textCount },
            { label: "Calculators", value: stats.mathCount },
          ].map((s) => (
            <div key={s.label} className="glass-card py-4 px-2">
              <div className="text-xl sm:text-2xl font-bold text-white">{s.value.toLocaleString()}</div>
              <div className="text-[11px] uppercase tracking-wide text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="scroll-mt-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Unit Conversion Families</h2>
        <div className="tilt-wrap grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {UNIT_FAMILIES.map((fam) => (
            <Link key={fam.id} href={`/convert/${fam.id}`} className="tilt-card glass-card p-5 flex flex-col gap-2 group">
              <span className="text-3xl">{fam.icon}</span>
              <span className="font-semibold text-white group-hover:text-gradient transition-all">{fam.name}</span>
              <span className="text-xs text-white/40">
                {fam.units.length} units · {(fam.units.length * (fam.units.length - 1)).toLocaleString()} conversions
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Text, Math &amp; SEO Toolkits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { href: "/text/uppercase", icon: "🔤", title: "Text Tools", desc: "Case converters, slugs, Base64, ciphers & more." },
            { href: "/calculator/percentage", icon: "🧮", title: "Calculators", desc: "BMI, interest, loans, geometry & finance math." },
            { href: "/seo/wordcounter", icon: "📈", title: "SEO Utilities", desc: "Meta checkers, readability score, keyword density." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="glass-panel p-6 flex flex-col gap-2 hover:shadow-glow transition-shadow">
              <span className="text-3xl">{c.icon}</span>
              <span className="font-semibold text-white">{c.title}</span>
              <span className="text-sm text-white/50">{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="explorer" className="scroll-mt-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Search 20,000+ Tools Instantly</h2>
        <ToolExplorer categories={categories} />
      </section>
    </div>
  );
}
