"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateLead } from "./actions";
import type { Lead, ChosenPath, LeadStatus } from "@/lib/types";

const PATHS: { value: ChosenPath | ""; label: string }[] = [
  { value: "", label: "—" },
  { value: "undecided", label: "Undecided" },
  { value: "cash", label: "Cash" },
  { value: "listed", label: "Listed (brokerage win)" },
  { value: "neither", label: "Neither" },
];

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "walked",
  "offer_made",
  "under_contract",
  "closed",
  "lost",
];

function money(n: number | null): string {
  if (n === null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accentdark disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

const input =
  "w-full rounded-md border border-line bg-white px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
const lbl = "block text-xs font-medium text-slatey";

function bool(v: boolean | null): string | null {
  if (v === null) return null;
  return v ? "Yes" : "No";
}

// Read-only display of the step-2 answers a seller provided.
function EnrichmentDetails({ lead }: { lead: Lead }) {
  const items: [string, string | null][] = [
    ["Owned for", lead.ownership_length],
    ["Condition", lead.property_condition],
    ["Occupancy", lead.occupancy],
    ["Repairs needed", lead.repairs_needed],
    ["Listed w/ realtor", bool(lead.listed_with_realtor)],
    ["Needs fast sale", bool(lead.needs_fast_sale)],
    ["Close timeline", lead.close_timeline],
    ["Reason for selling", lead.reason_for_selling],
    ["Asking price", lead.asking_price !== null ? money(lead.asking_price) : null],
    ["Fair price (theirs)", lead.fair_price !== null ? money(lead.fair_price) : null],
    ["Best time to call", lead.best_time_to_call],
    ["SMS consent", bool(lead.sms_consent)],
    ["Contact consent", bool(lead.privacy_consent)],
  ];
  const filled = items.filter(([, v]) => v);
  if (filled.length === 0) return null;

  return (
    <details open className="mt-2 rounded-md border border-line bg-wash/60 p-2.5">
      <summary className="cursor-pointer text-xs font-semibold text-accentdark">
        Property &amp; situation details ({filled.length})
      </summary>
      <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm text-slatey sm:grid-cols-2">
        {filled.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-slatey">{k}</dt>
            <dd className="text-right font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

export function LeadCard({ lead }: { lead: Lead }) {
  const [cash, setCash] = useState(lead.cash_offer ?? "");
  const [listed, setListed] = useState(lead.listed_estimate ?? "");

  const cashNum = cash === "" ? null : Number(cash);
  const listedNum = listed === "" ? null : Number(listed);
  const spread =
    cashNum !== null && listedNum !== null ? listedNum - cashNum : null;

  const created = new Date(lead.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-base font-bold text-ink">{lead.name}</p>
          <p className="text-sm text-slatey">
            {lead.address}
            {lead.city ? `, ${lead.city}` : ""}
          </p>
        </div>
        <p className="text-xs text-slatey">{created}</p>
      </div>

      <div className="mt-3 grid gap-x-6 gap-y-1 text-sm text-slatey sm:grid-cols-2">
        {lead.phone && (
          <p>
            Phone:{" "}
            <a href={`tel:${lead.phone}`} className="text-accentdark">
              {lead.phone}
            </a>
          </p>
        )}
        {lead.email && (
          <p>
            Email:{" "}
            <a href={`mailto:${lead.email}`} className="text-accentdark">
              {lead.email}
            </a>
          </p>
        )}
        {lead.timeline && <p>Timeline: {lead.timeline}</p>}
        {lead.situation && <p>Situation: {lead.situation}</p>}
      </div>
      {lead.condition_notes && (
        <p className="mt-2 rounded-md bg-wash p-2.5 text-sm text-slatey">
          Condition: {lead.condition_notes}
        </p>
      )}

      <EnrichmentDetails lead={lead} />

      <form action={updateLead} className="mt-4 border-t border-line pt-4">
        <input type="hidden" name="id" value={lead.id} />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className={lbl} htmlFor={`cash-${lead.id}`}>
              Cash offer
            </label>
            <input
              id={`cash-${lead.id}`}
              name="cash_offer"
              inputMode="decimal"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className={input}
              placeholder="0"
            />
          </div>
          <div className="space-y-1">
            <label className={lbl} htmlFor={`listed-${lead.id}`}>
              Listed estimate
            </label>
            <input
              id={`listed-${lead.id}`}
              name="listed_estimate"
              inputMode="decimal"
              value={listed}
              onChange={(e) => setListed(e.target.value)}
              className={input}
              placeholder="0"
            />
          </div>
          <div className="space-y-1">
            <span className={lbl}>Spread (what speed costs)</span>
            <div className="rounded-md border border-dashed border-line px-2.5 py-1.5 text-sm font-semibold text-ink">
              {money(spread)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={lbl} htmlFor={`path-${lead.id}`}>
              Chosen path
            </label>
            <select
              id={`path-${lead.id}`}
              name="chosen_path"
              defaultValue={lead.chosen_path ?? ""}
              className={input}
            >
              {PATHS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className={lbl} htmlFor={`status-${lead.id}`}>
              Status
            </label>
            <select
              id={`status-${lead.id}`}
              name="status"
              defaultValue={lead.status}
              className={input}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <label className={lbl} htmlFor={`notes-${lead.id}`}>
            Notes
          </label>
          <textarea
            id={`notes-${lead.id}`}
            name="notes"
            rows={2}
            defaultValue={lead.notes ?? ""}
            className={input}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
