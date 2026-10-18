import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | PDF Lovers Pro",
  description:
    "Read the Terms of Service for PDF Lovers Pro, the free client-side PDF toolkit. Understand your rights and responsibilities when using our 42+ online PDF tools.",
  alternates: {
    canonical: "https://pdflovers.com/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Terms of Service</h1>
      <p className="mt-3 text-sm text-slate-500">Last Updated: January 1, 2025</p>

      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          Welcome to PDF Lovers Pro ("the Service"), operated by Hassan Asghar, accessible at{" "}
          <a href="https://pdflovers.com">https://pdflovers.com</a>. By accessing or using our
          website and its 42+ PDF tools, you agree to be bound by these Terms of Service. If you
          do not agree with any part of these terms, please discontinue use of the Service
          immediately.
        </p>

        <h2>1. Description of Service</h2>
        <p>
          PDF Lovers Pro provides free, browser-based tools for merging, splitting, compressing,
          converting, editing, and managing PDF documents. All processing occurs entirely on the
          client side within your web browser using WebAssembly and JavaScript technologies. We
          do not operate a server-side file processing pipeline, and we do not store your
          uploaded files.
        </p>

        <h2>2. Acceptable Use</h2>
        <p>
          You agree to use PDF Lovers Pro only for lawful purposes. You may not use our tools to
          process documents that infringe copyright, violate intellectual property rights,
          contain malware, or are otherwise illegal under applicable law.
        </p>

        <h2>3. No Warranty</h2>
        <p>
          The Service is provided on an "as is" and "as available" basis without warranties of
          any kind, either express or implied. We do not guarantee that our tools will be
          error-free, uninterrupted, or compatible with every file format or device.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          In no event shall PDF Lovers Pro, Hassan Asghar, or any affiliated parties be liable for
          any indirect, incidental, special, or consequential damages resulting from the use or
          inability to use the Service, including but not limited to data loss or file
          corruption.
        </p>

        <h2>5. Advertising</h2>
        <p>
          PDF Lovers Pro is supported by third-party advertising networks, including Google
          AdSense and Adsterra. By using the Service, you acknowledge and accept the display of
          advertisements, including interactive ad units that may appear after certain user
          interactions.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All trademarks, logos, branding, source code architecture, and design elements of PDF
          Lovers Pro are the intellectual property of Hassan Asghar and may not be reproduced
          without written permission.
        </p>

        <h2>7. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Continued use of the
          Service after changes constitutes acceptance of the revised terms.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These Terms shall be governed in accordance with applicable international digital
          commerce regulations, without regard to conflict of law principles.
        </p>

        <h2>9. Contact Information</h2>
        <p>
          For any questions regarding these Terms of Service, please contact:
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
