import { unstable_cache } from "next/cache";
import { createPublicSupabase } from "@/lib/supabase/public";
import type { Faq } from "@/lib/types";

export const FAQS_TAG = "faqs";

// Cached list of published FAQs for the public /faq page. Admin edits bust the
// tag so changes appear immediately.
const getPublishedFaqsCached = unstable_cache(
  async (): Promise<Faq[]> => {
    try {
      const supabase = createPublicSupabase();
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true })
        .order("id", { ascending: true });
      if (error || !data) return [];
      return data as Faq[];
    } catch {
      return [];
    }
  },
  ["published-faqs"],
  { revalidate: 3600, tags: [FAQS_TAG] }
);

export async function getPublishedFaqs(): Promise<Faq[]> {
  return getPublishedFaqsCached();
}
