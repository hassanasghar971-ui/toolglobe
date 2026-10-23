import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  SITE_NAME,
  OWNER_NAME,
  OWNER_NAME_LOCAL,
  OWNER_CONTACT_EMAIL,
  OWNER_CONTACT_PHONE_PRIMARY,
  OWNER_CONTACT_PHONE_SECONDARY,
} from "@/lib/constants/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | ToolGlobe",
  description:
    "Read ToolGlobe's Privacy Policy to understand what data is collected, how browser-based tool processing works, and how advertising cookies are used.",
  pathSegments: ["privacy-policy"],
});

const LAST_UPDATED = "January 15, 2024";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-slate-700">
        <h2>1. Overview</h2>
        <p>
          {SITE_NAME} ("we", "us", "our") is owned and operated by {OWNER_NAME}{" "}
          ({OWNER_NAME_LOCAL}). This Privacy Policy explains what information
          is collected when you use our website and tools at toolglobe.app,
          and how that information is used.
        </p>

        <h2>2. How Our Tools Process Your Data</h2>
        <p>
          The overwhelming majority of ToolGlobe's utilities — including our
          JSON formatter, text converters, and calculators — run entirely in
          your web browser using client-side JavaScript. The text, numbers,
          or files you enter into a tool are processed locally on your
          device and are never transmitted to, stored on, or logged by our
          servers. You can verify this by disconnecting from the internet
          after a page has loaded — most tools will continue to function.
        </p>

        <h2>3. Information We Do Collect</h2>
        <p>We collect limited information automatically, specifically:</p>
        <ul>
          <li>
            <strong>Search queries:</strong> When you use the site search bar,
            your query is sent to our server to look up matching tools and is
            not stored beyond the duration of that request.
          </li>
          <li>
            <strong>Standard server logs:</strong> Like most websites, our
            hosting provider (Vercel) automatically logs IP addresses, browser
            type, and request timestamps for security and performance
            monitoring.
          </li>
          <li>
            <strong>Local storage and cookies:</strong> We use your browser's
            localStorage and cookies to remember ad display frequency (so
            intrusive ad formats are not shown more than twice in 24 hours)
            and basic site preferences. This data stays on your device.
          </li>
        </ul>

        <h2>4. Advertising and Third-Party Cookies</h2>
        <p>
          ToolGlobe displays advertisements served by Google AdSense and
          Adsterra. These third-party advertising networks may use cookies,
          device identifiers, or similar technologies to serve ads based on
          your prior visits to this and other websites. You can review and
          control ad personalization through{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google's Ad Settings
          </a>
          . We do not control the cookies set by these third-party networks
          and recommend reviewing their respective privacy policies.
        </p>

        <h2>5. Children's Privacy</h2>
        <p>
          ToolGlobe is not directed at children under 13, and we do not
          knowingly collect personal information from children.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          Depending on your jurisdiction (including under GDPR or CCPA), you
          may have rights to access, correct, or request deletion of
          personal data we hold about you. Since our tools process data
          entirely client-side and we do not maintain user accounts, we hold
          minimal personal data in practice. For any requests, contact us
          using the details below.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Material changes
          will be reflected by updating the "Last updated" date above.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          For privacy-related questions, contact {OWNER_NAME} ({OWNER_NAME_LOCAL}):
        </p>
        <ul>
          <li>Email: {OWNER_CONTACT_EMAIL}</li>
          <li>Phone: +{OWNER_CONTACT_PHONE_PRIMARY}</li>
          <li>Phone: +{OWNER_CONTACT_PHONE_SECONDARY}</li>
        </ul>
      </div>
    </main>
  );
}
