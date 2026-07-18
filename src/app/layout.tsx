import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title =
    s.home_seo_title ?? `${s.business_name} — Cash offer or listed, you pick`;
  const description =
    s.home_seo_description ??
    "A licensed Oregon brokerage that shows you two numbers: what your house nets listed and what we pay in cash. The gap is what speed costs.";
  return {
    title: { default: title, template: `%s · ${s.business_name}` },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    openGraph: { title, description, type: "website", url: SITE_URL, siteName: s.business_name },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}
