import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteSettings } from "@/lib/types";
import { SettingsForm } from "./SettingsForm";
import { BrandingUploader } from "./BrandingUploader";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();

  // Prefer the admin (service_role) client so we edit the true stored row,
  // then fall back to the public loader if the secret key is missing.
  let settings: SiteSettings | null = null;
  const supabase = createAdminClient();
  if (supabase) {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (data) settings = data as SiteSettings;
  }
  if (!settings) settings = await getSiteSettings();

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-slatey">
          Changes go live on the site immediately.
        </p>
      </div>
      <div className="mt-6 space-y-6">
        <BrandingUploader logo={settings.logo} favicon={settings.favicon} />
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
