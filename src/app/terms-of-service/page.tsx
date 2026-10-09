import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ToolGlobe',
  description: 'Terms and Terms of Service for using ToolGlobe tools.',
};

export default function TermsOfService() {
  return (
    <article className="max-w-4xl mx-auto py-10 prose prose-invert">
      <h1 className="text-3xl font-black mb-6">Terms of Service</h1>
      <section className="space-y-4 text-sm text-gray-300 leading-relaxed">
        <p>By accessing toolglobe.vercel.app, you agree to comply with all applicable copyright and web usage laws. The dynamic tool framework hosted on ToolGlobe is provided as-is without warranties of any kind.</p>
        <p>For legal inquiries: hassanasghar7868686@gmail.com or WhatsApp: +92 349 7726469.</p>
      </section>
    </article>
  );
}
