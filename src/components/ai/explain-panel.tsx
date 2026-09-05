"use client";

import { useState } from "react";
import { explainTopic } from "@/actions/ai";
import { SpeakButton } from "@/components/speech/speak-button";
import { Button, Card, inputCls } from "@/components/ui/primitives";

const SUGGESTIONS = [
  "La différence passé composé / imparfait",
  "Le subjonctif",
  "Les articles",
  "Le conditionnel",
  "L'accord du participe passé",
];

export function ExplainPanel({ level }: { level: string }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<{ reply: string; source: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const ask = async (q: string) => {
    const text = (q || query).trim();
    if (!text) return;
    setBusy(true);
    try {
      const res = await explainTopic(level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2", text);
      setState(res);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200" htmlFor="q">
          Your grammar question (level {level})
        </label>
        <textarea
          id="q"
          className={inputCls + " min-h-24 resize-y"}
          placeholder="Ex. : Why « je suis allé » and not « j'ai allé » ?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:text-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {s}
            </button>
          ))}
        </div>
        <div>
          <Button onClick={() => ask(query)} disabled={busy || !query.trim()}>
            {busy ? "Thinking…" : "Explain"}
          </Button>
        </div>
      </div>

      {state ? (
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Explanation {state.source === "ai" ? "(from AI)" : "(manual)"}
            </span>
            <SpeakButton text={state.reply.replace(/\n/g, " ").slice(0, 400)} label="" />
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-100">
            {state.reply}
          </div>
        </Card>
      ) : null}
    </div>
  );
}