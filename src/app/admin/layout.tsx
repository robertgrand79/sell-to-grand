import type { Metadata } from "next";
import Link from "next/link";
import { isAuthed } from "@/lib/admin-auth";
import { logout } from "./login/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthed();

  if (!authed) {
    // Login page renders its own minimal shell.
    return <div className="min-h-screen bg-wash">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-wash">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-ink">Sell to Grand admin</span>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/admin/leads" className="font-medium text-slatey hover:text-ink">
                Leads
              </Link>
              <Link href="/admin/settings" className="font-medium text-slatey hover:text-ink">
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slatey hover:text-ink" target="_blank">
              View site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-slatey hover:bg-wash"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
