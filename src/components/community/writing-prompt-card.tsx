"use client";

import { useState } from "react";
import { submitWriting } from "@/actions/community";
import { Button, Card, inputCls } from "@/components/ui/primitives";

export function WritingPromptCard({
  title,
  task,
  minWords,
  level,
}: {
  title: string;
  task: string;
  minWords: number;
  level: string;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; error?: string } | null>(null);

  const words = text.trim().split(/[ \n]/).filter(Boolean).length;

  const submit = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await submitWriting(text, level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2");
      setResult(res.error ? { error: res.error } : { ok: true });
      if (!res.error) setText("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{task}</p>
        <p className="mt-1 text-xs text-zinc-400">Goal: at least {minWords} words.</p>
      </div>
      <textarea
        className={inputCls + " min-h-36 resize-y"}
        placeholder="Write your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs ${words >= minWords ? "text-emerald-600" : "text-zinc-400"}`}>
          {words} / {minWords} words
        </span>
        <Button onClick={submit} disabled={busy || words < Math.min(5, minWords)}>
          {busy ? "Sending…" : "Send to community sharing"}
        </Button>
      </div>
      {result?.error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          {result.error}
        </p>
      ) : null}
      {result?.ok ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          Text sent! +15 XP. The community will review it.
        </p>
      ) : null}
    </Card>
  );
}