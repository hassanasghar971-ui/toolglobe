import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PDF Lovers Pro",
  description:
    "Read the official Privacy Policy of PDF Lovers Pro. Learn how we protect your data with 100% client-side, zero-server PDF processing, and how third-party advertising partners like Google AdSense and Adsterra use cookies.",
  alternates: {
    canonical: "https://pdflovers.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
      <p className="mt-3 text-sm text-slate-500">Last Updated: January 1, 2025</p>

      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          PDF Lovers Pro ("we," "our," or "us"), accessible at{" "}
          <a href="https://pdflovers.com">https://pdflovers.com</a>, is committed to protecting
          your privacy. This Privacy Policy explains how our website handles information when you
          use our free online PDF tools. Unlike most PDF platforms, PDF Lovers Pro performs 100%
          client-side, in-browser processing using WebAssembly and JavaScript. This means your
          files are never uploaded to any server, database, or third-party storage. All merging,
          splitting, compressing, converting, and editing operations happen locally on your own
          device's memory (RAM) and are automatically cleared when you close or refresh the page.
        </p>

        <h2>1. Information We Do Not Collect</h2>
        <p>
          We do not collect, store, transmit, or have any access to the content of the PDF
          documents, images, or files you process using our tools. There is no backend server,
          no database, and no file storage system involved in our file-processing pipeline.
        </p>

        <h2>2. Information Collected Automatically</h2>
        <p>
          Like most websites, our servers (via our hosting provider, Vercel) may automatically
          log standard technical information such as IP address, browser type, device type,
          referring pages, and timestamps for security, analytics, and performance monitoring
          purposes only.
        </p>

        <h2>3. Cookies and Third-Party Advertising</h2>
        <p>
          We use third-party advertising vendors, including Google AdSense and Adsterra, to
          display advertisements on PDF Lovers Pro. These vendors may use cookies, web beacons,
          and similar tracking technologies to collect information about your visits to this and
          other websites in order to provide advertisements about goods and services of interest
          to you. Google's use of advertising cookies enables it and its partners to serve ads
          based on your visit to this site and/or other sites on the Internet. You may opt out of
          personalized advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </p>

        <h2>4. Children's Privacy</h2>
        <p>
          PDF Lovers Pro does not knowingly collect any personal information from children under
          the age of 13. Our services are intended for general audiences and business
          professionals.
        </p>

        <h2>5. Data Security</h2>
        <p>
          Because all file processing occurs locally within your browser's memory using
          client-side WebAssembly engines, your documents are inherently protected from
          interception, unauthorized server access, or data breaches associated with cloud-based
          PDF tools.
        </p>

        <h2>6. Third-Party Links</h2>
        <p>
          Our website may contain links to external sites. We are not responsible for the privacy
          practices or content of such third-party websites.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Any changes will be posted on this page
          with a revised "Last Updated" date.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions regarding this Privacy Policy, please contact:
          <br />
          Lead Architect & Founder: Hassan Asghar
          <br />
          Email: <a href="mailto:hassanasghar7868686@gmail.com">hassanasghar7868686@gmail.com</a>
          <br />
          WhatsApp / Phone: +92 345 1098607
        </p>
      </div>
    </main>
  );
}
