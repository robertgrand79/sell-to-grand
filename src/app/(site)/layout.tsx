import { getSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LicenseDisclosure } from "@/components/LicenseDisclosure";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <SiteHeader settings={settings} />
      <LicenseDisclosure settings={settings} variant="band" />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
