"use client";

import { useActionState } from "react";
import { registerAction, type FormState } from "@/actions/auth";
import { Button, Field, inputCls } from "@/components/ui/primitives";

const initialState: FormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          {state.error}
        </p>
      ) : null}
      <Field label="Full name">
        <input
          className={inputCls}
          name="name"
          defaultValue={state.values?.name}
          placeholder="Marie Dupont"
          autoComplete="name"
          required
        />
        {state.fieldErrors?.name ? (
          <span className="text-xs text-rose-600">{state.fieldErrors.name.join(", ")}</span>
        ) : null}
      </Field>
      <Field label="Email address">
        <input
          className={inputCls}
          name="email"
          type="email"
          defaultValue={state.values?.email}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        {state.fieldErrors?.email ? (
          <span className="text-xs text-rose-600">{state.fieldErrors.email.join(", ")}</span>
        ) : null}
      </Field>
      <Field label="Password" hint="At least 8 characters.">
        <input
          className={inputCls}
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        {state.fieldErrors?.password ? (
          <span className="text-xs text-rose-600">{state.fieldErrors.password.join(", ")}</span>
        ) : null}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Target level">
          <select className={inputCls} name="targetLevel" defaultValue="C1">
            <option value="A1">A1 — Beginner</option>
            <option value="A2">A2 — Elementary</option>
            <option value="B1">B1 — Intermediate</option>
            <option value="B2">B2 — Upper Intermediate</option>
            <option value="C1">C1 — Advanced</option>
            <option value="C2">C2 — Mastery</option>
          </select>
        </Field>
        <Field label="Native language">
          <select className={inputCls} name="nativeLanguage" defaultValue="English">
            <option value="English">English</option>
            <option value="Arabic">العربية (Arabic)</option>
            <option value="Urdu">اردو (Urdu)</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Spanish">Español</option>
            <option value="Portuguese">Português</option>
            <option value="French">Français</option>
            <option value="Other">Other</option>
          </select>
        </Field>
      </div>
      <label className="-mt-1 flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          name="rememberMe"
          className="h-4 w-4 rounded border-zinc-300 accent-amber-500"
        />
        Remember me
      </label>
      <Button type="submit" disabled={pending} size="lg" className="mt-2 w-full">
        {pending ? "Creating…" : "Create my account"}
      </Button>
    </form>
  );
}