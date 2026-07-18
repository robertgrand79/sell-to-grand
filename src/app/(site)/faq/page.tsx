import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublishedFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Common questions about selling your Lane County home to Sell to Grand: cash offers, listing, timelines, and how the two numbers work.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const [faqs, s] = await Promise.all([getPublishedFaqs(), getSiteSettings()]);

  const jsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="wrap py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Questions
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slatey">
          Straight answers about how selling to us works. Don&apos;t see yours?
          {s.phone_display && (
            <>
              {" "}
              Call{" "}
              <a
                href={`tel:${s.phone ?? ""}`}
                className="font-semibold text-accentdark"
              >
                {s.phone_display}
              </a>
              .
            </>
          )}
        </p>

        {faqs.length > 0 ? (
          <dl className="mt-10 divide-y divide-line border-t border-line">
            {faqs.map((f) => (
              <div key={f.id} className="py-6">
                <dt className="text-lg font-semibold text-ink">{f.question}</dt>
                <dd className="mt-2 whitespace-pre-line text-base leading-relaxed text-slatey">
                  {f.answer}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-10 rounded-lg border border-line bg-wash p-6">
            <p className="text-base leading-relaxed text-slatey">
              We&apos;re putting our most common questions here. In the meantime,
              the fastest way to get answers about your specific house is to ask
              us directly.
            </p>
            <Link
              href="/#offer"
              className="mt-4 inline-block rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accentdark"
            >
              Get my two numbers
            </Link>
          </div>
        )}
      </div>

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </div>
  );
}
