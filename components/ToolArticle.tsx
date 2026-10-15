interface Props {
  content: string;
  faq: { q: string; a: string }[];
}

export default function ToolArticle({ content, faq }: Props) {
  return (
    <section className="max-w-2xl mx-auto px-4 pb-16">
      <article className="prose prose-gray max-w-none mt-8">
        <p className="text-gray-700 leading-relaxed">{content}</p>
      </article>

      {faq.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faq.map((item, i) => (
              <details key={i} className="border border-gray-200 rounded-lg px-4 py-3 group">
                <summary className="font-medium cursor-pointer text-gray-900">{item.q}</summary>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
