import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Sell to Grand collects, uses, and protects the information you share when you request a cash offer or listed estimate.",
};

const LAST_UPDATED = "July 18, 2026";

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-xl font-bold text-ink">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-base leading-relaxed text-slatey">{children}</p>;
}

export default async function PrivacyPage() {
  const s = await getSiteSettings();
  const name = s.business_name;
  const email = s.contact_email;
  const phone = s.phone_display;
  const addr = [s.address_street, s.address_city, s.address_state, s.address_zip]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="wrap py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slatey">Last updated: {LAST_UPDATED}</p>

        <P>
          This policy explains what information {name} collects when you use our
          website or contact us about your property, how we use it, and the
          choices you have. We keep this simple because our business is simple:
          you share details about your house so we can give you a cash offer and
          a listed estimate, and we use that information to help you.
        </P>

        <H>Information we collect</H>
        <P>
          <strong>Information you give us.</strong> When you fill out a form or
          contact us, we collect what you provide: your name, phone number,
          email address, the property address, and any details you share about
          the property&apos;s condition, your situation, timeline, and pricing.
        </P>
        <P>
          <strong>Information collected automatically.</strong> Like most
          websites, our hosting provider records basic technical data such as
          your browser type and IP address in standard server logs. We do not
          use this to identify you personally.
        </P>

        <H>How we use your information</H>
        <P>
          We use the information you share to prepare your cash offer and listed
          estimate, to contact you about your inquiry, and to provide the
          services you ask for. We do not sell your personal information, and we
          do not share it for anyone else&apos;s advertising.
        </P>

        <H>Text messages (SMS)</H>
        <P>
          If you give us your phone number and check the text-message consent
          box, you agree to receive text messages from {name} about your
          property inquiry. Message frequency varies, and message and data rates
          may apply. You can opt out at any time by replying <strong>STOP</strong>,
          or reply <strong>HELP</strong> for help. Consent to receive texts is
          not a condition of any sale or service, and we do not share your
          mobile number with third parties for their marketing.
        </P>

        <H>How we share information</H>
        <P>
          We share your information only with service providers that help us run
          the business (for example, our website hosting and database provider),
          and only as needed to provide our services. We may also disclose
          information if required by law or to protect our legal rights. That is
          the extent of it.
        </P>

        <H>How we store and protect it</H>
        <P>
          Your information is stored in a secured database and protected by
          access controls so that only our team can view lead details. No system
          is perfectly secure, but we take reasonable steps to protect the
          information you share with us.
        </P>

        <H>Your choices</H>
        <P>
          You can ask us to update or delete the information we have about you,
          or opt out of further contact, at any time. Just reach out using the
          contact details below and we&apos;ll take care of it.
        </P>

        <H>Cookies</H>
        <P>
          Our site uses only the minimal cookies needed for it to function. We
          do not use third-party advertising cookies.
        </P>

        <H>Children</H>
        <P>
          Our website and services are intended for adults. We do not knowingly
          collect information from anyone under 18.
        </P>

        <H>Changes to this policy</H>
        <P>
          We may update this policy from time to time. When we do, we&apos;ll
          change the &quot;last updated&quot; date at the top of this page.
        </P>

        <H>Contact us</H>
        <P>
          Questions about this policy or your information? Reach {name}
          {email ? (
            <>
              {" "}at{" "}
              <a href={`mailto:${email}`} className="font-semibold text-accentdark">
                {email}
              </a>
            </>
          ) : null}
          {phone ? (
            <>
              {" "}or{" "}
              <a href={`tel:${s.phone ?? ""}`} className="font-semibold text-accentdark">
                {phone}
              </a>
            </>
          ) : null}
          {addr ? `. ${addr}.` : "."}
        </P>
      </div>
    </div>
  );
}
