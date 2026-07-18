import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Faq } from "@/lib/types";
import { FaqManager } from "./FaqManager";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  let faqs: Faq[] = [];
  let loadError = false;

  if (supabase) {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) loadError = true;
    else faqs = (data ?? []) as Faq[];
  } else {
    loadError = true;
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-ink">FAQs</h1>
        <p className="text-sm text-slatey">
          Published questions appear on the public /faq page.
        </p>
      </div>

      {loadError ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load FAQs. Make sure{" "}
          <code className="rounded bg-white px-1">SUPABASE_SECRET_KEY</code> is
          set.
        </div>
      ) : (
        <div className="mt-6">
          <FaqManager faqs={faqs} />
        </div>
      )}
    </div>
  );
}
