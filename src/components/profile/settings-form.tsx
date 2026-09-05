"use client";

import { useActionState } from "react";
import { updateSettingsAction, type FormState } from "@/actions/auth";
import { Button, Field, inputCls } from "@/components/ui/primitives";

const initialState: FormState = {};

export function SettingsForm({
  name,
  targetLevel,
  nativeLanguage,
}: {
  name: string;
  targetLevel: string;
  nativeLanguage: string;
}) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          Settings saved.
        </p>
      ) : null}
      <Field label="Name">
        <input className={inputCls} name="name" defaultValue={name} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Target level">
          <select className={inputCls} name="targetLevel" defaultValue={targetLevel}>
            <option value="A1">A1 — Beginner</option>
            <option value="A2">A2 — Elementary</option>
            <option value="B1">B1 — Intermediate</option>
            <option value="B2">B2 — Upper Intermediate</option>
            <option value="C1">C1 — Advanced</option>
            <option value="C2">C2 — Mastery</option>
          </select>
        </Field>
        <Field label="Native language">
          <input className={inputCls} name="nativeLanguage" defaultValue={nativeLanguage} />
        </Field>
      </div>
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}