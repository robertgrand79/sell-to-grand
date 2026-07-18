import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Thank you",
  description: "We received your information and will be in touch with your two numbers.",
  robots: { index: false, follow: true },
};

export default async function ThankYouPage() {
  const s = await getSiteSettings();

  return (
    <div className="wrap py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1f6f6b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Thank you. We&apos;ve got it.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slatey">
          We&apos;ll look at your property and come back to you with both
          numbers: what it nets listed and what we can pay you in cash. No
          pressure either way, and no obligation to take either one.
        </p>

        <div className="mx-auto mt-10 max-w-md rounded-xl border border-line bg-white p-6 text-left shadow-sm">
          <p className="text-sm font-semibold text-ink">What happens next</p>
          <ol className="mt-3 space-y-3 text-sm leading-relaxed text-slatey">
            <li>1. We review your address and the details you shared.</li>
            <li>2. We reach out with your cash offer and listed estimate.</li>
            <li>3. You decide which path fits your life, or neither.</li>
          </ol>
        </div>

        {s.phone_display && (
          <p className="mt-8 text-base text-slatey">
            Want to talk sooner? Call{" "}
            <a href={`tel:${s.phone ?? ""}`} className="font-semibold text-accentdark">
              {s.phone_display}
            </a>
            .
          </p>
        )}

        <div className="mt-8">
          <Link href="/" className="text-sm font-medium text-accentdark hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
