import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Uses the publishable/anon key only.
// Row Level Security on the database is what actually protects the data:
// anon can INSERT a lead but can never SELECT one back.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
