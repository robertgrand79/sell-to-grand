import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lead } from "@/lib/types";
import { LeadsTable } from "./LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  await requireAdmin();
  const { view: viewParam } = await searchParams;
  const view: "active" | "archived" = viewParam === "archived" ? "archived" : "active";

  const supabase = createAdminClient();
  let leads: Lead[] = [];
  let loadError = false;

  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("archived", view === "archived")
      .order("created_at", { ascending: false });
    if (error) loadError = true;
    else leads = (data ?? []) as Lead[];
  } else {
    loadError = true;
  }

  const wins = leads.filter((l) => l.chosen_path === "listed").length;
  const tab = (key: "active" | "archived", label: string) => (
    <Link
      href={key === "active" ? "/admin/leads" : "/admin/leads?view=archived"}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        view === key ? "bg-accent text-white" : "text-slatey hover:bg-wash"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-ink">Leads</h1>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-white p-1">
          {tab("active", "Active")}
          {tab("archived", "Archived")}
        </div>
      </div>

      <p className="mt-2 text-sm text-slatey">
        {leads.length} {view === "archived" ? "archived" : "active"}
        {wins > 0 && (
          <>
            {" · "}
            <span className="font-semibold text-accentdark">{wins} chose to list</span>
          </>
        )}
        {leads.length > 0 && " · click a row to see all the details"}
      </p>

      {loadError ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load leads. Make sure{" "}
          <code className="rounded bg-white px-1">SUPABASE_SECRET_KEY</code> is set.
        </div>
      ) : leads.length === 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-white p-6 text-sm text-slatey">
          {view === "archived"
            ? "No archived leads."
            : "No leads yet. They'll show up here the moment someone submits the form."}
        </div>
      ) : (
        <div className="mt-6">
          <LeadsTable leads={leads} view={view} />
        </div>
      )}
    </div>
  );
}
