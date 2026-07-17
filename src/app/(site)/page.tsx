import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { LeadForm } from "@/components/LeadForm";

export default async function HomePage() {
  const s = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-wash">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              {s.hero_title ?? "Two numbers. You pick."}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slatey">
              {s.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#offer"
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

          {/* The trade, stated out loud. */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg border border-line bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-accentdark">
                Listed
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slatey">
                What the house nets on the open market with our brokerage. Higher
                number, but it takes showings, repairs, and time.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-accentdark">
                Cash
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slatey">
                What we pay you directly, below retail, on a closing date you
                pick. Less money, but no repairs, no showings, done fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why we can show both */}
      <section className="wrap py-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            The gap between the two numbers is what speed costs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slatey">
            Most cash buyers only ever show you their number. They call it the
            highest offer and hope you never find out what the house was worth
            listed. We don&apos;t work that way. Because Robert is a licensed
            Oregon principal broker, we can put both numbers in front of you and
            let you decide which one fits your life right now.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slatey">
            If the listed number is worth the wait, we&apos;ll tell you, and we
            can list it for you. If the certainty of a cash close is worth more
            to you than the extra dollars, we&apos;ll pay you and you&apos;re
            done. Either way you saw the trade with your own eyes.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Tell us about the house",
              body: "Address, rough condition, and how soon you want to be done. Two minutes.",
            },
            {
              step: "2",
              title: "We run both numbers",
              body: "What it nets listed, and what we can pay you in cash. You see them side by side.",
            },
            {
              step: "3",
              title: "You pick the path",
              body: "Cash close on your date, or list it with us. No pressure to do either.",
            },
          ].map((c) => (
            <div key={c.step} className="rounded-lg border border-line p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {c.step}
              </div>
              <h3 className="mt-3 text-base font-semibold text-ink">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slatey">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lead form */}
      <section id="offer" className="border-t border-line bg-wash">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Get your two numbers
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slatey">
              Fill this out and we&apos;ll come back with both: the listed
              estimate and the cash offer. No obligation to take either one.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slatey">
              <li>• We buy across {s.service_county}, {s.service_region}.</li>
              <li>• Any condition. You don&apos;t fix a thing.</li>
              <li>• You choose the closing date.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8">
            <LeadForm settings={s} />
          </div>
        </div>
      </section>
    </>
  );
}
