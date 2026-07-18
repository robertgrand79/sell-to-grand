import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="wrap flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex flex-col gap-1 leading-tight">
          {settings.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo}
              alt={settings.business_name}
              className="h-14 w-auto max-w-[300px] object-contain sm:h-16"
            />
          ) : (
            <span className="text-lg font-bold tracking-tight text-ink">
              {settings.business_name}
            </span>
          )}
          <span className="text-xs text-slatey">
            Cash offers in {settings.service_county}, {settings.service_region}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/faq"
            className="hidden text-sm font-medium text-slatey hover:text-ink sm:inline"
          >
            Questions
          </Link>
          {settings.phone_display && (
            <a
              href={`tel:${settings.phone ?? ""}`}
              className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accentdark"
            >
              {settings.phone_display}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
