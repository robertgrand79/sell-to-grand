"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitLead, enrichLead } from "@/app/(site)/actions";
import type { SiteSettings } from "@/lib/types";

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink placeholder:text-slatey/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
const labelClass = "block text-sm font-medium text-ink";

function formatMoney(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  return "$" + Number(digits).toLocaleString("en-US");
}

// Price input that shows a formatted dollar value as you type ($320,000).
// The server strips the $ and commas back to a number on submit.
function CurrencyField({
  id,
  name,
  label,
}: {
  id: string;
  name: string;
  label: string;
}) {
  const [val, setVal] = useState("");
  return (
    <div className="space-y-1">
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        inputMode="numeric"
        value={val}
        onChange={(e) => setVal(formatMoney(e.target.value))}
        placeholder="$0"
        className={fieldClass}
      />
    </div>
  );
}

function newToken(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function LeadForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [token, setToken] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function scrollToForm() {
    // Show the top of the form (and the step-2 confirmation) rather than
    // jumping to the page header.
    requestAnimationFrame(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const t = token || newToken();
    setToken(t);
    fd.set("edit_token", t);

    setPending(true);
    const res = await submitLead(fd);
    setPending(false);

    if (res.ok) {
      setStep(2);
      scrollToForm();
    } else {
      setError(res.error);
    }
  }

  async function handleStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("edit_token", token);
    setPending(true);
    await enrichLead(fd);
    router.push("/thank-you");
  }

  return (
    <div ref={containerRef}>
      {step === 1 ? (
        <form onSubmit={handleStep1} className="space-y-4">
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
              <input id="phone" name="phone" type="tel" inputMode="tel" className={fieldClass} />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" className={fieldClass} />
          </div>

          <div className="space-y-1">
            <label className={labelClass} htmlFor="address">
              Property address
            </label>
            <input id="address" name="address" required className={fieldClass} />
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-accent px-4 py-3 text-base font-semibold text-white transition hover:bg-accentdark disabled:opacity-60"
          >
            {pending ? "Sending…" : "Get my two numbers"}
          </button>
          <p className="text-xs leading-relaxed text-slatey">
            No obligation. We don&apos;t share your information. Sending this is
            not a contract, and any offer is non-binding until you sign a written
            agreement.
          </p>
        </form>
      ) : (
        <form onSubmit={handleStep2} className="space-y-5">
          <div className="rounded-md bg-accent/5 p-4">
            <p className="text-sm font-semibold text-ink">
              Got it — you&apos;re on our list.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slatey">
              A few more details help us give you an accurate cash offer and
              listed estimate. Don&apos;t have an answer handy? Leave it blank.
            </p>
          </div>

          <p className="text-sm font-bold uppercase tracking-wide text-accentdark">
            Property information
          </p>

          <div className="space-y-1">
            <label className={labelClass} htmlFor="ownership_length">
              How long have you owned the property?
            </label>
            <input id="ownership_length" name="ownership_length" className={fieldClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClass} htmlFor="property_condition">
                Current condition
              </label>
              <select id="property_condition" name="property_condition" className={fieldClass} defaultValue="">
                <option value="">Choose one</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
                <option>Terrible</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass} htmlFor="occupancy">
                Is anyone living in the house?
              </label>
              <select id="occupancy" name="occupancy" className={fieldClass} defaultValue="">
                <option value="">Choose one</option>
                <option value="owner">Yes — owner occupied</option>
                <option value="tenant">Yes — tenant occupied</option>
                <option value="vacant">No, it&apos;s vacant</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass} htmlFor="repairs_needed">
              What repairs or maintenance does the house need?
            </label>
            <textarea id="repairs_needed" name="repairs_needed" rows={3} className={fieldClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClass} htmlFor="listed_with_realtor">
                Currently listed with a Realtor?
              </label>
              <select id="listed_with_realtor" name="listed_with_realtor" className={fieldClass} defaultValue="">
                <option value="">Choose one</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass} htmlFor="needs_fast_sale">
                Do you need to sell fast?
              </label>
              <select id="needs_fast_sale" name="needs_fast_sale" className={fieldClass} defaultValue="">
                <option value="">Choose one</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <p className="pt-2 text-sm font-bold uppercase tracking-wide text-accentdark">
            Your situation
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClass} htmlFor="close_timeline">
                How soon would you like to close?
              </label>
              <select id="close_timeline" name="close_timeline" className={fieldClass} defaultValue="">
                <option value="">Choose one</option>
                <option>30 days or less</option>
                <option>1 to 3 months</option>
                <option>3 to 6 months</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass} htmlFor="best_time_to_call">
                Best time to call?
              </label>
              <select id="best_time_to_call" name="best_time_to_call" className={fieldClass} defaultValue="">
                <option value="">Choose one</option>
                <option>Anytime</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-slatey">
            We can close when you want. We work around your timeline and can give
            you a few days after closing to move your things.
          </p>

          <div className="space-y-1">
            <label className={labelClass} htmlFor="reason_for_selling">
              What&apos;s your reason for selling?
            </label>
            <input id="reason_for_selling" name="reason_for_selling" className={fieldClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CurrencyField id="asking_price" name="asking_price" label="Your asking price" />
            <CurrencyField id="fair_price" name="fair_price" label="Fair as-is price for both of us?" />
          </div>
          <p className="text-xs text-slatey">
            If we buy as-is, pay your closing and escrow costs, and close on the
            day you choose — what would feel fair to you?
          </p>

          <div className="space-y-3 border-t border-line pt-4">
            <label className="flex items-start gap-2 text-sm text-slatey">
              <input type="checkbox" name="sms_consent" className="mt-1 h-4 w-4 rounded border-line text-accent" />
              <span>
                I agree to receive text messages from {settings.business_name}.
                Message &amp; data rates may apply.
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slatey">
              <input type="checkbox" name="privacy_consent" className="mt-1 h-4 w-4 rounded border-line text-accent" />
              <span>I agree to be contacted about my property. No obligation.</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-accent px-5 py-3 text-base font-semibold text-white transition hover:bg-accentdark disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send my details"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/thank-you")}
              className="text-sm font-medium text-slatey hover:text-ink"
            >
              Skip for now
            </button>
          </div>
          {settings.phone_display && (
            <p className="text-sm text-slatey">
              Prefer to talk? Call{" "}
              <a href={`tel:${settings.phone ?? ""}`} className="font-semibold text-accentdark">
                {settings.phone_display}
              </a>
              .
            </p>
          )}
        </form>
      )}
    </div>
  );
}
