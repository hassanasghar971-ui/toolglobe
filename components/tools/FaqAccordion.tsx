"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={buttonId}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-slate-900 hover:bg-slate-50"
              >
                <span>{item.question}</span>
                <span aria-hidden="true">{isOpen ? "\u2212" : "+"}</span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-4 pb-4 text-slate-700"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
