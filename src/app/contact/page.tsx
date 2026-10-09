import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Developer | ToolGlobe',
  description: 'Get in touch with Hassan Asghar for support, tool suggestions, or business inquiries.',
};

export default function ContactPage() {
  return (
    <article className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-black mb-6 text-white">Contact Developer & Support</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6 text-sm text-gray-300">
        <div>
          <h2 className="text-base font-bold text-white mb-1">Developer Name</h2>
          <p>Hassan Asghar</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">Official Email</h2>
          <p className="text-indigo-400">hassanasghar7868686@gmail.com</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">Direct WhatsApp Support</h2>
          <p>Line 1: <a href="https://wa.me/923497726469" className="text-emerald-400 hover:underline">+92 349 7726469</a></p>
          <p>Line 2: <a href="https://wa.me/923451098607" className="text-emerald-400 hover:underline">+92 345 1098607</a></p>
        </div>
      </div>
    </article>
  );
}
