"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type LeadResult } from "@/app/(site)/actions";
import type { SiteSettings } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-accent px-4 py-3 text-base font-semibold text-white transition hover:bg-accentdark disabled:opacity-60"
    >
      {pending ? "Sending…" : "Get my two numbers"}
    </button>
  );
}

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink placeholder:text-slatey/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
const labelClass = "block text-sm font-medium text-ink";

export function LeadForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<LeadResult | null, FormData>(
    submitLead,
    null
  );

  if (state?.ok) {
    return (
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
        <h3 className="text-lg font-bold text-ink">
          Got it. We&apos;ll be in touch.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slatey">
          We&apos;ll look at your address and get back to you with both numbers:
          what it nets listed and what we can pay in cash. No pressure either
          way.
        </p>
        {settings.phone_display && (
          <p className="mt-4 text-sm text-slatey">
            Want to talk sooner? Call{" "}
            <a
              href={`tel:${settings.phone ?? ""}`}
              className="font-semibold text-accentdark"
            >
              {settings.phone_display}
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot, visually hidden from real users. */}
      <div aria-hidden className="hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required className={fieldClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" className={fieldClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1 sm:col-span-2">
          <label className={labelClass} htmlFor="address">
            Property address
          </label>
          <input id="address" name="address" required className={fieldClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="city">
            City
          </label>
          <input id="city" name="city" className={fieldClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="timeline">
            How soon do you need to sell?
          </label>
          <select id="timeline" name="timeline" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            <option>As soon as possible</option>
            <option>Within 30 days</option>
            <option>1 to 3 months</option>
            <option>Just exploring</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="situation">
            What&apos;s going on?
          </label>
          <select
            id="situation"
            name="situation"
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              Choose one
            </option>
            <option>Inherited the home</option>
            <option>Relocating</option>
            <option>Behind on payments</option>
            <option>Needs too many repairs</option>
            <option>Divorce or life change</option>
            <option>Just want it simple</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass} htmlFor="condition_notes">
          Anything about the condition we should know? (optional)
        </label>
        <textarea
          id="condition_notes"
          name="condition_notes"
          rows={3}
          className={fieldClass}
        />
      </div>

      {state && !state.ok && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton />
      <p className="text-xs leading-relaxed text-slatey">
        No obligation. We don&apos;t share your information. Sending this is not a
        contract, and any offer is non-binding until you sign a written
        agreement.
      </p>
    </form>
  );
}
