# Sell to Grand

Cash home-buying site for a licensed Oregon brokerage. The pitch is honest:
we show sellers **two numbers** — what the house nets listed and what we pay
in cash — and they pick. Sister brand to listwithgrand.com.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + RLS) — project `sell-to-grand` (`nzaswwzghwmpbclioxah`)

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the two public Supabase values
npm run dev
```

`.env.local` only needs the public Supabase URL + publishable anon key. Row
Level Security is what protects the data: anon can INSERT a lead but can never
SELECT one back.

## What's built

- Public homepage (`/`) — approved hero, the two-numbers explainer, lead form
- FAQ page (`/faq`) — renders published rows from the `faqs` table
- Lead form → `leads` table via a server action (anon insert, honeypot guarded)
- Prominent Oregon licence disclosure on every page, with a non-empty outage
  fallback so a Supabase blip can never drop a legally required line

## Not built yet

- Admin (leads + settings, two tabs). Needs a server-only Supabase secret key
  and an admin password — see `.env.example`.
- Vercel deploy + Cloudflare DNS

## Ground rules

Never invent business facts. The licence disclosure is a headline, not fine
print. Never copy content from listwithgrand.com. Phone is (541) 214-2163.
