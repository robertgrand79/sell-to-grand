// Mirrors the live Supabase schema for project sell-to-grand.

export type SiteSettings = {
  id: number;
  business_name: string;
  logo: string | null;
  favicon: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image: string | null;
  phone: string | null;
  phone_display: string | null;
  contact_email: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  license_number: string | null;
  license_type: string | null;
  license_expires: string | null;
  license_disclosure: string;
  service_areas: string[];
  service_county: string;
  service_region: string;
  home_seo_title: string | null;
  home_seo_description: string | null;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
};

export type ChosenPath = "cash" | "listed" | "neither" | "undecided";

export type LeadStatus =
  | "new"
  | "contacted"
  | "walked"
  | "offer_made"
  | "under_contract"
  | "closed"
  | "lost";

export type PropertyCondition = "Excellent" | "Good" | "Fair" | "Poor" | "Terrible";
export type Occupancy = "owner" | "tenant" | "vacant";

export type Lead = {
  id: number;
  created_at: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string;
  city: string | null;
  situation: string | null;
  timeline: string | null;
  condition_notes: string | null;
  cash_offer: number | null;
  listed_estimate: number | null;
  spread: number | null;
  chosen_path: ChosenPath | null;
  status: LeadStatus;
  notes: string | null;
  archived: boolean;
  // Step 2 enrichment
  edit_token: string | null;
  ownership_length: string | null;
  property_condition: PropertyCondition | null;
  repairs_needed: string | null;
  occupancy: Occupancy | null;
  listed_with_realtor: boolean | null;
  needs_fast_sale: boolean | null;
  close_timeline: string | null;
  reason_for_selling: string | null;
  asking_price: number | null;
  fair_price: number | null;
  best_time_to_call: string | null;
  sms_consent: boolean | null;
  privacy_consent: boolean | null;
};

// What the public lead form is allowed to submit.
export type LeadFormInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  situation: string;
  timeline: string;
  condition_notes: string;
};
