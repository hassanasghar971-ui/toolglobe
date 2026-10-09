import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ToolGlobe',
  description: 'Privacy Policy and Data Protection standards for ToolGlobe Users.',
};

export default function PrivacyPolicy() {
  return (
    <article className="max-w-4xl mx-auto py-10 prose prose-invert">
      <h1 className="text-3xl font-black mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-4">Effective Date: October 2026</p>

      <section className="space-y-4 text-sm text-gray-300 leading-relaxed">
        <p>At ToolGlobe (accessible from toolglobe.vercel.app), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ToolGlobe and how we use it.</p>

        <h2 className="text-xl font-bold text-white mt-6">Client-Side Processing Security</h2>
        <p>ToolGlobe operates on a zero-log infrastructure. All tools and algorithms run locally within your client browser session. We do not transmit, process, or store your personal dataset on any remote database servers.</p>

        <h2 className="text-xl font-bold text-white mt-6">Publisher Contact Information</h2>
        <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact Hassan Asghar directly:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-300">
          <li><strong>Email:</strong> hassanasghar7868686@gmail.com</li>
          <li><strong>WhatsApp 1:</strong> +92 349 7726469</li>
          <li><strong>WhatsApp 2:</strong> +92 345 1098607</li>
        </ul>
      </section>
    </article>
  );
}
