import type { SiteSettings } from "@/lib/types";

// The licence disclosure is the HEADLINE, not fine print. Oregon requires a
// licensee buying for their own account to disclose licence status on all
// advertising. It is also the single best sentence on this site: no other
// cash buyer in Lane County can say it. Rendered as a visible band, never a
// greyed-out footer line.
export function LicenseDisclosure({
  settings,
  variant = "band",
}: {
  settings: SiteSettings;
  variant?: "band" | "inline";
}) {
  const text = settings.license_disclosure;

  if (variant === "inline") {
    return (
      <p className="text-sm leading-relaxed text-slatey">
        <span className="font-semibold text-ink">Licensed and disclosed. </span>
        {text}
      </p>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Oregon licence disclosure"
      className="border-y border-accent/25 bg-accent/5"
    >
      <div className="wrap py-4">
        <p className="text-[0.95rem] leading-relaxed text-ink">
          <span className="font-semibold text-accentdark">
            Licensed and disclosed.{" "}
          </span>
          {text}
        </p>
      </div>
    </aside>
  );
}
