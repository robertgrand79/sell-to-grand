"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettings, type SettingsState } from "./actions";
import type { SiteSettings } from "@/lib/types";

const input =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
const lbl = "block text-sm font-medium text-ink";

function Field({
  name,
  label,
  defaultValue,
  hint,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className={lbl} htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} className={input} />
      {hint && <p className="text-xs text-slatey">{hint}</p>}
    </div>
  );
}

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accentdark disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save settings"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-6 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wide text-accentdark">
        {title}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const [state, action] = useActionState<SettingsState, FormData>(
    updateSettings,
    null
  );

  return (
    <form action={action} className="space-y-6">
      <Section title="Brand">
        <Field name="business_name" label="Business name" defaultValue={s.business_name} />
        <div className="space-y-1">
          <label className={lbl} htmlFor="hero_title">
            Hero title
          </label>
          <input id="hero_title" name="hero_title" defaultValue={s.hero_title ?? ""} className={input} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className={lbl} htmlFor="hero_subtitle">
            Hero subtitle
          </label>
          <textarea
            id="hero_subtitle"
            name="hero_subtitle"
            rows={3}
            defaultValue={s.hero_subtitle ?? ""}
            className={input}
          />
        </div>
      </Section>

      <Section title="Contact">
        <Field name="phone_display" label="Phone (shown)" defaultValue={s.phone_display} hint="e.g. (541) 214-2163" />
        <Field name="phone" label="Phone (dial)" defaultValue={s.phone} hint="e.g. +15412142163" />
        <Field name="contact_email" label="Contact email" defaultValue={s.contact_email} type="email" />
      </Section>

      <Section title="Office address">
        <Field name="address_street" label="Street" defaultValue={s.address_street} />
        <Field name="address_city" label="City" defaultValue={s.address_city} />
        <Field name="address_state" label="State" defaultValue={s.address_state} />
        <Field name="address_zip" label="ZIP" defaultValue={s.address_zip} />
      </Section>

      <Section title="Licence (Oregon disclosure)">
        <Field name="license_number" label="Licence number" defaultValue={s.license_number} />
        <Field name="license_type" label="Licence type" defaultValue={s.license_type} />
        <Field name="license_expires" label="Expires" defaultValue={s.license_expires} type="date" />
        <div className="space-y-1 sm:col-span-2">
          <label className={lbl} htmlFor="license_disclosure">
            Disclosure text (required, shown on every page)
          </label>
          <textarea
            id="license_disclosure"
            name="license_disclosure"
            rows={3}
            required
            defaultValue={s.license_disclosure}
            className={input}
          />
          <p className="text-xs text-slatey">
            Cannot be blank. Oregon requires it on all advertising.
          </p>
        </div>
      </Section>

      <Section title="Service area">
        <div className="space-y-1 sm:col-span-2">
          <label className={lbl} htmlFor="service_areas">
            Cities served
          </label>
          <textarea
            id="service_areas"
            name="service_areas"
            rows={3}
            defaultValue={(s.service_areas ?? []).join(", ")}
            className={input}
          />
          <p className="text-xs text-slatey">Separate with commas or new lines.</p>
        </div>
        <Field name="service_county" label="County" defaultValue={s.service_county} />
        <Field name="service_region" label="Region / state" defaultValue={s.service_region} />
      </Section>

      <Section title="SEO">
        <Field name="home_seo_title" label="Home title tag" defaultValue={s.home_seo_title} />
        <div className="space-y-1 sm:col-span-2">
          <label className={lbl} htmlFor="home_seo_description">
            Home meta description
          </label>
          <textarea
            id="home_seo_description"
            name="home_seo_description"
            rows={2}
            defaultValue={s.home_seo_description ?? ""}
            className={input}
          />
        </div>
      </Section>

      <div className="flex items-center gap-4">
        <Save />
        {state && (
          <span
            role="status"
            className={`text-sm font-medium ${state.ok ? "text-accentdark" : "text-red-600"}`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
