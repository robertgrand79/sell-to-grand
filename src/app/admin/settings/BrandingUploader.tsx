"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { uploadBranding, removeBranding, type UploadResult } from "./branding-actions";

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accentdark disabled:opacity-60"
    >
      {pending ? "Uploading…" : "Upload"}
    </button>
  );
}

function Asset({
  kind,
  label,
  currentUrl,
  hint,
}: {
  kind: "logo" | "favicon" | "about_photo";
  label: string;
  currentUrl: string | null;
  hint: string;
}) {
  const [state, action] = useActionState<UploadResult, FormData>(uploadBranding, null);
  const shownUrl = state?.ok ? state.url : currentUrl;

  return (
    <div className="rounded-lg border border-line p-4">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-xs text-slatey">{hint}</p>

      <div className="mt-3 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-line bg-wash">
          {shownUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownUrl} alt={`${label} preview`} className="max-h-16 max-w-16 object-contain" />
          ) : (
            <span className="text-xs text-slatey">None</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <form action={action} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="kind" value={kind} />
            <input
              type="file"
              name="file"
              accept="image/*"
              className="text-sm text-slatey file:mr-2 file:rounded-md file:border-0 file:bg-wash file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
            />
            <UploadButton />
          </form>
          {shownUrl && (
            <form action={removeBranding}>
              <input type="hidden" name="kind" value={kind} />
              <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                Remove
              </button>
            </form>
          )}
        </div>
      </div>

      {state && !state.ok && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      {state?.ok && <p className="mt-2 text-sm font-medium text-accentdark">Saved.</p>}
    </div>
  );
}

export function BrandingUploader({
  logo,
  favicon,
  aboutPhoto,
}: {
  logo: string | null;
  favicon: string | null;
  aboutPhoto: string | null;
}) {
  return (
    <section className="rounded-xl border border-line bg-white p-6 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wide text-accentdark">
        Branding
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Asset
          kind="logo"
          label="Site logo"
          currentUrl={logo}
          hint="Shown in the header instead of the site name. Wide/transparent PNG works best."
        />
        <Asset
          kind="favicon"
          label="Favicon"
          currentUrl={favicon}
          hint="The little icon in the browser tab. A square PNG (512×512) is ideal."
        />
        <Asset
          kind="about_photo"
          label="About photo (Meet Robert)"
          currentUrl={aboutPhoto}
          hint="A photo shown on the About page. A clear headshot or a photo of you and Shelly works great."
        />
      </div>
    </section>
  );
}
