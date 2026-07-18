import { createClient } from "@supabase/supabase-js";

// Read-only, cookie-free Supabase client for PUBLIC data (site settings,
// published FAQs). Because it doesn't touch cookies, pages that use it can be
// statically rendered and served from the CDN instead of re-rendering on every
// request. Still bound by RLS as the anon role.
export function createPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
