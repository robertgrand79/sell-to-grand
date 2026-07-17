"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, ADMIN_COOKIE } from "@/lib/admin-auth";

export type LoginState = { error: string } | null;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password =
    typeof formData.get("password") === "string"
      ? (formData.get("password") as string)
      : "";

  const token = checkPassword(password);
  if (!token) return { error: "Wrong password." };

  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  redirect("/admin/leads");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
