"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/actions/auth";
import { Button, Field, inputCls } from "@/components/ui/primitives";

const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          {state.error}
        </p>
      ) : null}
      <Field label="Email address">
        <input
          className={inputCls}
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Password">
        <input
          className={inputCls}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Button type="submit" disabled={pending} size="lg" className="mt-2 w-full">
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}