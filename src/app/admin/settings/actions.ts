"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { SETTINGS_TAG } from "@/lib/site-settings";

export type SettingsState = { ok: boolean; message: string } | null;

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}
function nullable(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s || null;
}

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase)
    return { ok: false, message: "SUPABASE_SECRET_KEY is not set." };

  // The licence disclosure is legally required and the column is NOT NULL.
  // Never let it be saved blank.
  const disclosure = str(formData.get("license_disclosure"));
  if (!disclosure) {
    return {
      ok: false,
      message:
        "Licence disclosure cannot be empty — Oregon requires it on all advertising.",
    };
  }

  const areasRaw = str(formData.get("service_areas"));
  const service_areas = areasRaw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const update = {
    business_name: str(formData.get("business_name")) || "Sell to Grand",
    hero_title: nullable(formData.get("hero_title")),
    hero_subtitle: nullable(formData.get("hero_subtitle")),
    phone: nullable(formData.get("phone")),
    phone_display: nullable(formData.get("phone_display")),
    contact_email: nullable(formData.get("contact_email")),
    address_street: nullable(formData.get("address_street")),
    address_city: nullable(formData.get("address_city")),
    address_state: nullable(formData.get("address_state")),
    address_zip: nullable(formData.get("address_zip")),
    license_number: nullable(formData.get("license_number")),
    license_type: nullable(formData.get("license_type")),
    license_expires: nullable(formData.get("license_expires")),
    license_disclosure: disclosure,
    service_areas: service_areas.length ? service_areas : ["Eugene", "Springfield"],
    service_county: str(formData.get("service_county")) || "Lane County",
    service_region: str(formData.get("service_region")) || "Oregon",
    home_seo_title: nullable(formData.get("home_seo_title")),
    home_seo_description: nullable(formData.get("home_seo_description")),
  };

  const { error } = await supabase
    .from("site_settings")
    .update(update)
    .eq("id", 1);

  if (error) return { ok: false, message: "Save failed. Try again." };

  revalidateTag(SETTINGS_TAG);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved." };
}
