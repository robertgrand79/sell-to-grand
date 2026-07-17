"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string };

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function submitLead(
  _prev: LeadResult | null,
  formData: FormData
): Promise<LeadResult> {
  // Honeypot: real people leave this hidden field empty.
  if (clean(formData.get("company"))) {
    return { ok: true };
  }

  const name = clean(formData.get("name"));
  const address = clean(formData.get("address"));
  const phone = clean(formData.get("phone"));
  const email = clean(formData.get("email"));

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
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Something went wrong saving that. Please call us instead.",
    };
  }
}
