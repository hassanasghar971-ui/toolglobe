import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | PDF Lovers Pro",
  description:
    "Get in touch with the PDF Lovers Pro team. Reach out to Founder Hassan Asghar via email or WhatsApp for support, partnership inquiries, or feature requests.",
  alternates: {
    canonical: "https://pdflovers.com/contact",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact PDF Lovers Pro",
  url: "https://pdflovers.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "PDF Lovers Pro",
    founder: {
      "@type": "Person",
      name: "Hassan Asghar",
    },
    email: "hassanasghar7868686@gmail.com",
    telephone: "+923451098607",
    url: "https://pdflovers.com",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Contact Us</h1>
      <p className="mt-4 text-lg text-slate-600">
        Have a question, found a bug, or want to suggest a new PDF tool? We would love to hear
        from you. PDF Lovers Pro is actively developed and maintained, and every message is read
        personally by our founder.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Email Support</h2>
          <p className="mt-2 text-sm text-slate-500">
            For general inquiries, bug reports, or business partnerships.
          </p>
          <a
            href="mailto:hassanasghar7868686@gmail.com"
            className="mt-4 inline-block font-semibold text-red-600 hover:underline"
          >
            hassanasghar7868686@gmail.com
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">WhatsApp / Phone</h2>
          <p className="mt-2 text-sm text-slate-500">
            For urgent support requests or priority feature access.
          </p>
          <a
            href="https://wa.me/923451098607"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-semibold text-red-600 hover:underline"
          >
            +92 345 1098607
          </a>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">Lead Architect & Founder</h2>
        <p className="mt-2 text-sm text-slate-600">
          PDF Lovers Pro is designed, engineered, and maintained by{" "}
          <strong>Hassan Asghar</strong>, a full-stack architect specializing in secure,
          privacy-first, client-side web applications.
        </p>
      </div>
    </main>
  );
}
