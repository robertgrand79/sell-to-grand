// Emails Robert when a new lead comes in. Uses Resend's HTTP API directly
// (no SDK dependency). It is a no-op until RESEND_API_KEY is set, and it
// never throws: a notification failure must never break lead capture.

type NewLead = {
  name: string;
  phone: string | null;
  email: string | null;
  address: string;
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value: string | null): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#4a5568">${esc(
    label
  )}</td><td style="padding:4px 0;color:#1c2430;font-weight:600">${esc(
    value
  )}</td></tr>`;
}

export async function notifyNewLead(lead: NewLead): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // notifications not configured yet

  const to =
    process.env.LEAD_NOTIFY_EMAIL || process.env.CONTACT_EMAIL || "";
  if (!to) return;

  const from = process.env.LEAD_FROM_EMAIL || "Sell to Grand <onboarding@resend.dev>";

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#1c2430;margin:0 0 4px">New lead: ${esc(lead.name)}</h2>
      <p style="color:#4a5568;margin:0 0 16px">${esc(lead.address)}</p>
      <table style="border-collapse:collapse;font-size:14px">
        ${row("Phone", lead.phone)}
        ${row("Email", lead.email)}
      </table>
      <p style="color:#4a5568;font-size:13px;margin-top:16px">
        Any property details they add on step 2 will be in the admin.
      </p>
    </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New lead: ${lead.name} — ${lead.address}`,
        html,
        ...(lead.email ? { reply_to: lead.email } : {}),
      }),
    });
  } catch {
    // Swallow: the lead is already saved; email is best-effort.
  }
}
