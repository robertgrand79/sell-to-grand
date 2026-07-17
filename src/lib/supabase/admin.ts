import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-ONLY Supabase client using the secret (service_role) key. This
// bypasses RLS, which is what the admin needs to read leads that anon can
// never see. NEVER import this into a client component. The key is read at
// request time so the public build never depends on it.
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return null;

  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
