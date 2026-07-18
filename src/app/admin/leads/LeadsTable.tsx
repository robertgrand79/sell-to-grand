"use client";

import { Fragment, useState } from "react";
import { LeadCard } from "./LeadCard";
import { setLeadArchived, deleteLead } from "./actions";
import type { Lead } from "@/lib/types";

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-accent/10 text-accentdark",
  contacted: "bg-blue-50 text-blue-700",
  walked: "bg-amber-50 text-amber-700",
  offer_made: "bg-amber-50 text-amber-700",
  under_contract: "bg-violet-50 text-violet-700",
  closed: "bg-emerald-50 text-emerald-700",
  lost: "bg-slate-100 text-slate-600",
};

export function LeadsTable({
  leads,
  view,
}: {
  leads: Lead[];
  view: "active" | "archived";
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-wash text-xs uppercase tracking-wide text-slatey">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Date</th>
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Address</th>
              <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Phone</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5" aria-label="Expand" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((lead) => {
              const open = openId === lead.id;
              return (
                <Fragment key={lead.id}>
                  <tr
                    onClick={() => setOpenId(open ? null : lead.id)}
                    className="cursor-pointer hover:bg-wash/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slatey">
                      {shortDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{lead.name}</td>
                    <td className="hidden px-4 py-3 text-slatey sm:table-cell">
                      {lead.address}
                      {lead.city ? `, ${lead.city}` : ""}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-slatey md:table-cell">
                      {lead.phone ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          STATUS_STYLES[lead.status] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {lead.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slatey">
                      <span aria-hidden>{open ? "▲" : "▼"}</span>
                    </td>
                  </tr>
                  {open && (
                    <tr className="bg-wash/40">
                      <td colSpan={6} className="px-4 py-4">
                        <LeadCard lead={lead} />
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <form action={setLeadArchived}>
                            <input type="hidden" name="id" value={lead.id} />
                            <input
                              type="hidden"
                              name="archived"
                              value={view === "archived" ? "false" : "true"}
                            />
                            <button
                              type="submit"
                              className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-slatey hover:bg-white"
                            >
                              {view === "archived" ? "Unarchive" : "Archive"}
                            </button>
                          </form>
                          <form
                            action={deleteLead}
                            onSubmit={(e) => {
                              if (
                                !window.confirm(
                                  `Delete ${lead.name}'s lead permanently? This cannot be undone.`
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="id" value={lead.id} />
                            <button
                              type="submit"
                              className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
