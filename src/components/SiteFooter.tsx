import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { LicenseDisclosure } from "@/components/LicenseDisclosure";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const areas = settings.service_areas ?? [];
  return (
    <footer className="mt-20 border-t border-line bg-wash">
      <div className="wrap grid gap-8 py-12 sm:grid-cols-2">
        <div className="space-y-3">
          <p className="text-base font-bold text-ink">{settings.business_name}</p>
          {(settings.address_street || settings.address_city) && (
            <p className="text-sm text-slatey">
              {settings.address_street}
              {settings.address_street ? ", " : ""}
              {settings.address_city}, {settings.address_state}{" "}
              {settings.address_zip}
            </p>
          )}
          <p className="text-sm text-slatey">
            {settings.phone_display && (
              <a href={`tel:${settings.phone ?? ""}`} className="hover:text-ink">
                {settings.phone_display}
              </a>
            )}
            {settings.contact_email && (
              <>
                {" · "}
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="hover:text-ink"
                >
                  {settings.contact_email}
                </a>
              </>
            )}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ink">Where we buy</p>
          <p className="text-sm text-slatey">
            {areas.length > 0
              ? areas.join(" · ")
              : `${settings.service_county}, ${settings.service_region}`}
          </p>
        </div>
      </div>

      {/* Disclosure repeated at the base of every page as an inline line too. */}
      <div className="border-t border-line">
        <div className="wrap py-6">
          <LicenseDisclosure settings={settings} variant="inline" />
          <p className="mt-4 text-xs text-slatey">
            © {settings.business_name}. Offers are non-binding until a written
            agreement is signed.{" "}
            <Link href="/about" className="underline hover:text-ink">
              About
            </Link>{" "}
            ·{" "}
            <Link href="/faq" className="underline hover:text-ink">
              Questions
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" className="underline hover:text-ink">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
