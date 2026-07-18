"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/notify";

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string };

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function money(value: FormDataEntryValue | null): number | null {
  const c = clean(value).replace(/[$,\s]/g, "");
  if (!c) return null;
  const n = Number(c);
  return Number.isFinite(n) ? n : null;
}

function yesNo(value: FormDataEntryValue | null): boolean | null {
  const v = clean(value).toLowerCase();
  if (v === "yes") return true;
  if (v === "no") return false;
  return null;
}

function checkbox(value: FormDataEntryValue | null): boolean {
  return clean(value) === "on" || clean(value) === "true";
}

// STEP 1 — captures the lead immediately (contact + address). Even if the
// visitor abandons step 2, this row exists and is callable.
export async function submitLead(formData: FormData): Promise<LeadResult> {
  if (clean(formData.get("company"))) {
    return { ok: true }; // honeypot
  }

  const name = clean(formData.get("name"));
  const address = clean(formData.get("address"));
  const phone = clean(formData.get("phone"));
  const email = clean(formData.get("email"));
  const editToken = clean(formData.get("edit_token"));

  if (!name) return { ok: false, error: "Please tell us your name." };
  if (!address)
    return { ok: false, error: "Please tell us the property address." };
  if (!phone && !email)
    return {
      ok: false,
      error: "Add a phone or an email so we can send your two numbers.",
    };

  const row = {
    name,
    address,
    phone: phone || null,
    email: email || null,
    city: clean(formData.get("city")) || null,
    situation: clean(formData.get("situation")) || null,
    timeline: clean(formData.get("timeline")) || null,
    condition_notes: clean(formData.get("condition_notes")) || null,
    ...(editToken ? { edit_token: editToken } : {}),
  };

  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("leads").insert(row);
    if (error) {
      return {
        ok: false,
        error: "Something went wrong saving that. Please call us instead.",
      };
    }
  } catch {
    return {
      ok: false,
      error: "Something went wrong saving that. Please call us instead.",
    };
  }

  // Best-effort notification; never blocks or fails the submission.
  await notifyNewLead({
    name,
    phone: phone || null,
    email: email || null,
    address,
    city: clean(formData.get("city")) || null,
    situation: clean(formData.get("situation")) || null,
    timeline: clean(formData.get("timeline")) || null,
    condition_notes: clean(formData.get("condition_notes")) || null,
  });

  return { ok: true };
}

// STEP 2 — enriches the SAME lead via a security-definer function, keyed on
// the secret token from step 1. Anon can never UPDATE leads directly.
export async function enrichLead(formData: FormData): Promise<LeadResult> {
  const token = clean(formData.get("edit_token"));
  if (!token) return { ok: true }; // nothing to attach to; treat as done

  const params = {
    p_token: token,
    p_ownership_length: clean(formData.get("ownership_length")) || null,
    p_property_condition: clean(formData.get("property_condition")) || null,
    p_repairs_needed: clean(formData.get("repairs_needed")) || null,
    p_occupancy: clean(formData.get("occupancy")) || null,
    p_listed_with_realtor: yesNo(formData.get("listed_with_realtor")),
    p_needs_fast_sale: yesNo(formData.get("needs_fast_sale")),
    p_close_timeline: clean(formData.get("close_timeline")) || null,
    p_reason_for_selling: clean(formData.get("reason_for_selling")) || null,
    p_asking_price: money(formData.get("asking_price")),
    p_fair_price: money(formData.get("fair_price")),
    p_best_time_to_call: clean(formData.get("best_time_to_call")) || null,
    p_sms_consent: checkbox(formData.get("sms_consent")),
    p_privacy_consent: checkbox(formData.get("privacy_consent")),
  };

  try {
    const supabase = await createServerSupabase();
    await supabase.rpc("enrich_lead", params);
  } catch {
    // Enrichment is a bonus; the lead is already captured from step 1.
  }
  return { ok: true };
}
