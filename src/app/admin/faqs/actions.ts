"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { FAQS_TAG } from "@/lib/faqs";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}
function int(v: FormDataEntryValue | null, fallback = 0): number {
  const n = Number(str(v));
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function revalidate() {
  revalidateTag(FAQS_TAG);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
}

export async function createFaq(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) return;

  const question = str(formData.get("question"));
  const answer = str(formData.get("answer"));
  if (!question || !answer) return;

  await supabase.from("faqs").insert({
    question,
    answer,
    display_order: int(formData.get("display_order")),
    is_published: formData.get("is_published") === "on",
  });
  revalidate();
}

export async function updateFaq(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) return;

  const id = int(formData.get("id"), NaN);
  if (!Number.isFinite(id)) return;

  const question = str(formData.get("question"));
  const answer = str(formData.get("answer"));
  if (!question || !answer) return;

  await supabase
    .from("faqs")
    .update({
      question,
      answer,
      display_order: int(formData.get("display_order")),
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);
  revalidate();
}

export async function deleteFaq(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) return;

  const id = int(formData.get("id"), NaN);
  if (!Number.isFinite(id)) return;

  await supabase.from("faqs").delete().eq("id", id);
  revalidate();
}
