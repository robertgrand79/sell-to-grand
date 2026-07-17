import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "stg_admin";

// The session cookie holds a hash derived from ADMIN_PASSWORD, never the
// password itself. Changing the password invalidates old cookies.
function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`stg::${pw}`).digest("hex");
}

// Login is usable as soon as a password is set. The secret key is only
// needed to load/edit data, and those pages report its absence themselves.
export function passwordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function secretKeyConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SECRET_KEY);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function checkPassword(password: string): string | null {
  const expected = expectedToken();
  const pw = process.env.ADMIN_PASSWORD;
  if (!expected || !pw) return null;
  if (!safeEqual(password, pw)) return null;
  return expected;
}

export async function isAuthed(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, expected);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}

export const ADMIN_COOKIE = COOKIE;
