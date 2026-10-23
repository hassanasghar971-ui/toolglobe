import { SITE_NAME, SITE_URL, OWNER_NAME, OWNER_CONTACT_EMAIL } from "@/lib/constants/site";

/**
 * Emits Organization + founding Person structured data. Source data comes
 * exclusively from validated site constants — never user input — so the
 * defensive `<` escaping mirrors ToolJsonLd's approach as belt-and-suspenders.
 */
export default function OrganizationJsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      email: OWNER_CONTACT_EMAIL,
      founder: {
        "@type": "Person",
        name: OWNER_NAME,
      },
    },
  ];

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };
  const serialized = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
