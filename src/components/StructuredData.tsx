import type { SiteSettings } from "@/lib/types";
import { SITE_URL } from "@/lib/site-url";

// Local-SEO structured data. A licensed broker buying homes fits
// RealEstateAgent (a subtype of LocalBusiness). Built from live settings so
// it never drifts from what the site actually shows.
export function StructuredData({ settings: s }: { settings: SiteSettings }) {
  const areas = (s.service_areas ?? []).map((name) => ({
    "@type": "City",
    name,
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: s.business_name,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.contact_email ? { email: s.contact_email } : {}),
    description:
      "A licensed Oregon brokerage that shows sellers two numbers: what the house nets listed and what they can be paid in cash.",
    parentOrganization: {
      "@type": "Organization",
      name: "Grand Capital LLC",
    },
    address: {
      "@type": "PostalAddress",
      ...(s.address_street ? { streetAddress: s.address_street } : {}),
      ...(s.address_city ? { addressLocality: s.address_city } : {}),
      ...(s.address_state ? { addressRegion: s.address_state } : {}),
      ...(s.address_zip ? { postalCode: s.address_zip } : {}),
      addressCountry: "US",
    },
    areaServed: areas.length ? areas : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
