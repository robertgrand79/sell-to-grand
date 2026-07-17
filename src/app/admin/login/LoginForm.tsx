"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accentdark disabled:opacity-60"
    >
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(login, null);
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      <Submit />
    </form>
  );
}
