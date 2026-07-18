import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Sell to Grand is the cash-buying side of a licensed Oregon brokerage in Eugene. We give Lane County homeowners two honest numbers, not one.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const s = await getSiteSettings();
  const areas = (s.service_areas ?? []).slice(0, 4).join(", ");

  return (
    <>
      <section className="border-b border-line bg-wash">
        <div className="wrap py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accentdark">
              About {s.business_name}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              A licensed brokerage that gives you two numbers, not one
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slatey">
              {s.business_name} is the cash-buying side of a licensed Oregon real
              estate brokerage, based in Eugene and serving homeowners across{" "}
              {s.service_county}. Most companies that buy houses for cash show you
              a single number and hope you never ask what your home is really
              worth. Because we are a licensed brokerage, we don&apos;t have to
              work that way.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Why we do it this way
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slatey">
              We can tell you both numbers: what your house would net listed on
              the open market, and what we can pay you in cash. Then you choose.
              The gap between the two is what speed and certainty cost, and we
              would rather you see that trade with your own eyes than have it
              hidden from you. Sometimes the cash offer is the right move.
              Sometimes listing is. Our job is to show you honestly, not to talk
              you into whichever one pays us.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Meet Robert Grand
            </h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-slatey">
                  {s.business_name} is run by Robert Grand, a licensed Oregon
                  Principal Broker
                  {s.license_number ? ` (License #${s.license_number})` : ""}.
                  Before real estate, Robert spent more than two decades in
                  emergency services, and that background shows up in how he
                  works: show up when you say you will, tell people the truth
                  even when it isn&apos;t the easy answer, and treat a stressful
                  situation with respect. He built {s.business_name} for sellers
                  who want a clear, honest option, whether that ends in a fast
                  cash close or a listing.
                </p>
                <p className="text-base leading-relaxed text-slatey">
                  Robert runs the business alongside his wife and business
                  partner, Shelly. Together they are a locally rooted, family-run
                  team, not a national operation, and the people you talk to are
                  the people who will see your sale through.
                </p>
              </div>
              {s.about_photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.about_photo}
                  alt={`Robert Grand, ${s.business_name}`}
                  className="w-full rounded-xl border border-line object-cover shadow-sm sm:w-56"
                />
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Local, and here to stay
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slatey">
              We are not a national wholesaler routing your address off to
              whoever bids highest that week. We live and work in{" "}
              {s.service_county}, out of our office in {s.address_city ?? "Eugene"}
              , and we buy in {areas || "Eugene and the surrounding towns"}, and
              the towns around them. When you reach out, you get us directly, not
              a call center.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              What you can expect
            </h2>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-slatey">
              <li>✓ Both numbers, honestly: the listed estimate and the cash offer.</li>
              <li>✓ No pressure and no obligation to take either one.</li>
              <li>✓ We buy as-is. You don&apos;t repair, clean, or stage a thing.</li>
              <li>✓ A closing date you choose.</li>
              <li>✓ If listing is genuinely better for you, we&apos;ll tell you.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-wash p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-ink">
              See your two numbers
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slatey">
              Tell us about your house and we&apos;ll come back with both. No
              obligation, no hard sell.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link
                href="/#offer"
                className="rounded-md bg-accent px-5 py-3 text-base font-semibold text-white hover:bg-accentdark"
              >
                Get my two numbers
              </Link>
              {s.phone_display && (
                <a
                  href={`tel:${s.phone ?? ""}`}
                  className="text-base font-semibold text-accentdark hover:underline"
                >
                  or call {s.phone_display}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
