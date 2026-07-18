"use client";

import { useFormStatus } from "react-dom";
import { createFaq, updateFaq, deleteFaq } from "./actions";
import type { Faq } from "@/lib/types";

const input =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
const lbl = "block text-xs font-medium text-slatey";

function Button({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accentdark disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-line px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}

function PublishToggle({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        name="is_published"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line text-accent focus:ring-accent/30"
      />
      Published (visible on the site)
    </label>
  );
}

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-8">
      {/* Add new */}
      <section className="rounded-xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-accentdark">
          Add a question
        </h2>
        <form action={createFaq} className="mt-4 space-y-4">
          <div className="space-y-1">
            <label className={lbl} htmlFor="new-question">
              Question
            </label>
            <input id="new-question" name="question" required className={input} />
          </div>
          <div className="space-y-1">
            <label className={lbl} htmlFor="new-answer">
              Answer
            </label>
            <textarea id="new-answer" name="answer" rows={4} required className={input} />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <label className={lbl} htmlFor="new-order">
                Order
              </label>
              <input
                id="new-order"
                name="display_order"
                type="number"
                defaultValue={(faqs.at(-1)?.display_order ?? 0) + 1}
                className={`${input} w-24`}
              />
            </div>
            <PublishToggle defaultChecked={false} />
            <Button>Add question</Button>
          </div>
        </form>
      </section>

      {/* Existing */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slatey">
          {faqs.length} question{faqs.length === 1 ? "" : "s"}
        </h2>
        {faqs.length === 0 ? (
          <p className="rounded-lg border border-line bg-white p-6 text-sm text-slatey">
            No questions yet. Add your first one above. It stays hidden until you
            tick Published.
          </p>
        ) : (
          faqs.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border border-line bg-white p-5 shadow-sm"
            >
              <form action={updateFaq} className="space-y-3">
                <input type="hidden" name="id" value={f.id} />
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      f.is_published
                        ? "bg-accent/10 text-accentdark"
                        : "bg-wash text-slatey"
                    }`}
                  >
                    {f.is_published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-slatey">#{f.id}</span>
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Question</label>
                  <input name="question" defaultValue={f.question} required className={input} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Answer</label>
                  <textarea
                    name="answer"
                    rows={4}
                    defaultValue={f.answer}
                    required
                    className={input}
                  />
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="space-y-1">
                    <label className={lbl}>Order</label>
                    <input
                      name="display_order"
                      type="number"
                      defaultValue={f.display_order}
                      className={`${input} w-24`}
                    />
                  </div>
                  <PublishToggle defaultChecked={f.is_published} />
                  <Button>Save</Button>
                </div>
              </form>
              <form action={deleteFaq} className="mt-3 flex justify-end border-t border-line pt-3">
                <input type="hidden" name="id" value={f.id} />
                <DeleteButton />
              </form>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
