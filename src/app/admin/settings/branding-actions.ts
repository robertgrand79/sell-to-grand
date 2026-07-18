"use server";

import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

// Logos are often exported on a big canvas of whitespace, which makes them
// look tiny in the header no matter the CSS size. Trim the surrounding
// uniform border so the mark fills the space. Best-effort: on any failure,
// keep the original bytes.
async function trimWhitespace(input: Buffer): Promise<Buffer> {
  try {
    return await sharp(input).trim({ threshold: 12 }).toBuffer();
  } catch {
    return input;
  }
}

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string }
  | null;

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

function safeExt(name: string): string {
  const ext = (name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext || "png";
}

// useActionState-compatible: (prevState, formData) => newState
export async function uploadBranding(
  _prev: UploadResult,
  formData: FormData
): Promise<UploadResult> {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "SUPABASE_SECRET_KEY is not set." };

  const kind = formData.get("kind");
  if (kind !== "logo" && kind !== "favicon") {
    return { ok: false, error: "Unknown asset." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image first." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "That file is not an image." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Please use an image under 2 MB." };
  }

  const path = `${kind}-${Date.now()}.${safeExt(file.name)}`;
  const raw = Buffer.from(await file.arrayBuffer());
  // Trim whitespace around a logo so it isn't dwarfed by its canvas. Leave
  // the favicon untouched (it should stay square).
  const bytes = kind === "logo" ? await trimWhitespace(raw) : raw;

  const { error: upErr } = await supabase.storage
    .from("branding")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (upErr) return { ok: false, error: "Upload failed. Try again." };

  const { data } = supabase.storage.from("branding").getPublicUrl(path);
  const url = data.publicUrl;

  const { error: setErr } = await supabase
    .from("site_settings")
    .update({ [kind]: url })
    .eq("id", 1);
  if (setErr) {
    return { ok: false, error: "Uploaded, but could not save to settings." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { ok: true, url };
}

export async function removeBranding(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) return;
  const kind = formData.get("kind");
  if (kind !== "logo" && kind !== "favicon") return;

  await supabase.from("site_settings").update({ [kind]: null }).eq("id", 1);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
