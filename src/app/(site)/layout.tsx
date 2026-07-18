import { getSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <SiteHeader settings={settings} />
      {/* Oregon licence disclosure lives in the footer (present on every page). */}
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
