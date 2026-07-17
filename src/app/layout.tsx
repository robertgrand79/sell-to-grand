import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";

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
    metadataBase: new URL("https://selltogrand.com"),
    openGraph: { title, description, type: "website" },
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
