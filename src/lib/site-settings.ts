import { unstable_cache } from "next/cache";
import { createPublicSupabase } from "@/lib/supabase/public";
import type { SiteSettings } from "@/lib/types";

// Tag used to invalidate the cached settings when the admin saves changes.
export const SETTINGS_TAG = "site-settings";

// Fallback used only if Supabase is unreachable at render time.
// license_disclosure is deliberately NON-EMPTY here: Oregon requires the
// licence disclosure on all advertising, and a database blip must never be
// the reason a legally required line vanishes from the site.
const FALLBACK: SiteSettings = {
  id: 1,
  business_name: "Sell to Grand",
  logo: null,
  favicon: null,
  about_photo: null,
  hero_title: "Two numbers. You pick.",
  hero_subtitle:
    "Most cash buyers show you one number and hope you do not ask what the house is really worth. We are a licensed brokerage, so we can tell you both: what it nets listed, and what we pay you Friday. The gap between them is what speed costs.",
  hero_image: null,
  phone: "+15412142163",
  phone_display: "(541) 214-2163",
  contact_email: "robert@selltogrand.com",
  address_street: "2472 Willamette St",
  address_city: "Eugene",
  address_state: "OR",
  address_zip: "97405",
  license_number: "201105089",
  license_type: "Principal Broker",
  license_expires: "2026-11-30",
  license_disclosure:
    "Robert Grand is a licensed Oregon Principal Broker buying this property for his own account and is self-represented in the transaction.",
  service_areas: [
    "Eugene",
    "Springfield",
    "Cottage Grove",
    "Creswell",
    "Junction City",
    "Veneta",
    "Florence",
    "Coburg",
    "Oakridge",
    "Lowell",
    "Dunes City",
    "Westfir",
  ],
  service_county: "Lane County",
  service_region: "Oregon",
  home_seo_title: null,
  home_seo_description: null,
};

// Cached so public pages can render statically and serve from the CDN. The
// admin busts this tag on save, so edits still go live right away.
const getSettingsCached = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const supabase = createPublicSupabase();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error || !data) return FALLBACK;

      // Guarantee the disclosure is never blank even if the column somehow is.
      return {
        ...data,
        license_disclosure:
          data.license_disclosure?.trim() || FALLBACK.license_disclosure,
      } as SiteSettings;
    } catch {
      return FALLBACK;
    }
  },
  ["site-settings"],
  { revalidate: 3600, tags: [SETTINGS_TAG] }
);

export async function getSiteSettings(): Promise<SiteSettings> {
  return getSettingsCached();
}
