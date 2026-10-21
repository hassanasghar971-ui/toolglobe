import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { findTool, TOOLS } from '@/lib/tools-registry';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AdLayout from '@/components/AdLayout';

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = findTool(params.slug);
  if (!tool) return notFound();

  const ToolComponent = dynamic(tool.component, {
    ssr: false,
    loading: () => <div className="p-10 text-center opacity-60">Loading tool…</div>,
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{tool.name}</h1>
      <AdLayout />
      <ErrorBoundary toolName={tool.slug}>
        <ToolComponent {...(tool.props ?? {})} />
      </ErrorBoundary>
      <AdLayout />
    </main>
  );
}
