// components/tool-engine/FaqAccordion.tsx
import type { ToolFAQ } from "@/lib/types/tool";

interface FaqAccordionProps {
  faqs: ToolFAQ[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section aria-label="Frequently Asked Questions" className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-card border border-neutral-200 dark:border-neutral-800 p-4 open:bg-neutral-50 dark:open:bg-neutral-900/50"
          >
            <summary className="cursor-pointer list-none font-medium text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
              {faq.question}
              <span className="ml-4 text-brand-500 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
