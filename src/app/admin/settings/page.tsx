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

  // Live view of what THIS running deployment sees for lead-notification env
  // vars. Values, not secrets (the API key shows only set/not set).
  const notify = {
    hasKey: Boolean(process.env.RESEND_API_KEY),
    from: process.env.LEAD_FROM_EMAIL || "(default) onboarding@resend.dev",
    to:
      process.env.LEAD_NOTIFY_EMAIL ||
      process.env.CONTACT_EMAIL ||
      "(none set)",
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-slatey">
          Changes go live on the site immediately.
        </p>
      </div>
      <div className="mt-6 space-y-6">
        <section className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-accentdark">
            Lead notifications (live config)
          </h2>
          <p className="mt-1 text-xs text-slatey">
            What this deployment currently reads. If a value looks wrong, fix
            the env var in Vercel (Production) and redeploy.
          </p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slatey">Resend API key</dt>
              <dd className={notify.hasKey ? "font-medium text-accentdark" : "font-medium text-red-600"}>
                {notify.hasKey ? "set" : "NOT set"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slatey">From (LEAD_FROM_EMAIL)</dt>
              <dd className="text-right font-medium text-ink">{notify.from}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slatey">To (LEAD_NOTIFY_EMAIL)</dt>
              <dd className="text-right font-medium text-ink">{notify.to}</dd>
            </div>
          </dl>
        </section>
        <BrandingUploader
          logo={settings.logo}
          favicon={settings.favicon}
          aboutPhoto={settings.about_photo}
        />
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
