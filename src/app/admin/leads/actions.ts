"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function parseMoney(v: FormDataEntryValue | null): number | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[$,\s]/g, "").trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function updateLead(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) return;

  const id = Number(str(formData.get("id")));
  if (!Number.isFinite(id)) return;

  const chosen = str(formData.get("chosen_path"));
  const status = str(formData.get("status"));

  // spread is a generated column — never written, only read back.
  const update = {
    cash_offer: parseMoney(formData.get("cash_offer")),
    listed_estimate: parseMoney(formData.get("listed_estimate")),
    chosen_path: chosen || null,
    status: status || "new",
    notes: str(formData.get("notes")) || null,
  };

  await supabase.from("leads").update(update).eq("id", id);
  revalidatePath("/admin/leads");
}
