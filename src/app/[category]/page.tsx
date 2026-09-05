import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryBySlug, getToolsByCategory, CATEGORIES } from "@/lib/tools-data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.name} — Free Online Tools`,
    description: `Browse ${cat.name} tools on ToolGlobe. ${cat.description} Free, instant, no signup required.`,
    alternates: { canonical: `/${category}` },
    openGraph: {
      title: `${cat.name} — Free Online Tools | ToolGlobe`,
      description: cat.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) {
    // Try to find closest match or 404
    const closestCat = CATEGORIES.find(c =>
      c.slug.includes(category) || category.includes(c.slug.split("-")[0])
    );
    if (!closestCat) notFound();
    return notFound();
  }

  const tools = getToolsByCategory(category);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${cat.color} text-white py-14`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/70 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{cat.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              {cat.icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">{cat.name}</h1>
              <p className="text-white/80 mt-1">{tools.length}+ free tools available</p>
            </div>
          </div>
          <p className="text-white/90 max-w-2xl text-lg">{cat.description}</p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${category}/${tool.slug}`}
                className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h2 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-sm mb-1">
                  {tool.name}
                </h2>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tool.description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs text-blue-600 font-medium">
                  Use Tool →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
