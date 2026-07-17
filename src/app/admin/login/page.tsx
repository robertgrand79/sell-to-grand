import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed, passwordConfigured } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthed()) redirect("/admin/leads");
  const configured = passwordConfigured();

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <h1 className="text-xl font-bold text-ink">Sell to Grand admin</h1>
      <p className="mt-1 text-sm text-slatey">Leads and site settings.</p>

      <div className="mt-8 rounded-xl border border-line bg-white p-6 shadow-sm">
        {configured ? (
          <LoginForm />
        ) : (
          <div className="space-y-3 text-sm text-slatey">
            <p className="font-semibold text-ink">Admin not configured yet.</p>
            <p>
              Set two environment variables (in Vercel, or in
              <code className="mx-1 rounded bg-wash px-1">.env.local</code>
              for local use), then reload:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <code className="rounded bg-wash px-1">ADMIN_PASSWORD</code> — the
                password you&apos;ll sign in with
              </li>
              <li>
                <code className="rounded bg-wash px-1">SUPABASE_SECRET_KEY</code>{" "}
                — the service_role secret from the Supabase dashboard
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
