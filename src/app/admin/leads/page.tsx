import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lead } from "@/lib/types";
import { LeadCard } from "./LeadCard";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  let leads: Lead[] = [];
  let loadError = false;

  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) loadError = true;
    else leads = (data ?? []) as Lead[];
  } else {
    loadError = true;
  }

  const wins = leads.filter((l) => l.chosen_path === "listed").length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-ink">Leads</h1>
        <p className="text-sm text-slatey">
          {leads.length} total
          {wins > 0 && (
            <>
              {" · "}
              <span className="font-semibold text-accentdark">
                {wins} chose to list
              </span>
            </>
          )}
        </p>
      </div>

      {loadError ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load leads. Make sure{" "}
          <code className="rounded bg-white px-1">SUPABASE_SECRET_KEY</code> is
          set.
        </div>
      ) : leads.length === 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-white p-6 text-sm text-slatey">
          No leads yet. They&apos;ll show up here the moment someone submits the
          form.
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
